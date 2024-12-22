import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

const genAI = new GoogleGenerativeAI("AIzaSyCo7BVnc1tEfz4zEoBV97zJ6nWFIPJn6TA");

interface PdfSummaryProps {
  text: string;
  onSummaryGenerated?: (summary: string) => void;
}

export function PdfSummary({ text, onSummaryGenerated }: PdfSummaryProps) {
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const { speak, stop, isSpeaking } = useTextToSpeech();

  useEffect(() => {
    const getSummary = async () => {
      if (!text || hasGenerated) return;
      
      setIsLoading(true);
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Please provide a concise summary of the following text: ${text}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summaryText = response.text();
        setSummary(summaryText);
        setHasGenerated(true);
        if (onSummaryGenerated) {
          onSummaryGenerated(summaryText);
        }
      } catch (error) {
        console.error("Error getting summary:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getSummary();
  }, [text, onSummaryGenerated, hasGenerated]);

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(summary);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Summary</CardTitle>
        {summary && !isLoading && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleSpeechToggle}
          >
            {isSpeaking ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Generating summary...</div>
        ) : (
          <div className="whitespace-pre-wrap">{summary}</div>
        )}
      </CardContent>
    </Card>
  );
}