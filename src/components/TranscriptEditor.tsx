import { Edit2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface TranscriptEditorProps {
  transcript: string[];
  onTranscriptChange: (newTranscript: string[]) => void;
}

export function TranscriptEditor({ transcript, onTranscriptChange }: TranscriptEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleTranscriptEdit = (index: number, newText: string) => {
    const newTranscript = [...transcript];
    newTranscript[index] = newText;
    onTranscriptChange(newTranscript);
    setEditingIndex(null);
  };

  const startEditing = (index: number) => {
    setEditValue(transcript[index]);
    setEditingIndex(index);
  };

  return (
    <div className="flex-1 bg-[#1a1a1a] rounded-lg p-6 overflow-y-auto scrollbar-hide">
      {transcript.length === 0 ? (
        <div className="h-full flex items-center justify-center text-muted">
          Click "Start Recording" to begin transcription
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto scrollbar-hide">
          {transcript.map((line, index) => (
            <div
              key={index}
              className="p-2 bg-[#2a2a2a] rounded animate-fade-in group relative"
              onClick={() => startEditing(index)}
            >
              {editingIndex === index ? (
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleTranscriptEdit(index, editValue)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleTranscriptEdit(index, editValue);
                    }
                  }}
                  className="min-h-[40px] resize-none focus:ring-1 bg-[#333333] text-white border-gray-700 scrollbar-hide"
                  autoFocus
                />
              ) : (
                <>
                  <div className="whitespace-pre-wrap text-white">{line}</div>
                  <Edit2 className="w-4 h-4 absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white" />
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}