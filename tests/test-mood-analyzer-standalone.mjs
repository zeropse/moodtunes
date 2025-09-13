// Standalone test for mood analyzer
import fs from "fs";
import path from "path";

// Test the mood analyzer by copying the core logic
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
      "workout",
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
      "relaxed",
      "calm",
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

function simpleMoodAnalysis(text) {
  if (!text || text.length < 3) {
    return {
      mood: "chill",
      confidence: 0.7,
      genres: ["lo-fi", "chillhop", "indie"],
      energy: 0.5,
      valence: 0.6,
      error: "Input too short or empty",
    };
  }

  const normalizedText = text.toLowerCase();
  const scores = {};

  // Simple keyword matching
  Object.entries(MOOD_PATTERNS).forEach(([moodName, moodData]) => {
    let score = 0;
    moodData.keywords.forEach((keyword) => {
      if (normalizedText.includes(keyword)) {
        score += 1;
      }
    });
    scores[moodName] = score;
  });

  // Find best match
  const bestMood = Object.entries(scores).reduce((a, b) =>
    scores[a[0]] > scores[b[0]] ? a : b
  )[0];

  const moodData = MOOD_PATTERNS[bestMood];
  const confidence = Math.min(0.95, 0.6 + scores[bestMood] * 0.1);

  return {
    mood: bestMood,
    confidence: parseFloat(confidence.toFixed(2)),
    genres: [...moodData.genres],
    energy: moodData.energy,
    valence: moodData.valence,
    tempo: moodData.tempo,
    detectedScore: scores[bestMood],
    allScores: scores,
  };
}

// Test cases
const testCases = [
  "I'm feeling absolutely amazing today! So excited and happy!",
  "I'm really sad and heartbroken today",
  "Pumped up and ready to workout! So much energy!",
  "Just want to chill and relax, feeling peaceful",
  "I'm so frustrated and angry right now!",
  "okay fine whatever",
  "not happy",
  "SUPER EXCITED!!!",
  "",
  "a",
  "I love this amazing wonderful fantastic day!",
];

console.log("🧪 Testing Simplified Mood Analysis\n");
console.log("Available moods:", Object.keys(MOOD_PATTERNS).join(", "));
console.log("\n" + "=".repeat(80) + "\n");

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: "${testCase}"`);

  try {
    const result = simpleMoodAnalysis(testCase);

    console.log(`✅ Mood: ${result.mood} (confidence: ${result.confidence})`);
    console.log(`   Genres: ${result.genres.slice(0, 3).join(", ")}`);
    console.log(`   Energy: ${result.energy}, Valence: ${result.valence}`);
    console.log(
      `   Score: ${result.detectedScore}, All scores:`,
      result.allScores
    );

    if (result.error) {
      console.log(`   ⚠️  ${result.error}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  console.log("-".repeat(40));
});

// Performance test
console.log("\n🎯 Testing Performance");
const performanceTest =
  "I'm feeling really happy and excited today, ready to dance and celebrate!";
const iterations = 10000;

console.time("Mood Analysis Performance");
for (let i = 0; i < iterations; i++) {
  simpleMoodAnalysis(performanceTest);
}
console.timeEnd("Mood Analysis Performance");

console.log(`\n✅ Completed ${iterations} analyses`);
console.log("\n🧪 Mood Analysis Tests Complete!");
