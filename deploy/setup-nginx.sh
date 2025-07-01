#!/bin/bash

# SumTube Bot - Nginx Setup Script with HTTPS
# This script sets up nginx with SSL to expose only the /api/bot/stats endpoint publicly

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
    error "Usage: $0 <server_dns> [email] [http_only]"
    error "Examples:"
    error "  $0 sumtubebot.example.com admin@example.com"
    error "  $0 ec2-3-110-118-25.ap-south-1.compute.amazonaws.com user@email.com"
    error "  $0 192.168.1.100 user@email.com http_only  # Skip HTTPS setup"
    exit 1
fi

SERVER_DNS="$1"
EMAIL="${2:-admin@localhost}"
HTTP_ONLY="${3:-}"
APP_PORT="${4:-3000}"

log "🌐 Setting up Nginx for SumTube Bot Stats API with HTTPS..."
info "Server DNS: $SERVER_DNS"
info "Email: $EMAIL"
info "App Port: $APP_PORT"

# Check if running as root
if [[ $EUID -eq 0 ]]; then
    error "This script should not be run as root. Please run as a regular user with sudo privileges."
    exit 1
fi

# Check if domain is a proper FQDN (not IP) for SSL
if [[ "$SERVER_DNS" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]] || [[ "$HTTP_ONLY" == "http_only" ]]; then
    warning "Using HTTP only mode (no SSL)"
    USE_HTTPS=false
else
    info "Using HTTPS mode with Let's Encrypt SSL"
    USE_HTTPS=true
fi

# Install nginx and certbot
log "📦 Installing Nginx and Certbot..."
sudo apt update
sudo apt install nginx -y

if [ "$USE_HTTPS" = true ]; then
    sudo apt install snapd -y
    sudo snap install core
    sudo snap refresh core
    sudo snap install --classic certbot
    sudo ln -sf /snap/bin/certbot /usr/bin/certbot
fi

# Verify installations
NGINX_VERSION=$(nginx -v 2>&1 | cut -d' ' -f3)
log "✅ Nginx installed: $NGINX_VERSION"

if [ "$USE_HTTPS" = true ]; then
    CERTBOT_VERSION=$(certbot --version 2>&1 | cut -d' ' -f2)
    log "✅ Certbot installed: $CERTBOT_VERSION"
fi

# Create initial HTTP configuration
log "⚙️  Creating initial Nginx configuration..."
if [ "$USE_HTTPS" = true ]; then
    # Initial HTTP config for Let's Encrypt verification
    sudo tee /etc/nginx/sites-available/sumtubebot-stats >/dev/null <<EOF
# SumTube Bot Stats API Configuration (Initial HTTP for SSL setup)
server {
    listen 80;
    server_name $SERVER_DNS;

    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Temporary endpoints for SSL setup
    location /api/bot/stats {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /health {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location / {
        return 404 "Not Found";
    }
}
EOF
else
    # HTTP-only configuration
    sudo tee /etc/nginx/sites-available/sumtubebot-stats >/dev/null <<EOF
# SumTube Bot Stats API Configuration (HTTP Only)
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
        limit_req zone=stats_limit burst=5 nodelay;
        
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /health {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location / {
        return 404 "Not Found";
    }

    server_tokens off;
}
EOF
fi

# Configure rate limiting
log "🛡️  Configuring rate limiting..."
# Remove any existing problematic rate limiting config files
sudo rm -f /etc/nginx/conf.d/rate-limiting.conf

# Check if rate limiting is already configured in nginx.conf
if ! grep -q "limit_req_zone.*stats_limit" /etc/nginx/nginx.conf; then
    # Add rate limiting to the main nginx.conf http block
    sudo sed -i '/^http {/a\\n    # Rate limiting zones for SumTube Bot\n    limit_req_zone $binary_remote_addr zone=stats_limit:10m rate=10r/m;\n    limit_req_log_level warn;\n    limit_req_status 429;\n' /etc/nginx/nginx.conf
    log "✅ Rate limiting configuration added"
else
    log "✅ Rate limiting already configured"
fi

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

# Configure firewall
log "🔥 Configuring firewall..."
sudo ufw allow 'Nginx HTTP'
if [ "$USE_HTTPS" = true ]; then
    sudo ufw allow 'Nginx HTTPS'
fi

# Start nginx
log "🚀 Starting Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Setup SSL if using HTTPS
if [ "$USE_HTTPS" = true ]; then
    log "🔐 Setting up SSL certificate with Let's Encrypt..."

    # Obtain SSL certificate
    sudo certbot --nginx -d "$SERVER_DNS" --email "$EMAIL" --agree-tos --non-interactive --redirect

    # Update configuration for HTTPS-only with enhanced security
    log "🔒 Updating configuration for HTTPS-only..."
    sudo tee /etc/nginx/sites-available/sumtubebot-stats >/dev/null <<EOF
# SumTube Bot Stats API Configuration (HTTPS Only)
server {
    listen 80;
    server_name $SERVER_DNS;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $SERVER_DNS;

    # SSL Configuration (managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/$SERVER_DNS/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$SERVER_DNS/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Enhanced Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Content-Security-Policy "default-src 'self'; script-src 'none'; object-src 'none';" always;

    # Rate limiting for stats endpoint
    location /api/bot/stats {
        limit_req zone=stats_limit burst=5 nodelay;
        
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        
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
        return 404 "API endpoint not found. Only /api/bot/stats is available.";
    }

    # Security: Hide nginx version
    server_tokens off;
}
EOF

    # Test the updated configuration
    if sudo nginx -t; then
        log "✅ HTTPS configuration is valid"
        sudo systemctl reload nginx
    else
        error "❌ HTTPS configuration has errors"
        exit 1
    fi

    # Setup auto-renewal
    log "🔄 Setting up SSL certificate auto-renewal..."
    sudo systemctl enable snap.certbot.renew.timer

fi

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
if [ "$USE_HTTPS" = true ]; then
    info "🔒 HTTPS Endpoints:"
    info "  Stats API: https://$SERVER_DNS/api/bot/stats"
    info "  Health Check: https://$SERVER_DNS/health"
    info "  HTTP redirects to HTTPS automatically"
else
    info "🌐 HTTP Endpoints:"
    info "  Stats API: http://$SERVER_DNS/api/bot/stats"
    info "  Health Check: http://$SERVER_DNS/health"
fi
echo ""
info "🔒 Security Features:"
info "  - Only stats and health endpoints exposed"
info "  - Rate limiting: 10 requests/minute per IP"
if [ "$USE_HTTPS" = true ]; then
    info "  - HTTPS with Let's Encrypt SSL"
    info "  - HSTS and enhanced security headers"
    info "  - HTTP to HTTPS redirect"
    info "  - Auto SSL renewal enabled"
else
    info "  - Security headers enabled"
fi
info "  - All other requests blocked (404)"
echo ""
info "🔧 Management Commands:"
info "  - Check status: sudo systemctl status nginx"
info "  - Restart: sudo systemctl restart nginx"
info "  - View logs: sudo tail -f /var/log/nginx/access.log"
info "  - Test config: sudo nginx -t"
if [ "$USE_HTTPS" = true ]; then
    info "  - Check SSL: sudo certbot certificates"
    info "  - Renew SSL: sudo certbot renew --dry-run"
fi
echo ""
warning "⚠️  Important Notes:"
warning "1. Internal API (port $APP_PORT) is still only accessible locally"
warning "2. Only /api/bot/stats and /health are publicly accessible"
warning "3. Rate limiting is enforced (10 req/min per IP)"
warning "4. All Discord bot functionality remains internal"
if [ "$USE_HTTPS" = true ]; then
    warning "5. SSL certificate will auto-renew every 90 days"
fi

# Test the endpoints
echo ""
log "🧪 Testing endpoints..."
sleep 2

PROTOCOL="http"
if [ "$USE_HTTPS" = true ]; then
    PROTOCOL="https"
fi

if curl -f $PROTOCOL://localhost/health >/dev/null 2>&1; then
    info "✅ Health endpoint is accessible"
else
    warning "⚠️  Health endpoint test failed (this is normal if the bot isn't running)"
fi

if curl -f $PROTOCOL://localhost/api/bot/stats >/dev/null 2>&1; then
    info "✅ Stats API endpoint is accessible"
else
    warning "⚠️  Stats API test failed (this is normal if the bot isn't running)"
fi

log "🎉 Nginx setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Ensure SumTube Bot is running: pm2 status"
if [ "$USE_HTTPS" = true ]; then
    echo "2. Test public access: curl https://$SERVER_DNS/api/bot/stats"
    echo "3. Monitor nginx logs: sudo tail -f /var/log/nginx/access.log"
    echo "4. Verify SSL: curl -I https://$SERVER_DNS/health"
else
    echo "2. Test public access: curl http://$SERVER_DNS/api/bot/stats"
    echo "3. Monitor nginx logs: sudo tail -f /var/log/nginx/access.log"
fi
