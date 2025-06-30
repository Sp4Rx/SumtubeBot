# SumTube - AI YouTube Summarizer Discord Bot

## Overview

SumTube is a Discord bot application that automatically detects YouTube links in Discord messages and provides AI-powered video summaries with key points, timestamps, and contextual analysis. The application is built with a modern full-stack architecture using TypeScript throughout.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: tsx for hot reloading in development
- **Production**: esbuild for optimized builds

## Key Components

### Discord Bot Integration
- **Library**: discord.js v14 with Gateway intents for message monitoring
- **Features**: 
  - Automatic YouTube link detection via regex patterns
  - Real-time video summarization without rate limiting
  - Stateless operation for maximum simplicity

### AI Services
- **Gemini Integration**: Google's Gemini 2.5 Flash model for direct video content analysis
- **Direct Video Processing**: Gemini AI processes YouTube URLs directly without requiring transcripts
- **Summary Features**:
  - Intelligent content summarization with Discord-optimized formatting
  - Key points extraction with clickable timestamps
  - Minimalistic summaries under 1700 characters
  - Automatic timestamp generation with YouTube links

### Frontend Components
- **Landing Page**: Marketing site with bot information and setup guide
- **Component Library**: shadcn/ui components for consistent UI
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Demo Interface**: Interactive Discord chat simulation

## Data Flow

1. **Discord Message Processing**:
   - Bot monitors messages for YouTube URLs
   - Extracts video ID from URL patterns
   - Processes each URL independently

2. **Content Analysis Pipeline**:
   - Processes YouTube URLs directly through Google Gemini API
   - Generates structured summary with metadata using Gemini 2.5 Flash
   - Returns results immediately without caching

3. **Response Generation**:
   - Formats AI response into Discord embed
   - Includes summary, key points, and timestamps
   - Handles error cases gracefully

4. **Web Interface**:
   - Serves static marketing site
   - Provides basic bot statistics via REST API
   - Handles bot invitation and setup instructions

## External Dependencies

### Third-Party Services
- **Discord API**: Bot hosting and message handling
- **Google Gemini API**: Gemini 2.5 Flash for direct video content analysis

### Key Libraries
- **Frontend**: React, Tailwind CSS, Radix UI primitives
- **Backend**: Express.js, discord.js
- **AI**: Google Gemini AI for video content analysis
- **Shared**: Zod for validation, date-fns for utilities
- **Development**: Vite, tsx, esbuild, TypeScript

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite dev server with HMR
- **API Development**: tsx for TypeScript execution

### Production Build
- **Frontend**: Vite build process generating optimized static assets
- **Backend**: esbuild compilation for Node.js deployment
- **Single Port**: Express serves both API and static files on port 5000

## Features

### Core Functionality
- **Automatic Detection**: Monitors Discord messages for YouTube links
- **AI Analysis**: Uses Google Gemini 2.5 Flash for intelligent video summarization
- **Rich Responses**: Discord embeds with summaries, key points, and timestamps
- **Error Handling**: Graceful failure handling with user-friendly messages

### Technical Features
- **Stateless Design**: No database dependencies for maximum simplicity
- **TypeScript**: End-to-end type safety
- **Modern Stack**: Latest versions of React, Node.js, and related tools
- **Development Tools**: Hot reloading, type checking, and optimized builds

## Setup and Configuration

### Environment Variables
- `DISCORD_BOT_TOKEN`: Discord bot authentication token
- `GEMINI_API_KEY`: Google Gemini API key for video analysis

### Installation
1. Install dependencies: `npm install`
2. Set environment variables
3. Start development: `npm run dev`
4. Build for production: `npm run build`
5. Start production: `npm start`

## Recent Updates

- **Simplified Architecture**: Removed database dependencies for maximum performance
- **Direct AI Integration**: Streamlined video processing with Google Gemini
- **Stateless Operation**: No rate limiting or data persistence for better scalability
- **Reduced Dependencies**: Optimized package size and complexity