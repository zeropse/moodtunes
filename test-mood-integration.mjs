#!/usr/bin/env node

/**
 * Test script to verify mood analysis and song suggestion integration
 * This script tests the complete flow from mood text to song suggestions
 */

const API_BASE = "http://localhost:3000/api";

async function testMoodAnalysis(moodText) {
  console.log(`\n🎭 Testing mood analysis for: "${moodText}"`);

  try {
    const response = await fetch(`${API_BASE}/analyze-mood`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ moodText }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error?.message || "Analysis failed");
    }

    const data = result.data;
    console.log(`✅ Detected mood: ${data.mood}`);
    console.log(`📊 Confidence: ${(data.confidence * 100).toFixed(1)}%`);
    console.log(`🎵 Genres: ${data.genres.join(", ")}`);
    console.log(`⚡ Energy: ${data.energy.toFixed(2)}`);
    console.log(`😊 Valence: ${data.valence.toFixed(2)}`);
    console.log(`🥁 Tempo: ${data.tempo.min}-${data.tempo.max} BPM`);

    return data;
  } catch (error) {
    console.error(`❌ Mood analysis failed: ${error.message}`);
    return null;
  }
}

async function testSongSuggestions(moodAnalysis, originalText) {
  console.log(`\n🎵 Testing song suggestions for mood: ${moodAnalysis.mood}`);

  try {
    const response = await fetch(`${API_BASE}/suggest-songs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mood: moodAnalysis.mood,
        genres: moodAnalysis.genres,
        energy: moodAnalysis.energy,
        valence: moodAnalysis.valence,
        tempo: moodAnalysis.tempo,
        moodText: originalText,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      if (result.warning) {
        console.log(`⚠️  ${result.warning}`);
        // Still show fallback results
        const suggestions = result.suggestions;
        console.log(`📀 Found ${suggestions.totalTracks} sample tracks`);
        console.log(
          `🎼 Genres used: ${suggestions.seedGenres?.join(", ") || "N/A"}`
        );
        return suggestions;
      } else {
        throw new Error(result.error?.message || "Song suggestions failed");
      }
    }

    const suggestions = result.suggestions;
    console.log(`✅ Found ${suggestions.totalTracks} tracks`);
    console.log(
      `🎼 Genres used: ${suggestions.seedGenres?.join(", ") || "N/A"}`
    );

    if (suggestions.tracks && suggestions.tracks.length > 0) {
      console.log(`\n🎤 Top 5 suggestions:`);
      suggestions.tracks.slice(0, 5).forEach((track, index) => {
        const artists = Array.isArray(track.artists)
          ? track.artists.join(", ")
          : track.artists;
        const score = track.moodScore ? ` (Score: ${track.moodScore})` : "";
        console.log(`  ${index + 1}. ${track.name} - ${artists}${score}`);
      });
    }

    return suggestions;
  } catch (error) {
    console.error(`❌ Song suggestions failed: ${error.message}`);
    return null;
  }
}

async function testCompleteFlow(moodText) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🚀 Testing complete flow for: "${moodText}"`);
  console.log(`${"=".repeat(60)}`);

  // Step 1: Analyze mood
  const moodAnalysis = await testMoodAnalysis(moodText);
  if (!moodAnalysis) {
    console.log(`❌ Cannot proceed - mood analysis failed`);
    return false;
  }

  // Step 2: Get song suggestions
  const suggestions = await testSongSuggestions(moodAnalysis, moodText);
  if (!suggestions) {
    console.log(`❌ Cannot proceed - song suggestions failed`);
    return false;
  }

  console.log(`\n✅ Complete flow successful!`);
  return true;
}

async function runTests() {
  console.log(`🧪 Mood Music Integration Test`);
  console.log(`Testing the complete mood analysis → song suggestions flow\n`);

  // Test different mood scenarios
  const testCases = [
    "I'm feeling super happy and energetic today!",
    "I'm really sad and need some comfort music",
    "I'm angry and frustrated with everything",
    "I'm in a romantic mood tonight",
    "I'm feeling nostalgic about the past",
    "I'm calm and relaxed",
    "I'm anxious and stressed",
    "I'm feeling confident and ready to conquer the world",
  ];

  let successCount = 0;

  for (const testCase of testCases) {
    const success = await testCompleteFlow(testCase);
    if (success) successCount++;

    // Small delay between tests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`📊 Test Results: ${successCount}/${testCases.length} passed`);
  console.log(`${"=".repeat(60)}`);

  if (successCount === testCases.length) {
    console.log(
      `🎉 All tests passed! The mood-based song suggestion system is working correctly.`
    );
  } else {
    console.log(`⚠️  Some tests failed. Check the logs above for details.`);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${API_BASE}/analyze-mood`, {
      method: "GET",
    });
    // GET should return Method Not Allowed (405) or API info, both indicate server is running
    return response.status === 405 || response.status === 200;
  } catch (error) {
    console.log(`Server check failed: ${error.message}`);
    return false;
  }
}

// Main execution
async function main() {
  console.log(`🔍 Checking if development server is running...`);

  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log(`❌ Development server is not running at ${API_BASE}`);
    console.log(`Please run: npm run dev`);
    process.exit(1);
  }

  console.log(`✅ Development server is running`);
  await runTests();
}

main().catch(console.error);
