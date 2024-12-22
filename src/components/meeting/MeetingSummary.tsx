import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface MeetingSummaryProps {
  summary: string;
  onSummarize: () => void;
  isSummarizing: boolean;
}

export function MeetingSummary({ summary, onSummarize, isSummarizing }: MeetingSummaryProps) {
  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={onSummarize}
        disabled={isSummarizing}
        className="self-start flex items-center gap-2 bg-primary text-black hover:bg-primary-hover"
      >
        <FileText className="w-4 h-4" />
        {isSummarizing ? "Summarizing..." : "Summarize"}
      </Button>

      {summary && (
        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-white">Summary</h2>
          <p className="text-gray-300 whitespace-pre-wrap">{summary}</p>
        </div>
      )}
    </div>
  );
}