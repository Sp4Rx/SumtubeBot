#!/bin/bash

# SumTube Bot EC2 Setup Script
# This script installs Node.js, PM2, and sets up the application

set -e

echo "🚀 Starting SumTube Bot EC2 setup..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update -y

# Install Node.js 20.x (Ubuntu) - has built-in .env support
echo "📦 Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
echo "✅ Node.js version: $(node --version)"
echo "✅ NPM version: $(npm --version)"

# Check Node.js version (should be 20+)
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js 20+ required for built-in .env support"
    echo "Current version: $(node --version)"
    echo "Please run this script to install Node.js 20"
    exit 1
fi
echo "✅ Node.js version check passed (v20+)"

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /opt/sumtube-bot
sudo chown ec2-user:ec2-user /opt/sumtube-bot

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p /opt/sumtube-bot/logs

# Install application dependencies
echo "📦 Installing application dependencies..."
cd /opt/sumtube-bot
npm install --production

echo "✅ Dependencies installed successfully!"
echo "📝 Next steps:"
echo "1. Upload your built application files to /opt/sumtube-bot"
echo "2. Set environment variables using: pm2 start ecosystem.config.js"
echo "3. Save PM2 configuration: pm2 save && pm2 startup"
