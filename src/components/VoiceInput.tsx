import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { SpeechRecognition } from "@/types/speech";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
}

export function VoiceInput({ onTranscript }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in your browser");
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      stopListening(recognitionInstance);
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast.error("Error recognizing speech. Please try again.");
      stopListening(recognitionInstance);
    };

    recognitionInstance.onend = () => {
      stopListening(recognitionInstance);
    };

    try {
      recognitionInstance.start();
      setIsListening(true);
      setRecognition(recognitionInstance);
      toast.info("Listening... Speak your question");
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast.error("Failed to start speech recognition");
    }
  };

  const stopListening = (recognitionInstance: SpeechRecognition) => {
    if (recognitionInstance) {
      recognitionInstance.stop();
    }
    setIsListening(false);
    setRecognition(null);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        if (isListening && recognition) {
          stopListening(recognition);
        } else {
          startListening();
        }
      }}
      className="ml-2"
    >
      {isListening ? (
        <MicOff className="h-4 w-4 text-red-500" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}