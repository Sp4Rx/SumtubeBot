# SumTube Bot Deployment Guide

This guide covers deploying the SumTube Bot with the frontend on **Cloudflare Pages** and the backend API + Discord bot on **AWS EC2**.

## Architecture Overview

- **Frontend**: React app hosted on Cloudflare Pages
- **Backend**: Node.js API server hosted on AWS EC2 (Free Tier eligible)
- **Discord Bot**: Runs alongside the API server on EC2
- **AI Service**: Google Gemini API for video summarization

## Prerequisites

1. **Accounts Required**:
   - Cloudflare account (free)
   - AWS account (free tier)
   - Discord Developer account
   - Google AI Studio account (for Gemini API)

2. **Local Development**:
   - Node.js 20+ (for built-in .env file support)
   - Git
   - GitHub repository

## Part 1: Setting Up Environment Variables

### Required API Keys

1. **Discord Bot Token**:
   - Visit [Discord Developer Portal](https://discord.com/developers/applications)
   - Create new application → Bot → Copy token
   - Enable necessary bot permissions and intents

2. **Google Gemini API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Create API key
   - Enable Gemini API access

### Environment Variables Setup

#### For Local Development

Create a `.env` file in the project root:

```bash
# Copy from .env.example
cp .env.example .env
```

Fill in your actual values:
```env
DISCORD_BOT_TOKEN=your_actual_discord_token
GEMINI_API_KEY=your_actual_gemini_key
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

#### For Production (EC2)

Environment variables will be set via PM2 ecosystem file or system environment.

## Part 2: AWS EC2 Setup (Free Tier)

### 1. Launch EC2 Instance

1. **Instance Configuration**:
   - AMI: Amazon Linux 2023 (free tier eligible)
   - Instance Type: t2.micro (free tier)
   - Storage: 8GB GP2 (free tier)
   - Security Group: Allow HTTP (80), HTTPS (443), SSH (22), and Custom TCP (3000)

2. **Security Group Rules**:
   ```
   SSH (22) - Your IP
   HTTP (80) - 0.0.0.0/0
   HTTPS (443) - 0.0.0.0/0
   Custom TCP (3000) - 0.0.0.0/0
   ```

### 2. Connect to EC2 and Setup

```bash
# Connect to your Ubuntu EC2 instance
ssh -i your-key.pem ubuntu@ec2-3-110-118-25.ap-south-1.compute.amazonaws.com

# Upload and run the setup script
scp -i your-key.pem deploy/install-dependencies.sh ubuntu@ec2-3-110-118-25.ap-south-1.compute.amazonaws.com:~/
ssh -i your-key.pem ubuntu@ec2-3-110-118-25.ap-south-1.compute.amazonaws.com
chmod +x install-dependencies.sh
./install-dependencies.sh
```

### 3. Deploy Application to EC2

#### Option A: From Windows (Local Machine)

```batch
# Build locally using Windows script
deploy\deploy-windows.bat

# Upload to EC2 using Windows script
deploy\upload-to-ec2.bat "path\to\your-key.pem"
```

#### Option B: Manual Upload

```bash
# Build the application locally
npm run build

# Upload files to EC2
scp -i your-key.pem -r dist/ ecosystem.config.js package.json ubuntu@ec2-3-110-118-25.ap-south-1.compute.amazonaws.com:/opt/sumtube-bot/
```

#### On EC2 Instance

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@ec2-3-110-118-25.ap-south-1.compute.amazonaws.com

# Set up environment variables (first time only)
cd /opt/sumtube-bot
./deploy/set-environment.sh

# Deploy the application
./deploy/deploy.sh
```

### 4. Set Environment Variables on EC2

**Option 1: Using PM2 Ecosystem (Recommended)**

Edit `ecosystem.config.js` on EC2:
```javascript
module.exports = {
  apps: [{
    name: 'sumtube-bot-api',
    script: './dist/index.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DISCORD_BOT_TOKEN: 'your_actual_token',
      GEMINI_API_KEY: 'your_actual_key',
      CORS_ORIGIN: 'https://your-pages-domain.pages.dev'
    }
  }]
};
```

**Option 2: System Environment Variables**

```bash
# Add to ~/.bashrc or /etc/environment
export DISCORD_BOT_TOKEN="your_token"
export GEMINI_API_KEY="your_key"
export NODE_ENV="production"
export PORT="3000"
export CORS_ORIGIN="https://your-pages-domain.pages.dev"
```

### 5. Optional: Set up Nginx (for domain/SSL)

```bash
# Install Nginx
sudo yum install -y nginx

# Configure Nginx proxy
sudo tee /etc/nginx/conf.d/sumtube.conf > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Part 3: Cloudflare Pages Setup

### 1. Prepare Repository

Push your code to GitHub with the changes made in this guide.

### 2. Create Cloudflare Pages Project

1. Go to Cloudflare Dashboard → Pages → Create a project
2. Connect to GitHub and select your repository
3. Configure build settings:

   **Build Configuration**:
   ```
   Framework preset: None
   Build command: npm run build:client
   Build output directory: dist/client
   Root directory: (leave empty)
   ```

   **Environment Variables**:
   ```
   VITE_DISCORD_APPLICATION_ID = your_discord_application_id_here
   ```



### 4. Configure Custom Domain (Optional)

1. Add your domain to Cloudflare Pages
2. Update DNS settings
3. SSL will be automatically configured

## Part 4: Final Configuration

### Update Frontend API URL

Update `wrangler.toml` and rebuild:

```toml
[build.environment_variables]
```

### Test the Deployment

1. **Health Check**: Visit `https://your-ec2-domain.com/health`
2. **Frontend**: Visit your Cloudflare Pages URL
3. **Discord Bot**: Invite bot to server and test with YouTube links

## Part 5: Monitoring and Maintenance

### EC2 Monitoring

```bash
# Check application status
pm2 status
pm2 logs sumtube-bot-api

# Monitor system resources
htop
df -h
```

### Cloudflare Pages

- Monitor deployments in Cloudflare Dashboard
- Check build logs for any issues
- Set up notifications for failed deployments

## Cost Breakdown (Free Tier)

- **EC2 t2.micro**: Free for 12 months (750 hours/month)
- **Cloudflare Pages**: Free tier (500 builds/month, unlimited sites)
- **Gemini API**: Free tier available
- **Discord Bot**: Free

## Troubleshooting

### Common Issues

1. 
2. **Discord Bot Not Responding**: Verify `DISCORD_BOT_TOKEN`
3. **Gemini API Errors**: Check `GEMINI_API_KEY` and quota
4. **EC2 Connection Issues**: Verify security group settings

### Logs

```bash
# PM2 logs
pm2 logs sumtube-bot-api

# System logs
sudo journalctl -u nginx -f  # If using Nginx
```

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use IAM roles** for EC2 instead of access keys when possible
3. **Enable CloudFlare security features** (DDoS protection, WAF)
4. **Regular security updates** on EC2
5. **Monitor API usage** and set up alerts

## Updating the Application

Use the provided deployment script:

```bash
# On your local machine
./deploy/deploy.sh

# Or manually deploy new changes
npm run build:server
# Upload to EC2 and restart PM2
```

This setup provides a robust, scalable, and cost-effective deployment for your SumTube Bot! 