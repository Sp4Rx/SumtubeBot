#!/bin/bash

# SumTube Bot - Nginx Setup Script
# This script sets up nginx to expose only the /api/bot/stats endpoint publicly

set -e # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
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

# Check if DNS parameter is provided
if [ -z "$1" ]; then
    error "Usage: $0 <server_dns>"
    error "Example: $0 ec2-3-110-118-25.ap-south-1.compute.amazonaws.com"
    exit 1
fi

SERVER_DNS="$1"
APP_PORT="${2:-3000}"

log "🌐 Setting up Nginx for SumTube Bot Stats API..."
info "Server DNS: $SERVER_DNS"
info "App Port: $APP_PORT"

# Check if running as root
if [[ $EUID -eq 0 ]]; then
    error "This script should not be run as root. Please run as a regular user with sudo privileges."
    exit 1
fi

# Install nginx
log "📦 Installing Nginx..."
sudo apt update
sudo apt install nginx -y

# Verify nginx installation
NGINX_VERSION=$(nginx -v 2>&1 | cut -d' ' -f3)
log "✅ Nginx installed: $NGINX_VERSION"

# Create nginx configuration for SumTube Bot
log "⚙️  Creating Nginx configuration..."
sudo tee /etc/nginx/sites-available/sumtubebot-stats >/dev/null <<EOF
# SumTube Bot Stats API Configuration
server {
    listen 80;
    server_name $SERVER_DNS;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Rate limiting for stats endpoint
    location /api/bot/stats {
        # Rate limit: 10 requests per minute per IP
        limit_req zone=stats_limit burst=5 nodelay;
        
        # Proxy to internal SumTube Bot API
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Block all other requests
    location / {
        return 404 "Not Found";
    }

    # Custom error pages
    error_page 404 /404.html;
    location = /404.html {
        return 404 "API endpoint not found. Only /api/bot/stats is available.";
        add_header Content-Type text/plain;
    }

    # Security: Hide nginx version
    server_tokens off;
}
EOF

# Create rate limiting configuration
log "🛡️  Configuring rate limiting..."
sudo tee /etc/nginx/conf.d/rate-limiting.conf >/dev/null <<EOF
# Rate limiting zones
http {
    # Rate limit for stats API: 10 requests per minute per IP
    limit_req_zone \$binary_remote_addr zone=stats_limit:10m rate=10r/m;
    
    # Log rate limiting
    limit_req_log_level warn;
    limit_req_status 429;
}
EOF

# Enable the site and disable default
log "🔗 Enabling SumTube Bot site..."
sudo ln -sf /etc/nginx/sites-available/sumtubebot-stats /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
log "🧪 Testing Nginx configuration..."
if sudo nginx -t; then
    log "✅ Nginx configuration is valid"
else
    error "❌ Nginx configuration has errors"
    exit 1
fi

# Configure firewall for HTTP traffic
log "🔥 Configuring firewall for HTTP access..."
sudo ufw allow 'Nginx HTTP'
log "✅ Firewall configured for HTTP traffic"

# Start and enable nginx
log "🚀 Starting Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Check nginx status
if sudo systemctl is-active --quiet nginx; then
    log "✅ Nginx is running successfully"
else
    error "❌ Failed to start Nginx"
    exit 1
fi

# Display configuration summary
log "📊 Nginx Setup Complete!"
echo ""
info "🌐 Public API Endpoints:"
info "  Stats API: http://$SERVER_DNS/api/bot/stats"
info "  Health Check: http://$SERVER_DNS/health"
echo ""
info "🔒 Security Features:"
info "  - Only stats and health endpoints exposed"
info "  - Rate limiting: 10 requests/minute per IP"
info "  - Security headers enabled"
info "  - All other requests blocked (404)"
echo ""
info "🔧 Management Commands:"
info "  - Check status: sudo systemctl status nginx"
info "  - Restart: sudo systemctl restart nginx"
info "  - View logs: sudo tail -f /var/log/nginx/access.log"
info "  - Test config: sudo nginx -t"
echo ""
warning "⚠️  Important Notes:"
warning "1. Internal API (port $APP_PORT) is still only accessible locally"
warning "2. Only /api/bot/stats and /health are publicly accessible"
warning "3. Rate limiting is enforced (10 req/min per IP)"
warning "4. All Discord bot functionality remains internal"

# Test the endpoints
echo ""
log "🧪 Testing endpoints..."
sleep 2

if curl -f http://localhost/health >/dev/null 2>&1; then
    info "✅ Health endpoint is accessible"
else
    warning "⚠️  Health endpoint test failed (this is normal if the bot isn't running)"
fi

if curl -f http://localhost/api/bot/stats >/dev/null 2>&1; then
    info "✅ Stats API endpoint is accessible"
else
    warning "⚠️  Stats API test failed (this is normal if the bot isn't running)"
fi

log "🎉 Nginx setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Ensure SumTube Bot is running: pm2 status"
echo "2. Test public access: curl http://$SERVER_DNS/api/bot/stats"
echo "3. Monitor nginx logs: sudo tail -f /var/log/nginx/access.log"
