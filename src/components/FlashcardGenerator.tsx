import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";

const genAI = new GoogleGenerativeAI("AIzaSyCo7BVnc1tEfz4zEoBV97zJ6nWFIPJn6TA");

interface FlashcardGeneratorProps {
  content: string;
}

export function FlashcardGenerator({ content }: FlashcardGeneratorProps) {
  const [flashcards, setFlashcards] = useState<
    Array<{ question: string; answer: string }>
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const generateFlashcards = async () => {
    if (!content) {
      toast.error("No content available to generate flashcards");
      return;
    }

    setIsGenerating(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Generate 5 flashcards from this content. Each flashcard should have a question and answer. Return ONLY a JSON array where each item has 'question' and 'answer' fields. Do not include any markdown formatting or additional text. Content: ${content}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean the response text by removing any markdown formatting
      const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();

      try {
        const parsedFlashcards = JSON.parse(cleanedText);
        if (Array.isArray(parsedFlashcards)) {
          setFlashcards(parsedFlashcards);
          setCurrentCardIndex(0);
          setFlippedCards({});
          toast.success("Flashcards generated successfully!");
        } else {
          throw new Error("Response is not an array");
        }
      } catch (parseError) {
        console.error("Parse error:", parseError);
        toast.error("Failed to parse flashcards response");
      }
    } catch (error) {
      console.error("Error generating flashcards:", error);
      toast.error("Failed to generate flashcards");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handlePrevCard = () => {
    setCurrentCardIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prev) => Math.min(flashcards.length - 1, prev + 1));
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={generateFlashcards}
        disabled={isGenerating}
        className="w-2/4 bg-purple-600 hover:bg-purple-700"
      >
        {isGenerating ? "Generating Flashcards..." : "Generate Flashcards"}
      </Button>

      {flashcards.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Flashcards ({currentCardIndex + 1}/{flashcards.length})
          </h3>

          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
              onClick={handlePrevCard}
              disabled={currentCardIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
              onClick={handleNextCard}
              disabled={currentCardIndex === flashcards.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <ScrollArea className="w-full px-10">
              <div className="flex gap-4 py-4">
                {flashcards.map((flashcard, index) => (
                  <div
                    key={index}
                    className={`min-w-[300px] h-[200px] perspective-1000 transition-transform duration-300 ${
                      index === currentCardIndex
                        ? "scale-100"
                        : "scale-90 opacity-50"
                    }`}
                    style={{
                      transform: `translateX(-${currentCardIndex * 100}%)`,
                    }}
                  >
                    <Card
                      className={`w-full h-full cursor-pointer transition-transform duration-500 transform-style-preserve-3d relative ${
                        flippedCards[index] ? "[transform:rotateY(180deg)]" : ""
                      }`}
                      onClick={() => toggleFlip(index)}
                    >
                      <div className="absolute w-full h-full backface-hidden p-6 flex items-center justify-center text-center">
                        <div className="font-medium">
                          Q: {flashcard.question}
                        </div>
                      </div>
                      <div className="absolute w-full h-full backface-hidden [transform:rotateY(180deg)] bg-primary-light p-6 flex items-center justify-center text-center rounded-lg">
                        <div className="text-primary">
                          A: {flashcard.answer}
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
