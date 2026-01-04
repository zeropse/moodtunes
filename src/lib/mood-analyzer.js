import { GoogleGenAI } from "@google/genai";
import { fallbackAnalyzeMood } from "@/lib/backup-mood-analyzer.js";

export const analyzeMood = async (text) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("GEMINI_API_KEY not set, using local analysis.");
    return fallbackAnalyzeMood(text);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `You are a professional music curator. Analyze the user's input and provide a mood and a Spotify search query.
      
      User Input: "${text}"
      
      Instructions:
      1. "mood": A single descriptive word.
      2. "searchQuery": A highly optimized string for Spotify search. Combine genres, moods, and styles. Do NOT use quotes or punctuation.
      
      Example:
      Input: "I'm feeling nostalgic for the 90s but in a sad way"
      Output: {"mood": "nostalgic", "searchQuery": "90s slow grunge melancholic alternative"}`,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const responseText = response.text;

    if (responseText) {
      try {
        const data = JSON.parse(responseText);
        return {
          mood: (data.mood || "chill").toLowerCase(),
          searchQuery: data.searchQuery || "chill music",
        };
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", responseText);
      }
    }
  } catch (error) {
    console.error("Gemini API error:", error.message);
  }

  // Final fallback if anything above fails
  return fallbackAnalyzeMood(text);
};
