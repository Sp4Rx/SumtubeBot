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
BRANCH="main"
CURRENT_DIR="$(pwd)"
SKIP_BACKUP=false
SKIP_INSTALL=false
SKIP_PULL=false

# Help function
show_help() {
    echo "SumTube Bot - Production Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS] [BRANCH]"
    echo ""
    echo "Options:"
    echo "  -h, --help          Show this help message"
    echo "  --skip-backup       Skip creating backup before deployment"
    echo "  --skip-install      Skip npm install step"
    echo "  --skip-pull         Skip git pull (useful for CI/CD when code is already deployed)"
    echo ""
    echo "Arguments:"
    echo "  BRANCH              Git branch to deploy (default: main)"
    echo ""
    echo "Examples:"
    echo "  $0                          # Deploy from main branch"
    echo "  $0 develop                  # Deploy from develop branch"
    echo "  $0 --skip-backup            # Deploy without backup"
    echo "  $0 --skip-install main      # Deploy without npm install"
    echo "  $0 --skip-backup --skip-install --skip-pull  # Skip all (CI/CD mode)"
    echo ""
    exit 0
}

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            ;;
        --skip-backup)
            SKIP_BACKUP=true
            shift
            ;;
        --skip-install)
            SKIP_INSTALL=true
            shift
            ;;
        --skip-pull)
            SKIP_PULL=true
            shift
            ;;
        -*)
            echo "❌ Unknown option: $1"
            echo "   Use --help for usage information"
            exit 1
            ;;
        *)
            BRANCH="$1"
            shift
            ;;
    esac
done

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

# Show deployment options
echo "🚀 Starting deployment..."
if [ "$SKIP_BACKUP" = "true" ] || [ "$SKIP_INSTALL" = "true" ] || [ "$SKIP_PULL" = "true" ]; then
    echo "📋 Options:"
    [ "$SKIP_BACKUP" = "true" ] && echo "   ⏭️  Skip backup: enabled"
    [ "$SKIP_INSTALL" = "true" ] && echo "   ⏭️  Skip npm install: enabled"
    [ "$SKIP_PULL" = "true" ] && echo "   ⏭️  Skip git pull: enabled"
    echo ""
fi
echo "🔍 Running pre-deployment checks..."
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Please run this script from the SumTube Bot project directory."
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the SumTube Bot project root."
    exit 1
fi

# Check if Node.js is installed
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please run ubuntu-server-setup.sh first."
    exit 1
fi

NODE_VERSION=$(node --version)
if [[ ${NODE_VERSION:1:2} -lt 20 ]]; then
    echo "❌ Node.js version 20+ required. Current version: $NODE_VERSION"
    exit 1
fi
echo "   Node.js: ✅ SET = $NODE_VERSION"

# Check if PM2 is installed
if ! command_exists pm2; then
    echo "❌ PM2 is not installed. Please run ubuntu-server-setup.sh first."
    exit 1
fi
echo "   PM2: ✅ SET = $(pm2 --version)"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating template..."
    if [ ! -f "env.template" ]; then
        echo "❌ env.template file not found. Please ensure you have the complete project."
        exit 1
    fi
    cp env.template .env
    echo "❌ Please configure your .env file before deploying:"
    echo "   nano .env"
    exit 1
fi
echo "   .env file: ✅ SET"
echo ""
echo "✅ Pre-deployment checks passed"
echo ""

# Create backup of current state (unless skipped)
if [ "$SKIP_BACKUP" = "false" ]; then
    echo "💾 Creating backup of current deployment..."
    BACKUP_DIR="../backups/sumtubebot-$(date +%Y%m%d_%H%M%S)"
    mkdir -p ../backups
    cp -r . "$BACKUP_DIR"
    echo "✅ Backup created: $BACKUP_DIR"
    echo ""
else
    echo "⏭️  Skipping backup (--skip-backup flag set)"
    echo ""
fi

# Pull latest changes (unless skipped)
if [ "$SKIP_PULL" = "false" ]; then
    echo "📥 Pulling latest changes from $BRANCH branch..."
    git fetch origin
    git checkout "$BRANCH"
    git pull origin "$BRANCH"
    echo "✅ Latest changes pulled"
    echo ""
else
    echo "⏭️  Skipping git pull (--skip-pull flag set)"
    echo "   Using current code in directory"
    echo ""
fi

# Install dependencies (unless skipped)
if [ "$SKIP_INSTALL" = "false" ]; then
    echo "📦 Installing dependencies..."
    npm ci
    echo "✅ Dependencies installed"
    echo ""
else
    echo "⏭️  Skipping npm install (--skip-install flag set)"
    echo ""
fi

# Build application
echo "🔨 Building server application..."
npm run build:server
echo "✅ Build completed"
echo ""

# Environment check
echo "🔍 Checking environment configuration..."
if ! grep -q "DISCORD_BOT_TOKEN=" .env || grep -q "your_discord_bot_token_here" .env; then
    echo "❌ Discord bot token not configured properly in .env"
    exit 1
fi

if ! grep -q "GEMINI_API_KEY=" .env || grep -q "your_gemini_api_key_here" .env; then
    echo "❌ Gemini API key not configured properly in .env"
    exit 1
fi

echo "✅ Environment configuration verified"
echo ""

# Verify build output exists
if [ ! -f "dist/index.js" ]; then
    echo "❌ Build output not found: dist/index.js"
    echo "   Please run: npm run build:server"
    exit 1
fi
echo "   Build output: ✅ SET = dist/index.js"
echo ""

# Delete existing PM2 process to force fresh environment reload
echo "🛑 Removing existing PM2 process (to force fresh env reload)..."
pm2 delete "$APP_NAME" 2>/dev/null || true

# Start fresh PM2 process (ensures .env file is reloaded)
echo "🚀 Starting fresh PM2 process with updated environment..."
# Ensure we're in the project directory
cd "$CURRENT_DIR" || {
    echo "❌ Failed to change to project directory: $CURRENT_DIR"
    exit 1
}

# Verify files exist
if [ ! -f "dist/index.js" ]; then
    echo "❌ Build output not found: dist/index.js"
    exit 1
fi

if [ -f "ecosystem.config.mjs" ]; then
    echo "   Using ecosystem.config.mjs"
    pm2 start ecosystem.config.mjs || {
        echo "❌ Failed to start PM2 with ecosystem.config.mjs"
        echo "   Trying fallback method..."
        pm2 start dist/index.js --name "$APP_NAME" --interpreter node --interpreter-args "--env-file=.env" --cwd "$CURRENT_DIR"
    }
elif [ -f "ecosystem.config.js" ]; then
    echo "   Using ecosystem.config.js"
    pm2 start ecosystem.config.js || {
        echo "❌ Failed to start PM2 with ecosystem.config.js"
        echo "   Trying fallback method..."
        pm2 start dist/index.js --name "$APP_NAME" --interpreter node --interpreter-args "--env-file=.env" --cwd "$CURRENT_DIR"
    }
else
    echo "   Using direct script start"
    pm2 start dist/index.js --name "$APP_NAME" --interpreter node --interpreter-args "--env-file=.env" --cwd "$CURRENT_DIR"
fi
echo "✅ PM2 process started"
echo ""

# Save PM2 configuration
pm2 save

# Wait for application to start
echo "⏳ Waiting for application to start..."
sleep 5
echo ""

# Health check
echo "🏥 Performing health check..."
if curl -f http://localhost:3000/health >/dev/null 2>&1; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed. Check application logs:"
    pm2 logs "$APP_NAME" --lines 20
    exit 1
fi
echo ""

# Display deployment summary
echo "📊 Deployment Summary:"
echo "   Application: $APP_NAME"
echo "   Branch: $BRANCH"
echo "   Directory: $CURRENT_DIR"
echo "   Node.js: $(node --version)"
if [ "$SKIP_BACKUP" = "true" ]; then
    echo "   Backup: ⏭️  SKIPPED"
fi
if [ "$SKIP_INSTALL" = "true" ]; then
    echo "   npm install: ⏭️  SKIPPED"
fi
if [ "$SKIP_PULL" = "true" ]; then
    echo "   git pull: ⏭️  SKIPPED"
fi
echo "   PM2 Status:"
pm2 list
echo ""

# Display useful commands
echo "🔗 Useful Commands:"
echo "   View logs: pm2 logs $APP_NAME"
echo "   Monitor: pm2 monit"
echo "   Restart: pm2 restart $APP_NAME"
echo "   Stop: pm2 stop $APP_NAME"
echo "   Health check: curl http://localhost:3000/health"
echo ""

echo "🎉 Deployment completed successfully!"
echo ""

echo "⚠️  Post-deployment checklist:"
echo "   1. Verify bot is responding in Discord"
echo "   2. Check application logs for any errors"
echo "   3. Test YouTube link summarization"
echo "   4. Monitor resource usage with: pm2 monit"
echo "   5. Server is running internally on port 3000"
echo ""

echo "📋 Server Information:"
echo "   Internal API: http://localhost:3000"
echo "   Health endpoint: http://localhost:3000/health"
echo "   This server is configured for internal Discord bot use only"

# Exit with success
exit 0
