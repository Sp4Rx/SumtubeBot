#!/bin/bash

# SumTube Bot Environment Variables Setup for Ubuntu EC2
# This script helps you set environment variables securely

set -e

echo "🔐 Setting up environment variables for SumTube Bot..."

# Create environment file
ENV_FILE="/home/ubuntu/.sumtube-env"

echo "📝 Please enter your environment variables:"

read -p "Discord Bot Token: " DISCORD_BOT_TOKEN
read -p "Gemini API Key: " GEMINI_API_KEY

# Write to environment file
cat >$ENV_FILE <<EOF
export NODE_ENV="production"
export PORT="3000"
export DISCORD_BOT_TOKEN="$DISCORD_BOT_TOKEN"
export GEMINI_API_KEY="$GEMINI_API_KEY"
EOF

# Secure the file
chmod 600 $ENV_FILE

# Add to bashrc if not already there
if ! grep -q "source $ENV_FILE" ~/.bashrc; then
    echo "source $ENV_FILE" >>~/.bashrc
    echo "✅ Environment variables added to ~/.bashrc"
fi

echo "✅ Environment variables configured!"
echo "📝 To load them in current session, run: source $ENV_FILE"
echo "🔄 Or reload your shell: source ~/.bashrc"
echo ""
echo "🚀 You can now start the application with: pm2 start ecosystem.config.js"
