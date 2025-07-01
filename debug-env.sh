#!/bin/bash

# SumTube Bot Environment Debug Script
echo "🔍 Debugging Environment Configuration..."
echo ""

# Check current directory
echo "📂 Current directory: $(pwd)"
echo ""

# Check if .env file exists
if [ -f ".env" ]; then
    echo "✅ .env file found"
    echo "📄 .env file size: $(wc -c <.env) bytes"
    echo "📄 .env file lines: $(wc -l <.env) lines"
    echo ""
    echo "🔐 .env file contents (masking sensitive data):"
    sed 's/=.*/=***HIDDEN***/g' .env
else
    echo "❌ .env file NOT found"
    echo "📁 Files in current directory:"
    ls -la
    echo ""
    echo "🔧 Creating .env from template..."
    if [ -f "env.template" ]; then
        cp env.template .env
        echo "✅ .env created from template"
        echo "⚠️  Please edit .env with your actual values: nano .env"
    else
        echo "❌ env.template not found either"
    fi
fi

echo ""
echo "🔍 Environment variables check:"
echo "NODE_ENV: ${NODE_ENV:-'not set'}"
echo "PORT: ${PORT:-'not set'}"
echo "DISCORD_BOT_TOKEN: ${DISCORD_BOT_TOKEN:+***SET***}${DISCORD_BOT_TOKEN:-'not set'}"
echo "GEMINI_API_KEY: ${GEMINI_API_KEY:+***SET***}${GEMINI_API_KEY:-'not set'}"
echo "VITE_DISCORD_APPLICATION_ID: ${VITE_DISCORD_APPLICATION_ID:-'not set'}"

echo ""
echo "📦 Node.js version: $(node --version)"
echo "📦 PM2 version: $(pm2 --version)"

echo ""
echo "📊 Current PM2 processes:"
pm2 list

echo ""
echo "🔗 Recent PM2 logs (last 10 lines):"
pm2 logs sumtubebot --lines 10 --nostream

echo ""
echo "📋 Next steps:"
echo "1. If .env is missing values, edit it: nano .env"
echo "2. Restart PM2 after fixing: pm2 restart sumtubebot"
echo "3. Check logs: pm2 logs sumtubebot"
