export const analyzeMood = async (text) => {
  const lowerText = text.toLowerCase();

  const moodMap = {
    happy: [
      "happy",
      "joy",
      "excited",
      "good",
      "great",
      "awesome",
      "fantastic",
      "cheerful",
    ],
    sad: [
      "sad",
      "down",
      "unhappy",
      "depressed",
      "blue",
      "crying",
      "lonely",
      "grief",
    ],
    energetic: [
      "energetic",
      "pumped",
      "active",
      "workout",
      "running",
      "gym",
      "dance",
      "party",
    ],
    relaxed: [
      "relaxed",
      "chill",
      "calm",
      "peaceful",
      "sleep",
      "rest",
      "quiet",
      "meditate",
    ],
    romantic: ["romantic", "love", "date", "passion", "heart", "crush"],
    focused: ["focused", "study", "work", "concentrate", "reading", "coding"],
    angry: ["angry", "mad", "furious", "rage", "annoyed", "frustrated"],
  };

  let detectedMood = "chill"; // Default
  let maxMatches = 0;

  for (const [mood, keywords] of Object.entries(moodMap)) {
    const matches = keywords.filter((keyword) =>
      lowerText.includes(keyword)
    ).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedMood = mood;
    }
  }

  // Map mood to Spotify search query terms
  const queryMap = {
    happy: "happy upbeat pop",
    sad: "sad acoustic melancholic",
    energetic: "high energy workout dance",
    relaxed: "lo-fi chill acoustic",
    romantic: "romantic love songs r&b",
    focused: "instrumental study lo-fi",
    angry: "rock metal aggressive",
    chill: "chill pop indie",
  };

  return {
    mood: detectedMood,
    searchQuery: queryMap[detectedMood] || "chill music",
  };
};
