export const extractVideoId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

export const getVideoTranscript = async (videoUrl: string): Promise<string> => {
  try {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }
    
    const response = await fetch(`https://transcriptor-vercel.vercel.app/api/transcript?videoId=${videoId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch transcript');
    }
    
    const data = await response.json();
    return data.transcript.join(' ');
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw new Error('Failed to fetch video transcript');
  }
};