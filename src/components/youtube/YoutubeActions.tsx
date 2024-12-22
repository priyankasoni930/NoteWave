import { Button } from "@/components/ui/button";
import { FileText, FileDown } from "lucide-react";
import { generatePresentationFromContent } from "@/utils/pptGenerator";
import { generatePdfFromContent } from "@/utils/pdfGenerator";
import { toast } from "sonner";

interface YoutubeActionsProps {
  transcript: string;
  summary: string;
}

export function YoutubeActions({ transcript, summary }: YoutubeActionsProps) {
  const handleGeneratePPT = async () => {
    if (!transcript || !summary) {
      toast.error(
        "Please process a video and wait for the summary to be generated"
      );
      return;
    }

    try {
      await generatePresentationFromContent(
        "YouTube Video Summary",
        summary,
        transcript,
        true // This indicates it's from YouTube for better formatting
      );
      toast.success("PowerPoint presentation generated successfully!");
    } catch (error) {
      console.error("Error generating presentation:", error);
      toast.error("Failed to generate presentation");
    }
  };

  const handleGeneratePDF = async () => {
    if (!transcript || !summary) {
      toast.error(
        "Please process a video and wait for the summary to be generated"
      );
      return;
    }

    try {
      generatePdfFromContent(
        "YouTube Video Summary",
        summary,
        transcript,
        true // This indicates it's from YouTube for better formatting
      );
      toast.success("PDF generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="flex gap-4">
      <Button
        onClick={handleGeneratePPT}
        className="flex-1 bg-purple-600 hover:bg-purple-700"
      >
        <FileText className="w-4 h-4 mr-2" />
        Generate PowerPoint
      </Button>

      <Button
        onClick={handleGeneratePDF}
        className="flex-1 bg-red-600 hover:bg-red-700"
      >
        <FileDown className="w-4 h-4 mr-2" />
        Generate PDF
      </Button>
    </div>
  );
}