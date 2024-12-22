import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { TranscriptEditor } from "@/components/TranscriptEditor";

interface TranscriptWithSpeechProps {
  transcript: string[];
  onTranscriptChange: (newTranscript: string[]) => void;
}

export function TranscriptWithSpeech({ transcript, onTranscriptChange }: TranscriptWithSpeechProps) {
  const { speak, stop, isSpeaking } = useTextToSpeech();

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(transcript.join(" "));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="icon"
          onClick={handleSpeechToggle}
          className="mb-2"
        >
          {isSpeaking ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      <TranscriptEditor 
        transcript={transcript}
        onTranscriptChange={onTranscriptChange}
      />
    </div>
  );
}