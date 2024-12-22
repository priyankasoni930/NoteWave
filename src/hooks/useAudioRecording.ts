import { useState, useRef } from 'react';
import { toast } from "sonner";

export function useAudioRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startMicrophoneRecording = async () => {
    try {
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 2
        }
      });

      const mediaRecorder = new MediaRecorder(micStream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      const handleStreamEnd = () => {
        stopRecording();
        toast.error("Recording was stopped");
      };

      micStream.getTracks().forEach(track => {
        track.onended = handleStreamEnd;
      });

      mediaRecorder.start(500);
      setIsRecording(true);
      setAudioBlob(null);
      toast.success("Recording started - capturing microphone audio");
    } catch (error) {
      handleRecordingError(error);
    }
  };

  const startSystemAudioRecording = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 2
        }
      });

      const audioTracks = [
        ...displayStream.getAudioTracks(),
        ...micStream.getAudioTracks()
      ];

      const combinedStream = new MediaStream(audioTracks);
      console.log('Audio tracks in combined stream:', combinedStream.getAudioTracks().length);

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      const handleStreamEnd = () => {
        stopRecording();
        toast.error("Recording was stopped");
      };

      displayStream.getTracks().forEach(track => {
        track.onended = handleStreamEnd;
      });
      micStream.getTracks().forEach(track => {
        track.onended = handleStreamEnd;
      });

      mediaRecorder.start(500);
      setIsRecording(true);
      setAudioBlob(null);
      displayStream.getVideoTracks().forEach(track => track.stop());
      toast.success("Recording started - capturing both system and microphone audio");
    } catch (error) {
      handleRecordingError(error);
    }
  };

  const handleRecordingError = (error: unknown) => {
    console.error('Recording error:', error);
    
    if (error instanceof DOMException) {
      if (error.name === 'NotAllowedError') {
        toast.error("Permission denied. Please allow audio access.");
      } else if (error.name === 'NotFoundError') {
        toast.error("No audio input devices found. Please check your microphone connection.");
      } else if (error.name === 'NotSupportedError') {
        toast.error("Audio capture is not supported in your current environment.");
      } else if (error.name === 'NotReadableError') {
        toast.error("Could not access your audio devices. Please check your settings.");
      } else {
        toast.error(`Recording error: ${error.message}`);
      }
    } else {
      toast.error("Could not start recording. Please try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      toast.info("Recording stopped, processing audio...");

      if (audioChunksRef.current.length > 0) {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(blob);
      }
    }
  };

  return {
    isRecording,
    startMicrophoneRecording,
    startSystemAudioRecording,
    stopRecording,
    audioBlob
  };
}