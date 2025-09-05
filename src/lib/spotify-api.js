class SpotifyAPIClient {
  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.baseURL = "https://api.spotify.com/v1";
    this.tokenURL = "https://accounts.spotify.com/api/token";
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      console.log("Using cached Spotify token");
      return this.accessToken;
    }

    if (!this.clientId || !this.clientSecret) {
      throw new SpotifyAPIError("Spotify credentials not configured", 500);
    }

    const credentials = Buffer.from(
      `${this.clientId}:${this.clientSecret}`
    ).toString("base64");

    try {
      console.log("Requesting new Spotify access token...");
      const response = await fetch(this.tokenURL, {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Spotify token request failed: ${response.status} - ${errorText}`
        );
        const isRetryable = response.status >= 500 || response.status === 429;
        throw new SpotifyAPIError(
          `Token request failed: ${response.status}`,
          response.status,
          isRetryable
        );
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + data.expires_in * 1000 - 60000;
      console.log("Successfully obtained Spotify access token");

      return this.accessToken;
    } catch (error) {
      console.error("Error getting Spotify access token:", error);
      if (error instanceof SpotifyAPIError) {
        throw error;
      }
      throw new SpotifyAPIError(
        `Failed to get access token: ${error.message}`,
        500
      );
    }
  }

  async makeRequest(endpoint, options = {}) {
    const token = await this.getAccessToken();
    const url = `${this.baseURL}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const isRetryable = response.status >= 500 || response.status === 429;
        throw new SpotifyAPIError(
          `Spotify API request failed: ${response.status} ${response.statusText}`,
          response.status,
          isRetryable
        );
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        throw new SpotifyAPIError(
          "Request timeout - Spotify API is taking too long to respond",
          408,
          true
        );
      }

      if (error instanceof SpotifyAPIError) {
        throw error;
      }

      throw new SpotifyAPIError(`Network error: ${error.message}`, 500, true);
    }
  }

  async searchTracks(query, options = {}) {
    const { limit = 20, offset = 0 } = options;

    const queryParams = new URLSearchParams({
      q: query,
      type: "track",
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const endpoint = `/search?${queryParams.toString()}`;
    return this.makeRequest(endpoint);
  }
}

export class SpotifyAPIError extends Error {
  constructor(message, statusCode = 500, retryable = false) {
    super(message);
    this.name = "SpotifyAPIError";
    this.statusCode = statusCode;
    this.retryable = retryable;
  }
}

const spotifyClient = new SpotifyAPIClient();

export async function generateSongSuggestions(moodAnalysis) {
  const { mood, genres } = moodAnalysis;

  try {
    console.log("Generating song suggestions from each genre:", {
      mood,
      genres,
    });

    let allTracks = [];

    // Search for 11 songs from each genre (extra song for duplicates)
    for (const genre of genres) {
      try {
        console.log(`Searching for 11 songs in genre: ${genre}`);

        const results = await spotifyClient.searchTracks(`genre:"${genre}"`, {
          limit: 11,
        });

        if (
          results.tracks &&
          results.tracks.items &&
          results.tracks.items.length > 0
        ) {
          console.log(
            `Found ${results.tracks.items.length} tracks from genre: ${genre}`
          );

          // Add genre info to each track for reference
          const tracksWithGenre = results.tracks.items.map((track) => ({
            ...track,
            sourceGenre: genre,
          }));

          allTracks.push(...tracksWithGenre);
        } else {
          console.log(`No tracks found for genre: ${genre}`);
        }
      } catch (genreError) {
        console.warn(`Failed to search genre "${genre}":`, genreError.message);
      }
    }

    // Remove duplicates and select up to 10 tracks per genre
    const uniqueTracks = removeDuplicatesAndSelect(allTracks);

    // Shuffle the tracks for random order
    const shuffledTracks = shuffleArray(uniqueTracks);

    if (shuffledTracks.length === 0) {
      throw new SpotifyAPIError(
        "No tracks found for any of the mood genres",
        404
      );
    }

    const formattedTracks = shuffledTracks.map((track) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist) => artist.name),
      preview_url: track.preview_url,
      external_urls: track.external_urls,
      duration_ms: track.duration_ms,
      popularity: track.popularity,
      sourceGenre: track.sourceGenre,
      album: {
        id: track.album.id,
        name: track.album.name,
        images: track.album.images,
        release_date: track.album.release_date,
        total_tracks: track.album.total_tracks,
      },
    }));

    console.log(
      `Successfully found ${formattedTracks.length} tracks from ${genres.length} genres for mood: ${mood}`
    );

    return {
      mood,
      tracks: formattedTracks,
      totalTracks: formattedTracks.length,
      seedGenres: genres,
      moodAnalysis: {
        searchedGenres: genres,
      },
    };
  } catch (error) {
    if (error instanceof SpotifyAPIError) {
      throw error;
    }
    throw new SpotifyAPIError(
      `Failed to generate song suggestions: ${error.message}`,
      500
    );
  }
}

// Helper function to shuffle array for random order
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper function to remove duplicates and select up to 10 tracks per genre
function removeDuplicatesAndSelect(tracks) {
  // Group tracks by genre
  const tracksByGenre = {};

  tracks.forEach((track) => {
    if (!tracksByGenre[track.sourceGenre]) {
      tracksByGenre[track.sourceGenre] = [];
    }
    tracksByGenre[track.sourceGenre].push(track);
  });

  const finalTracks = [];
  const seen = new Set();

  // For each genre, select up to 10 unique tracks
  Object.entries(tracksByGenre).forEach(([genre, genreTracks]) => {
    let selectedFromGenre = 0;

    for (const track of genreTracks) {
      if (selectedFromGenre >= 10) break;

      const key = `${track.id}-${track.name}`;
      if (!seen.has(key)) {
        seen.add(key);
        finalTracks.push(track);
        selectedFromGenre++;
      } else {
        console.log(`Duplicate found, adding new track from genre: ${genre}`);
      }
    }

    console.log(
      `Selected ${selectedFromGenre} unique tracks from genre: ${genre}`
    );
  });

  return finalTracks;
}

export function validateSpotifyConfig() {
  return !!(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET);
}
