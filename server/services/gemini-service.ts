import { GoogleGenAI, Content, Part } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ""
});

export const model = 'gemini-2.5-flash';

export interface VideoSummaryData {
  summary: string;
  keyPoints: string[];
  timestamps: string[];
  title: string;
  duration: number;
}

export async function generateVideoSummary(videoUrl: string, videoId: string): Promise<VideoSummaryData> {
  try {
    console.log(`🎬 Starting Gemini analysis for video: ${videoUrl} (ID: ${videoId})`);

    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not found in environment variables');
      throw new Error('GEMINI_API_KEY not configured');
    }

    // Create a detailed prompt for better YouTube video summaries
    const prompt = `
    Analyze the following YouTube video and generate a concise summary formatted for a Discord message under 1700 characters.
    - Start with a short summary summarizing the overall theme or purpose of the video.
    - Each point must begin with a timestamp in [m:ss] format (e.g., [1:15]).
    - Format the timestamp [m:ss] as a clickable hyperlink like: https://www.youtube.com/watch?v=${videoId}#t=SECONDS.
    - Use total SECONDS for the timestamp (e.g., 75 instead of 01:15).
    - Do not include any other text than the summary. minimalistic.
    - Add important information like code, links, images, problems, solutions, etc. also.
    `;

    console.log('📝 Created prompt for video analysis');
    console.log(`📋 Using model: ${model}`);

    // Create content with both text prompt and YouTube URL
    const contents: Content = {
      parts: [
        {
          text: prompt
        } as Part,
        {
          fileData: {
            fileUri: videoUrl
          }
        } as Part
      ]
    };

    console.log('🚀 Sending request to Gemini API...');
    const startTime = Date.now();

    // Generate content using Gemini 2.5 Flash
    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
    });

    const endTime = Date.now();
    const processingTime = endTime - startTime;
    console.log(`✅ Gemini API response received in ${processingTime}ms`);

    // Extract the summary text
    const summaryText = response.text;

    if (summaryText && summaryText.trim()) {
      console.log(`📄 Summary generated successfully (${summaryText.length} characters)`);
      console.log(`📊 Summary preview: ${summaryText.substring(0, 100)}...`);

      // Parse the summary to extract key points and timestamps
      const lines = summaryText.trim().split('\n').filter(line => line.trim());
      const summary = lines[0] || summaryText.slice(0, 200);
      const keyPoints: string[] = [];
      const timestamps: string[] = [];

      // Extract lines that contain timestamps
      lines.forEach(line => {
        if (line.includes('[') && line.includes(']')) {
          keyPoints.push(line.trim());
          timestamps.push(line.trim());
        }
      });

      // Use default values instead of extraction functions
      const title = `YouTube Video ${videoId}`;
      const duration = 0; // Default duration

      return {
        summary: summary.trim(),
        keyPoints: keyPoints.length > 0 ? keyPoints : [summaryText.slice(0, 100) + '...'],
        timestamps: timestamps.length > 0 ? timestamps : [],
        title: title,
        duration: duration,
      };
    } else {
      console.error('❌ Gemini API returned empty or null summary');
      throw new Error('Gemini API did not return a summary');
    }
  } catch (error: any) {
    console.error('❌ Gemini API error occurred:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Provide more specific error messages
    if (error.message?.includes('API key')) {
      console.error('🔑 API key validation failed');
      throw new Error('Invalid API key. Please check your GEMINI_API_KEY environment variable.');
    } else if (error.message?.includes('quota')) {
      console.error('📊 API quota exceeded');
      throw new Error('API quota exceeded. Please try again later or check your Gemini API usage limits.');
    } else if (error.message?.includes('blocked')) {
      console.error('🚫 Content was blocked by Gemini');
      throw new Error('Content was blocked. The video might contain restricted content or be unavailable.');
    } else if (error.message?.includes('not found')) {
      console.error('🔍 Video not found or inaccessible');
      throw new Error('Video not found. Please check if the YouTube URL is valid and the video is publicly accessible.');
    } else {
      console.error('🔥 Unknown Gemini API error');
      throw new Error(`Error calling Gemini API: ${error.message || 'Unknown error occurred'}`);
    }
  }
}

export function extractVideoId(url: string): string | null {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
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
