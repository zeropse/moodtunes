#!/usr/bin/env node

/**
 * Simple test to verify the improved mood-based song suggestions
 */

const API_BASE = "http://localhost:3000/api";

async function testMoodToSongs(moodText) {
  console.log(`\n🎭 Testing: "${moodText}"`);
  console.log("=".repeat(50));

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
    console.log(`   🎵 Available genres: ${moodData.genres.join(", ")}`);
    console.log(
      `   ⚡ Energy: ${moodData.energy} | 😊 Valence: ${moodData.valence}`
    );

    // Step 2: Get song suggestions
    console.log("\n2️⃣ Getting song suggestions...");
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
    console.log(`   ✅ Found ${suggestions.totalTracks} tracks`);
    console.log(
      `   🎼 Selected genre: ${
        suggestions.selectedGenre || suggestions.seedGenres?.[0] || "N/A"
      }`
    );
    console.log(
      `   🌟 Seed genres: ${suggestions.seedGenres?.join(", ") || "N/A"}`
    );

    if (suggestions.tracks && suggestions.tracks.length > 0) {
      console.log(`\n🎵 Top 5 song suggestions:`);
      suggestions.tracks.slice(0, 5).forEach((track, index) => {
        const artists = Array.isArray(track.artists)
          ? track.artists.join(", ")
          : track.artists;
        const score = track.moodScore ? ` (Score: ${track.moodScore})` : "";
        console.log(`   ${index + 1}. ${track.name} - ${artists}${score}`);
      });
    }

    return true;
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log(`🎵 Testing New Mood-Based Song Suggestions`);
  console.log(
    `Using direct genre search (no deprecated recommendations API)\n`
  );

  const testCases = [
    "I'm feeling super happy and want to dance!",
    "I'm really sad and heartbroken",
    "I'm angry and need to let off steam",
    "I'm relaxed and want to chill",
    "I'm feeling energetic and pumped up",
  ];

  let successCount = 0;

  for (const testCase of testCases) {
    const success = await testMoodToSongs(testCase);
    if (success) successCount++;

    // Small delay between tests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`📊 Test Results: ${successCount}/${testCases.length} passed`);
  console.log(`${"=".repeat(60)}`);

  if (successCount === testCases.length) {
    console.log(
      `🎉 All tests passed! Genre-based song suggestions are working!`
    );
  } else {
    console.log(`⚠️  Some tests failed. Check the logs above.`);
  }
}

// Run the tests
runTests().catch(console.error);
