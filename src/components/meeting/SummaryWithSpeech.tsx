import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { MeetingSummary } from "@/components/meeting/MeetingSummary";

interface SummaryWithSpeechProps {
  summary: string;
  onSummarize: () => void;
  isSummarizing: boolean;
}

export function SummaryWithSpeech({ summary, onSummarize, isSummarizing }: SummaryWithSpeechProps) {
  const { speak, stop, isSpeaking } = useTextToSpeech();

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(summary);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {summary && (
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
        )}
      </div>
      <MeetingSummary
        summary={summary}
        onSummarize={onSummarize}
        isSummarizing={isSummarizing}
      />
    </div>
  );
}