export const fallbackAnalyzeMood = (text) => {
  const lowerText = text.toLowerCase();

  const moodMap = {
    happy: {
      keywords: [
        "happy",
        "joy",
        "excited",
        "good",
        "great",
        "awesome",
        "fantastic",
        "cheerful",
        "glad",
        "delighted",
        "ecstatic",
        "content",
        "vibrant",
        "sunny",
        "positive",
        "bliss",
        "celebrate",
        "party",
        "smile",
        "laugh",
      ],
      query: "happy upbeat pop feel good",
    },
    sad: {
      keywords: [
        "sad",
        "down",
        "unhappy",
        "depressed",
        "blue",
        "crying",
        "lonely",
        "grief",
        "heartbroken",
        "miserable",
        "sorrow",
        "gloomy",
        "melancholy",
        "pain",
        "hurt",
        "tears",
        "miss",
        "empty",
        "dark",
        "heavy",
      ],
      query: "sad acoustic melancholic emotional",
    },
    energetic: {
      keywords: [
        "energetic",
        "pumped",
        "active",
        "workout",
        "running",
        "gym",
        "dance",
        "party",
        "power",
        "strong",
        "fast",
        "hype",
        "motivation",
        "beast",
        "training",
        "cardio",
        "lift",
        "sprint",
        "adrenaline",
        "go",
      ],
      query: "high energy workout dance edm",
    },
    relaxed: {
      keywords: [
        "relaxed",
        "chill",
        "calm",
        "peaceful",
        "sleep",
        "rest",
        "quiet",
        "meditate",
        "serene",
        "tranquil",
        "soft",
        "mellow",
        "cozy",
        "spa",
        "zen",
        "breathe",
        "unwind",
        "slow",
        "dreamy",
        "ambient",
      ],
      query: "lo-fi chill acoustic ambient",
    },
    romantic: {
      keywords: [
        "romantic",
        "love",
        "date",
        "passion",
        "heart",
        "crush",
        "sweet",
        "darling",
        "honey",
        "kiss",
        "hug",
        "together",
        "forever",
        "soulmate",
        "valentine",
        "wedding",
        "proposal",
        "intimate",
        "lovely",
        "babe",
      ],
      query: "romantic love songs r&b soul",
    },
    focused: {
      keywords: [
        "focused",
        "study",
        "work",
        "concentrate",
        "reading",
        "coding",
        "learn",
        "deep",
        "mind",
        "brain",
        "logic",
        "productivity",
        "flow",
        "task",
        "exam",
        "library",
        "office",
        "writing",
        "think",
        "smart",
      ],
      query: "instrumental study lo-fi focus",
    },
    angry: {
      keywords: [
        "angry",
        "mad",
        "furious",
        "rage",
        "annoyed",
        "frustrated",
        "hate",
        "pissed",
        "aggressive",
        "violent",
        "scream",
        "loud",
        "heavy",
        "metal",
        "rebel",
        "fight",
        "storm",
        "fire",
        "burn",
        "vengeance",
      ],
      query: "rock metal aggressive heavy",
    },
    chill: {
      keywords: [
        "chill",
        "vibe",
        "cool",
        "easy",
        "smooth",
        "flow",
        "wave",
        "breeze",
        "summer",
        "beach",
        "pool",
        "hangout",
        "friends",
        "night",
        "city",
        "lights",
        "groove",
        "rhythm",
        "style",
        "fresh",
      ],
      query: "chill pop indie alternative",
    },
  };

  let detectedMood = "chill";
  let maxScore = 0;

  // Simple negation check
  const isNegated =
    lowerText.includes("not ") ||
    lowerText.includes("don't ") ||
    lowerText.includes("never ");

  for (const [mood, data] of Object.entries(moodMap)) {
    let score = 0;
    data.keywords.forEach((keyword) => {
      if (lowerText.includes(keyword)) {
        // Give more weight to exact matches or longer words
        score += keyword.length > 5 ? 2 : 1;
      }
    });

    if (score > maxScore) {
      maxScore = score;
      detectedMood = mood;
    }
  }

  // If negated and we found a mood, maybe flip it or default to chill
  if (isNegated && maxScore > 0) {
    if (detectedMood === "happy") detectedMood = "sad";
    else if (detectedMood === "sad") detectedMood = "happy";
    else detectedMood = "chill";
  }

  return {
    mood: detectedMood,
    searchQuery: moodMap[detectedMood]?.query || "chill music",
  };
};
