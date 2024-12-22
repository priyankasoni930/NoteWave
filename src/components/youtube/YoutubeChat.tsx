import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { VoiceInput } from "@/components/VoiceInput";
import { Volume2, VolumeX, SendHorizontal } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

const genAI = new GoogleGenerativeAI("AIzaSyCo7BVnc1tEfz4zEoBV97zJ6nWFIPJn6TA");

interface YoutubeChatProps {
  transcript: string;
}

export function YoutubeChat({ transcript }: YoutubeChatProps) {
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
      const prompt = `Based on this video transcript: "${transcript}", please answer the following question: ${question}`;

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
    <div className="space-y-4 bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Chat with Video</h2>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about the video..."
            className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
          />
          <VoiceInput onTranscript={setQuestion} />
          <SendHorizontal className="mt-2 cursor-pointer" onClick={handleAsk} />
        </div>

        {response && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Response:</h3>
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
            </div>
            <p className="text-gray-200 whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
