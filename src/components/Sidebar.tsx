import { useState, useEffect } from "react";
import { Calendar, Video, Search, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { MeetingItem } from "./meeting/MeetingItem";
import { ApiKeyDialog } from "./meeting/ApiKeyDialog";
import { Link } from "react-router-dom";

interface Meeting {
  id: string;
  title: string;
  date: string;
  transcript?: string[];
  isActive?: boolean;
  isEditing?: boolean;
}

interface SidebarProps {
  onMeetingSelect?: (meeting: Meeting) => void;
  onMeetingUpdate?: (meeting: Meeting) => void;
}

export function Sidebar({ onMeetingSelect, onMeetingUpdate }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  const { data: fetchedMeetings, isLoading } = useQuery({
    queryKey: ["meetings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (fetchedMeetings) {
      setMeetings(
        fetchedMeetings.map((m) => ({
          ...m,
          isActive: false,
          isEditing: false,
        }))
      );
    }
  }, [fetchedMeetings]);

  const createNewMeeting = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Check if user has an API key stored
    const { data: apiKeyData } = await supabase
      .from("user_settings")
      .select("openai_api_key")
      .eq("user_id", user.id)
      .single();

    if (!apiKeyData?.openai_api_key) {
      setShowApiKeyDialog(true);
      return;
    }

    await createMeetingWithApiKey(user.id);
  };

  const createMeetingWithApiKey = async (userId: string) => {
    const newMeeting = {
      title: `Meeting ${meetings.length + 1}`,
      user_id: userId,
      transcript: [],
    };

    const { data, error } = await supabase
      .from("meetings")
      .insert(newMeeting)
      .select()
      .single();

    if (error) {
      toast.error("Failed to create meeting");
      return;
    }

    if (data) {
      const meetingWithState = {
        ...data,
        isActive: true,
        isEditing: false,
      };

      setMeetings((prev) => {
        const updated = prev
          .map((m) => ({ ...m, isActive: false }))
          .concat(meetingWithState);
        return updated;
      });

      if (onMeetingSelect) {
        onMeetingSelect(meetingWithState);
      }
      toast.success("New meeting created");
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    }
  };

  const selectMeeting = (meeting: Meeting) => {
    setMeetings((prev) => {
      const updated = prev.map((m) => ({
        ...m,
        isActive: m.id === meeting.id,
      }));
      if (onMeetingSelect) {
        onMeetingSelect(meeting);
      }
      return updated;
    });
  };

  const handleMeetingUpdate = (updatedMeeting: Meeting) => {
    setMeetings((prev) =>
      prev.map((meeting) =>
        meeting.id === updatedMeeting.id ? { ...updatedMeeting } : meeting
      )
    );
    if (onMeetingUpdate) {
      onMeetingUpdate(updatedMeeting);
    }
  };

  const handleMeetingDelete = (id: string) => {
    setMeetings((prev) => prev.filter((meeting) => meeting.id !== id));
  };

  const filteredMeetings = meetings.filter((meeting) => {
    const searchLower = searchQuery.toLowerCase();
    const titleMatch = meeting.title.toLowerCase().includes(searchLower);
    const dateMatch =
      new Date(meeting.date).toLocaleDateString().includes(searchQuery) ||
      new Date(meeting.date).getFullYear().toString().includes(searchQuery);
    return titleMatch || dateMatch;
  });

  if (isLoading) {
    return (
      <div className="w-64 h-screen border-r border-gray-800 bg-[#1a1a1a] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const handleApiKeySaved = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await createMeetingWithApiKey(user.id);
    }
  };

  return (
    <>
      <div className="w-64 h-screen border-r border-gray-800 bg-[#1a1a1a] flex flex-col">
        <div className="p-4">
          <Link className="text-2xl font-bold text-green-400" to="/">
            NoteWave
          </Link>
          <button
            className="w-full flex mt-3 items-center justify-center gap-2 px-4 py-2 bg-primary text-black rounded-md hover:bg-primary-hover"
            onClick={createNewMeeting}
          >
            <Video className="w-4 h-4" />
            New Meeting
          </button>
        </div>

        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              type="text"
              name="search"
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#2a2a2a] border-gray-700 text-white"
              autoComplete="off"
              data-lpignore="true"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="sidebar-item active">
            <Calendar className="w-5 h-5" />
            <span>Meetings</span>
          </div>

          <div className="mt-6 px-6 text-sm text-muted font-medium">
            Recent Meetings
          </div>
          {filteredMeetings.map((meeting) => (
            <MeetingItem
              key={meeting.id}
              meeting={meeting}
              onSelect={selectMeeting}
              onUpdate={handleMeetingUpdate}
              onDelete={handleMeetingDelete}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          {/* <Link className="text-3xl font-bold text-green-400" to="/">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 border-gray-700 text-white hover:bg-gray-800"
            >
              Dashboard
            </Button>
          </Link> */}
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 border-gray-700 text-white mt-2 hover:bg-gray-800"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <ApiKeyDialog
        open={showApiKeyDialog}
        onOpenChange={setShowApiKeyDialog}
        onApiKeySaved={handleApiKeySaved}
      />
    </>
  );
}
