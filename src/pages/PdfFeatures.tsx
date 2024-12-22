import { useState } from "react";
import { PdfSummary } from "@/components/pdf/PdfSummary";
import { PdfChat } from "@/components/pdf/PdfChat";
import { PdfHeader } from "@/components/pdf/PdfHeader";
import { PdfUploader } from "@/components/pdf/PdfUploader";
import { PdfActions } from "@/components/pdf/PdfActions";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react"; // Add this import

const PdfFeatures = () => {
  const [pdfText, setPdfText] = useState<string>("");
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handlePdfProcessed = (text: string) => {
    setPdfText(text);
    localStorage.setItem("pdfText", text);
  };

  return (
    <div className="container mx-auto p-3">
      <PdfHeader />

      <PdfUploader
        onTextExtracted={handlePdfProcessed}
        onFileChange={setFile}
      />

      {file && (
        <div className="mt-1 mb-4 flex items-center justify-center text-green-600">
          <FileText className="w-6 h-6 mr-2" />
          <span>File uploaded successfully!</span>
        </div>
      )}

      {pdfText && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <PdfSummary
              text={pdfText}
              onSummaryGenerated={(newSummary) => setSummary(newSummary)}
            />
            <PdfChat text={pdfText} />
          </div>

          <div className="flex gap-4 mt-6">
            <Button
              onClick={() => navigate("/pdf/flashcards")}
              className="bg-teal-800 hover:bg-teal-900 w-80"
            >
              Generate Flashcards
            </Button>

            <Button
              onClick={() => navigate("/pdf/quiz")}
              className="bg-red-300 hover:bg-red-400 w-80"
            >
              Take Quiz
            </Button>

            <PdfActions
              pdfText={pdfText}
              summary={summary}
              isGeneratingPPT={isGeneratingPPT}
              setIsGeneratingPPT={setIsGeneratingPPT}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfFeatures;
