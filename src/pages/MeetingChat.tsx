import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Volume2, VolumeX, SendHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { VoiceInput } from "@/components/VoiceInput";

const genAI = new GoogleGenerativeAI("AIzaSyCo7BVnc1tEfz4zEoBV97zJ6nWFIPJn6TA");

const MeetingChat = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { speak, stop, isSpeaking } = useTextToSpeech();

  const { data: meeting } = useQuery({
    queryKey: ["meeting", meetingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("id", meetingId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleAsk = async () => {
    if (!question.trim() || !meeting?.transcript) {
      toast.error(
        "Please enter a question and ensure there's a transcript available"
      );
      return;
    }

    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Based on this meeting transcript: "${meeting.transcript.join(
        " "
      )}", please answer the following question: ${question}`;

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
    <div className="min-h-screen bg-[#121212] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="outline"
          onClick={() => navigate("/meeting")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Meetings
        </Button>

        <Card className="p-6 bg-[#1a1a1a] border-gray-800">
          <h1 className="text-2xl font-bold mb-4 text-white">
            Chat with Meeting: {meeting?.title}
          </h1>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about the meeting..."
                className="min-h-[100px] bg-[#2a2a2a] border-gray-700 text-white"
              />
              <VoiceInput onTranscript={setQuestion} />
              <SendHorizontal
                onClick={handleAsk}
                className="cursor-pointer w-11"
              />
            </div>

            {response && (
              <div className="mt-4 p-4 bg-[#2a2a2a] rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-white">Response:</h3>
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
                <p className="text-white whitespace-pre-wrap">{response}</p>
              </div>
            )}

            {meeting?.transcript && (
              <div className="flex gap-4 mt-8">
                <Button
                  onClick={() => navigate(`/meeting/flashcards/${meetingId}`)}
                  className="w-1/3 bg-purple-600 hover:bg-purple-700"
                >
                  Generate Flashcards
                </Button>
                <Button
                  onClick={() => navigate(`/meeting/quiz/${meetingId}`)}
                  className="w-1/3 bg-red-600 hover:bg-red-700"
                >
                  Take Quiz
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MeetingChat;
