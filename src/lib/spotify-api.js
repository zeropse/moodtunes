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
    const randomGenre = genres[Math.floor(Math.random() * genres.length)];

    const searchResults = await spotifyClient.searchTracks(
      `genre:"${randomGenre}"`,
      { limit: 10 }
    );

    if (
      !searchResults.tracks ||
      !searchResults.tracks.items ||
      searchResults.tracks.items.length === 0
    ) {
      throw new SpotifyAPIError("No tracks found for the specified mood", 404);
    }

    const formattedTracks = searchResults.tracks.items.map((track) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist) => artist.name),
      preview_url: track.preview_url,
      external_urls: track.external_urls,
      duration_ms: track.duration_ms,
      popularity: track.popularity,
      album: {
        id: track.album.id,
        name: track.album.name,
        images: track.album.images,
        release_date: track.album.release_date,
        total_tracks: track.album.total_tracks,
      },
    }));

    return {
      mood,
      tracks: formattedTracks,
      totalTracks: formattedTracks.length,
      seedGenres: [randomGenre],
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

export function validateSpotifyConfig() {
  return !!(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET);
}

export { spotifyClient };
