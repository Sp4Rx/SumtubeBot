import { Client, GatewayIntentBits, Message } from 'discord.js';
import { generateVideoSummary, extractVideoId } from './gemini-service';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const YOUTUBE_URL_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;

export async function startDiscordBot(): Promise<void> {
  if (!process.env.DISCORD_BOT_TOKEN) {
    throw new Error('DISCORD_BOT_TOKEN not configured');
  }

  await client.login(process.env.DISCORD_BOT_TOKEN);
}

client.on('messageCreate', async (message: Message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Check for YouTube URLs
  const youtubeMatches = message.content.match(YOUTUBE_URL_REGEX);
  if (!youtubeMatches) return;

  try {
    for (const youtubeUrl of youtubeMatches) {
      const videoId = extractVideoId(youtubeUrl);
      if (!videoId) continue;

      // Show typing indicator (skip for certain channel types)
      if (message.channel.type === 0 || message.channel.type === 2 || message.channel.type === 5) { // GUILD_TEXT, DM, GUILD_ANNOUNCEMENT
        try {
          await (message.channel as any).sendTyping();
        } catch (error) {
          // Ignore typing errors
        }
      }

      // Generate AI summary directly from URL
      const summaryData = await generateVideoSummary(youtubeUrl, videoId);

      // Send summary message directly without storing
      await sendSummaryMessage(message, summaryData);
    }
  } catch (error) {
    console.error('Error processing YouTube link:', error);
    await message.reply({
      content: '❌ An error occurred while processing the video. Please try again later.',
    });
  }
});

async function sendSummaryMessage(message: Message, summaryData: any) {
  const embed = {
    color: 0xFF0000, // YouTube red
    title: `📺 ${summaryData.title}`,
    description: summaryData.summary,
    fields: [
      {
        name: '⏱️ Duration',
        value: formatDuration(summaryData.duration),
        inline: true,
      },
      {
        name: '🔍 Key Points',
        value: summaryData.keyPoints.slice(0, 3).map((point: string, index: number) => `${index + 1}. ${point}`).join('\n') || 'No key points available',
        inline: false,
      },
    ],
    footer: {
      text: 'SumTube • AI-Powered Video Summaries',
      icon_url: 'https://i.imgur.com/SumTubeLogo.png',
    },
    timestamp: new Date().toISOString(),
  };

  if (summaryData.timestamps && summaryData.timestamps.length > 0) {
    embed.fields.push({
      name: '🕒 Key Moments',
      value: summaryData.timestamps.slice(0, 3).join('\n') || 'No timestamps available',
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

client.on('ready', () => {
  console.log(`✅ Discord bot logged in as ${client.user?.tag}!`);
});

client.on('error', (error) => {
  console.error('Discord client error:', error);
});

process.on('SIGINT', () => {
  console.log('🛑 Gracefully shutting down Discord bot...');
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Gracefully shutting down Discord bot...');
  client.destroy();
  process.exit(0);
});
