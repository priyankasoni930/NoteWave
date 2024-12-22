import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function YoutubeHeader() {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <Link className="text-2xl font-bold text-green-400" to="/">
        NoteWave
      </Link>
      <h1 className="text-3xl font-bold">Youtube Video Analysis</h1>
      <Button
        variant="outline"
        className="border-gray-700 text-white hover:bg-gray-800"
        onClick={handleSignOut}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
