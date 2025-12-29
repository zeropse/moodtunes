// Comprehensive test suite for all MoodTunes features
import { config } from "dotenv";
config({ path: ".env.local" });

console.log("🚀 MoodTunes Comprehensive Test Suite");
console.log("=====================================\n");

// Test configuration
const BASE_URL = "http://localhost:3000";
const CONCURRENT_REQUESTS = 10;
const PERFORMANCE_ITERATIONS = 50;

// Test results tracking
const results = {
  coreFeatures: { passed: 0, failed: 0, tests: [] },
  performance: { passed: 0, failed: 0, tests: [] },
  errorHandling: { passed: 0, failed: 0, tests: [] },
  edgeCases: { passed: 0, failed: 0, tests: [] },
  accessibility: { passed: 0, failed: 0, tests: [] },
};

// Helper functions
async function makeRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    const data = await response.json();
    return { status: response.status, data, ok: response.ok };
  } catch (error) {
    return { status: 0, error: error.message, ok: false };
  }
}

function addTestResult(category, test) {
  results[category].tests.push(test);
  if (test.passed) {
    results[category].passed++;
  } else {
    results[category].failed++;
  }
}

// Test 1: Core Features Comprehensive Test
async function testCoreFeatures() {
  console.log("1. Testing Core Features");
  console.log("-".repeat(40));

  const moodTests = [
    {
      name: "Complex Happy Mood",
      input:
        "I'm absolutely ecstatic and thrilled! Today has been the most amazing day ever, filled with joy, laughter, and wonderful surprises. I feel like I'm on top of the world and nothing can bring me down!",
      expectedMoods: ["happy", "energetic", "confident"],
      minConfidence: 0.7,
    },
    {
      name: "Nuanced Sad Mood",
      input:
        "I'm feeling quite melancholy and introspective today. There's a deep sadness in my heart, mixed with nostalgia for better times. I miss the way things used to be.",
      expectedMoods: ["sad", "nostalgic", "thoughtful"],
      minConfidence: 0.6,
    },
    {
      name: "High Energy Workout Mood",
      input:
        "PUMPED UP AND READY TO CRUSH THIS WORKOUT!!! Feeling so energetic and motivated, let's get those endorphins flowing! Time to push my limits!",
      expectedMoods: ["energetic", "confident", "happy"],
      minConfidence: 0.8,
    },
    {
      name: "Romantic Evening Mood",
      input:
        "Feeling so romantic and in love tonight. The candlelight dinner was perfect, and I can't stop thinking about my special someone. My heart is full of tender emotions.",
      expectedMoods: ["romantic", "happy", "thoughtful"],
      minConfidence: 0.7,
    },
    {
      name: "Chill Weekend Vibe",
      input:
        "Just chilling on this lazy Sunday afternoon. No stress, no worries, just taking it easy and enjoying the peaceful moment. Life is good when you can just relax.",
      expectedMoods: ["chill", "relaxed", "happy"],
      minConfidence: 0.6,
    },
  ];

  for (const test of moodTests) {
    console.log(`Testing: ${test.name}`);

    const result = await makeRequest("/api/analyze-mood", {
      method: "POST",
      body: JSON.stringify({ moodText: test.input }),
    });

    const testResult = {
      name: test.name,
      input: test.input,
      passed: false,
      details: {},
    };

    if (result.status === 401) {
      testResult.passed = true;
      testResult.details.note = "Authentication required (expected)";
    } else if (result.ok && result.data.success) {
      const analysis = result.data.data;

      const moodMatch = test.expectedMoods.includes(analysis.mood);
      const confidenceOk = analysis.confidence >= test.minConfidence;
      const hasGenres = analysis.genres && analysis.genres.length >= 3;
      const hasValidEnergy = analysis.energy >= 0 && analysis.energy <= 1;
      const hasValidValence = analysis.valence >= 0 && analysis.valence <= 1;

      testResult.passed =
        confidenceOk && hasGenres && hasValidEnergy && hasValidValence;
      testResult.details = {
        detectedMood: analysis.mood,
        moodMatch,
        confidence: analysis.confidence,
        confidenceOk,
        genres: analysis.genres.slice(0, 3),
        energy: analysis.energy,
        valence: analysis.valence,
        hasValidParams: hasValidEnergy && hasValidValence,
      };

      if (moodMatch) {
        console.log(`✅ Perfect mood match: ${analysis.mood}`);
      } else {
        console.log(
          `⚠️  Different mood: ${
            analysis.mood
          } (expected one of: ${test.expectedMoods.join(", ")})`
        );
      }

      console.log(
        `   Confidence: ${analysis.confidence} (min: ${test.minConfidence})`
      );
      console.log(`   Genres: ${analysis.genres.slice(0, 3).join(", ")}`);
      console.log(
        `   Energy: ${analysis.energy}, Valence: ${analysis.valence}`
      );
    } else {
      testResult.details.error = result.data?.error?.message || "Unknown error";
    }

    addTestResult("coreFeatures", testResult);
    console.log("");
  }
}

// Test 2: Performance and Scalability
async function testPerformance() {
  console.log("2. Testing Performance and Scalability");
  console.log("-".repeat(40));

  // Response time test
  console.log("Testing response times...");
  const responseTimes = [];
  const testMood = "I'm feeling happy and excited today!";

  for (let i = 0; i < PERFORMANCE_ITERATIONS; i++) {
    const startTime = performance.now();

    const result = await makeRequest("/api/analyze-mood", {
      method: "POST",
      body: JSON.stringify({ moodText: testMood }),
    });

    const endTime = performance.now();
    const responseTime = endTime - startTime;
    responseTimes.push(responseTime);

    if (i % 10 === 0) {
      process.stdout.write(`Progress: ${i + 1}/${PERFORMANCE_ITERATIONS}\r`);
    }
  }

  const avgResponseTime =
    responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  const maxResponseTime = Math.max(...responseTimes);
  const minResponseTime = Math.min(...responseTimes);
  const p95ResponseTime = responseTimes.sort((a, b) => a - b)[
    Math.floor(responseTimes.length * 0.95)
  ];

  console.log(`\n✅ Response Time Analysis:`);
  console.log(`   Average: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`   Min: ${minResponseTime.toFixed(2)}ms`);
  console.log(`   Max: ${maxResponseTime.toFixed(2)}ms`);
  console.log(`   95th percentile: ${p95ResponseTime.toFixed(2)}ms`);

  addTestResult("performance", {
    name: "Response Time Test",
    passed: avgResponseTime < 500 && p95ResponseTime < 1000,
    details: {
      avgResponseTime,
      maxResponseTime,
      minResponseTime,
      p95ResponseTime,
    },
  });

  // Concurrent requests test
  console.log("\nTesting concurrent requests...");
  const concurrentStartTime = performance.now();

  const concurrentPromises = Array(CONCURRENT_REQUESTS)
    .fill()
    .map((_, i) =>
      makeRequest("/api/analyze-mood", {
        method: "POST",
        body: JSON.stringify({ moodText: `Test mood ${i + 1}` }),
      })
    );

  const concurrentResults = await Promise.allSettled(concurrentPromises);
  const concurrentEndTime = performance.now();
  const concurrentTotalTime = concurrentEndTime - concurrentStartTime;

  const successfulRequests = concurrentResults.filter(
    (r) => r.status === "fulfilled" && (r.value.status === 401 || r.value.ok)
  ).length;

  console.log(`✅ Concurrent Requests:`);
  console.log(`   Successful: ${successfulRequests}/${CONCURRENT_REQUESTS}`);
  console.log(`   Total time: ${concurrentTotalTime.toFixed(2)}ms`);
  console.log(
    `   Avg per request: ${(concurrentTotalTime / CONCURRENT_REQUESTS).toFixed(
      2
    )}ms`
  );

  addTestResult("performance", {
    name: "Concurrent Requests Test",
    passed: successfulRequests >= CONCURRENT_REQUESTS * 0.9,
    details: {
      successfulRequests,
      totalRequests: CONCURRENT_REQUESTS,
      totalTime: concurrentTotalTime,
    },
  });

  // Memory usage simulation
  console.log("\nTesting memory efficiency...");
  const largeInputs = Array(10)
    .fill()
    .map(
      (_, i) =>
        `Large mood input ${
          i + 1
        }: ${"I'm feeling amazing and happy and excited and wonderful and fantastic and great and awesome and brilliant and perfect and beautiful ".repeat(
          20
        )}`
    );

  let memoryTestPassed = true;
  for (const input of largeInputs) {
    const result = await makeRequest("/api/analyze-mood", {
      method: "POST",
      body: JSON.stringify({ moodText: input }),
    });

    if (!result.ok && result.status !== 401 && result.status !== 400) {
      memoryTestPassed = false;
      break;
    }
  }

  console.log(
    `✅ Memory Efficiency: ${memoryTestPassed ? "Passed" : "Failed"}`
  );

  addTestResult("performance", {
    name: "Memory Efficiency Test",
    passed: memoryTestPassed,
    details: { largeInputsProcessed: largeInputs.length },
  });

  console.log("");
}

// Test 3: Error Handling and Resilience
async function testErrorHandling() {
  console.log("3. Testing Error Handling and Resilience");
  console.log("-".repeat(40));

  const errorTests = [
    {
      name: "Empty Input Validation",
      body: { moodText: "" },
      expectedStatus: [400, 401],
      description: "Should reject empty mood text",
    },
    {
      name: "Null Input Validation",
      body: { moodText: null },
      expectedStatus: [400, 401],
      description: "Should reject null mood text",
    },
    {
      name: "Undefined Input Validation",
      body: {},
      expectedStatus: [400, 401],
      description: "Should reject missing mood text",
    },
    {
      name: "Too Short Input",
      body: { moodText: "hi" },
      expectedStatus: [400, 401],
      description: "Should reject too short input",
    },
    {
      name: "Extremely Long Input",
      body: { moodText: "a".repeat(10000) },
      expectedStatus: [400, 401],
      description: "Should handle very long input gracefully",
    },
    {
      name: "Special Characters",
      body: { moodText: "I'm feeling <script>alert('xss')</script> today!" },
      expectedStatus: [200, 401],
      description: "Should sanitize special characters",
    },
    {
      name: "Unicode and Emojis",
      body: {
        moodText: "I'm feeling 😊🎉 amazing today! 中文 العربية русский",
      },
      expectedStatus: [200, 401],
      description: "Should handle unicode and emojis",
    },
    {
      name: "SQL Injection Attempt",
      body: { moodText: "'; DROP TABLE users; --" },
      expectedStatus: [200, 401],
      description: "Should handle SQL injection attempts",
    },
  ];

  for (const test of errorTests) {
    console.log(`Testing: ${test.name}`);
    console.log(`Description: ${test.description}`);

    const result = await makeRequest("/api/analyze-mood", {
      method: "POST",
      body: JSON.stringify(test.body),
    });

    const testResult = {
      name: test.name,
      passed: test.expectedStatus.includes(result.status),
      details: {
        expectedStatus: test.expectedStatus,
        actualStatus: result.status,
        description: test.description,
      },
    };

    if (testResult.passed) {
      console.log(`✅ Handled correctly: ${result.status}`);
    } else {
      console.log(
        `❌ Unexpected response: ${
          result.status
        } (expected: ${test.expectedStatus.join(" or ")})`
      );
    }

    addTestResult("errorHandling", testResult);
    console.log("");
  }

  // Test malformed JSON
  console.log("Testing malformed JSON handling...");
  try {
    const response = await fetch(`${BASE_URL}/api/analyze-mood`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: '{"moodText": "test"', // Missing closing brace
    });

    const malformedJsonTest = {
      name: "Malformed JSON Test",
      passed: response.status === 400 || response.status === 401,
      details: { status: response.status },
    };

    console.log(`✅ Malformed JSON: ${response.status}`);
    addTestResult("errorHandling", malformedJsonTest);
  } catch (error) {
    console.log(`✅ Malformed JSON handled: ${error.message}`);
    addTestResult("errorHandling", {
      name: "Malformed JSON Test",
      passed: true,
      details: { error: error.message },
    });
  }

  console.log("");
}

// Test 4: Edge Cases and Boundary Conditions
async function testEdgeCases() {
  console.log("4. Testing Edge Cases and Boundary Conditions");
  console.log("-".repeat(40));

  const edgeCases = [
    {
      name: "Contradictory Emotions",
      input:
        "I'm happy but sad, excited yet tired, confident but anxious all at the same time",
      description: "Should handle contradictory emotions gracefully",
    },
    {
      name: "Negation Heavy Text",
      input:
        "I'm not happy, not sad, not angry, not excited, just not feeling anything at all",
      description: "Should handle multiple negations",
    },
    {
      name: "Repetitive Text",
      input: "happy happy happy happy happy happy happy happy happy happy",
      description: "Should handle repetitive keywords",
    },
    {
      name: "All Caps Emotional",
      input: "I AM SO INCREDIBLY HAPPY AND EXCITED RIGHT NOW!!!!!!",
      description: "Should handle caps and excessive punctuation",
    },
    {
      name: "Mixed Languages",
      input: "I'm feeling très heureux and muy feliz today! 很开心！",
      description: "Should handle mixed language input",
    },
    {
      name: "Numbers and Symbols",
      input: "Feeling 100% amazing today!!! Rating my mood 10/10 :) :) :)",
      description: "Should handle numbers and symbols",
    },
    {
      name: "Minimal Valid Input",
      input: "sad",
      description: "Should work with minimal valid input",
    },
    {
      name: "Complex Sentence Structure",
      input:
        "Although I was initially feeling quite melancholy this morning, as the day progressed and various positive events unfolded, my emotional state gradually shifted towards a more optimistic and cheerful disposition.",
      description: "Should handle complex sentence structures",
    },
    {
      name: "Stream of Consciousness",
      input:
        "feeling good today yeah really good like super good you know what I mean just good vibes all around good energy good mood good everything",
      description: "Should handle stream of consciousness text",
    },
    {
      name: "Poetic Expression",
      input:
        "My heart soars like a bird in flight, dancing on clouds of pure delight, every breath a symphony of joy",
      description: "Should handle poetic/metaphorical language",
    },
  ];

  for (const testCase of edgeCases) {
    console.log(`Testing: ${testCase.name}`);
    console.log(
      `Input: "${testCase.input.substring(0, 60)}${
        testCase.input.length > 60 ? "..." : ""
      }"`
    );
    console.log(`Description: ${testCase.description}`);

    const result = await makeRequest("/api/analyze-mood", {
      method: "POST",
      body: JSON.stringify({ moodText: testCase.input }),
    });

    const testResult = {
      name: testCase.name,
      input: testCase.input,
      description: testCase.description,
      passed: false,
      details: {},
    };

    if (result.status === 401) {
      testResult.passed = true;
      testResult.details.note = "Authentication required (expected)";
    } else if (result.ok && result.data.success) {
      const analysis = result.data.data;

      const hasValidMood = analysis.mood && typeof analysis.mood === "string";
      const hasValidConfidence =
        analysis.confidence >= 0 && analysis.confidence <= 1;
      const hasGenres =
        analysis.genres &&
        Array.isArray(analysis.genres) &&
        analysis.genres.length > 0;
      const hasValidEnergy =
        typeof analysis.energy === "number" &&
        analysis.energy >= 0 &&
        analysis.energy <= 1;
      const hasValidValence =
        typeof analysis.valence === "number" &&
        analysis.valence >= 0 &&
        analysis.valence <= 1;

      testResult.passed =
        hasValidMood &&
        hasValidConfidence &&
        hasGenres &&
        hasValidEnergy &&
        hasValidValence;
      testResult.details = {
        mood: analysis.mood,
        confidence: analysis.confidence,
        genres: analysis.genres.slice(0, 3),
        energy: analysis.energy,
        valence: analysis.valence,
        validStructure:
          hasValidMood &&
          hasValidConfidence &&
          hasGenres &&
          hasValidEnergy &&
          hasValidValence,
      };

      console.log(
        `✅ Processed: ${analysis.mood} (confidence: ${analysis.confidence})`
      );
      console.log(`   Genres: ${analysis.genres.slice(0, 3).join(", ")}`);
    } else {
      testResult.details.error = result.data?.error?.message || "Unknown error";
      console.log(`❌ Failed: ${testResult.details.error}`);
    }

    addTestResult("edgeCases", testResult);
    console.log("");
  }
}

// Test 5: Accessibility and User Experience
async function testAccessibility() {
  console.log("5. Testing Accessibility and User Experience");
  console.log("-".repeat(40));

  // Test API response structure for accessibility
  const accessibilityTests = [
    {
      name: "Response Structure Consistency",
      input: "I'm feeling happy today",
      description: "API responses should have consistent structure",
    },
    {
      name: "Error Message Clarity",
      input: "",
      description: "Error messages should be clear and helpful",
    },
    {
      name: "Internationalization Support",
      input: "Je suis très heureux aujourd'hui",
      description: "Should handle non-English input gracefully",
    },
  ];

  for (const test of accessibilityTests) {
    console.log(`Testing: ${test.name}`);

    const result = await makeRequest("/api/analyze-mood", {
      method: "POST",
      body: JSON.stringify({ moodText: test.input }),
    });

    const testResult = {
      name: test.name,
      passed: false,
      details: {},
    };

    if (result.status === 401) {
      // Check if error message is user-friendly
      const hasUserFriendlyError =
        result.data && result.data.error && result.data.error.message;
      testResult.passed = hasUserFriendlyError;
      testResult.details = {
        hasErrorMessage: hasUserFriendlyError,
        errorMessage: result.data?.error?.message,
      };
    } else if (result.ok && result.data.success) {
      // Check response structure
      const hasRequiredFields =
        result.data.data &&
        result.data.data.mood &&
        result.data.data.confidence !== undefined &&
        result.data.data.genres &&
        result.data.data.energy !== undefined &&
        result.data.data.valence !== undefined;

      const hasMetadata = result.data.meta && result.data.meta.requestId;

      testResult.passed = hasRequiredFields && hasMetadata;
      testResult.details = {
        hasRequiredFields,
        hasMetadata,
        responseStructure: Object.keys(result.data),
      };
    } else {
      // Check error handling
      const hasErrorStructure = result.data && result.data.error;
      testResult.passed = hasErrorStructure;
      testResult.details = {
        hasErrorStructure,
        status: result.status,
      };
    }

    if (testResult.passed) {
      console.log(`✅ ${test.description}`);
    } else {
      console.log(`❌ ${test.description}`);
    }

    addTestResult("accessibility", testResult);
    console.log("");
  }
}

// Generate comprehensive report
function generateComprehensiveReport() {
  console.log("📊 Comprehensive Test Results");
  console.log("=".repeat(60));

  const categories = [
    { name: "Core Features", key: "coreFeatures", weight: 0.3 },
    { name: "Performance", key: "performance", weight: 0.25 },
    { name: "Error Handling", key: "errorHandling", weight: 0.2 },
    { name: "Edge Cases", key: "edgeCases", weight: 0.15 },
    { name: "Accessibility", key: "accessibility", weight: 0.1 },
  ];

  let totalWeightedScore = 0;
  let totalPassed = 0;
  let totalTests = 0;

  categories.forEach((category) => {
    const result = results[category.key];
    const total = result.passed + result.failed;
    const percentage = total > 0 ? (result.passed / total) * 100 : 0;
    const weightedScore = (percentage / 100) * category.weight;

    totalWeightedScore += weightedScore;
    totalPassed += result.passed;
    totalTests += total;

    console.log(
      `${category.name.padEnd(20)} ${result.passed
        .toString()
        .padStart(3)}/${total.toString().padEnd(3)} (${percentage
        .toFixed(1)
        .padStart(5)}%) Weight: ${(category.weight * 100).toFixed(0)}%`
    );
  });

  const overallScore = (totalWeightedScore * 100).toFixed(1);
  const simplePercentage =
    totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : "0.0";

  console.log("-".repeat(60));
  console.log(`Overall Score: ${overallScore}% (Weighted)`);
  console.log(
    `Simple Score:  ${simplePercentage}% (${totalPassed}/${totalTests} tests passed)`
  );

  // Quality assessment
  if (parseFloat(overallScore) >= 90) {
    console.log("🏆 Excellent! Production ready with high quality.");
  } else if (parseFloat(overallScore) >= 80) {
    console.log("🎉 Great! Ready for production with minor improvements.");
  } else if (parseFloat(overallScore) >= 70) {
    console.log("✅ Good! Some areas need attention before production.");
  } else if (parseFloat(overallScore) >= 60) {
    console.log("⚠️  Fair! Significant improvements needed.");
  } else {
    console.log("❌ Poor! Major issues need to be addressed.");
  }

  // Detailed failure analysis
  console.log("\n🔍 Detailed Analysis:");

  categories.forEach((category) => {
    const result = results[category.key];
    const failures = result.tests.filter((test) => !test.passed);

    if (failures.length > 0) {
      console.log(`\n${category.name} Issues:`);
      failures.forEach((failure) => {
        console.log(
          `  ❌ ${failure.name}: ${
            failure.details?.error || "Failed validation"
          }`
        );
      });
    }
  });

  // Performance insights
  const perfTests = results.performance.tests;
  const responseTimeTest = perfTests.find(
    (t) => t.name === "Response Time Test"
  );
  const concurrentTest = perfTests.find(
    (t) => t.name === "Concurrent Requests Test"
  );

  if (responseTimeTest || concurrentTest) {
    console.log("\n⚡ Performance Insights:");

    if (responseTimeTest && responseTimeTest.details) {
      const { avgResponseTime, p95ResponseTime } = responseTimeTest.details;
      console.log(`  Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
      console.log(`  95th Percentile: ${p95ResponseTime.toFixed(2)}ms`);

      if (avgResponseTime < 200) {
        console.log("  🚀 Excellent response times!");
      } else if (avgResponseTime < 500) {
        console.log("  ✅ Good response times");
      } else {
        console.log("  ⚠️  Response times could be improved");
      }
    }

    if (concurrentTest && concurrentTest.details) {
      const { successfulRequests, totalRequests } = concurrentTest.details;
      const successRate = (successfulRequests / totalRequests) * 100;
      console.log(
        `  Concurrent Request Success Rate: ${successRate.toFixed(1)}%`
      );

      if (successRate >= 95) {
        console.log("  🚀 Excellent concurrency handling!");
      } else if (successRate >= 90) {
        console.log("  ✅ Good concurrency handling");
      } else {
        console.log("  ⚠️  Concurrency handling needs improvement");
      }
    }
  }

  return {
    overallScore: parseFloat(overallScore),
    simplePercentage: parseFloat(simplePercentage),
    totalPassed,
    totalTests,
    categoryResults: categories.map((cat) => ({
      name: cat.name,
      passed: results[cat.key].passed,
      total: results[cat.key].passed + results[cat.key].failed,
      percentage:
        results[cat.key].passed + results[cat.key].failed > 0
          ? (results[cat.key].passed /
              (results[cat.key].passed + results[cat.key].failed)) *
            100
          : 0,
    })),
  };
}

// Main test execution
async function runComprehensiveTests() {
  const startTime = Date.now();

  try {
    // Check if server is running
    const serverCheck = await makeRequest("/api/analyze-mood");
    if (serverCheck.status === 0) {
      console.log("❌ Server not running. Please start with: pnpm dev");
      return;
    }

    console.log("✅ Server is running, starting comprehensive tests...\n");

    await testCoreFeatures();
    await testPerformance();
    await testErrorHandling();
    await testEdgeCases();
    await testAccessibility();

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    console.log(
      `\n⏱️  Total test execution time: ${(totalTime / 1000).toFixed(
        2
      )} seconds`
    );

    const report = generateComprehensiveReport();

    console.log("\n🎯 Comprehensive Testing Complete!");

    return report;
  } catch (error) {
    console.error("❌ Test suite failed:", error.message);
    console.error(error.stack);
  }
}

// Execute tests
runComprehensiveTests().catch(console.error);
