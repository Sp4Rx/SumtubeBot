# 🚀 Quick Start Guide for SumTube Bot

**Your EC2 Instance**: `ec2-3-110-118-25.ap-south-1.compute.amazonaws.com`

## 📋 Prerequisites Checklist

- ✅ Discord Bot Token ([Get from Discord Developer Portal](https://discord.com/developers/applications))
- ✅ Google Gemini API Key ([Get from Google AI Studio](https://aistudio.google.com/))
- ✅ AWS EC2 Ubuntu instance running
- ✅ EC2 security group allows port 3000
- ✅ Your .pem key file for EC2 access
- ✅ Node.js 20+ (for built-in .env support)

## 🔧 Local Development (Windows)

1. **Clone and Install**:
   ```bash
   git clone <your-repo>
   cd SumtubeBot
   npm install
   ```

2. **Set Environment Variables**:
   Copy template and fill with your actual tokens:
   ```bash
   cp .env.template .env
   ```
   
   Edit `.env` file with your actual values:
   ```env
   DISCORD_BOT_TOKEN=your_actual_bot_token_here
   GEMINI_API_KEY=your_actual_gemini_key_here
   VITE_DISCORD_APPLICATION_ID=your_discord_application_id_here
   NODE_ENV=development
   PORT=3000
   ```

3. **Start Development**:
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## 🌐 Deploy to Production

### Step 1: Prepare EC2 (First Time Only)

```bash
# Connect to your EC2
ssh -i your-key.pem ubuntu@ec2-3-110-118-25.ap-south-1.compute.amazonaws.com

# Upload setup script
scp -i your-key.pem deploy/install-dependencies.sh ubuntu@ec2-3-110-118-25.ap-south-1.compute.amazonaws.com:~/

# Run setup
chmod +x install-dependencies.sh
./install-dependencies.sh
```

### Step 2: Deploy from Windows

#### Option A: Using Windows Scripts
```batch
# Build the app
deploy\deploy-windows.bat

# Upload to EC2
deploy\upload-to-ec2.bat "path\to\your-key.pem"
```

#### Option B: Manual Steps
```bash
# Build locally
npm run build

# Upload files
scp -i your-key.pem -r dist/ ecosystem.config.js package.json ubuntu@ec2-3-110-118-25.ap-south-1.compute.amazonaws.com:/opt/sumtube-bot/
```

### Step 3: Configure Environment on EC2

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@ec2-3-110-118-25.ap-south-1.compute.amazonaws.com

# Go to app directory
cd /opt/sumtube-bot

# Set up environment variables (first time only)
./deploy/set-environment.sh
# Enter your Discord Bot Token
# Enter your Gemini API Key  
# Enter your Cloudflare Pages domain (when ready)

# Deploy and start
./deploy/deploy.sh
```

### Step 4: Setup Cloudflare Pages

1. **Go to Cloudflare Pages Dashboard**
2. **Create new project** → Connect to GitHub
3. **Build settings**:
   - Build command: `npm run build:client`
   - Build output directory: `dist/client`
   - Environment variable: 
     - `VITE_DISCORD_APPLICATION_ID = your_discord_application_id_here`



## 🔍 Testing Your Deployment

1. **API Health Check**:
   ```
   http://ec2-3-110-118-25.ap-south-1.compute.amazonaws.com:3000/health
   ```

2. **Bot Stats API**:
   ```
   http://ec2-3-110-118-25.ap-south-1.compute.amazonaws.com:3000/api/bot/stats
   ```

3. **Frontend** (after Cloudflare Pages deployment):
   ```
   https://your-app.pages.dev
   ```

## ⚠️ Important Security Notes

- ✅ `ecosystem.config.js` is safe to commit (no secrets)
- ❌ Never commit `.env` files with real tokens
- ❌ Never commit `ecosystem.config.local.js` files  
- ✅ Environment variables are stored securely in `/home/ubuntu/.sumtube-env`

## 🔄 Updating Your App

```bash
# On Windows - build new version
npm run build
deploy\upload-to-ec2.bat "path\to\your-key.pem"

# On EC2 - deploy updates
ssh -i your-key.pem ubuntu@ec2-3-110-118-25.ap-south-1.compute.amazonaws.com
cd /opt/sumtube-bot
./deploy/deploy.sh
```

## 🆘 Common Issues



**Bot Not Responding**: Check Discord Bot Token and bot permissions

**EC2 Connection Failed**: Verify security group allows port 3000

**Build Fails**: Run `npm install` and check Node.js version (18+)

## 📊 Monitoring

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs sumtube-bot-api

# Monitor resources
htop
```

Your bot is now ready! 🎉 