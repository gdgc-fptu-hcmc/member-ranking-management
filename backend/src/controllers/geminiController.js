import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getGeminiResponse = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: "You are a helpful assistant for a university's Google Developer Group (GDG) club. Provide concise and relevant answers about the club's activities, membership, events, and other related information.",
        temperature: 1,
        thinkingConfig: {
            includeThoughts: false,
            thinkingBudget: "minimal"
        }
    }
    });

    res.json({ reply: response.text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to fetch response from Gemini AI" });
  }
};