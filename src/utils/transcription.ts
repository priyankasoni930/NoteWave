import OpenAI from 'openai';
import { supabase } from '@/integrations/supabase/client';

export interface TranscriptionConfig {
  language?: string;
  prompt?: string;
}

export const startTranscription = async (audioBlob: Blob, config: TranscriptionConfig = {}) => {
  try {
    // Get the current user's API key
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('user_settings')
      .select('openai_api_key')
      .eq('user_id', user.id)
      .single();

    if (apiKeyError || !apiKeyData?.openai_api_key) {
      throw new Error('OpenAI API key not found. Please add your API key to create meetings.');
    }

    const openai = new OpenAI({
      apiKey: apiKeyData.openai_api_key,
      dangerouslyAllowBrowser: true
    });

    // Convert Blob to File with .webm extension for OpenAI API
    const file = new File([audioBlob], 'audio.webm', {
      type: 'audio/webm;codecs=opus',
      lastModified: Date.now(),
    });

    const response = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'en', // Set language to English
    });

    return response.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
};