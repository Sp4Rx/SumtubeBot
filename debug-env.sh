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
    
    # Load .env file
    set -a
    source .env 2>/dev/null || true
    set +a
    
    # Function to display variable
    show_var() {
        local var_name=$1
        local is_sensitive=$2
        local value="${!var_name}"
        
        if [ -z "$value" ]; then
            echo "   $var_name: ❌ NOT SET or EMPTY"
        else
            if [ "$is_sensitive" = "true" ]; then
                local length=${#value}
                if [ $length -gt 8 ]; then
                    local preview="${value:0:4}...${value: -4}"
                    echo "   $var_name: ✅ SET (length: $length, preview: $preview)"
                else
                    echo "   $var_name: ✅ SET (length: $length) ⚠️  Too short!"
                fi
            else
                echo "   $var_name: ✅ SET = $value"
            fi
        fi
    }
    
    echo "📋 Environment Variables from .env file:"
    show_var "NODE_ENV" false
    show_var "PORT" false
    show_var "DISCORD_BOT_TOKEN" true
    show_var "GEMINI_API_KEY" true
    show_var "VITE_DISCORD_APPLICATION_ID" false
    
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
    exit 1
fi

echo ""
echo "📦 Node.js version: $(node --version)"
echo "📦 PM2 version: $(pm2 --version)"

echo ""
echo "📊 Current PM2 processes:"
pm2 list

echo ""
echo "🔍 PM2 Environment (what the running app sees):"
if pm2 list | grep -q "sumtubebot"; then
    pm2 show sumtubebot 2>/dev/null | grep -A 20 "env:" || echo "   (Check PM2 logs for actual values)"
    echo ""
    echo "🔗 Recent PM2 logs (last 30 lines) - Look for environment validation:"
    pm2 logs sumtubebot --lines 30 --nostream 2>/dev/null || echo "   (No logs available)"
else
    echo "   ⚠️  PM2 process 'sumtubebot' is not running"
fi

echo ""
echo "🧪 Testing GEMINI_API_KEY:"
if [ -n "$GEMINI_API_KEY" ] && [ ${#GEMINI_API_KEY} -gt 20 ]; then
    echo "   Testing API key validity..."
    TEST_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}" \
        -H "Content-Type: application/json" \
        -d '{"contents":[{"parts":[{"text":"Say hello"}]}]}' 2>&1)
    HTTP_CODE=$(echo "$TEST_RESPONSE" | tail -n1)
    if [ "$HTTP_CODE" = "200" ]; then
        echo "   ✅ API key is VALID and working!"
    elif [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
        echo "   ❌ API key is INVALID (HTTP $HTTP_CODE)"
        echo "   Check your GEMINI_API_KEY in .env file"
    else
        echo "   ⚠️  Got HTTP $HTTP_CODE - API key format may be correct but request failed"
    fi
else
    echo "   ⚠️  GEMINI_API_KEY is too short or empty"
fi

echo ""
echo "📋 Next steps:"
echo "1. If .env is missing values, edit it: nano .env"
echo ""
echo "2. If PM2 is using OLD cached environment variables:"
echo "   Option A (Recommended): Delete and recreate PM2 process"
echo "      pm2 delete sumtubebot"
echo "      pm2 start ecosystem.config.mjs"
echo "      pm2 save"
echo ""
echo "   Option B: Force reload environment"
echo "      pm2 restart sumtubebot --update-env"
echo "      pm2 save"
echo ""
echo "3. Verify the new key is loaded:"
echo "   pm2 logs sumtubebot --lines 20 | grep GEMINI_API_KEY"
echo "   (Check the 'verification' line to confirm it matches your .env file)"
echo ""
echo "4. Check full logs: pm2 logs sumtubebot --lines 50"
