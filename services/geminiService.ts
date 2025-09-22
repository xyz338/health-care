
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY is not set. Please set it in your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getSymptomAdvice = async (symptoms: string): Promise<string> => {
  if (!API_KEY) {
    return "API Key not configured. Please contact support.";
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following symptoms and provide general, helpful information. Do not provide a diagnosis. \n\nSymptoms: "${symptoms}"`,
      config: {
        systemInstruction: `You are a helpful AI medical assistant. Your primary goal is to provide safe, general information based on user-described symptoms. 
        You MUST NOT provide a diagnosis or prescribe any treatment.
        You MUST always conclude your response with a clear and prominent disclaimer: "IMPORTANT: This is not medical advice. Please consult a qualified healthcare professional for any health concerns."`,
        temperature: 0.5,
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I couldn't process your request at the moment. Please try again later.";
  }
};
