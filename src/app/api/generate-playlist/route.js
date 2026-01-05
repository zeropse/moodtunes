import { NextResponse } from "next/server";
import { analyzeMood } from "@/lib/mood-analyzer";
import { searchTracks } from "@/lib/spotify";

export async function POST(request) {
  try {
    const {
      text,
      excludeIds = [],
      model = "gemini-1.5-flash",
    } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // 1. Analyze mood
    const { mood, searchQuery } = await analyzeMood(text, model);

    // 2. Search Spotify
    const spotifyData = await searchTracks(searchQuery, excludeIds);

    if (!spotifyData || !spotifyData.tracks) {
      return NextResponse.json(
        { error: "Failed to fetch songs from Spotify" },
        { status: 500 }
      );
    }

    const tracks = spotifyData.tracks.items.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      album: track.album.name,
      image: track.album.images[0]?.url,
      url: track.external_urls.spotify,
      preview_url: track.preview_url,
    }));

    return NextResponse.json({
      mood,
      searchQuery,
      tracks,
    });
  } catch (error) {
    console.error("Error generating playlist:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
