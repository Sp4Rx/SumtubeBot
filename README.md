# 📺 SumtubeBot

![SumtubeBot Logo](./attached_assets/logo_1751221870398.png)

**AI-Powered Discord Bot for Intelligent YouTube Video Summaries**

SumtubeBot is an intelligent Discord bot that automatically detects YouTube links in your server and provides comprehensive AI-generated summaries with key timestamps, making it easier for your community to understand video content at a glance.

## 🌟 Features

- **🤖 AI-Powered Summaries**: Advanced AI analyzes video content using Google Gemini to provide intelligent, contextual summaries
- **⚡ Instant Detection**: Automatically detects YouTube links in messages and responds with summaries in seconds
- **🕒 Timestamp Support**: Includes relevant timestamps for key moments, making it easy to jump to important sections
- **🔒 Privacy Focused**: Only processes public YouTube videos and doesn't store personal data or conversation history
- **🌐 Multi-Server Support**: Works across multiple Discord servers simultaneously with customizable permissions
- **📊 Smart Analytics**: Provides content categorization and key topic extraction for better understanding

## 🚀 Quick Start

### Add to Your Discord Server

[![Add to Discord](https://img.shields.io/badge/Add%20to-Discord-7289da?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/oauth2/authorize?client_id=1388543377351508009&permissions=2147551232&scope=bot%20applications.commands)

### Usage

1. **Invite the bot** to your Discord server using the link above
2. **Share a YouTube link** in any channel where the bot has access
3. **Get instant summaries** with timestamps and key insights automatically

Example:
```
User: Check out this tutorial: https://youtu.be/example-video
SumtubeBot: 📺 How To Submit Your Hackathon Build
Submitting your project to the World's Largest Hackathon on Devpost involves...
Key Timestamps:
• 0:18 - Access the hackathon homepage
• 0:35 - Manage Team: Add teammates via email
• 0:43 - Project Overview: Enter Project Name, Elevator Pitch
...
```

## 🛠️ Tech Stack

- **Backend**: Node.js with TypeScript
- **Framework**: Express.js
- **AI Service**: Google Gemini AI
- **Discord Integration**: Discord.js v14
- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Build Tool**: Vite
- **Deployment**: 
  - Frontend: Cloudflare Pages (Free)
  - Backend: AWS EC2 (Free Tier)

## 🏗️ Development Setup

### Prerequisites

- Node.js 20+ (for built-in .env file support)
- npm or yarn
- Discord Application with Bot Token
- Google Gemini API Key

### Environment Variables

Create a `.env` file in the root directory (copy from template):

```bash
cp .env.template .env
# Edit .env with your actual Discord tokens and Gemini API key
```

Note: Node.js 20+ automatically loads `.env` files with the `--env-file` flag (no dotenv package needed).

```env
# Discord Configuration
DISCORD_BOT_TOKEN=your_discord_bot_token
VITE_DISCORD_APPLICATION_ID=your_discord_application_id

# Google Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sp4Rx/sumtubebot.git
   cd sumtubebot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`
   Backend API will be available at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   npm run start:server
   ```

## 📁 Project Structure

```
sumtubebot/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Node.js backend
│   ├── services/          # Core services
│   │   ├── discord-bot.ts # Discord bot logic
│   │   └── gemini-service.ts # AI service integration
│   ├── routes.ts          # API routes
│   └── index.ts           # Server entry point
├── attached_assets/       # Static assets
└── README.md
```

## 🔧 Configuration

### Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Navigate to "Bot" section and create a bot
4. Copy the bot token to your `.env` file
5. Enable necessary intents:
   - Message Content Intent
   - Server Members Intent (optional)

### Required Permissions

The bot needs the following Discord permissions:
- Read Messages/View Channels
- Send Messages  
- Embed Links
- Read Message History
- Use Slash Commands

## 🌐 Deployment

This project is designed for a split deployment architecture:

### 🚀 Quick Deployment Guide

**Frontend → Cloudflare Pages (Free)**
- Automatic builds from GitHub
- Global CDN distribution
- Zero configuration SSL

**Backend → AWS EC2 (Free Tier)**
- t2.micro instance (Free for 12 months)
- PM2 for process management
- Discord bot + API server

### 📋 Detailed Setup

See the comprehensive **[DEPLOY.md](./DEPLOY.md)** guide for:
- Step-by-step AWS EC2 setup
- Cloudflare Pages configuration  
- Environment variable management
- Security best practices
- Cost optimization tips

### 💰 Cost Breakdown (Free Tier)
- **EC2 t2.micro**: Free for 12 months
- **Cloudflare Pages**: Free tier (unlimited sites)
- **Gemini API**: Free tier available
- **Total Monthly Cost**: $0 (during free tier period)

### Alternative Deployments

The bot can also be deployed on:
- **Railway**: Use provided configurations
- **DigitalOcean**: App Platform or Droplets
- **Heroku**: With the provided scripts
- **Google Cloud**: Compute Engine or Cloud Run

## 📊 Features in Detail

### AI-Powered Video Analysis

- **Content Summarization**: Extracts key points and main topics
- **Timestamp Extraction**: Identifies important moments with precise timing
- **Context Understanding**: Provides relevant insights based on video content
- **Language Processing**: Handles multiple languages and technical content

### Discord Integration

- **Automatic Link Detection**: Monitors channels for YouTube URLs
- **Rich Embeds**: Formats summaries in beautiful Discord embeds
- **Server Management**: Supports multiple servers with isolated configurations
- **Permission Control**: Respects Discord's permission system

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **🐛 Bug Reports**: [GitHub Issues](https://github.com/sp4rx/sumtubebot/issues)
- **📚 Documentation**: [Deployment Guide](./DEPLOY.md)
- **🚀 Quick Start**: [Quick Start Guide](./QUICK-START.md)

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful video analysis capabilities
- **Discord.js** for excellent Discord API integration
- **React & Tailwind CSS** for the beautiful frontend interface
- **Cloudflare Pages** for reliable frontend hosting
- **AWS EC2** for scalable backend infrastructure

---

<div align="center">

**Made with ❤️ by [Sp4Rx](https://github.com/Sp4Rx)**

⭐ **Star this repository if you find it helpful!**

</div> 