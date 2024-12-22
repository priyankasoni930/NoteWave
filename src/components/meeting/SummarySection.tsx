import { SummaryWithSpeech } from "@/components/meeting/SummaryWithSpeech";
import { summarizeText } from "@/utils/summarization";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SummarySectionProps {
  summary: string;
  transcript: string[];
  currentMeetingId?: string;
  isSummarizing: boolean;
  setIsSummarizing: (value: boolean) => void;
  setSummary: (summary: string) => void;
}

export function SummarySection({ 
  summary,
  transcript,
  currentMeetingId,
  isSummarizing,
  setIsSummarizing,
  setSummary
}: SummarySectionProps) {
  const handleSummarize = async () => {
    if (transcript.length === 0) {
      toast.error("No transcript available to summarize");
      return;
    }

    setIsSummarizing(true);
    try {
      const fullText = transcript.join(" ");
      const summarizedText = await summarizeText(fullText);
      setSummary(summarizedText);

      if (currentMeetingId) {
        const { error } = await supabase
          .from('meetings')
          .update({ summary: summarizedText })
          .eq('id', currentMeetingId);

        if (error) throw error;
      }

      toast.success("Summary generated successfully");
    } catch (error) {
      console.error('Summarization error:', error);
      toast.error("Failed to generate summary. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="flex-1 h-[calc(100vh-10rem)] overflow-y-auto scrollbar-hide bg-[#1a1a1a] rounded-lg">
      <SummaryWithSpeech
        summary={summary}
        onSummarize={handleSummarize}
        isSummarizing={isSummarizing}
      />
    </div>
  );
}