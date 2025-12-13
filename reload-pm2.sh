#!/bin/bash

# Force PM2 to reload environment variables from .env file
# This script deletes and recreates the PM2 process to ensure fresh env vars

echo "🔄 Forcing PM2 to reload environment variables..."
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    exit 1
fi

# Check if PM2 process exists
if pm2 list | grep -q "sumtubebot"; then
    echo "📋 Current PM2 process found"
    echo ""
    echo "🛑 Stopping and deleting existing PM2 process..."
    pm2 delete sumtubebot 2>/dev/null || true
    echo "✅ Process deleted"
    echo ""
    
    echo "🚀 Starting fresh PM2 process with updated environment..."
    pm2 start ecosystem.config.mjs
    pm2 save
    echo "✅ PM2 process recreated"
    echo ""
    
    echo "⏳ Waiting 3 seconds for startup..."
    sleep 3
    
    echo "📊 PM2 Status:"
    pm2 list | grep sumtubebot || echo "   (Process not found)"
    echo ""
    
    echo "🔍 Recent logs (check for environment validation):"
    pm2 logs sumtubebot --lines 20 --nostream 2>/dev/null | grep -E "(Environment variables|GEMINI_API_KEY|verification)" || echo "   (No relevant logs found)"
    echo ""
    
    echo "✅ Done! Check the logs above to verify the correct API key is loaded."
    echo "   Look for the 'GEMINI_API_KEY verification' line to confirm it matches your .env file."
else
    echo "⚠️  PM2 process 'sumtubebot' not found"
    echo "🚀 Starting new PM2 process..."
    pm2 start ecosystem.config.mjs
    pm2 save
    echo "✅ PM2 process started"
fi

