import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface YoutubeSummaryProps {
  summary: string;
}

export function YoutubeSummary({ summary }: YoutubeSummaryProps) {
  const { speak, stop, isSpeaking } = useTextToSpeech();

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(summary);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Video Summary</h2>
        {summary && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleSpeechToggle}
            className="ml-2"
          >
            {isSpeaking ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      <div className="prose prose-invert">
        <p className="text-gray-200 whitespace-pre-wrap">{summary}</p>
      </div>
    </div>
  );
}