#!/bin/bash

# SumTube Bot Deployment Script for Ubuntu EC2
# This script deploys the application on EC2

set -e

APP_DIR="/opt/sumtube-bot"
BACKUP_DIR="/opt/sumtube-bot-backup-$(date +%Y%m%d_%H%M%S)"

echo "🚀 Starting deployment on Ubuntu EC2..."

# Check if environment variables are set
if [ -f "/home/ubuntu/.sumtube-env" ]; then
    echo "📂 Loading environment variables..."
    source /home/ubuntu/.sumtube-env
else
    echo "⚠️ Environment file not found. Run deploy/set-environment.sh first!"
    exit 1
fi

# Create backup of current version
if [ -d "$APP_DIR/dist" ]; then
    echo "💾 Creating backup..."
    sudo cp -r $APP_DIR $BACKUP_DIR
    echo "✅ Backup created at $BACKUP_DIR"
fi

# Stop the application
echo "🛑 Stopping application..."
pm2 stop sumtube-bot-api || echo "Application not running"

# Navigate to app directory
cd $APP_DIR

# Install/update dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Create logs directory if it doesn't exist
mkdir -p logs

# Start the application
echo "🚀 Starting application..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot (only if not already set)
if ! pm2 unstartup &>/dev/null; then
    echo "🔄 Setting up PM2 auto-start..."
    pm2 startup
    echo "⚠️ Please run the command shown above to complete PM2 startup setup"
fi

echo "✅ Deployment completed successfully!"
echo "📊 Application status:"
pm2 status

echo ""
echo "🔗 Your API is running at: http://ec2-3-110-118-25.ap-south-1.compute.amazonaws.com:3000"
echo "🏥 Health check: http://ec2-3-110-118-25.ap-south-1.compute.amazonaws.com:3000/health"
