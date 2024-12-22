import { Input } from "@/components/ui/input";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import pdfToText from "react-pdftotext";

interface PdfUploaderProps {
  onTextExtracted: (text: string) => void;
  onFileChange: (file: File | null) => void;
}

export function PdfUploader({ onTextExtracted, onFileChange }: PdfUploaderProps) {
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    onFileChange(file);
    try {
      const text = await pdfToText(file);
      onTextExtracted(text);
      toast.success("PDF processed successfully");
    } catch (error) {
      console.error("Error processing PDF:", error);
      toast.error("Error processing PDF");
      onFileChange(null);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 w-full max-w-md">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center px-4 py-6 bg-black text-blue rounded-lg shadow-lg tracking-wide uppercase border border-green-400 cursor-pointer hover:text-white transition-colors duration-300 ease-in-out"
        >
          <svg
            className="w-8 h-8"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
          </svg>
          <span className="mt-2 text-base leading-normal">
            Select a PDF file
          </span>
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Upload a PDF file to analyze
        </p>
      </div>
    </div>
  );
}