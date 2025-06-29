import { Client, GatewayIntentBits, Message } from 'discord.js';
import { extractVideoId, getVideoTranscript } from './youtube-transcript';
import { generateVideoSummary } from './gemini-service';
import { storage } from '../storage';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const YOUTUBE_URL_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;
const RATE_LIMIT_PER_HOUR = 10;

async function checkRateLimit(serverId: string): Promise<boolean> {
  const server = await storage.getDiscordServer(serverId);
  
  if (!server) {
    // Create new server entry
    await storage.createDiscordServer({
      serverId,
      serverName: 'Unknown Server',
      isActive: true,
      rateLimitCount: 0,
    });
    return true;
  }

  // Reset rate limit if an hour has passed
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
  if (server.lastResetTime < hourAgo) {
    await storage.resetServerRateLimit(serverId);
    return true;
  }

  return server.rateLimitCount < RATE_LIMIT_PER_HOUR;
}

async function incrementRateLimit(serverId: string): Promise<void> {
  const server = await storage.getDiscordServer(serverId);
  if (server) {
    await storage.updateServerRateLimit(serverId, server.rateLimitCount + 1);
  }
}

client.on('ready', () => {
  console.log(`🤖 SumTube bot is online as ${client.user?.tag}`);
});

client.on('messageCreate', async (message: Message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Check for YouTube URLs
  const youtubeMatches = message.content.match(YOUTUBE_URL_REGEX);
  if (!youtubeMatches) return;

  const serverId = message.guild?.id;
  if (!serverId) return;

  // Check rate limit
  const canProcess = await checkRateLimit(serverId);
  if (!canProcess) {
    await message.reply({
      content: '⚠️ Rate limit exceeded! This server has reached the maximum of 10 summaries per hour. Please try again later.',
    });
    return;
  }

  try {
    for (const youtubeUrl of youtubeMatches) {
      const videoId = extractVideoId(youtubeUrl);
      if (!videoId) continue;

      // Check if we already have a summary for this video
      const existingSummary = await storage.getVideoSummary(videoId);
      if (existingSummary) {
        await sendSummaryMessage(message, existingSummary);
        continue;
      }

      // Show typing indicator (skip for certain channel types)
      if (message.channel.type === 0 || message.channel.type === 2 || message.channel.type === 5) { // GUILD_TEXT, DM, GUILD_ANNOUNCEMENT
        try {
          await (message.channel as any).sendTyping();
        } catch (error) {
          // Ignore typing errors
        }
      }

      // Get video transcript
      const transcriptData = await getVideoTranscript(videoId);
      if (!transcriptData) {
        await message.reply({
          content: '❌ Unable to get transcript for this video. The video might not have captions available or could be private.',
        });
        continue;
      }

      // Generate AI summary
      const summaryData = await generateVideoSummary(transcriptData);
      
      // Store summary
      const videoSummary = await storage.createVideoSummary({
        videoId,
        videoTitle: transcriptData.title,
        videoUrl: youtubeUrl,
        summary: summaryData.summary,
        keyPoints: summaryData.keyPoints,
        timestamps: summaryData.timestamps,
        duration: transcriptData.duration,
      });

      await sendSummaryMessage(message, videoSummary);
      await incrementRateLimit(serverId);
    }
  } catch (error) {
    console.error('Error processing YouTube link:', error);
    await message.reply({
      content: '❌ An error occurred while processing the video. Please try again later.',
    });
  }
});

async function sendSummaryMessage(message: Message, summary: any) {
  const embed = {
    color: 0xFF0000, // YouTube red
    title: `📺 ${summary.videoTitle}`,
    description: summary.summary,
    fields: [
      {
        name: '⏱️ Duration',
        value: formatDuration(summary.duration),
        inline: true,
      },
      {
        name: '🔍 Key Points',
        value: summary.keyPoints.slice(0, 3).map((point: string, index: number) => `${index + 1}. ${point}`).join('\n') || 'No key points available',
        inline: false,
      },
    ],
    footer: {
      text: 'SumTube • AI-Powered Video Summaries',
      icon_url: 'https://i.imgur.com/SumTubeLogo.png',
    },
    timestamp: new Date().toISOString(),
  };

  if (summary.timestamps && summary.timestamps.length > 0) {
    embed.fields.push({
      name: '🕒 Key Moments',
      value: summary.timestamps.slice(0, 3).join('\n') || 'No timestamps available',
      inline: false,
    });
  }

  await message.reply({ embeds: [embed] });
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export async function startDiscordBot(): Promise<void> {
  const token = process.env.DISCORD_BOT_TOKEN || process.env.DISCORD_TOKEN;
  
  if (!token) {
    throw new Error('DISCORD_BOT_TOKEN environment variable is required');
  }

  await client.login(token);
}

export { client as discordClient };
