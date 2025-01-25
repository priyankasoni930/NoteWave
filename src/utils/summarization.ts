import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("");

export const summarizeText = async (text: string): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `Please provide a concise summary of the following text, focusing on the key points and main ideas: ${text}`;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};
