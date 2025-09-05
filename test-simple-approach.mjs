#!/usr/bin/env node

/**
 * Test script for the new simplified approach:
 * 10 songs from each genre in random order
 */

const API_BASE = "http://localhost:3000/api";

async function testSimplifiedApproach(moodText) {
  console.log(`\n🎭 Testing: "${moodText}"`);
  console.log("=".repeat(60));

  try {
    // Step 1: Analyze mood
    console.log("1️⃣ Analyzing mood...");
    const moodResponse = await fetch(`${API_BASE}/analyze-mood`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moodText }),
    });

    if (!moodResponse.ok) {
      throw new Error(`Mood analysis failed: ${moodResponse.status}`);
    }

    const moodResult = await moodResponse.json();
    const moodData = moodResult.data;

    console.log(`   ✅ Detected mood: ${moodData.mood}`);
    console.log(`   📊 Confidence: ${(moodData.confidence * 100).toFixed(1)}%`);
    console.log(`   🎵 Genres: ${moodData.genres.join(", ")}`);

    // Step 2: Get song suggestions using simplified approach
    console.log("\n2️⃣ Getting 10 songs from each genre in random order...");
    const songsResponse = await fetch(`${API_BASE}/suggest-songs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mood: moodData.mood,
        genres: moodData.genres,
        energy: moodData.energy,
        valence: moodData.valence,
        tempo: moodData.tempo,
        moodText: moodText,
      }),
    });

    if (!songsResponse.ok) {
      throw new Error(`Song suggestions failed: ${songsResponse.status}`);
    }

    const songsResult = await songsResponse.json();

    if (songsResult.warning) {
      console.log(`   ⚠️  ${songsResult.warning}`);
    }

    const suggestions = songsResult.suggestions;
    console.log(`   ✅ Found ${suggestions.totalTracks} tracks total`);
    console.log(
      `   🎼 Searched genres: ${suggestions.seedGenres?.join(", ") || "N/A"}`
    );

    if (suggestions.tracks && suggestions.tracks.length > 0) {
      console.log(`\n🎵 Random selection of songs (first 10):`);

      // Group tracks by source genre to show variety
      const tracksByGenre = {};
      suggestions.tracks.forEach((track) => {
        const genre = track.sourceGenre || "unknown";
        if (!tracksByGenre[genre]) {
          tracksByGenre[genre] = [];
        }
        tracksByGenre[genre].push(track);
      });

      // Show distribution
      console.log(`\n📊 Distribution by genre:`);
      Object.entries(tracksByGenre).forEach(([genre, tracks]) => {
        console.log(`   ${genre}: ${tracks.length} tracks`);
      });

      console.log(`\n🎤 Random song list:`);
      suggestions.tracks.slice(0, 10).forEach((track, index) => {
        const artists = Array.isArray(track.artists)
          ? track.artists.join(", ")
          : track.artists;
        const genre = track.sourceGenre ? ` [${track.sourceGenre}]` : "";
        console.log(`   ${index + 1}. ${track.name} - ${artists}${genre}`);
      });
    }

    return true;
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function runSimpleTests() {
  console.log(
    `🎵 Testing Simplified Approach: 10 Songs per Genre in Random Order\n`
  );

  const testCases = [
    "I'm feeling super happy and want to dance!",
    "I'm really sad and heartbroken",
    "I'm feeling energetic and pumped up",
  ];

  let successCount = 0;

  for (const testCase of testCases) {
    const success = await testSimplifiedApproach(testCase);
    if (success) successCount++;

    // Small delay between tests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(`\n${"=".repeat(70)}`);
  console.log(`📊 Test Results: ${successCount}/${testCases.length} passed`);
  console.log(`${"=".repeat(70)}`);

  if (successCount === testCases.length) {
    console.log(`🎉 All tests passed! Simplified approach working correctly!`);
  } else {
    console.log(`⚠️  Some tests failed. Check the logs above.`);
  }
}

// Run the tests
runSimpleTests().catch(console.error);
