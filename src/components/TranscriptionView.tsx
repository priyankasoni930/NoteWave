import { useState, useEffect } from "react";
import { toast } from "sonner";
import { startTranscription } from "@/utils/transcription";
import { useAudioRecording } from "@/hooks/useAudioRecording";
import { MeetingHeader } from "@/components/meeting/MeetingHeader";
import { RecordingOptionsDialog } from "@/components/RecordingOptionsDialog";
import { supabase } from "@/integrations/supabase/client";
import { TranscriptSection } from "@/components/meeting/TranscriptSection";
import { SummarySection } from "@/components/meeting/SummarySection";

interface TranscriptionViewProps {
  currentMeetingId?: string;
  onTranscriptUpdate?: (meetingId: string, transcript: string[]) => void;
  initialTranscript?: string[];
}

export function TranscriptionView({ 
  currentMeetingId, 
  onTranscriptUpdate, 
  initialTranscript = [] 
}: TranscriptionViewProps) {
  const [transcript, setTranscript] = useState<string[]>(initialTranscript);
  const [summary, setSummary] = useState<string>("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showRecordingOptions, setShowRecordingOptions] = useState(false);
  
  const { 
    isRecording, 
    startMicrophoneRecording,
    startSystemAudioRecording,
    stopRecording,
    audioBlob 
  } = useAudioRecording();

  useEffect(() => {
    const loadMeetingData = async () => {
      if (currentMeetingId) {
        const { data, error } = await supabase
          .from('meetings')
          .select('transcript, summary')
          .eq('id', currentMeetingId)
          .single();

        if (error) {
          toast.error("Failed to load meeting data");
          return;
        }

        if (data) {
          setTranscript(data.transcript || []);
          setSummary(data.summary || "");
        }
      }
    };

    loadMeetingData();
  }, [currentMeetingId]);

  useEffect(() => {
    if (initialTranscript !== transcript) {
      setTranscript(initialTranscript);
    }
  }, [initialTranscript]);

  useEffect(() => {
    if (audioBlob) {
      handleTranscription(audioBlob);
    }
  }, [audioBlob]);

  const handleTranscription = async (blob: Blob) => {
    try {
      const text = await startTranscription(blob);
      if (text) {
        const newTranscript = [...transcript, text];
        setTranscript(newTranscript);
        
        if (currentMeetingId) {
          const { error } = await supabase
            .from('meetings')
            .update({ transcript: newTranscript })
            .eq('id', currentMeetingId);

          if (error) throw error;

          if (onTranscriptUpdate) {
            onTranscriptUpdate(currentMeetingId, newTranscript);
          }
        }
        
        toast.success("Transcription completed");
      }
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error("Transcription failed. Please try again.");
    }
  };

  const handleRecordingOptionSelect = async (option: "mic" | "system") => {
    setShowRecordingOptions(false);
    if (option === "mic") {
      await startMicrophoneRecording();
    } else {
      await startSystemAudioRecording();
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setShowRecordingOptions(true);
    } else {
      stopRecording();
    }
  };

  const downloadTranscript = () => {
    const content = `
Transcript:
${transcript.join("\n")}

Summary:
${summary}`;

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "transcript-and-summary.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Transcript and summary downloaded");
  };

  return (
    <div className="flex-1 p-6 flex flex-col h-screen bg-[#121212]">
      <MeetingHeader
        onDownload={downloadTranscript}
        isRecording={isRecording}
        onToggleRecording={toggleRecording}
        hasTranscript={transcript.length > 0}
        isMeetingSelected={!!currentMeetingId}
        currentMeetingId={currentMeetingId}
      />

      <RecordingOptionsDialog
        open={showRecordingOptions}
        onOpenChange={setShowRecordingOptions}
        onSelectOption={handleRecordingOptionSelect}
      />

      <div className="flex-1 flex gap-6 mt-6">
        <TranscriptSection 
          transcript={transcript}
          currentMeetingId={currentMeetingId}
          onTranscriptUpdate={onTranscriptUpdate}
        />
        
        {transcript.length > 0 && (
          <SummarySection
            summary={summary}
            transcript={transcript}
            currentMeetingId={currentMeetingId}
            isSummarizing={isSummarizing}
            setIsSummarizing={setIsSummarizing}
            setSummary={setSummary}
          />
        )}
      </div>
    </div>
  );
}