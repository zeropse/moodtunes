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

    // Check cache first
    const cacheKey = `search:${query}:${limit}:${offset}`;
    const cached = this.getCachedResult(cacheKey);
    if (cached) {
      return cached;
    }

    const queryParams = new URLSearchParams({
      q: query,
      type: "track",
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const endpoint = `/search?${queryParams.toString()}`;

    // Use rate-limited request
    const result = await this.makeRateLimitedRequest(endpoint);

    // Cache successful results
    if (result && result.tracks) {
      this.setCachedResult(cacheKey, result);
    }

    return result;
  }

  getCachedResult(key) {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(`spotify_cache_${key}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          const now = Date.now();
          if (now < parsed.expiry) {
            console.log(`Cache hit: ${key}`);
            return parsed.data;
          } else {
            localStorage.removeItem(`spotify_cache_${key}`);
          }
        }
      } catch (error) {
        console.warn("Cache read error:", error);
      }
    }
    return null;
  }

  setCachedResult(key, data) {
    if (typeof window !== "undefined") {
      try {
        const cacheEntry = {
          data,
          expiry: Date.now() + 30 * 60 * 1000, // 30 minutes
          created: Date.now(),
        };
        localStorage.setItem(
          `spotify_cache_${key}`,
          JSON.stringify(cacheEntry)
        );
        console.log(`Cached: ${key}`);
      } catch (error) {
        console.warn("Cache write error:", error);
      }
    }
  }

  async makeRateLimitedRequest(endpoint, options = {}) {
    // Simple rate limiting - wait if we made a request recently
    const now = Date.now();
    const lastRequest = this.lastRequestTime || 0;
    const timeSinceLastRequest = now - lastRequest;
    const minInterval = 100; // 100ms between requests

    if (timeSinceLastRequest < minInterval) {
      await new Promise((resolve) =>
        setTimeout(resolve, minInterval - timeSinceLastRequest)
      );
    }

    this.lastRequestTime = Date.now();
    return this.makeRequest(endpoint, options);
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

export async function generateSongSuggestions(moodAnalysis, options = {}) {
  const { mood, genres } = moodAnalysis;
  const { retryAttempt = 0, excludeTrackIds = [] } = options;

  try {
    console.log("Generating song suggestions from each genre:", {
      mood,
      genres,
      retryAttempt,
      excludeCount: excludeTrackIds.length,
    });

    let allTracks = [];

    // Create varied search strategies for repeated moods
    const searchStrategies = [
      // Attempt 0: Standard genre search
      {
        query: (genre) => `genre:"${genre}"`,
        offset: 0,
        description: "standard genre search",
      },
      // Attempt 1: Add time constraints for variety
      {
        query: (genre) => `genre:"${genre}" year:2020-2024`,
        offset: 0,
        description: "recent music (2020-2024)",
      },
      // Attempt 2: Different time period
      {
        query: (genre) => `genre:"${genre}" year:2015-2019`,
        offset: 0,
        description: "mid-period music (2015-2019)",
      },
      // Attempt 3: Older music
      {
        query: (genre) => `genre:"${genre}" year:2010-2014`,
        offset: 0,
        description: "classic period (2010-2014)",
      },
      // Attempt 4: Use offset for same query
      {
        query: (genre) => `genre:"${genre}"`,
        offset: 20,
        description: "standard search with offset",
      },
      // Attempt 5: Use larger offset
      {
        query: (genre) => `genre:"${genre}"`,
        offset: 40,
        description: "standard search with larger offset",
      },
    ];

    const currentStrategy =
      searchStrategies[Math.min(retryAttempt, searchStrategies.length - 1)];

    console.log(
      `Using search strategy ${retryAttempt}: ${currentStrategy.description}`
    );

    // Search for songs from each genre using the current strategy
    for (const genre of genres) {
      try {
        console.log(
          `Searching for songs in genre: ${genre} (${currentStrategy.description})`
        );

        const searchQuery = currentStrategy.query(genre);
        const results = await spotifyClient.searchTracks(searchQuery, {
          limit: 20, // Get more tracks to filter out duplicates
          offset: currentStrategy.offset,
        });

        if (
          results.tracks &&
          results.tracks.items &&
          results.tracks.items.length > 0
        ) {
          // Filter out excluded tracks and get up to 11 tracks per genre
          const newTracks = results.tracks.items
            .filter((track) => !excludeTrackIds.includes(track.id))
            .slice(0, 11);

          if (newTracks.length > 0) {
            console.log(
              `Found ${newTracks.length} new tracks from genre: ${genre}`
            );

            // Add genre info to each track for reference
            const tracksWithGenre = newTracks.map((track) => ({
              ...track,
              sourceGenre: genre,
            }));

            allTracks.push(...tracksWithGenre);
          } else {
            console.log(
              `All tracks from genre ${genre} were duplicates, trying fallback...`
            );

            // Fallback: try with a different offset
            const fallbackResults = await spotifyClient.searchTracks(
              searchQuery,
              {
                limit: 20,
                offset: currentStrategy.offset + 20,
              }
            );

            if (fallbackResults.tracks && fallbackResults.tracks.items) {
              const fallbackTracks = fallbackResults.tracks.items
                .filter((track) => !excludeTrackIds.includes(track.id))
                .slice(0, 11);

              if (fallbackTracks.length > 0) {
                console.log(
                  `Found ${fallbackTracks.length} fallback tracks from genre: ${genre}`
                );
                const tracksWithGenre = fallbackTracks.map((track) => ({
                  ...track,
                  sourceGenre: genre,
                }));
                allTracks.push(...tracksWithGenre);
              }
            }
          }
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
      duration_ms: track.duration_ms,
      external_urls: {
        spotify: track.external_urls.spotify, // Only keep Spotify URL
      },
      album: {
        images: track.album.images, // Only keep images array for album art
      },
      // Removed unused fields: preview_url, popularity, sourceGenre,
      // album.id, album.name, album.release_date, album.total_tracks
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

// Fallback suggestions when Spotify is unavailable
export const fallbackSuggestions = {
  tracks: [
    {
      id: "fallback_1",
      name: "Happy",
      artists: ["Pharrell Williams"],
      duration_ms: 232560,
      external_urls: { spotify: "#" },
      album: { images: [] },
    },
    {
      id: "fallback_2",
      name: "Can't Stop the Feeling!",
      artists: ["Justin Timberlake"],
      duration_ms: 236000,
      external_urls: { spotify: "#" },
      album: { images: [] },
    },
    {
      id: "fallback_3",
      name: "Uptown Funk",
      artists: ["Mark Ronson", "Bruno Mars"],
      duration_ms: 270000,
      external_urls: { spotify: "#" },
      album: { images: [] },
    },
    {
      id: "fallback_4",
      name: "Good as Hell",
      artists: ["Lizzo"],
      duration_ms: 219000,
      external_urls: { spotify: "#" },
      album: { images: [] },
    },
    {
      id: "fallback_5",
      name: "Shake It Off",
      artists: ["Taylor Swift"],
      duration_ms: 219000,
      external_urls: { spotify: "#" },
      album: { images: [] },
    },
    {
      id: "fallback_6",
      name: "Don't Stop Me Now",
      artists: ["Queen"],
      duration_ms: 210000,
      external_urls: { spotify: "#" },
      album: { images: [] },
    },
    {
      id: "fallback_7",
      name: "Walking on Sunshine",
      artists: ["Katrina and the Waves"],
      duration_ms: 239000,
      external_urls: { spotify: "#" },
      album: { images: [] },
    },
    {
      id: "fallback_8",
      name: "I Want It That Way",
      artists: ["Backstreet Boys"],
      duration_ms: 213000,
      external_urls: { spotify: "#" },
      album: { images: [] },
    },
    {
      id: "fallback_9",
      name: "Mr. Blue Sky",
      artists: ["Electric Light Orchestra"],
      duration_ms: 302000,
      external_urls: { spotify: "#" },
      album: { images: [] },
    },
    {
      id: "fallback_10",
      name: "Good Vibrations",
      artists: ["The Beach Boys"],
      duration_ms: 218000,
      external_urls: { spotify: "#" },
      album: { images: [] },
    },
  ],
  totalTracks: 10,
  seedGenres: ["pop", "rock", "dance"],
  fallback: true,
};
