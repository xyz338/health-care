import { GoogleGenAI, Chat } from "@google/genai";
import { Doctor, User } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY is not set. Please set it in your environment variables.");
  throw new Error("API Key not configured.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = 'gemini-2.5-flash';

export const startChatSessionWithContext = (doctors: Doctor[], user: User | null): Chat => {
  const doctorInfo = doctors.map(({ name, specialty, fee, experience }) => ({ name, specialty, fee, experience }));
  const doctorsJson = JSON.stringify(doctorInfo, null, 2);
  const userName = user?.name || 'guest';

  const systemInstruction = `You are a helpful AI assistant for the Health Care platform.
The current user is named ${userName}.
Here is the list of available doctors in JSON format:
${doctorsJson}

Your primary goal is to answer questions about these doctors and provide general health information.
Use the provided JSON data to answer questions about doctor specialties, experience, fees, etc.
If a user asks to book an appointment, guide them to use the 'Book Appointment' button on the main page. Do not attempt to book it yourself.
You MUST NOT provide a diagnosis or prescribe any treatment.
You MUST always conclude your response with a clear and prominent disclaimer: "IMPORTANT: This is not medical advice. Please consult a qualified healthcare professional for any health concerns."`;

  return ai.chats.create({
    model,
    config: {
      systemInstruction,
      temperature: 0.5,
    },
  });
};