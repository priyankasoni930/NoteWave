import { TranscriptWithSpeech } from "@/components/meeting/TranscriptWithSpeech";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TranscriptSectionProps {
  transcript: string[];
  currentMeetingId?: string;
  onTranscriptUpdate?: (meetingId: string, transcript: string[]) => void;
}

export function TranscriptSection({ 
  transcript, 
  currentMeetingId,
  onTranscriptUpdate 
}: TranscriptSectionProps) {
  return (
    <div className="flex-1 h-[calc(100vh-10rem)] overflow-y-auto bg-[#1a1a1a] rounded-lg">
      <TranscriptWithSpeech 
        transcript={transcript}
        onTranscriptChange={async (newTranscript) => {
          if (currentMeetingId) {
            const { error } = await supabase
              .from('meetings')
              .update({ transcript: newTranscript })
              .eq('id', currentMeetingId);
            
            if (error) {
              toast.error("Failed to save transcript changes");
              return;
            }
            
            if (onTranscriptUpdate) {
              onTranscriptUpdate(currentMeetingId, newTranscript);
            }
          }
        }}
      />
    </div>
  );
}