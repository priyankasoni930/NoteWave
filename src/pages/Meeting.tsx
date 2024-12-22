import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TranscriptionView } from "@/components/TranscriptionView";

interface Meeting {
  id: string;
  title: string;
  date: string;
  transcript?: string[];
  isActive?: boolean;
  isEditing?: boolean;
}

const Index = () => {
  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null);

  const handleMeetingSelect = (meeting: Meeting) => {
    setCurrentMeeting(meeting);
  };

  const handleTranscriptUpdate = (meetingId: string, transcript: string[]) => {
    setCurrentMeeting(prev => 
      prev && prev.id === meetingId 
        ? { ...prev, transcript }
        : prev
    );
  };

  return (
    <div className="flex">
      <Sidebar 
        onMeetingSelect={handleMeetingSelect}
        onMeetingUpdate={(meeting) => {
          if (currentMeeting?.id === meeting.id) {
            setCurrentMeeting(meeting);
          }
        }}
      />
      <TranscriptionView
        currentMeetingId={currentMeeting?.id}
        initialTranscript={currentMeeting?.transcript}
        onTranscriptUpdate={handleTranscriptUpdate}
      />
    </div>
  );
};

export default Index;