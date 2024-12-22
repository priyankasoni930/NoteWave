import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const genAI = new GoogleGenerativeAI("AIzaSyCo7BVnc1tEfz4zEoBV97zJ6nWFIPJn6TA");

interface QuizProps {
  content: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export function Quiz({ content }: QuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [showResults, setShowResults] = useState(false);

  const generateQuiz = async () => {
    if (!content) {
      toast.error("No content available to generate quiz");
      return;
    }

    setIsGenerating(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Generate a quiz with 5 multiple choice questions based on this content. Each question should have 4 options with only one correct answer. Return ONLY a JSON array where each item has 'question', 'options' (array of 4 strings), and 'correctAnswer' (index 0-3) fields. Content: ${content}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();

      try {
        const parsedQuestions = JSON.parse(cleanedText);
        if (Array.isArray(parsedQuestions)) {
          setQuestions(parsedQuestions);
          setSelectedAnswers({});
          setCurrentQuestion(0);
          setShowResults(false);
          toast.success("Quiz generated successfully!");
        } else {
          throw new Error("Response is not an array");
        }
      } catch (parseError) {
        console.error("Parse error:", parseError);
        toast.error("Failed to parse quiz response");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Failed to generate quiz");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswer = (value: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: parseInt(value),
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={generateQuiz}
        disabled={isGenerating}
        className="w-2/4 text-black bg-teal-800 hover:bg-teal-900"
      >
        {isGenerating ? "Generating Quiz..." : "Generate Quiz"}
      </Button>

      {questions.length > 0 && !showResults && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Question {currentQuestion + 1} of {questions.length}
              </h3>
              <span className="text-sm text-muted-foreground">
                {Object.keys(selectedAnswers).length} of {questions.length}{" "}
                answered
              </span>
            </div>

            <p className="text-lg mb-4">
              {questions[currentQuestion].question}
            </p>

            <RadioGroup
              value={selectedAnswers[currentQuestion]?.toString()}
              onValueChange={handleAnswer}
              className="space-y-2"
            >
              {questions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-accent"
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestion] === undefined}
              >
                {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {showResults && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Quiz Results</h3>
          <p className="text-lg mb-4">
            You scored {calculateScore()} out of {questions.length} questions
            correctly!
          </p>
          <div className="space-x-4">
            <Button onClick={resetQuiz} variant="outline">
              Retake Quiz
            </Button>
            <Button
              onClick={() => {
                setShowResults(false);
                setCurrentQuestion(0);
              }}
            >
              Review Answers
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
