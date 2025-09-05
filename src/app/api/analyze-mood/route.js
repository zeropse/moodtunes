import { NextResponse } from "next/server";

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

    const processingTime = Date.now() - startTime;
    console.log("Simple mood analysis", {
      requestId,
      mood: "happy",
      processingTime,
      inputLength: moodText.length,
    });

    // Always return happy mood
    const responseData = {
      mood: "happy",
      confidence: 0.9,
      genres: ["pop", "dance", "funk", "disco", "house"],
      energy: 0.8,
      valence: 0.9,
      tempo: { min: 120, max: 140 },
    };

    return NextResponse.json({
      success: true,
      data: responseData,
      meta: {
        requestId,
        processingTime,
        analysisMethod: "simple",
      },
    });
  } catch (error) {
    const processingTime = Date.now() - startTime;

    console.error("Unexpected error during mood analysis", {
      requestId,
      message: error.message,
      processingTime,
    });

    return createErrorResponse(
      "We had trouble understanding your mood. Try rephrasing your description.",
      500
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: "Simple Mood Analysis API",
    version: "3.0.0",
    description: "Simple mood analysis that always returns happy mood",
    endpoints: {
      POST: {
        description: "Analyze mood from text input (always returns happy)",
        body: {
          moodText: "string (3-500 characters)",
        },
        response: {
          success: "boolean",
          data: {
            mood: "string (always 'happy')",
            confidence: "number (0.9)",
            genres: "string[]",
            energy: "number (0.8)",
            valence: "number (0.9)",
            tempo: "object { min: 120, max: 140 }",
          },
        },
      },
    },
    availableMoods: ["happy"],
  });
}

function sanitizeInput(input) {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .replace(/[<>\"'&]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
