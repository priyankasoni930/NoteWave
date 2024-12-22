import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { YoutubeChat } from "@/components/youtube/YoutubeChat";
import { YoutubeSummary } from "@/components/youtube/YoutubeSummary";
import { YoutubeActions } from "@/components/youtube/YoutubeActions";
import { extractVideoId, getVideoTranscript } from "@/utils/youtube";
import { summarizeText } from "@/utils/summarization";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { YoutubeHeader } from "@/components/youtube/YoutubeHeader";

export default function YoutubeFeatures() {
  const [videoUrl, setVideoUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const videoId = extractVideoId(videoUrl);
      if (!videoId) {
        toast.error("Invalid YouTube URL");
        return;
      }

      const transcriptText = await getVideoTranscript(videoUrl);
      setTranscript(transcriptText);

      const summaryText = await summarizeText(transcriptText);
      setSummary(summaryText);

      toast.success("Video processed successfully!");

      localStorage.setItem("youtubeTranscript", transcriptText);
    } catch (error) {
      console.error("Error processing video:", error);
      toast.error("Failed to process video");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-3">
      <YoutubeHeader />
      <div className="max-w-4xl mx-auto space-y-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              YouTube Video URL
            </label>
            <Input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#11ff88] hover:bg-[#0ee077] text-black"
          >
            {isLoading ? "Processing..." : "Analyze Video"}
          </Button>
        </form>

        {transcript && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <YoutubeSummary summary={summary} />
              <YoutubeChat transcript={transcript} />
            </div>

            <YoutubeActions transcript={transcript} summary={summary} />

            <div className="flex gap-4">
              <Button
                onClick={() => navigate("/youtube/flashcards")}
                className="flex-1 bg-teal-800 hover:bg-teal-900"
              >
                Generate Flashcards
              </Button>

              <Button
                onClick={() => navigate("/youtube/quiz")}
                className="flex-1 bg-red-300 hover:bg-red-400"
              >
                Take Quiz
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
