#!/bin/bash

# SumTube Bot - Production Deployment Script
# This script handles deployment of SumTube Bot from within the project directory

set -e # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="sumtubebot"
BRANCH="${1:-main}"
CURRENT_DIR="$(pwd)"

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Pre-deployment checks
log "🔍 Running pre-deployment checks..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    error "Not in a git repository. Please run this script from the SumTube Bot project directory."
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    error "package.json not found. Please run this script from the SumTube Bot project root."
    exit 1
fi

# Check if Node.js is installed
if ! command_exists node; then
    error "Node.js is not installed. Please run ubuntu-server-setup.sh first."
    exit 1
fi

NODE_VERSION=$(node --version)
if [[ ${NODE_VERSION:1:2} -lt 20 ]]; then
    error "Node.js version 20+ required. Current version: $NODE_VERSION"
    exit 1
fi

# Check if PM2 is installed
if ! command_exists pm2; then
    error "PM2 is not installed. Please run ubuntu-server-setup.sh first."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    warning ".env file not found. Creating template..."
    if [ ! -f ".env.template" ]; then
        error ".env.template file not found. Please ensure you have the complete project."
        exit 1
    fi
    cp .env.template .env
    error "Please configure your .env file before deploying:"
    info "nano .env"
    exit 1
fi

log "✅ Pre-deployment checks passed"

# Create backup of current state
log "💾 Creating backup of current deployment..."
BACKUP_DIR="../backups/sumtubebot-$(date +%Y%m%d_%H%M%S)"
mkdir -p ../backups
cp -r . "$BACKUP_DIR"
log "✅ Backup created: $BACKUP_DIR"

# Pull latest changes
log "📥 Pulling latest changes from $BRANCH branch..."
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

# Install dependencies
log "📦 Installing dependencies..."
npm ci --only=production

# Build application
log "🔨 Building server application..."
npm run build:server

# Environment check
log "🔍 Checking environment configuration..."
if ! grep -q "DISCORD_BOT_TOKEN=" .env || grep -q "your_discord_bot_token_here" .env; then
    error "Discord bot token not configured properly in .env"
    exit 1
fi

if ! grep -q "GEMINI_API_KEY=" .env || grep -q "your_gemini_api_key_here" .env; then
    error "Gemini API key not configured properly in .env"
    exit 1
fi

log "✅ Environment configuration verified"

# Stop existing PM2 process (if running)
log "🛑 Stopping existing application..."
pm2 stop "$APP_NAME" 2>/dev/null || true

# Start/Restart application with PM2
log "🚀 Starting application with PM2..."
if pm2 list | grep -q "$APP_NAME"; then
    log "🔄 Restarting existing PM2 process..."
    pm2 restart "$APP_NAME"
else
    log "🆕 Starting new PM2 process..."
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js --name "$APP_NAME"
    else
        pm2 start dist/index.js --name "$APP_NAME"
    fi
fi

# Save PM2 configuration
pm2 save

# Wait for application to start
log "⏳ Waiting for application to start..."
sleep 5

# Health check
log "🏥 Performing health check..."
if curl -f http://localhost:3000/health >/dev/null 2>&1; then
    log "✅ Health check passed"
else
    error "Health check failed. Check application logs:"
    pm2 logs "$APP_NAME" --lines 20
    exit 1
fi

# Display deployment summary
log "📊 Deployment Summary:"
info "Application: $APP_NAME"
info "Branch: $BRANCH"
info "Directory: $CURRENT_DIR"
info "Node.js: $(node --version)"
info "PM2 Status:"
pm2 list

# Display useful commands
log "🔗 Useful Commands:"
info "View logs: pm2 logs $APP_NAME"
info "Monitor: pm2 monit"
info "Restart: pm2 restart $APP_NAME"
info "Stop: pm2 stop $APP_NAME"
info "Health check: curl http://localhost:3000/health"

log "🎉 Deployment completed successfully!"

echo ""
warning "Post-deployment checklist:"
warning "1. Verify bot is responding in Discord"
warning "2. Check application logs for any errors"
warning "3. Test YouTube link summarization"
warning "4. Monitor resource usage with: pm2 monit"
warning "5. Server is running internally on port 3000"

# Display server information
echo ""
info "Server Information:"
info "Internal API: http://localhost:3000"
info "Health endpoint: http://localhost:3000/health"
info "This server is configured for internal Discord bot use only"

# Exit with success
exit 0
