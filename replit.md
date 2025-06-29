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

### Database Layer
- **ORM**: Drizzle ORM with TypeScript-first approach
- **Database**: PostgreSQL (configured via Neon Database)
- **Migrations**: Drizzle Kit for schema management
- **Schema**: Shared schema definitions between client and server

## Key Components

### Discord Bot Integration
- **Library**: discord.js v14 with Gateway intents for message monitoring
- **Features**: 
  - Automatic YouTube link detection via regex patterns
  - Rate limiting (10 summaries per server per hour)
  - Server management and statistics tracking

### AI Services
- **Gemini Integration**: Google's Gemini 2.5 Flash model for video content analysis
- **YouTube Transcript**: youtube-transcript library for extracting video captions
- **Summary Features**:
  - Intelligent content summarization with Discord-optimized formatting
  - Key points extraction with clickable timestamps
  - Minimalistic summaries under 1700 characters
  - Automatic timestamp generation with YouTube links

### Storage System
- **Database Schema**:
  - `users`: User authentication and management
  - `video_summaries`: Cached video summaries with metadata
  - `discord_servers`: Server settings and rate limiting
- **In-Memory Storage**: MemStorage class for development/testing
- **Production Storage**: PostgreSQL with connection pooling

### Frontend Components
- **Landing Page**: Marketing site with bot information and setup guide
- **Component Library**: shadcn/ui components for consistent UI
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Demo Interface**: Interactive Discord chat simulation

## Data Flow

1. **Discord Message Processing**:
   - Bot monitors messages for YouTube URLs
   - Validates rate limits per server
   - Extracts video ID from URL patterns

2. **Content Analysis Pipeline**:
   - Fetches video transcript using YouTube API
   - Processes transcript through OpenAI GPT-4o
   - Generates structured summary with metadata
   - Caches results in database

3. **Response Generation**:
   - Formats AI response into Discord embed
   - Includes summary, key points, and timestamps
   - Handles error cases and rate limiting notifications

4. **Web Interface**:
   - Serves static marketing site
   - Provides bot statistics via REST API
   - Handles bot invitation and setup instructions

## External Dependencies

### Third-Party Services
- **Discord API**: Bot hosting and message handling
- **Google Gemini API**: Gemini 2.5 Flash for content analysis
- **Neon Database**: PostgreSQL hosting
- **YouTube**: Transcript extraction (no official API key required)

### Key Libraries
- **Frontend**: React, Tailwind CSS, Radix UI primitives
- **Backend**: Express.js, discord.js, drizzle-orm
- **Shared**: Zod for validation, date-fns for utilities
- **Development**: Vite, tsx, esbuild, TypeScript

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite dev server with HMR
- **API Development**: tsx for TypeScript execution
- **Database**: Local development with Drizzle migrations

### Production Build
- **Frontend**: Vite build process generating optimized static assets
- **Backend**: esbuild bundling for Node.js deployment
- **Asset Management**: Static file serving via Express

### Environment Configuration
- **Database**: `DATABASE_URL` for PostgreSQL connection
- **Discord**: `DISCORD_BOT_TOKEN` for bot authentication and message handling
- **Gemini**: `GEMINI_API_KEY` for AI-powered video analysis
- **Security**: Environment-based configuration management

## Changelog

```
Changelog:
- June 29, 2025: Initial setup with OpenAI GPT-4o integration
- June 29, 2025: Migrated from OpenAI to Google Gemini 2.5 Flash for video analysis
- June 29, 2025: Updated landing page with custom YouTube-style logo
- June 29, 2025: Fixed UI overlapping issue between status badge and GitHub ribbon
- June 29, 2025: Implemented Discord bot with YouTube link detection and AI summaries
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```