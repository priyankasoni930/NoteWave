import { Button } from "@/components/ui/button";
import { FileText, FileDown } from "lucide-react";
import { generatePresentationFromContent } from "@/utils/pptGenerator";
import { generatePdfFromContent } from "@/utils/pdfGenerator";
import { toast } from "sonner";

interface PdfActionsProps {
  pdfText: string;
  summary: string;
  isGeneratingPPT: boolean;
  setIsGeneratingPPT: (value: boolean) => void;
}

export function PdfActions({
  pdfText,
  summary,
  isGeneratingPPT,
  setIsGeneratingPPT,
}: PdfActionsProps) {
  const handleGeneratePPT = async () => {
    if (!pdfText || !summary) {
      toast.error(
        "Please process a PDF and wait for the summary to be generated"
      );
      return;
    }

    setIsGeneratingPPT(true);
    try {
      await generatePresentationFromContent("PDF Summary", summary, pdfText);
      toast.success("PowerPoint presentation generated successfully!");
    } catch (error) {
      console.error("Error generating presentation:", error);
      toast.error("Failed to generate presentation");
    } finally {
      setIsGeneratingPPT(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!pdfText || !summary) {
      toast.error(
        "Please process a PDF and wait for the summary to be generated"
      );
      return;
    }

    try {
      generatePdfFromContent("PDF Summary", summary, pdfText);
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
        disabled={isGeneratingPPT}
        className="w-80 bg-purple-600 hover:bg-purple-700"
      >
        <FileText className="w-4 h-4 mr-2" />
        {isGeneratingPPT ? "Generating PowerPoint..." : "Generate PowerPoint"}
      </Button>

      <Button
        onClick={handleGeneratePDF}
        className="w-80 bg-red-600 hover:bg-red-700"
      >
        <FileDown className="w-4 h-4 mr-2" />
        Generate PDF
      </Button>
    </div>
  );
}
