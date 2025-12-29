import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  analyzeMoodFromText,
  sanitizeInput,
  getAvailableMoods,
  getMoodCategories,
} from "@/lib/mood-analyzer";

function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function createErrorResponse(message, statusCode = 500) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message: message,
        code: "API_ERROR",
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    },
    { status: statusCode }
  );
}

export async function POST(request) {
  const requestId = generateRequestId();
  const startTime = Date.now();

  try {
    // Check authentication
    const { userId } = await auth();

    if (!userId) {
      return createErrorResponse("Authentication required", 401);
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Invalid JSON in request body", {
        requestId,
        error: parseError.message,
      });
      return createErrorResponse("Invalid request format", 400);
    }

    const { moodText } = body;

    // Basic input validation
    if (!moodText || typeof moodText !== "string") {
      return createErrorResponse("Mood text is required", 400);
    }

    const trimmedText = moodText.trim();
    if (trimmedText.length < 3) {
      return createErrorResponse(
        "Mood description must be at least 3 characters long",
        400
      );
    }

    if (trimmedText.length > 500) {
      return createErrorResponse(
        "Mood description must be 500 characters or less",
        400
      );
    }

    // Sanitize input
    const sanitizedText = sanitizeInput(trimmedText);
    if (!sanitizedText) {
      return createErrorResponse(
        "Invalid input: please provide a meaningful mood description",
        400
      );
    }

    // Perform mood analysis
    let analysisResult;
    try {
      analysisResult = analyzeMoodFromText(sanitizedText);

      // Double-check that we got a valid result
      if (!analysisResult || !analysisResult.mood || !analysisResult.genres) {
        throw new Error("Invalid analysis result returned");
      }
    } catch (analysisError) {
      console.warn("Mood analysis failed, defaulting to chill mood", {
        requestId,
        error: analysisError.message,
        inputText: sanitizedText.substring(0, 50) + "...",
      });

      // Default to chill mood if analysis fails
      analysisResult = {
        mood: "chill",
        confidence: 0.7,
        genres: ["lo-fi", "chillhop", "indie", "alternative", "chillout"],
        energy: 0.5,
        valence: 0.6,
        tempo: { min: 80, max: 110 },
        detectedKeywords: ["default"],
        analysis: {
          fallback: true,
          error: `Analysis failed: ${analysisError.message}`,
        },
      };
    }

    const processingTime = Date.now() - startTime;
    console.log("Advanced mood analysis completed", {
      requestId,
      detectedMood: analysisResult.mood,
      confidence: analysisResult.confidence,
      processingTime,
      inputLength: moodText.length,
      detectedKeywords: analysisResult.detectedKeywords,
    });

    return NextResponse.json({
      success: true,
      data: {
        mood: analysisResult.mood,
        confidence: analysisResult.confidence,
        genres: analysisResult.genres,
        energy: analysisResult.energy,
        valence: analysisResult.valence,
        tempo: analysisResult.tempo,
        analysis: {
          detectedKeywords: analysisResult.detectedKeywords,
          inputText:
            sanitizedText.length > 100
              ? sanitizedText.substring(0, 97) + "..."
              : sanitizedText,
        },
      },
      meta: {
        requestId,
        processingTime,
        analysisMethod: "advanced_keyword_sentiment",
        version: "4.0.0",
      },
    });
  } catch (error) {
    const processingTime = Date.now() - startTime;

    console.error("Unexpected error during mood analysis", {
      requestId,
      message: error.message,
      stack: error.stack,
      processingTime,
    });

    // Instead of returning an error, default to chill mood
    console.warn("Defaulting to chill mood due to unexpected error", {
      requestId,
    });

    return NextResponse.json({
      success: true,
      data: {
        mood: "chill",
        confidence: 0.7,
        genres: ["lo-fi", "chillhop", "indie", "alternative", "chillout"],
        energy: 0.5,
        valence: 0.6,
        tempo: { min: 80, max: 110 },
        analysis: {
          detectedKeywords: ["default"],
          inputText: "Error fallback",
          fallback: true,
          error: `Unexpected error: ${error.message}`,
        },
      },
      meta: {
        requestId,
        processingTime,
        analysisMethod: "fallback_chill",
        version: "4.0.0",
        fallback: true,
      },
    });
  }
}

export async function GET() {
  return NextResponse.json({
    name: "Advanced Mood Analysis API",
    version: "4.0.0",
    description:
      "Intelligent mood analysis using keyword detection and sentiment analysis",
    endpoints: {
      POST: {
        description:
          "Analyze mood from text input using advanced NLP techniques",
        body: {
          moodText: "string (3-500 characters)",
        },
        response: {
          success: "boolean",
          data: {
            mood: "string (detected mood category)",
            confidence: "number (0.0-1.0)",
            genres: "string[] (recommended music genres)",
            energy: "number (0.0-1.0, musical energy level)",
            valence: "number (0.0-1.0, musical positivity)",
            tempo: "object { min: number, max: number } (BPM range)",
            analysis: {
              detectedKeywords:
                "string[] (keywords that influenced mood detection)",
              inputText: "string (sanitized input text, truncated if long)",
            },
          },
          meta: {
            requestId: "string",
            processingTime: "number (ms)",
            analysisMethod: "string",
            version: "string",
          },
        },
      },
    },
    availableMoods: getAvailableMoods(),
    moodCategories: getMoodCategories(),
    features: [
      "Keyword-based mood detection",
      "Sentiment analysis fallback",
      "Confidence scoring",
      "Genre recommendations based on mood",
      "Musical parameter mapping (energy, valence, tempo)",
      "Input sanitization and validation",
      "Detailed analysis feedback",
    ],
  });
}
