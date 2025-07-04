# SumTube Bot Deployment Guide

This guide covers deploying SumTube Bot to production environments.

## 🏗️ Architecture Overview

- **Frontend**: Deployed on Cloudflare Pages (static site)
- **Backend**: Deployed on Ubuntu server with PM2 (Discord bot + API)
- **Database**: No database required (stateless)

## 📋 Prerequisites

- Ubuntu 20.04+ server (AWS EC2, DigitalOcean, etc.)
- Node.js 20+ (for built-in .env file support)
- Domain name (optional, for SSL)
- Discord Application & Bot Token
- Google Gemini API Key

---

## 🚀 Quick Deployment

### 1. Cloudflare Pages (Frontend)

The frontend is automatically deployed via Cloudflare Pages when you push to your repository.

**Setup Steps:**
1. Fork this repository
2. Connect to Cloudflare Pages
3. Configure build settings:
   - **Build command**: `npm run build:client`
   - **Build output directory**: `dist/client`
   - **Root directory**: (leave empty)

**Environment Variables in Cloudflare:**
```
VITE_DISCORD_APPLICATION_ID=your_discord_application_id_here
```

**If deployment fails with "wrangler.toml not valid":**
- The issue has been fixed in the latest version
- Ensure your wrangler.toml includes `pages_build_output_dir = "dist/client"`

### 2. Ubuntu Server (Backend)

#### Option A: Automated Setup (Recommended)

```bash
# 1. Download the setup script
wget https://raw.githubusercontent.com/Sp4Rx/sumtubebot/main/deploy/ubuntu-server-setup.sh

# 2. Make it executable and run
chmod +x ubuntu-server-setup.sh
./ubuntu-server-setup.sh

# 3. Clone your repository
cd /home/$(whoami)/sumtubebot
git clone https://github.com/Sp4Rx/sumtubebot.git .

# 4. Setup environment variables
./setup-env.sh
nano .env  # Edit with your actual tokens

# 5. Deploy the application
./production-deploy.sh
```

#### Option B: Manual Setup

Follow the manual setup instructions below.

---

## 🔧 Manual Server Setup

### 1. Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y curl wget git unzip software-properties-common \
    apt-transport-https ca-certificates gnupg lsb-release \
    htop nano vim ufw fail2ban nginx

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 startup
sudo pm2 startup systemd -u $USER --hp $HOME
```

### 2. Security Configuration

```bash
# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw --force enable

# Start fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Application Deployment

```bash
# Create application directory
mkdir -p /home/$USER/sumtubebot
cd /home/$USER/sumtubebot

# Clone repository
git clone https://github.com/Sp4Rx/sumtubebot.git .

# Create environment file
cp .env.template .env
nano .env  # Edit with your actual values

# Install dependencies
npm ci --only=production

# Build application
npm run build:server

# Start with PM2
pm2 start ecosystem.config.js --name sumtubebot
pm2 save
```

### 4. Nginx Configuration

```bash
# Create nginx configuration
sudo nano /etc/nginx/sites-available/sumtubebot
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3000/health;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Default response for other requests
    location / {
        return 503;
    }
}
```

Enable the site:

```bash
sudo ln -sf /etc/nginx/sites-available/sumtubebot /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### 5. SSL Certificate (Optional)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 📝 Environment Variables

### Backend (.env)
```bash
# Discord Bot Configuration
DISCORD_BOT_TOKEN=your_discord_bot_token_here

# Google Gemini AI Configuration  
GEMINI_API_KEY=your_gemini_api_key_here

# Discord Application ID (for invite links and slash commands)
VITE_DISCORD_APPLICATION_ID=your_discord_application_id_here

# Server Configuration
NODE_ENV=production
PORT=3000
```

### Frontend (Cloudflare Pages)
```
VITE_DISCORD_APPLICATION_ID=your_discord_application_id_here
```

---

## 🔄 Deployment Scripts

### Ubuntu Server Setup
```bash
# Initial server setup (run once)
./deploy/ubuntu-server-setup.sh
```

**Features:**
- ✅ Installs Node.js 20.x, PM2, nginx
- ✅ Configures firewall and security
- ✅ Sets up SSL certificate preparation
- ✅ Creates deployment helper scripts
- ✅ Configures automatic updates

### Production Deployment
```bash
# Deploy/update application
./deploy/production-deploy.sh [branch]
```

**Features:**
- ✅ Pre-deployment checks
- ✅ Automated backup creation
- ✅ Git pull and dependency installation
- ✅ Application build and health checks
- ✅ PM2 process management
- ✅ nginx configuration reload

---

## 🛠️ Management Commands

### PM2 Process Management
```bash
# View status
pm2 status

# View logs
pm2 logs sumtubebot

# Restart application
pm2 restart sumtubebot

# Stop application
pm2 stop sumtubebot

# Monitor resources
pm2 monit
```

### System Monitoring
```bash
# Check application health
curl http://localhost:3000/health

# Check nginx status
sudo systemctl status nginx

# Check firewall status
sudo ufw status

# Check system resources
htop
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. Cloudflare Pages Not Loading
**Problem**: Build succeeds but page doesn't load
**Solution**: 
- Check `wrangler.toml` has `pages_build_output_dir = "dist/client"`
- Ensure SPA routing is configured with redirects
- Verify environment variables are set in Cloudflare

#### 2. Discord Bot Not Responding
**Problem**: Bot appears offline or doesn't respond
**Solutions**:
```bash
# Check application logs
pm2 logs sumtubebot

# Verify environment variables
cat .env | grep DISCORD_BOT_TOKEN
cat .env | grep VITE_DISCORD_APPLICATION_ID

# Check bot permissions in Discord
# Ensure bot has required permissions in your server
```

#### 3. Health Check Failing
**Problem**: `/health` endpoint returns 503
**Solutions**:
```bash
# Check if application is running
pm2 status

# Check application logs
pm2 logs sumtubebot --lines 50

# Verify port is listening
netstat -tlnp | grep 3000
```

#### 4. SSL Certificate Issues
**Solutions**:
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test nginx configuration
sudo nginx -t
```

### Log Locations
- **Application logs**: `pm2 logs sumtubebot`
- **nginx logs**: `/var/log/nginx/`
- **System logs**: `journalctl -u nginx`

---

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **Firewall**: Only allow necessary ports
3. **SSL**: Always use HTTPS in production
4. **Updates**: Keep system and dependencies updated
5. **Monitoring**: Set up uptime monitoring
6. **Backups**: Regular deployment backups
7. **Access**: Use SSH keys, disable password authentication

---

## 📊 Monitoring & Alerts

### Uptime Monitoring
The application includes Better Stack monitoring integration:
- Status badge on homepage
- Real-time uptime tracking
- Alert notifications

### Application Monitoring
```bash
# View real-time metrics
pm2 monit

# Check resource usage
htop

# Monitor application logs
pm2 logs sumtubebot --follow
```

---

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review application logs: `pm2 logs sumtubebot`
3. Verify environment configuration
4. Check system resources and network connectivity
5. Create an issue on GitHub with detailed error logs

For immediate help:
- 📧 Email: support@suvajit.in
- 🐛 GitHub Issues: [Create Issue](https://github.com/Sp4Rx/sumtubebot/issues/new) 