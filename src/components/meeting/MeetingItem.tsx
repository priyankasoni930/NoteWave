import { useState } from "react";
import { Video, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Meeting {
  id: string;
  title: string;
  date: string;
  transcript?: string[];
  isActive?: boolean;
  isEditing?: boolean;
}

interface MeetingItemProps {
  meeting: Meeting;
  onSelect: (meeting: Meeting) => void;
  onUpdate: (meeting: Meeting) => void;
  onDelete: (id: string) => void;
}

export function MeetingItem({ meeting, onSelect, onUpdate, onDelete }: MeetingItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(meeting.title);

  const handleMeetingNameEdit = async (newTitle: string) => {
    const { error } = await supabase
      .from('meetings')
      .update({ title: newTitle })
      .eq('id', meeting.id);

    if (error) {
      toast.error("Failed to update meeting title");
      return;
    }

    const updatedMeeting = { ...meeting, title: newTitle };
    onUpdate(updatedMeeting);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', meeting.id);

    if (error) {
      toast.error("Failed to delete meeting");
      return;
    }

    onDelete(meeting.id);
    toast.success("Meeting deleted");
  };

  return (
    <div
      className={cn(
        "sidebar-item group",
        meeting.isActive && "active"
      )}
    >
      <Video className="w-5 h-5" />
      <div className="flex flex-col flex-1">
        {isEditing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleMeetingNameEdit(title)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleMeetingNameEdit(title);
              }
            }}
            autoFocus
            className="py-0 h-6 meeting-edit-input"
          />
        ) : (
          <div className="flex items-center justify-between w-full">
            <span 
              className="text-sm cursor-pointer"
              onClick={() => onSelect(meeting)}
              onDoubleClick={() => setIsEditing(true)}
            >
              {meeting.title}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
        <span className="text-xs text-muted">
          {new Date(meeting.date).toLocaleString()}
        </span>
      </div>
    </div>
  );
}