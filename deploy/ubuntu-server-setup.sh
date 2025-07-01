#!/bin/bash

# SumTube Bot - Ubuntu Server Initial Setup Script
# This script sets up a fresh Ubuntu server for SumTube Bot deployment

set -e # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
    error "This script should not be run as root. Please run as a regular user with sudo privileges."
    exit 1
fi

log "🚀 Starting SumTube Bot Ubuntu Server Setup..."

# Update system packages
log "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
log "🔧 Installing essential packages..."
sudo apt install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    htop \
    nano \
    vim \
    ufw \
    fail2ban

# Install Node.js 20.x (LTS)
log "📱 Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js installation
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
log "✅ Node.js installed: $NODE_VERSION"
log "✅ npm installed: $NPM_VERSION"

# Install PM2 globally
log "🔄 Installing PM2 process manager..."
sudo npm install -g pm2

# Setup PM2 startup script
sudo pm2 startup systemd -u $USER --hp $HOME
log "✅ PM2 startup script configured"

# Configure UFW Firewall (restricted - internal server)
log "🔥 Configuring UFW firewall for internal server..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 3000/tcp # SumTube Bot API (internal only)
sudo ufw --force enable
log "✅ Firewall configured for internal access only"

# Configure fail2ban
log "🛡️  Configuring fail2ban..."
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
log "✅ fail2ban configured and started"

# Create application directory
APP_DIR="/home/$USER/sumtubebot"
log "📁 Creating application directory: $APP_DIR"
mkdir -p $APP_DIR
cd $APP_DIR

# Create systemd service for auto-updates (optional)
log "🔄 Creating auto-update service..."
sudo tee /etc/systemd/system/sumtubebot-update.service >/dev/null <<EOF
[Unit]
Description=SumTube Bot Auto Update
After=network.target

[Service]
Type=oneshot
User=$USER
WorkingDirectory=$APP_DIR
ExecStart=/bin/bash -c 'git pull && npm ci && npm run build:server && pm2 restart sumtubebot'
EOF

sudo tee /etc/systemd/system/sumtubebot-update.timer >/dev/null <<EOF
[Unit]
Description=Run SumTube Bot Auto Update daily
Requires=sumtubebot-update.service

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable sumtubebot-update.timer
log "✅ Auto-update service created (disabled by default)"

# Create deployment helper script
log "📝 Creating deployment helper script..."
tee $APP_DIR/deploy-app.sh >/dev/null <<'EOF'
#!/bin/bash

# SumTube Bot Deployment Helper
set -e

log() {
    echo -e "\033[0;32m[$(date +'%Y-%m-%d %H:%M:%S')]\033[0m $1"
}

log "🚀 Deploying SumTube Bot..."

# Pull latest changes
log "📥 Pulling latest changes..."
git pull origin main

# Install dependencies
log "📦 Installing dependencies..."
npm ci

# Build application
log "🔨 Building application..."
npm run build:server

# Restart PM2 process
log "🔄 Restarting application..."
pm2 restart sumtubebot || pm2 start ecosystem.config.mjs

# Save PM2 configuration
pm2 save

log "✅ Deployment complete!"
log "📊 Process status:"
pm2 status
EOF

chmod +x $APP_DIR/deploy-app.sh
log "✅ Deployment helper script created"

# Create environment setup script
log "📝 Creating environment setup script..."
tee $APP_DIR/setup-env.sh >/dev/null <<'EOF'
#!/bin/bash

# Environment Variables Setup for SumTube Bot
echo "🔐 Setting up environment variables for SumTube Bot..."

# Check if .env file exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Creating backup..."
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
fi

# Create .env file
echo "📝 Creating .env file..."
cat > .env << 'ENVEOF'
# Discord Bot Configuration
DISCORD_BOT_TOKEN=your_discord_bot_token_here

# Google Gemini AI Configuration  
GEMINI_API_KEY=your_gemini_api_key_here

# Discord Application ID (for invite links)
VITE_DISCORD_APPLICATION_ID=your_discord_application_id_here

# Server Configuration
NODE_ENV=production
PORT=3000
ENVEOF

echo "✅ .env file created!"
echo ""
echo "🔧 Please edit the .env file with your actual values:"
echo "   nano .env"
echo ""
echo "Required values:"
echo "1. DISCORD_BOT_TOKEN - Get from https://discord.com/developers/applications"
echo "2. GEMINI_API_KEY - Get from https://aistudio.google.com/app/apikey"
echo "3. VITE_DISCORD_APPLICATION_ID - Your Discord Application ID"
echo ""
echo "After updating .env, run: ./deploy-app.sh"
EOF

chmod +x $APP_DIR/setup-env.sh
log "✅ Environment setup script created"

# System information
log "📊 System Information:"
info "OS: $(lsb_release -d | cut -f2)"
info "Kernel: $(uname -r)"
info "Memory: $(free -h | grep '^Mem:' | awk '{print $2}')"
info "Disk: $(df -h / | awk 'NR==2{print $4 " available"}')"
info "CPU: $(nproc) cores"
info "Public DNS: $(curl -s http://169.254.169.254/latest/meta-data/public-hostname 2>/dev/null || echo 'Not available')"

log "🎉 Ubuntu Server Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Clone your repository: git clone https://github.com/yourusername/sumtubebot.git ."
echo "2. Setup environment: ./setup-env.sh"
echo "3. Deploy application: ./deploy-app.sh"
echo ""
echo "🔗 Useful Commands:"
echo "- Check logs: pm2 logs sumtubebot"
echo "- Monitor processes: pm2 monit"
echo "- Restart app: pm2 restart sumtubebot"
echo "- Check firewall: sudo ufw status"
echo "- Health check: curl http://localhost:3000/health"
echo ""
warning "Remember to:"
warning "1. This is configured as an internal server (no public web access)"
warning "2. Only port 3000 is open for the Discord bot API"
warning "3. Secure your Discord bot token and API keys"
warning "4. The bot will be accessible internally via: http://localhost:3000"
