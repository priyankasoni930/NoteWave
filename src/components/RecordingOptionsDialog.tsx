import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, Speaker } from "lucide-react";

interface RecordingOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectOption: (option: "mic" | "system") => void;
}

export function RecordingOptionsDialog({
  open,
  onOpenChange,
  onSelectOption,
}: RecordingOptionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Recording Source</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center gap-4 pt-4">
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 px-6"
            onClick={() => onSelectOption("mic")}
          >
            <Mic className="h-8 w-8" />
            <span>Microphone Only</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 px-6"
            onClick={() => onSelectOption("system")}
          >
            <Speaker className="h-8 w-8" />
            <span>System Audio</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}