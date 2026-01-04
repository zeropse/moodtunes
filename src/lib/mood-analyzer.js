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
      model: "gemini-2.5-flash",
      contents: `You are a professional music curator. Analyze the user's input and provide a mood and a Spotify search query.
      
      User Input: "${text}"
      
      Instructions:
      1. "mood": A single descriptive word.
      2. "searchQuery": A highly optimized string for Spotify search. Combine genres, moods, and styles. 
      3. IMPORTANT: Do NOT include years, decades, or time periods (like "90s" or "2000s") in the searchQuery. The system handles time variety automatically.
      4. Do NOT use quotes or punctuation.
      5. Do NOT include any explanations or extra text.
      6. Do NOT use generic terms like "music" or "songs" in the searchQuery.
      7. Do NOT include both "mood" and "searchQuery" in the same field; return a JSON object with two separate fields.
      8. Format your response as a JSON object like this:
      {
        "mood": "happy",
        "searchQuery": "upbeat pop dance energetic feel-good"
      }
      
      Example:
      Input: "I'm feeling nostalgic but in a sad way"
      Output: {"mood": "nostalgic", "searchQuery": "slow grunge melancholic alternative"}`,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const responseText = response.text;

    if (responseText) {
      try {
        // Clean the response: remove markdown blocks and any trailing/leading non-JSON characters
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const cleanedText = jsonMatch ? jsonMatch[0] : responseText.trim();
        const data = JSON.parse(cleanedText);
        console.log("Gemini Mood Analysis Result:", data);
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
