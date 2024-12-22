import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApiKeySaved: () => void;
}

export function ApiKeyDialog({ open, onOpenChange, onApiKeySaved }: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Clear the input when dialog opens
  useEffect(() => {
    if (open) {
      setApiKey("");
    }
  }, [open]);

  const handleApiKeySubmit = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      const { error: upsertError } = await supabase
        .from('user_settings')
        .upsert(
          {
            user_id: user.id,
            openai_api_key: apiKey
          },
          {
            onConflict: 'user_id'
          }
        );

      if (upsertError) {
        console.error("Error updating API key:", upsertError);
        toast.error("Failed to save API key");
        return;
      }

      toast.success("API key saved successfully");
      onOpenChange(false);
      onApiKeySaved();
    } catch (error) {
      console.error("Error in handleApiKeySubmit:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter your OpenAI API Key</DialogTitle>
          <DialogDescription>
            To create meetings and use the transcription feature, you need to provide your OpenAI API key.
            This key will be securely stored and used for your meetings.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            type="text"
            name="apikey"
            autoComplete="new-password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            onClick={handleApiKeySubmit} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save API Key"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}