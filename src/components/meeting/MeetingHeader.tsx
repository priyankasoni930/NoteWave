import { Button } from "@/components/ui/button";
import { Mic, Download, StopCircle, Settings, MessageSquare } from "lucide-react";
import { useState } from "react";
import { ApiKeyDialog } from "@/components/meeting/ApiKeyDialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface MeetingHeaderProps {
  onDownload: () => void;
  isRecording: boolean;
  onToggleRecording: () => void;
  hasTranscript: boolean;
  isMeetingSelected: boolean;
  currentMeetingId?: string;
}

export function MeetingHeader({
  onDownload,
  isRecording,
  onToggleRecording,
  hasTranscript,
  isMeetingSelected,
  currentMeetingId,
}: MeetingHeaderProps) {
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <Button
          variant={isRecording ? "destructive" : "default"}
          onClick={onToggleRecording}
          disabled={!isMeetingSelected}
        >
          {isRecording ? (
            <>
              <StopCircle className="w-4 h-4 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Start Recording
            </>
          )}
        </Button>

        {hasTranscript && (
          <>
            <Button variant="outline" onClick={onDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate(`/meeting/chat/${currentMeetingId}`)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </>
        )}
      </div>

      <Button
        variant="outline"
        onClick={() => setShowApiKeyDialog(true)}
      >
        <Settings className="w-4 h-4 mr-2" />
        Update API Key
      </Button>

      <ApiKeyDialog 
        open={showApiKeyDialog}
        onOpenChange={setShowApiKeyDialog}
        onApiKeySaved={() => {
          toast.success("API key updated successfully");
        }}
      />
    </div>
  );
}