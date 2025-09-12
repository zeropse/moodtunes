import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { mood, moodAnalysis, suggestions, sharedBy } = body;

    // Validate required data
    if (!mood || !moodAnalysis || !suggestions) {
      return NextResponse.json(
        { error: "Missing required mood data" },
        { status: 400 }
      );
    }

    // Prepare data for sharing
    const shareData = {
      mood,
      moodAnalysis,
      suggestions,
      sharedBy: sharedBy || "Anonymous",
      sharedAt: new Date().toISOString(),
      appName: "MoodTunes",
    };

    // Create a bin on jsonbin.io
    const response = await fetch("https://api.jsonbin.io/v3/b", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key":
          process.env.JSONBIN_API_KEY ||
          "$2a$10$8GUdAY5M9Zp9pMZpOQZY0.vxHpJvKQZY0L6Q5L6Q5L6Q5L6Q5L6Q5",
        "X-Bin-Name": `moodtunes-share-${Date.now()}`,
        "X-Bin-Private": "false", // Make it public for sharing
      },
      body: JSON.stringify(shareData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("JSONBin API error:", errorData);
      throw new Error(`JSONBin API error: ${response.status}`);
    }

    const result = await response.json();
    const shareId = result.metadata.id;

    // Build share URL
    const shareUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/share/${shareId}`;

    return NextResponse.json({
      success: true,
      shareId,
      shareUrl,
      message: "Mood shared successfully!",
    });
  } catch (error) {
    console.error("Error creating share:", error);
    return NextResponse.json(
      {
        error: "Failed to create share link",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get("id");

    if (!shareId) {
      return NextResponse.json(
        { error: "Share ID is required" },
        { status: 400 }
      );
    }

    // Fetch shared data from jsonbin.io
    const response = await fetch(`https://api.jsonbin.io/v3/b/${shareId}`, {
      headers: {
        "X-Master-Key":
          process.env.JSONBIN_API_KEY ||
          "$2a$10$8GUdAY5M9Zp9pMZpOQZY0.vxHpJvKQZY0L6Q5L6Q5L6Q5L6Q5L6Q5",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Shared mood not found" },
          { status: 404 }
        );
      }
      throw new Error(`JSONBin API error: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json({
      success: true,
      data: result.record,
    });
  } catch (error) {
    console.error("Error fetching shared data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch shared mood",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
