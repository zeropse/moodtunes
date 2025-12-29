// Mood analysis patterns and mappings
const MOOD_PATTERNS = {
  happy: {
    keywords: [
      "happy",
      "joy",
      "excited",
      "great",
      "amazing",
      "wonderful",
      "fantastic",
      "awesome",
      "cheerful",
      "elated",
      "euphoric",
      "delighted",
      "thrilled",
      "ecstatic",
      "blissful",
      "upbeat",
      "positive",
      "good",
      "excellent",
      "brilliant",
      "celebrate",
      "celebration",
    ],
    genres: ["pop", "dance", "funk", "disco", "house", "reggae"],
    energy: 0.8,
    valence: 0.9,
    tempo: { min: 120, max: 140 },
  },
  sad: {
    keywords: [
      "sad",
      "depressed",
      "down",
      "blue",
      "melancholy",
      "heartbroken",
      "disappointed",
      "lonely",
      "grief",
      "sorrow",
      "crying",
      "tears",
      "hurt",
      "pain",
      "lost",
      "empty",
      "hopeless",
      "devastated",
      "broken",
      "miss",
      "missing",
    ],
    genres: [
      "blues",
      "indie",
      "folk",
      "alternative",
      "acoustic",
      "singer-songwriter",
    ],
    energy: 0.3,
    valence: 0.2,
    tempo: { min: 60, max: 90 },
  },
  angry: {
    keywords: [
      "angry",
      "mad",
      "furious",
      "rage",
      "hate",
      "pissed",
      "frustrated",
      "annoyed",
      "irritated",
      "outraged",
      "livid",
      "enraged",
      "hostile",
      "resentful",
      "bitter",
      "aggravated",
      "infuriated",
    ],
    genres: ["rock", "metal", "punk", "hardcore", "grunge", "industrial"],
    energy: 0.9,
    valence: 0.1,
    tempo: { min: 140, max: 180 },
  },
  relaxed: {
    keywords: [
      "relaxed",
      "calm",
      "peaceful",
      "chill",
      "tranquil",
      "serene",
      "mellow",
      "laid-back",
      "easy",
      "comfortable",
      "zen",
      "meditative",
      "quiet",
      "gentle",
      "soothing",
      "restful",
    ],
    genres: ["ambient", "chillout", "lo-fi", "jazz", "classical", "new-age"],
    energy: 0.4,
    valence: 0.6,
    tempo: { min: 60, max: 100 },
  },
  energetic: {
    keywords: [
      "energetic",
      "pumped",
      "motivated",
      "active",
      "hyper",
      "charged",
      "intense",
      "powerful",
      "strong",
      "dynamic",
      "vigorous",
      "lively",
      "spirited",
      "workout",
      "exercise",
      "run",
      "gym",
    ],
    genres: [
      "electronic",
      "edm",
      "techno",
      "house",
      "drum-and-bass",
      "hardstyle",
    ],
    energy: 0.95,
    valence: 0.7,
    tempo: { min: 128, max: 160 },
  },
  romantic: {
    keywords: [
      "love",
      "romantic",
      "romance",
      "crush",
      "relationship",
      "date",
      "valentine",
      "sweet",
      "tender",
      "affection",
      "heart",
      "kiss",
      "hug",
      "intimate",
      "passion",
      "adore",
      "devoted",
    ],
    genres: ["r&b", "soul", "jazz", "pop", "indie-pop", "soft-rock"],
    energy: 0.5,
    valence: 0.8,
    tempo: { min: 80, max: 120 },
  },
  nostalgic: {
    keywords: [
      "nostalgic",
      "memories",
      "remember",
      "past",
      "childhood",
      "miss",
      "old",
      "vintage",
      "retro",
      "throwback",
      "reminisce",
      "wistful",
      "sentimental",
      "reflection",
    ],
    genres: [
      "classic-rock",
      "oldies",
      "folk",
      "country",
      "indie",
      "alternative",
    ],
    energy: 0.5,
    valence: 0.6,
    tempo: { min: 90, max: 130 },
  },
  anxious: {
    keywords: [
      "anxious",
      "nervous",
      "worried",
      "stress",
      "overwhelmed",
      "panic",
      "fear",
      "scared",
      "tension",
      "uneasy",
      "restless",
      "agitated",
      "troubled",
      "concerned",
      "apprehensive",
    ],
    genres: [
      "indie",
      "alternative",
      "electronic",
      "ambient",
      "post-rock",
      "experimental",
    ],
    energy: 0.6,
    valence: 0.3,
    tempo: { min: 100, max: 130 },
  },
  confident: {
    keywords: [
      "confident",
      "bold",
      "strong",
      "powerful",
      "successful",
      "winner",
      "champion",
      "boss",
      "fierce",
      "unstoppable",
      "determined",
      "fearless",
      "brave",
      "dominant",
      "swagger",
    ],
    genres: ["hip-hop", "rap", "trap", "rock", "pop", "funk"],
    energy: 0.8,
    valence: 0.8,
    tempo: { min: 110, max: 140 },
  },
  thoughtful: {
    keywords: [
      "thinking",
      "contemplating",
      "philosophical",
      "deep",
      "introspective",
      "reflecting",
      "pondering",
      "wondering",
      "questioning",
      "analyzing",
      "studying",
      "focused",
      "concentrated",
    ],
    genres: ["jazz", "classical", "ambient", "post-rock", "indie", "neo-soul"],
    energy: 0.4,
    valence: 0.5,
    tempo: { min: 70, max: 110 },
  },
  chill: {
    keywords: [
      "chill",
      "chilling",
      "laid-back",
      "easy-going",
      "casual",
      "cool",
      "whatever",
      "alright",
      "fine",
      "okay",
      "simple",
      "basic",
      "normal",
      "regular",
      "standard",
      "moderate",
      "balanced",
    ],
    genres: [
      "lo-fi",
      "chillhop",
      "indie",
      "alternative",
      "chillout",
      "downtempo",
    ],
    energy: 0.5,
    valence: 0.6,
    tempo: { min: 80, max: 110 },
  },
};

// Sentiment analysis patterns for proper sentence analysis
const SENTIMENT_PATTERNS = {
  positive: {
    words: [
      "good",
      "great",
      "amazing",
      "wonderful",
      "fantastic",
      "excellent",
      "awesome",
      "brilliant",
      "perfect",
      "beautiful",
      "love",
      "like",
      "enjoy",
      "happy",
      "excited",
      "thrilled",
      "delighted",
      "pleased",
      "satisfied",
      "grateful",
      "thankful",
      "blessed",
      "lucky",
      "successful",
      "proud",
    ],
    phrases: [
      "feel good",
      "feeling great",
      "so happy",
      "really excited",
      "absolutely love",
      "can't wait",
      "looking forward",
      "best day",
      "so grateful",
      "feeling blessed",
    ],
    intensity: [
      "very",
      "really",
      "so",
      "extremely",
      "absolutely",
      "incredibly",
      "totally",
      "completely",
      "utterly",
      "super",
      "mega",
    ],
    modifiers: ["!", "!!!", ":)", "😊", "😃", "😄", "🎉", "❤️"],
  },
  negative: {
    words: [
      "bad",
      "terrible",
      "awful",
      "horrible",
      "sad",
      "depressed",
      "angry",
      "frustrated",
      "disappointed",
      "hurt",
      "pain",
      "hate",
      "dislike",
      "upset",
      "worried",
      "anxious",
      "stressed",
      "overwhelmed",
      "lonely",
      "empty",
      "broken",
      "devastated",
      "heartbroken",
    ],
    phrases: [
      "feel bad",
      "feeling down",
      "so sad",
      "really upset",
      "can't stand",
      "had enough",
      "feeling terrible",
      "worst day",
      "feel awful",
      "so frustrated",
    ],
    intensity: [
      "very",
      "really",
      "so",
      "extremely",
      "absolutely",
      "incredibly",
      "totally",
      "completely",
      "utterly",
      "super",
    ],
    modifiers: [":(", ":((", "😢", "😭", "😞", "💔", "😡", "😤"],
  },
  neutral: {
    words: [
      "okay",
      "fine",
      "normal",
      "regular",
      "usual",
      "standard",
      "average",
      "typical",
      "same",
      "nothing",
      "just",
      "maybe",
      "perhaps",
      "somewhat",
      "kind of",
      "sort of",
    ],
    phrases: [
      "it's okay",
      "nothing special",
      "just normal",
      "same as usual",
      "kind of okay",
      "not bad",
      "not good",
      "could be better",
      "could be worse",
    ],
    modifiers: ["🤷", "😐", "😑"],
  },
};

// Context patterns for better mood detection
const CONTEXT_PATTERNS = {
  temporal: {
    past: [
      "yesterday",
      "last week",
      "before",
      "used to",
      "remember when",
      "back then",
      "previously",
    ],
    present: [
      "today",
      "now",
      "currently",
      "right now",
      "at the moment",
      "these days",
    ],
    future: [
      "tomorrow",
      "next week",
      "will",
      "going to",
      "planning to",
      "hope to",
      "looking forward",
    ],
  },
  intensity: {
    high: [
      "extremely",
      "incredibly",
      "absolutely",
      "totally",
      "completely",
      "utterly",
      "super",
      "mega",
      "so much",
      "really really",
    ],
    medium: [
      "very",
      "really",
      "quite",
      "pretty",
      "fairly",
      "rather",
      "somewhat",
    ],
    low: [
      "a bit",
      "a little",
      "slightly",
      "kind of",
      "sort of",
      "maybe",
      "perhaps",
    ],
  },
  negation: [
    "not",
    "no",
    "never",
    "don't",
    "can't",
    "won't",
    "isn't",
    "aren't",
    "wasn't",
    "weren't",
    "haven't",
    "hasn't",
    "hadn't",
  ],
};

/**
 * Gets the default chill mood when analysis fails
 * @returns {Object} Default chill mood analysis result
 */
function getDefaultChillMood() {
  return {
    mood: "chill",
    confidence: 0.7,
    genres: ["lo-fi", "chillhop", "indie", "alternative", "chillout"],
    energy: 0.5,
    valence: 0.6,
    tempo: { min: 80, max: 110 },
    detectedKeywords: ["chill"],
    analysis: {
      sentimentScore: {
        positive: 0,
        negative: 0,
        neutral: 1,
        overall: 0,
        intensity: 1,
        hasNegation: false,
      },
      contextFactors: {
        temporal: { past: 0, present: 1, future: 0 },
        intensity: { high: 0, medium: 1, low: 0 },
      },
      linguisticFeatures: {
        wordCount: 1,
        sentenceCount: 1,
        avgWordsPerSentence: 1,
        hasExclamation: false,
        hasQuestion: false,
        hasEmoji: false,
        repetition: 0,
        capsUsage: 0,
      },
      sentences: 1,
      complexity: { avgWordLength: 5, avgSentenceLength: 1, complexity: 3 },
      fallback: true,
      error: "Used default chill mood due to analysis error",
    },
  };
}

/**
 * Analyzes mood from text using advanced sentence analysis and sentiment scoring
 * @param {string} text - The input text to analyze
 * @returns {Object} Analysis result with mood, confidence, genres, energy, valence, tempo, and analysis details
 */
export function analyzeMoodFromText(text) {
  try {
    // Input validation
    if (!text || typeof text !== "string") {
      console.warn("Invalid input text provided, defaulting to chill mood");
      return getDefaultChillMood();
    }

    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      console.warn("Empty text provided, defaulting to chill mood");
      return getDefaultChillMood();
    }

    if (trimmedText.length > 5000) {
      console.warn("Text too long, truncating and continuing with analysis");
      text = trimmedText.substring(0, 5000);
    } else {
      text = trimmedText;
    }

    const normalizedText = text.toLowerCase();
    const sentences = splitIntoSentences(normalizedText);

    // Perform comprehensive analysis
    const sentimentScore = analyzeSentiment(normalizedText);
    const contextAnalysis = analyzeContext(normalizedText);
    const linguisticFeatures = extractLinguisticFeatures(normalizedText);
    const keywordMatches = analyzeKeywordMatches(normalizedText);

    // Calculate mood scores using multiple factors
    const moodScores = calculateMoodScores(
      sentimentScore,
      contextAnalysis,
      linguisticFeatures,
      keywordMatches
    );

    // Find the best matching mood
    const sortedMoods = Object.entries(moodScores)
      .sort(([, a], [, b]) => b.score - a.score)
      .filter(([, data]) => data.score > 0);

    if (sortedMoods.length === 0) {
      const generalAnalysis = analyzeGeneralSentiment(normalizedText);
      return generalAnalysis || getDefaultChillMood();
    }

    const [primaryMood, moodData] = sortedMoods[0];
    const moodPattern = MOOD_PATTERNS[primaryMood];

    if (!moodPattern) {
      console.warn(`Unknown mood pattern: ${primaryMood}, defaulting to chill`);
      return getDefaultChillMood();
    }

    // Calculate confidence based on multiple factors
    const confidence = calculateConfidence(
      moodData,
      sentimentScore,
      contextAnalysis,
      linguisticFeatures,
      normalizedText
    );

    return {
      mood: primaryMood,
      confidence: parseFloat(confidence.toFixed(2)),
      genres: [...moodPattern.genres],
      energy: adjustEnergyLevel(
        moodPattern.energy,
        contextAnalysis,
        linguisticFeatures
      ),
      valence: adjustValenceLevel(moodPattern.valence, sentimentScore),
      tempo: { ...moodPattern.tempo },
      detectedKeywords: moodData.keywords.slice(0, 5),
      analysis: {
        sentimentScore: sentimentScore,
        contextFactors: contextAnalysis,
        linguisticFeatures: linguisticFeatures,
        sentences: sentences.length,
        complexity: calculateTextComplexity(normalizedText),
      },
    };
  } catch (error) {
    console.error("Error analyzing mood from text:", error);
    console.warn("Defaulting to chill mood due to analysis error");

    const defaultMood = getDefaultChillMood();
    defaultMood.analysis.error = `Analysis failed: ${error.message}`;
    return defaultMood;
  }
}

/**
 * Splits text into sentences for better analysis
 */
function splitIntoSentences(text) {
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Analyzes sentiment using multiple approaches
 */
function analyzeSentiment(text) {
  try {
    if (!text || typeof text !== "string") {
      return {
        positive: 0,
        negative: 0,
        neutral: 1,
        overall: 0,
        intensity: 1,
        hasNegation: false,
      };
    }

    let positiveScore = 0;
    let negativeScore = 0;
    let neutralScore = 0;
    let intensityMultiplier = 1;
    let hasNegation = false;

    // Check for negation words
    CONTEXT_PATTERNS.negation.forEach((neg) => {
      if (text.includes(neg)) {
        hasNegation = true;
      }
    });

    // Check for intensity modifiers
    SENTIMENT_PATTERNS.positive.intensity.forEach((intensity) => {
      if (text.includes(intensity)) {
        intensityMultiplier += 0.3;
      }
    });

    // Analyze positive sentiment
    SENTIMENT_PATTERNS.positive.words.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      if (regex.test(text)) {
        positiveScore += 1 * intensityMultiplier;
      }
    });

    SENTIMENT_PATTERNS.positive.phrases.forEach((phrase) => {
      if (text.includes(phrase)) {
        positiveScore += 2 * intensityMultiplier;
      }
    });

    // Analyze negative sentiment
    SENTIMENT_PATTERNS.negative.words.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      if (regex.test(text)) {
        negativeScore += 1 * intensityMultiplier;
      }
    });

    SENTIMENT_PATTERNS.negative.phrases.forEach((phrase) => {
      if (text.includes(phrase)) {
        negativeScore += 2 * intensityMultiplier;
      }
    });

    // Analyze neutral sentiment
    SENTIMENT_PATTERNS.neutral.words.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      if (regex.test(text)) {
        neutralScore += 1;
      }
    });

    // Apply negation effects
    if (hasNegation) {
      const temp = positiveScore;
      positiveScore = negativeScore * 0.7;
      negativeScore = temp * 0.7;
    }

    return {
      positive: positiveScore,
      negative: negativeScore,
      neutral: neutralScore,
      overall: positiveScore - negativeScore,
      intensity: intensityMultiplier,
      hasNegation: hasNegation,
    };
  } catch (error) {
    console.error("Error in sentiment analysis:", error);
    return {
      positive: 0,
      negative: 0,
      neutral: 1,
      overall: 0,
      intensity: 1,
      hasNegation: false,
    };
  }
}

/**
 * Analyzes context and temporal aspects
 */
function analyzeContext(text) {
  const context = {
    temporal: { past: 0, present: 0, future: 0 },
    intensity: { high: 0, medium: 0, low: 0 },
    emotionalContext: {},
  };

  // Temporal analysis
  Object.entries(CONTEXT_PATTERNS.temporal).forEach(([timeframe, words]) => {
    words.forEach((word) => {
      if (text.includes(word)) {
        context.temporal[timeframe]++;
      }
    });
  });

  // Intensity analysis
  Object.entries(CONTEXT_PATTERNS.intensity).forEach(([level, words]) => {
    words.forEach((word) => {
      if (text.includes(word)) {
        context.intensity[level]++;
      }
    });
  });

  return context;
}

/**
 * Extracts linguistic features for mood analysis
 */
function extractLinguisticFeatures(text) {
  const words = text.split(/\s+/);
  const sentences = splitIntoSentences(text);

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    avgWordsPerSentence: words.length / Math.max(sentences.length, 1),
    hasExclamation: text.includes("!"),
    hasQuestion: text.includes("?"),
    hasEmoji:
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
        text
      ),
    repetition: countRepetition(text),
    capsUsage: (text.match(/[A-Z]/g) || []).length / text.length,
  };
}

/**
 * Analyzes keyword matches with contextual weighting
 */
function analyzeKeywordMatches(text) {
  const matches = {};

  Object.entries(MOOD_PATTERNS).forEach(([moodName, moodData]) => {
    matches[moodName] = {
      keywords: [],
      score: 0,
      contextualScore: 0,
    };

    moodData.keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "i");
      if (regex.test(text)) {
        matches[moodName].keywords.push(keyword);
        matches[moodName].score += 1;

        // Add contextual scoring based on surrounding words
        const contextScore = analyzeKeywordContext(text, keyword);
        matches[moodName].contextualScore += contextScore;
      }
    });
  });

  return matches;
}

/**
 * Analyzes context around keywords for better mood detection
 */
function analyzeKeywordContext(text, keyword) {
  const regex = new RegExp(`(.{0,30})\\b${keyword}\\b(.{0,30})`, "i");
  const match = text.match(regex);

  if (!match) return 0;

  const context = (match[1] + " " + match[2]).toLowerCase();
  let contextScore = 1;

  // Boost score for intensity words near the keyword
  CONTEXT_PATTERNS.intensity.high.forEach((intensity) => {
    if (context.includes(intensity)) contextScore += 0.5;
  });

  // Check for negation that might flip the meaning
  CONTEXT_PATTERNS.negation.forEach((neg) => {
    if (context.includes(neg)) contextScore *= 0.3;
  });

  return contextScore;
}

/**
 * Calculates mood scores using multiple analysis factors
 */
function calculateMoodScores(
  sentimentScore,
  contextAnalysis,
  linguisticFeatures,
  keywordMatches
) {
  const scores = {};

  Object.entries(MOOD_PATTERNS).forEach(([moodName, moodData]) => {
    let score = 0;

    // Base keyword score
    score += keywordMatches[moodName].contextualScore * 2;

    // Sentiment alignment score
    if (
      moodName === "happy" ||
      moodName === "excited" ||
      moodName === "confident"
    ) {
      score += Math.max(0, sentimentScore.positive) * 0.5;
    } else if (
      moodName === "sad" ||
      moodName === "angry" ||
      moodName === "anxious"
    ) {
      score += Math.max(0, sentimentScore.negative) * 0.5;
    } else if (moodName === "relaxed" || moodName === "thoughtful") {
      score += sentimentScore.neutral * 0.3;
    }

    // Intensity alignment
    const expectedEnergy = moodData.energy;
    if (expectedEnergy > 0.7 && contextAnalysis.intensity.high > 0) {
      score += 1;
    } else if (expectedEnergy < 0.5 && contextAnalysis.intensity.low > 0) {
      score += 1;
    }

    // Linguistic feature alignment
    if (linguisticFeatures.hasExclamation && expectedEnergy > 0.6) {
      score += 0.5;
    }
    if (linguisticFeatures.hasQuestion && moodName === "thoughtful") {
      score += 0.5;
    }

    scores[moodName] = {
      score: score,
      keywords: keywordMatches[moodName].keywords,
    };
  });

  return scores;
}

/**
 * Calculates confidence based on analysis quality
 */
function calculateConfidence(
  moodData,
  sentimentScore,
  contextAnalysis,
  linguisticFeatures,
  text
) {
  let confidence = 0.6; // Base confidence

  // Keyword confidence
  const keywordDensity =
    moodData.keywords.length / Math.max(linguisticFeatures.wordCount, 1);
  confidence += Math.min(0.2, keywordDensity * 5);

  // Sentiment confidence
  const sentimentStrength =
    Math.abs(sentimentScore.overall) /
    Math.max(linguisticFeatures.wordCount, 1);
  confidence += Math.min(0.15, sentimentStrength * 3);

  // Text quality confidence
  if (linguisticFeatures.wordCount >= 5) confidence += 0.05;
  if (linguisticFeatures.sentenceCount >= 2) confidence += 0.05;
  if (linguisticFeatures.avgWordsPerSentence > 3) confidence += 0.05;

  return Math.min(0.95, confidence);
}

/**
 * Adjusts energy level based on context
 */
function adjustEnergyLevel(baseEnergy, contextAnalysis, linguisticFeatures) {
  let adjustedEnergy = baseEnergy;

  if (contextAnalysis.intensity.high > 0) {
    adjustedEnergy = Math.min(1.0, adjustedEnergy + 0.1);
  } else if (contextAnalysis.intensity.low > 0) {
    adjustedEnergy = Math.max(0.0, adjustedEnergy - 0.1);
  }

  if (linguisticFeatures.hasExclamation) {
    adjustedEnergy = Math.min(1.0, adjustedEnergy + 0.05);
  }

  return adjustedEnergy;
}

/**
 * Adjusts valence level based on sentiment
 */
function adjustValenceLevel(baseValence, sentimentScore) {
  let adjustedValence = baseValence;

  if (sentimentScore.overall > 0) {
    adjustedValence = Math.min(
      1.0,
      adjustedValence + sentimentScore.overall * 0.05
    );
  } else if (sentimentScore.overall < 0) {
    adjustedValence = Math.max(
      0.0,
      adjustedValence + sentimentScore.overall * 0.05
    );
  }

  return adjustedValence;
}

/**
 * Counts repetition patterns in text
 */
function countRepetition(text) {
  const words = text.toLowerCase().split(/\s+/);
  const wordCount = {};
  let repetitions = 0;

  words.forEach((word) => {
    if (word.length > 2) {
      // Only count meaningful words
      wordCount[word] = (wordCount[word] || 0) + 1;
      if (wordCount[word] > 1) repetitions++;
    }
  });

  return repetitions;
}

/**
 * Calculates text complexity score
 */
function calculateTextComplexity(text) {
  const words = text.split(/\s+/);
  const sentences = splitIntoSentences(text);
  const avgWordLength =
    words.reduce((sum, word) => sum + word.length, 0) / words.length;
  const avgSentenceLength = words.length / Math.max(sentences.length, 1);

  return {
    avgWordLength: avgWordLength,
    avgSentenceLength: avgSentenceLength,
    complexity: (avgWordLength + avgSentenceLength) / 2,
  };
}

/**
 * Analyzes general sentiment when no specific mood keywords are detected
 * @param {string} text - The normalized text to analyze
 * @returns {Object} Sentiment analysis result
 */
function analyzeGeneralSentiment(text) {
  try {
    // Use the new advanced sentiment analysis
    const sentimentScore = analyzeSentiment(text);
    const contextAnalysis = analyzeContext(text);
    const linguisticFeatures = extractLinguisticFeatures(text);

    // Determine mood based on comprehensive sentiment analysis
    if (
      sentimentScore.positive > sentimentScore.negative &&
      sentimentScore.positive > sentimentScore.neutral
    ) {
      const intensity = contextAnalysis.intensity.high > 0 ? 0.8 : 0.6;
      return {
        mood: "happy",
        confidence: Math.min(0.85, 0.6 + sentimentScore.positive * 0.05),
        genres: ["pop", "indie", "folk", "acoustic"],
        energy: intensity,
        valence: Math.min(0.9, 0.7 + sentimentScore.positive * 0.03),
        tempo: { min: 100, max: 130 },
        detectedKeywords: SENTIMENT_PATTERNS.positive.words
          .filter((word) => new RegExp(`\\b${word}\\b`, "i").test(text))
          .slice(0, 3),
        analysis: {
          sentimentScore: sentimentScore,
          contextFactors: contextAnalysis,
          linguisticFeatures: linguisticFeatures,
          sentences: splitIntoSentences(text).length,
          complexity: calculateTextComplexity(text),
        },
      };
    } else if (sentimentScore.negative > sentimentScore.positive) {
      const intensity = contextAnalysis.intensity.high > 0 ? 0.2 : 0.4;
      return {
        mood: "sad",
        confidence: Math.min(0.85, 0.6 + sentimentScore.negative * 0.05),
        genres: ["indie", "alternative", "folk", "blues"],
        energy: intensity,
        valence: Math.max(0.1, 0.3 - sentimentScore.negative * 0.03),
        tempo: { min: 70, max: 100 },
        detectedKeywords: SENTIMENT_PATTERNS.negative.words
          .filter((word) => new RegExp(`\\b${word}\\b`, "i").test(text))
          .slice(0, 3),
        analysis: {
          sentimentScore: sentimentScore,
          contextFactors: contextAnalysis,
          linguisticFeatures: linguisticFeatures,
          sentences: splitIntoSentences(text).length,
          complexity: calculateTextComplexity(text),
        },
      };
    } else {
      // Default to chill mood for neutral/unclear sentiment
      return {
        mood: "chill",
        confidence: Math.min(0.8, 0.6 + sentimentScore.neutral * 0.05),
        genres: ["lo-fi", "chillhop", "indie", "alternative", "chillout"],
        energy: 0.5,
        valence: 0.6,
        tempo: { min: 80, max: 110 },
        detectedKeywords: SENTIMENT_PATTERNS.neutral.words
          .filter((word) => new RegExp(`\\b${word}\\b`, "i").test(text))
          .slice(0, 3),
        analysis: {
          sentimentScore: sentimentScore,
          contextFactors: contextAnalysis,
          linguisticFeatures: linguisticFeatures,
          sentences: splitIntoSentences(text).length,
          complexity: calculateTextComplexity(text),
          generalSentiment: true,
        },
      };
    }
  } catch (error) {
    console.error("Error in general sentiment analysis:", error);
    console.warn("Defaulting to chill mood from general sentiment analysis");
    return getDefaultChillMood();
  }
}

/**
 * Sanitizes user input text
 * @param {string} input - The input text to sanitize
 * @returns {string} Sanitized text
 */
export function sanitizeInput(input) {
  if (typeof input !== "string") {
    return "";
  }

  return (
    input
      // Remove potentially harmful characters but keep basic punctuation
      .replace(/[<>\"'&{}[\]\\]/g, "")
      // Replace multiple whitespace with single space
      .replace(/\s+/g, " ")
      // Remove excessive punctuation (more than 3 in a row)
      .replace(/[!?.,]{4,}/g, "...")
      .trim()
  );
}

/**
 * Gets the list of available moods
 * @returns {string[]} Array of available mood names
 */
export function getAvailableMoods() {
  return Object.keys(MOOD_PATTERNS);
}

/**
 * Gets detailed information about mood categories
 * @returns {Object} Object containing mood category details
 */
export function getMoodCategories() {
  const categories = {};

  for (const [moodName, moodData] of Object.entries(MOOD_PATTERNS)) {
    categories[moodName] = {
      description: getMoodDescription(moodName),
      genres: [...moodData.genres],
      characteristics: getMoodCharacteristics(moodData),
      keywords: moodData.keywords.slice(0, 10), // First 10 keywords as examples
    };
  }

  return categories;
}

/**
 * Gets a human-readable description for a mood
 * @param {string} moodName - The name of the mood
 * @returns {string} Description of the mood
 */
function getMoodDescription(moodName) {
  const descriptions = {
    happy: "Joyful, excited, positive emotions",
    sad: "Melancholy, heartbroken, down emotions",
    angry: "Frustrated, mad, intense emotions",
    relaxed: "Calm, peaceful, chill emotions",
    energetic: "Pumped up, motivated, active emotions",
    romantic: "Love, affection, tender emotions",
    nostalgic: "Memories, reminiscent, sentimental emotions",
    anxious: "Worried, nervous, stressed emotions",
    confident: "Bold, powerful, successful emotions",
    thoughtful: "Contemplative, introspective, focused emotions",
    chill: "Laid-back, easy-going, casual emotions",
  };

  return descriptions[moodName] || "Unknown mood";
}

/**
 * Gets characteristics description for mood data
 * @param {Object} moodData - The mood data object
 * @returns {string} Characteristics description
 */
function getMoodCharacteristics(moodData) {
  const energyLevel =
    moodData.energy > 0.7 ? "High" : moodData.energy > 0.4 ? "Moderate" : "Low";
  const valenceLevel =
    moodData.valence > 0.7
      ? "high"
      : moodData.valence > 0.4
      ? "moderate"
      : "low";
  const tempoLevel =
    moodData.tempo.max > 140
      ? "fast"
      : moodData.tempo.max > 100
      ? "moderate"
      : "slow";

  return `${energyLevel} energy, ${valenceLevel} valence, ${tempoLevel} tempo`;
}
