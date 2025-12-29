#!/usr/bin/env node

// Test script for mood analysis functionality
import {
  analyzeMoodFromText,
  sanitizeInput,
  getAvailableMoods,
} from "./src/lib/mood-analyzer.js";

console.log("🧪 Testing Mood Analysis Engine\n");

// Test cases covering different moods and edge cases
const testCases = [
  // Happy moods
  "I'm feeling absolutely amazing today! So excited and happy!",
  "Great day, feeling wonderful and cheerful",

  // Sad moods
  "I'm really sad and heartbroken today",
  "Feeling down and melancholy, missing someone",

  // Energetic moods
  "Pumped up and ready to workout! So much energy!",
  "Feeling super motivated and energetic, let's go!",

  // Relaxed moods
  "Just want to chill and relax, feeling peaceful",
  "Calm and tranquil, need some mellow vibes",

  // Angry moods
  "I'm so frustrated and angry right now!",
  "Feeling mad and irritated, need some aggressive music",

  // Romantic moods
  "In love and feeling romantic, thinking about my crush",
  "Sweet and tender feelings, valentine's day vibes",

  // Nostalgic moods
  "Remembering old times, feeling nostalgic about childhood",
  "Wistful and sentimental, missing the past",

  // Anxious moods
  "Feeling nervous and worried about everything",
  "Stressed and overwhelmed, so much anxiety",

  // Confident moods
  "Feeling like a boss, confident and powerful!",
  "Strong and fearless, ready to conquer the world",

  // Thoughtful moods
  "Deep in thought, contemplating life and philosophy",
  "Introspective and focused, analyzing everything",

  // Edge cases
  "okay fine whatever", // neutral/chill
  "not happy", // negation
  "SUPER EXCITED!!!", // caps and punctuation
  "😊 feeling good 🎉", // emojis
  "a", // too short
  "", // empty
  "I'm feeling happy but also sad and confused", // mixed emotions
];

console.log("Available moods:", getAvailableMoods().join(", "));
console.log("\n" + "=".repeat(80) + "\n");

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: "${testCase}"`);

  try {
    // Test input sanitization
    const sanitized = sanitizeInput(testCase);
    console.log(`Sanitized: "${sanitized}"`);

    // Test mood analysis
    const result = analyzeMoodFromText(testCase);

    console.log(`Result: ${result.mood} (confidence: ${result.confidence})`);
    console.log(`Genres: ${result.genres.slice(0, 3).join(", ")}`);
    console.log(`Energy: ${result.energy}, Valence: ${result.valence}`);
    console.log(`Keywords: ${result.detectedKeywords.join(", ")}`);

    if (result.analysis?.fallback) {
      console.log("⚠️  Used fallback analysis");
    }

    console.log("✅ Analysis completed successfully");
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  console.log("-".repeat(40));
});

console.log("\n🎯 Testing Performance");

// Performance test
const performanceTest =
  "I'm feeling really happy and excited today, ready to dance and celebrate!";
const iterations = 1000;

console.time("Mood Analysis Performance");
for (let i = 0; i < iterations; i++) {
  analyzeMoodFromText(performanceTest);
}
console.timeEnd("Mood Analysis Performance");

console.log(`\n✅ Completed ${iterations} analyses`);
console.log("\n🧪 Mood Analysis Tests Complete!");
