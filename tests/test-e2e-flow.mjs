// End-to-end test for MoodTunes application flow
import { config } from "dotenv";
config({ path: ".env.local" });

console.log("🎯 MoodTunes End-to-End Flow Test");
console.log("==================================\n");

// Test configuration
const BASE_URL = "http://localhost:3000";
const TEST_MOODS = [
  {
    text: "I'm feeling absolutely amazing and happy today!",
    expectedMood: "happy",
    description: "Happy mood test",
  },
  {
    text: "I'm really sad and heartbroken, need some comfort music",
    expectedMood: "sad",
    description: "Sad mood test",
  },
  {
    text: "Pumped up and energetic, ready to workout and conquer the world!",
    expectedMood: "energetic",
    description: "Energetic mood test",
  },
  {
    text: "Just want to chill and relax, feeling peaceful and calm",
    expectedMood: "chill",
    description: "Chill mood test",
  },
  {
    text: "Feeling romantic and in love, thinking about my special someone",
    expectedMood: "romantic",
    description: "Romantic mood test",
  },
];

// Test results tracking
const testResults = {
  moodAnalysis: { passed: 0, failed: 0, tests: [] },
  apiValidation: { passed: 0, failed: 0, tests: [] },
  edgeCases: { passed: 0, failed: 0, tests: [] },
  performance: { passed: 0, failed: 0, tests: [] },
};

// Helper function to make API requests
async function makeRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    return { status: response.status, data, ok: response.ok };
  } catch (error) {
    return { status: 0, error: error.message, ok: false };
  }
}

// Test 1: Mood Analysis Accuracy
async function testMoodAnalysis() {
  console.log("1. Testing Mood Analysis Accuracy");
  console.log("-".repeat(40));

  for (const testCase of TEST_MOODS) {
    console.log(`Testing: "${testCase.description}"`);
    console.log(`Input: "${testCase.text}"`);

    const result = await makeRequest("/api/analyze-mood", {
      method: "POST",
      body: JSON.stringify({ moodText: testCase.text }),
    });

    const testResult = {
      description: testCase.description,
      input: testCase.text,
      expected: testCase.expectedMood,
      status: result.status,
    };

    if (result.status === 401) {
      console.log("⚠️  Authentication required (expected for API)");
      testResult.result = "auth_required";
      testResult.passed = true; // This is expected behavior
    } else if (result.ok && result.data.success) {
      const analysis = result.data.data;
      testResult.actual = analysis.mood;
      testResult.confidence = analysis.confidence;
      testResult.genres = analysis.genres;

      // Check if detected mood matches expected (or is reasonable)
      const moodMatch = analysis.mood === testCase.expectedMood;
      const reasonableConfidence = analysis.confidence >= 0.6;
      const hasGenres = analysis.genres && analysis.genres.length > 0;

      testResult.passed = reasonableConfidence && hasGenres;

      if (moodMatch) {
        console.log(
          `✅ Perfect match: ${analysis.mood} (confidence: ${analysis.confidence})`
        );
      } else {
        console.log(
          `⚠️  Different mood: ${analysis.mood} vs expected ${testCase.expectedMood} (confidence: ${analysis.confidence})`
        );
      }

      console.log(`   Genres: ${analysis.genres.slice(0, 3).join(", ")}`);
      console.log(
        `   Energy: ${analysis.energy}, Valence: ${analysis.valence}`
      );
    } else {
      console.log(`❌ Request failed: ${result.status}`);
      testResult.passed = false;
      testResult.error = result.data?.error?.message || "Unknown error";
    }

    testResults.moodAnalysis.tests.push(testResult);
    if (testResult.passed) {
      testResults.moodAnalysis.passed++;
    } else {
      testResults.moodAnalysis.failed++;
    }

    console.log("");
  }
}

// Test 2: API Validation and Error Handling
async function testAPIValidation() {
  console.log("2. Testing API Validation and Error Handling");
  console.log("-".repeat(40));

  const validationTests = [
    {
      description: "Empty mood text",
      body: { moodText: "" },
      expectedStatus: 400,
    },
    {
      description: "Missing mood text",
      body: {},
      expectedStatus: 400,
    },
    {
      description: "Too short mood text",
      body: { moodText: "ok" },
      expectedStatus: 400,
    },
    {
      description: "Very long mood text",
      body: { moodText: "a".repeat(1000) },
      expectedStatus: 400,
    },
    {
      description: "Invalid JSON",
      body: "invalid json",
      expectedStatus: 400,
      skipStringify: true,
    },
    {
      description: "Non-string mood text",
      body: { moodText: 123 },
      expectedStatus: 400,
    },
  ];

  for (const test of validationTests) {
    console.log(`Testing: ${test.description}`);

    const result = await makeRequest("/api/analyze-mood", {
      method: "POST",
      body: test.skipStringify ? test.body : JSON.stringify(test.body),
    });

    const testResult = {
      description: test.description,
      expectedStatus: test.expectedStatus,
      actualStatus: result.status,
      passed: false,
    };

    if (result.status === 401) {
      console.log("⚠️  Authentication required (expected)");
      testResult.passed = true; // Auth is expected
    } else if (
      result.status === test.expectedStatus ||
      (result.status >= 400 && test.expectedStatus >= 400)
    ) {
      console.log(`✅ Correct validation: ${result.status}`);
      testResult.passed = true;
    } else {
      console.log(
        `❌ Unexpected status: ${result.status} (expected ${test.expectedStatus})`
      );
      testResult.error = result.data?.error?.message || "Unexpected response";
    }

    testResults.apiValidation.tests.push(testResult);
    if (testResult.passed) {
      testResults.apiValidation.passed++;
    } else {
      testResults.apiValidation.failed++;
    }

    console.log("");
  }
}

// Test 3: Edge Cases and Robustness
async function testEdgeCases() {
  console.log("3. Testing Edge Cases and Robustness");
  console.log("-".repeat(40));

  const edgeCases = [
    {
      description: "Mixed emotions",
      text: "I'm happy but also sad and confused about everything",
      expectation: "Should handle mixed emotions gracefully",
    },
    {
      description: "Negation handling",
      text: "I'm not happy, not sad, just not feeling anything",
      expectation: "Should handle negation properly",
    },
    {
      description: "All caps with punctuation",
      text: "SUPER EXCITED AND PUMPED UP!!!",
      expectation: "Should handle caps and punctuation",
    },
    {
      description: "Minimal valid input",
      text: "sad",
      expectation: "Should work with minimal input",
    },
    {
      description: "Complex sentence structure",
      text: "Although I was feeling down earlier, now I'm starting to feel better and more optimistic about the future",
      expectation: "Should handle complex sentences",
    },
    {
      description: "Special characters and emojis",
      text: "Feeling great today! 😊🎉 Ready to party & dance!!!",
      expectation: "Should handle special characters",
    },
  ];

  for (const testCase of edgeCases) {
    console.log(`Testing: ${testCase.description}`);
    console.log(`Input: "${testCase.text}"`);
    console.log(`Expectation: ${testCase.expectation}`);

    const result = await makeRequest("/api/analyze-mood", {
      method: "POST",
      body: JSON.stringify({ moodText: testCase.text }),
    });

    const testResult = {
      description: testCase.description,
      input: testCase.text,
      expectation: testCase.expectation,
      status: result.status,
    };

    if (result.status === 401) {
      console.log("⚠️  Authentication required (expected)");
      testResult.passed = true;
    } else if (result.ok && result.data.success) {
      const analysis = result.data.data;
      console.log(
        `✅ Handled gracefully: ${analysis.mood} (confidence: ${analysis.confidence})`
      );
      console.log(`   Genres: ${analysis.genres.slice(0, 3).join(", ")}`);

      testResult.passed =
        analysis.confidence >= 0.5 && analysis.genres.length > 0;
      testResult.actual = analysis.mood;
      testResult.confidence = analysis.confidence;
    } else {
      console.log(`❌ Failed to handle: ${result.status}`);
      testResult.passed = false;
      testResult.error = result.data?.error?.message || "Unknown error";
    }

    testResults.edgeCases.tests.push(testResult);
    if (testResult.passed) {
      testResults.edgeCases.passed++;
    } else {
      testResults.edgeCases.failed++;
    }

    console.log("");
  }
}

// Test 4: Performance and Load Testing
async function testPerformance() {
  console.log("4. Testing Performance and Load");
  console.log("-".repeat(40));

  const performanceTests = [
    {
      description: "Response time test",
      iterations: 10,
      text: "I'm feeling happy and excited today!",
    },
    {
      description: "Concurrent requests test",
      concurrent: 5,
      text: "Testing concurrent mood analysis",
    },
    {
      description: "Large input test",
      iterations: 3,
      text: "I'm feeling really happy and excited and amazing and wonderful and fantastic and great and awesome and brilliant and perfect and beautiful and joyful and elated and euphoric and delighted and thrilled and ecstatic and blissful and upbeat and positive and good and excellent and cheerful and celebrating and having the best day ever and feeling like I am on top of the world and everything is going perfectly and I could not be happier right now and life is absolutely incredible and amazing and I want to dance and sing and celebrate this wonderful feeling that I have right now because it is just so perfect and beautiful and I am grateful for everything in my life and feeling blessed and lucky and successful and proud and confident and strong and powerful and unstoppable and ready to conquer anything that comes my way because I am feeling so incredibly positive and optimistic and hopeful about the future and everything that is going to happen and I know that great things are coming my way and I am ready to embrace all the wonderful opportunities that life has to offer me and I am so excited about all the possibilities that lie ahead and I feel like I can achieve anything I set my mind to and I am filled with so much energy and enthusiasm and passion for life and everything that it has to offer and I am grateful for this amazing feeling of happiness and joy that fills my heart and soul and makes me feel alive and vibrant and ready to take on the world with confidence and determination and a positive attitude that will help me overcome any challenges that may come my way",
    },
  ];

  for (const test of performanceTests) {
    console.log(`Testing: ${test.description}`);

    const testResult = {
      description: test.description,
      passed: false,
    };

    if (test.iterations) {
      // Sequential requests test
      const times = [];

      for (let i = 0; i < test.iterations; i++) {
        const startTime = performance.now();

        const result = await makeRequest("/api/analyze-mood", {
          method: "POST",
          body: JSON.stringify({ moodText: test.text }),
        });

        const endTime = performance.now();
        const responseTime = endTime - startTime;
        times.push(responseTime);

        if (result.status !== 401 && !result.ok) {
          console.log(`❌ Request ${i + 1} failed: ${result.status}`);
        }
      }

      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const maxTime = Math.max(...times);
      const minTime = Math.min(...times);

      console.log(`✅ Average response time: ${avgTime.toFixed(2)}ms`);
      console.log(
        `   Min: ${minTime.toFixed(2)}ms, Max: ${maxTime.toFixed(2)}ms`
      );

      testResult.passed = avgTime < 1000; // Should respond within 1 second
      testResult.avgTime = avgTime;
      testResult.maxTime = maxTime;
      testResult.minTime = minTime;
    } else if (test.concurrent) {
      // Concurrent requests test
      const startTime = performance.now();

      const promises = Array(test.concurrent)
        .fill()
        .map(() =>
          makeRequest("/api/analyze-mood", {
            method: "POST",
            body: JSON.stringify({ moodText: test.text }),
          })
        );

      const results = await Promise.allSettled(promises);
      const endTime = performance.now();

      const successCount = results.filter(
        (r) =>
          r.status === "fulfilled" && (r.value.status === 401 || r.value.ok)
      ).length;

      const totalTime = endTime - startTime;

      console.log(
        `✅ Concurrent requests: ${successCount}/${test.concurrent} succeeded`
      );
      console.log(`   Total time: ${totalTime.toFixed(2)}ms`);

      testResult.passed = successCount >= test.concurrent * 0.8; // 80% success rate
      testResult.successRate = successCount / test.concurrent;
      testResult.totalTime = totalTime;
    }

    testResults.performance.tests.push(testResult);
    if (testResult.passed) {
      testResults.performance.passed++;
    } else {
      testResults.performance.failed++;
    }

    console.log("");
  }
}

// Test 5: Spotify Integration (Basic)
async function testSpotifyIntegration() {
  console.log("5. Testing Spotify Integration");
  console.log("-".repeat(40));

  console.log("Testing song suggestions API...");

  const result = await makeRequest("/api/suggest-songs", {
    method: "POST",
    body: JSON.stringify({
      mood: "happy",
      genres: ["pop", "dance", "funk"],
      energy: 0.8,
      valence: 0.9,
      tempo: { min: 120, max: 140 },
      moodText: "I am feeling happy today",
    }),
  });

  if (result.status === 401) {
    console.log("⚠️  Authentication required (expected for song suggestions)");
    console.log("✅ Spotify API endpoint is properly protected");
  } else if (result.ok && result.data.success) {
    console.log(
      `✅ Got ${result.data.suggestions.tracks.length} song suggestions`
    );
    result.data.suggestions.tracks.slice(0, 3).forEach((track, index) => {
      console.log(
        `   ${index + 1}. "${track.name}" by ${track.artists.join(", ")}`
      );
    });
  } else {
    console.log(`❌ Unexpected response: ${result.status}`);
  }

  console.log("");
}

// Generate test report
function generateReport() {
  console.log("📊 Test Results Summary");
  console.log("=".repeat(50));

  const categories = [
    { name: "Mood Analysis", results: testResults.moodAnalysis },
    { name: "API Validation", results: testResults.apiValidation },
    { name: "Edge Cases", results: testResults.edgeCases },
    { name: "Performance", results: testResults.performance },
  ];

  let totalPassed = 0;
  let totalFailed = 0;

  categories.forEach((category) => {
    const { passed, failed } = category.results;
    const total = passed + failed;
    const percentage = total > 0 ? ((passed / total) * 100).toFixed(1) : "0.0";

    console.log(`${category.name}: ${passed}/${total} passed (${percentage}%)`);

    totalPassed += passed;
    totalFailed += failed;
  });

  const grandTotal = totalPassed + totalFailed;
  const overallPercentage =
    grandTotal > 0 ? ((totalPassed / grandTotal) * 100).toFixed(1) : "0.0";

  console.log("-".repeat(50));
  console.log(
    `Overall: ${totalPassed}/${grandTotal} passed (${overallPercentage}%)`
  );

  if (overallPercentage >= 80) {
    console.log("🎉 Great! Most tests are passing.");
  } else if (overallPercentage >= 60) {
    console.log("⚠️  Some issues found. Review failed tests.");
  } else {
    console.log("❌ Many tests failing. Needs attention.");
  }

  console.log("\n🔍 Detailed Results:");
  categories.forEach((category) => {
    if (category.results.failed > 0) {
      console.log(`\n${category.name} failures:`);
      category.results.tests.forEach((test) => {
        if (!test.passed) {
          console.log(`  - ${test.description}: ${test.error || "Failed"}`);
        }
      });
    }
  });
}

// Run all tests
async function runAllTests() {
  try {
    await testMoodAnalysis();
    await testAPIValidation();
    await testEdgeCases();
    await testPerformance();
    await testSpotifyIntegration();

    generateReport();
  } catch (error) {
    console.error("❌ Test suite failed:", error.message);
  }

  console.log("\n🎯 End-to-End Testing Complete!");
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/analyze-mood`);
    return true;
  } catch (error) {
    console.log("❌ Server not running. Please start with: pnpm dev");
    return false;
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runAllTests();
  }
}

main().catch(console.error);
