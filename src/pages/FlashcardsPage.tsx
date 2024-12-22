import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FlashcardGenerator } from "@/components/FlashcardGenerator";
import { supabase } from "@/integrations/supabase/client";

const FlashcardsPage = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      if (location.pathname.includes("/meeting/")) {
        // Fetch meeting transcript
        const { data, error } = await supabase
          .from("meetings")
          .select("transcript")
          .eq("id", meetingId)
          .single();

        if (error) {
          console.error("Error fetching meeting:", error);
          return;
        }

        if (data?.transcript) {
          setContent(data.transcript.join(" "));
        }
      } else if (location.pathname.includes("/youtube/")) {
        // Get YouTube transcript from localStorage
        const transcript = localStorage.getItem("youtubeTranscript");
        if (transcript) {
          setContent(transcript);
        }
      } else if (location.pathname.includes("/pdf/")) {
        // Get PDF text from localStorage
        const pdfText = localStorage.getItem("pdfText");
        if (pdfText) {
          setContent(pdfText);
        }
      }
    };

    fetchContent();
  }, [meetingId, location.pathname]);

  const getBackPath = () => {
    if (location.pathname.includes("/meeting/")) {
      return `/meeting/chat/${meetingId}`;
    } else if (location.pathname.includes("/youtube/")) {
      return "/youtube";
    } else {
      return "/pdf";
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button
          variant="outline"
          onClick={() => navigate(getBackPath())}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-white">Flashcards</h1>
          <FlashcardGenerator content={content} />
        </div>
      </div>
    </div>
  );
};

export default FlashcardsPage;
