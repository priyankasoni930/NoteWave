import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";
import { VoiceInput } from "@/components/VoiceInput";
import { Volume2, VolumeX, SendHorizontal } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

const genAI = new GoogleGenerativeAI("AIzaSyCo7BVnc1tEfz4zEoBV97zJ6nWFIPJn6TA");

interface PdfChatProps {
  text: string;
}

export function PdfChat({ text }: PdfChatProps) {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { speak, stop, isSpeaking } = useTextToSpeech();

  const handleAsk = async () => {
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Based on this text: "${text}", please answer the following question: ${question}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setResponse(response.text());
    } catch (error) {
      console.error("Error getting response:", error);
      toast.error("Failed to get response");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(response);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat with PDF</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about the PDF..."
              className="min-h-[100px]"
            />
            <VoiceInput onTranscript={setQuestion} />
            <SendHorizontal
              className="mt-2 cursor-pointer"
              onClick={handleAsk}
            />
          </div>

          {response && (
            <div className="mt-4 p-4 bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Response:</h3>
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
              </div>
              <p className="whitespace-pre-wrap">{response}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
