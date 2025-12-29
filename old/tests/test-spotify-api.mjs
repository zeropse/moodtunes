// Test Spotify API integration
// Using built-in fetch (Node.js 18+)

// Test Spotify API credentials and basic functionality
async function testSpotifyAPI() {
  console.log("🎵 Testing Spotify API Integration\n");

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.log("❌ Spotify credentials not found in environment");
    console.log("   SPOTIFY_CLIENT_ID:", clientId ? "Set" : "Missing");
    console.log("   SPOTIFY_CLIENT_SECRET:", clientSecret ? "Set" : "Missing");
    return;
  }

  console.log("✅ Spotify credentials found");
  console.log("   Client ID:", clientId.substring(0, 8) + "...");

  try {
    // Test getting access token
    console.log("\n🔑 Testing access token...");

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );

    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );

    if (!tokenResponse.ok) {
      console.log(`❌ Token request failed: ${tokenResponse.status}`);
      const errorText = await tokenResponse.text();
      console.log("   Error:", errorText);
      return;
    }

    const tokenData = await tokenResponse.json();
    console.log("✅ Access token obtained successfully");
    console.log("   Token type:", tokenData.token_type);
    console.log("   Expires in:", tokenData.expires_in, "seconds");

    // Test search functionality
    console.log("\n🔍 Testing search functionality...");

    const searchQueries = [
      'genre:"pop"',
      'genre:"electronic"',
      'genre:"indie"',
      'genre:"jazz"',
      "happy",
      "sad songs",
    ];

    for (const query of searchQueries) {
      console.log(`\nSearching for: "${query}"`);

      const searchResponse = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=track&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        }
      );

      if (!searchResponse.ok) {
        console.log(`❌ Search failed: ${searchResponse.status}`);
        continue;
      }

      const searchData = await searchResponse.json();
      const tracks = searchData.tracks?.items || [];

      console.log(`✅ Found ${tracks.length} tracks`);

      tracks.slice(0, 3).forEach((track, index) => {
        console.log(
          `   ${index + 1}. "${track.name}" by ${track.artists
            .map((a) => a.name)
            .join(", ")}`
        );
        console.log(`      Album: ${track.album.name}`);
        console.log(
          `      Duration: ${Math.floor(track.duration_ms / 60000)}:${String(
            Math.floor((track.duration_ms % 60000) / 1000)
          ).padStart(2, "0")}`
        );
        console.log(`      Popularity: ${track.popularity}`);
      });
    }

    // Test rate limiting behavior
    console.log("\n⚡ Testing rate limiting...");

    const rapidRequests = [];
    for (let i = 0; i < 5; i++) {
      rapidRequests.push(
        fetch(`https://api.spotify.com/v1/search?q=test&type=track&limit=1`, {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        })
      );
    }

    const rapidResults = await Promise.allSettled(rapidRequests);
    const successCount = rapidResults.filter(
      (r) => r.status === "fulfilled" && r.value.ok
    ).length;
    const failCount = rapidResults.length - successCount;

    console.log(
      `✅ Rapid requests: ${successCount} succeeded, ${failCount} failed`
    );

    if (failCount > 0) {
      console.log(
        "   Some requests may have been rate limited (this is normal)"
      );
    }
  } catch (error) {
    console.log(`❌ Error testing Spotify API: ${error.message}`);
  }
}

// Test our app's Spotify integration
async function testAppSpotifyIntegration() {
  console.log("\n🎯 Testing App Spotify Integration\n");

  const testMoods = [
    {
      mood: "happy",
      genres: ["pop", "dance", "funk"],
      energy: 0.8,
      valence: 0.9,
      tempo: { min: 120, max: 140 },
    },
    {
      mood: "sad",
      genres: ["blues", "indie", "folk"],
      energy: 0.3,
      valence: 0.2,
      tempo: { min: 60, max: 90 },
    },
    {
      mood: "energetic",
      genres: ["electronic", "edm", "techno"],
      energy: 0.95,
      valence: 0.7,
      tempo: { min: 128, max: 160 },
    },
  ];

  for (const moodData of testMoods) {
    console.log(`Testing ${moodData.mood} mood suggestions...`);

    try {
      const response = await fetch("http://localhost:3000/api/suggest-songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mood: moodData.mood,
          genres: moodData.genres,
          energy: moodData.energy,
          valence: moodData.valence,
          tempo: moodData.tempo,
          moodText: `I'm feeling ${moodData.mood} today`,
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
        console.log("⚠️  Authentication required (expected)");
      } else if (response.ok && result.success) {
        console.log(
          `✅ Got ${result.suggestions.tracks.length} song suggestions`
        );
        result.suggestions.tracks.slice(0, 2).forEach((track, index) => {
          console.log(
            `   ${index + 1}. "${track.name}" by ${track.artists.join(", ")}`
          );
        });
      } else {
        console.log(`❌ Request failed: ${response.status}`);
        console.log("   Error:", result.error?.message || "Unknown error");
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }

    console.log("-".repeat(40));
  }
}

// Load environment variables
import { config } from "dotenv";
config({ path: ".env.local" });

// Run tests
async function runAllTests() {
  await testSpotifyAPI();
  await testAppSpotifyIntegration();
  console.log("\n🎵 Spotify API Tests Complete!");
}

runAllTests().catch(console.error);
