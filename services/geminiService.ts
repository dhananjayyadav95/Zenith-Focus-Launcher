
import { GoogleGenAI } from "@google/genai";

// Use gemini-3-flash-preview for basic text and conversational tasks
const MODEL_NAME = 'gemini-3-flash-preview';

/**
 * Provides a single, powerful, minimalist one-sentence focus mantra.
 * Uses gemini-3-flash-preview as it's a basic text task.
 */
export const getDailyMantra = async (): Promise<string> => {
  try {
    // Initialize GoogleGenAI inside the function to ensure it uses the latest API key from the environment
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: 'Provide a single, powerful, minimalist one-sentence focus mantra. No emojis.',
    });
    // Use the .text property directly (not a method) as per guidelines
    return response.text?.trim() || "Stay intentional.";
  } catch (e) {
    console.error("Error fetching mantra:", e);
    return "Stay intentional.";
  }
};

/**
 * Provides a conversational response for the Zenith Focus Coach.
 * @param history Array of previous messages in the conversation (role and parts).
 */
export const getChatResponse = async (history: any[]): Promise<string> => {
  try {
    // Initialize GoogleGenAI inside the function to ensure it uses the latest API key from the environment
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: history,
      config: {
        systemInstruction: 'You are Zenith, a minimalist focus coach. Use brief, powerful, and stoic language. Encourage the user to stay focused, minimize distractions, and reclaim their time. Avoid emojis and excessive enthusiasm.',
      },
    });
    // Use the .text property directly (not a method) as per guidelines
    return response.text || "Stay focused on your current purpose.";
  } catch (e) {
    console.error("Error in Zenith Coach conversation:", e);
    // Rethrow to allow the component to handle specific error messages like "Requested entity was not found"
    throw e;
  }
};
