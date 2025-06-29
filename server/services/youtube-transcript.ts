import { YoutubeTranscript } from 'youtube-transcript';

export interface TranscriptData {
  videoId: string;
  title: string;
  transcript: string;
  duration: number;
}

export function extractVideoId(url: string): string | null {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function getVideoTranscript(videoId: string): Promise<TranscriptData | null> {
  try {
    // Get transcript
    const transcriptArray = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcriptArray || transcriptArray.length === 0) {
      return null;
    }

    // Combine transcript text
    const transcript = transcriptArray
      .map(item => item.text)
      .join(' ')
      .replace(/\[.*?\]/g, '') // Remove [Music], [Applause], etc.
      .replace(/\s+/g, ' ')
      .trim();

    // Calculate duration from transcript
    const duration = transcriptArray.length > 0 
      ? Math.round((transcriptArray[transcriptArray.length - 1].offset + transcriptArray[transcriptArray.length - 1].duration) / 1000)
      : 0;

    // Get video title (simplified approach - in production you'd use YouTube API)
    const title = await getVideoTitle(videoId);

    return {
      videoId,
      title: title || `Video ${videoId}`,
      transcript,
      duration,
    };
  } catch (error) {
    console.error(`Error fetching transcript for video ${videoId}:`, error);
    return null;
  }
}

async function getVideoTitle(videoId: string): Promise<string | null> {
  try {
    // In a production environment, you'd use the YouTube Data API
    // For now, we'll return a generic title
    return `YouTube Video ${videoId}`;
  } catch (error) {
    console.error(`Error fetching title for video ${videoId}:`, error);
    return null;
  }
}
