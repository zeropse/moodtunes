import { NextResponse } from "next/server";
import {
  generateSongSuggestions,
  validateSpotifyConfig,
  SpotifyAPIError,
} from "@/lib/spotify-api";

function generateRequestId() {
  return `suggestions_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 11)}`;
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

function validateSuggestionsRequest(body) {
  const { mood, genres, energy, valence, tempo } = body;
  const errors = [];

  if (!mood || typeof mood !== "string") {
    errors.push("Missing or invalid required field: mood (must be string)");
  }

  if (!genres || !Array.isArray(genres) || genres.length === 0) {
    errors.push(
      "Missing or invalid required field: genres (must be non-empty array)"
    );
  }

  if (typeof energy !== "number" || energy < 0 || energy > 1) {
    errors.push("Invalid energy value (must be number between 0 and 1)");
  }

  if (typeof valence !== "number" || valence < 0 || valence > 1) {
    errors.push("Invalid valence value (must be number between 0 and 1)");
  }

  if (
    tempo &&
    (typeof tempo !== "object" ||
      typeof tempo.min !== "number" ||
      typeof tempo.max !== "number" ||
      tempo.min < 0 ||
      tempo.max < 0 ||
      tempo.min > tempo.max)
  ) {
    errors.push(
      "Invalid tempo value (must be object with valid min and max numbers)"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export async function POST(request) {
  const requestId = generateRequestId();
  const startTime = Date.now();

  try {
    if (!validateSpotifyConfig()) {
      console.error("Spotify API credentials not configured", { requestId });
      return createErrorResponse(
        "Music service is not available. Please check the server configuration.",
        503
      );
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

    const validation = validateSuggestionsRequest(body);
    if (!validation.isValid) {
      console.error("Request validation failed", {
        requestId,
        errors: validation.errors,
      });
      return createErrorResponse(validation.errors[0], 400);
    }

    const { mood, genres, energy, valence, tempo, moodText } = body;

    const moodAnalysis = {
      mood,
      genres: genres.slice(0, 5),
      energy,
      valence,
      tempo,
    };

    let suggestionsData;
    try {
      suggestionsData = await generateSongSuggestions(moodAnalysis);
    } catch (spotifyError) {
      const fallbackSuggestions = {
        id: "fallback-suggestions",
        mood: body.moodText || body.mood || "Unknown",
        tracks: [
          {
            id: "sample-1",
            name: "Sample Track 1",
            artists: ["Sample Artist"],
            preview_url: null,
            external_urls: { spotify: "#" },
            duration_ms: 180000,
            popularity: 75,
          },
          {
            id: "sample-2",
            name: "Sample Track 2",
            artists: ["Sample Artist"],
            preview_url: null,
            external_urls: { spotify: "#" },
            duration_ms: 200000,
            popularity: 70,
          },
        ],
        totalTracks: 2,
        seedGenres: body.genres?.slice(0, 3) || ["pop"],
        shareUrl: "#",
        createdAt: new Date().toISOString(),
        fallback: true,
        message: "Sample song suggestions - Spotify connection unavailable",
      };

      return NextResponse.json({
        success: true,
        suggestions: fallbackSuggestions,
        warning:
          "Spotify is temporarily unavailable. Here are some sample suggestions.",
        meta: {
          requestId,
          processingTime: Date.now() - startTime,
          fallback: true,
        },
      });
    }

    const targetCount = energy > 0.7 ? 20 : energy > 0.4 ? 15 : 10;
    if (suggestionsData.tracks && suggestionsData.tracks.length > targetCount) {
      suggestionsData.tracks = suggestionsData.tracks.slice(0, targetCount);
    }

    const suggestionsResponse = {
      tracks: suggestionsData.tracks || [],
      totalTracks: suggestionsData.tracks?.length || 0,
      seedGenres: suggestionsData.seedGenres,
      mood: moodText || mood,
      moodAnalysis: {
        energy,
        valence,
        genres: genres.slice(0, 3),
      },
    };

    const processingTime = Date.now() - startTime;
    console.log("Song suggestions success", {
      requestId,
      mood,
      trackCount: suggestionsData.tracks?.length || 0,
      processingTime,
      genres: genres.slice(0, 3),
    });

    const response = {
      success: true,
      suggestions: suggestionsResponse,
      meta: {
        requestId,
        processingTime,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const processingTime = Date.now() - startTime;

    if (error instanceof SpotifyAPIError) {
      console.error("Spotify API error", {
        requestId,
        message: error.message,
        statusCode: error.statusCode,
        processingTime,
      });

      if (error.statusCode >= 500 || error.statusCode === 408) {
        const fallbackSuggestions = {
          id: "fallback-suggestions",
          mood: body?.moodText || body?.mood || "Unknown",
          tracks: [
            {
              id: "sample-1",
              name: "Sample Track 1",
              artists: ["Sample Artist"],
              preview_url: null,
              external_urls: { spotify: "#" },
              duration_ms: 180000,
              popularity: 75,
            },
            {
              id: "sample-2",
              name: "Sample Track 2",
              artists: ["Sample Artist"],
              preview_url: null,
              external_urls: { spotify: "#" },
              duration_ms: 200000,
              popularity: 70,
            },
          ],
          totalTracks: 2,
          seedGenres: body?.genres?.slice(0, 3) || ["pop"],
          shareUrl: "#",
          createdAt: new Date().toISOString(),
          fallback: true,
          message: "Sample song suggestions - Spotify connection unavailable",
        };

        // Return fallback response instead of error
        return NextResponse.json({
          success: true,
          suggestions: fallbackSuggestions,
          warning:
            "Spotify is temporarily unavailable. Please try again later for personalized recommendations.",
          meta: {
            requestId,
            processingTime,
            fallback: true,
          },
        });
      }

      const statusCode =
        error.statusCode >= 400 && error.statusCode < 600
          ? error.statusCode
          : 500;

      return createErrorResponse(
        "We're having trouble connecting to Spotify. Please try again later.",
        statusCode
      );
    }

    // Handle unexpected errors
    console.error("Unexpected error during song suggestions generation", {
      requestId,
      message: error.message,
      processingTime,
    });

    return createErrorResponse(
      "We couldn't generate song suggestions right now. Please try again.",
      500
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
