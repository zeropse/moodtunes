const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const SEARCH_ENDPOINT = "https://api.spotify.com/v1/search";

let cachedToken = null;
let tokenExpiry = 0;

const getAccessToken = async () => {
  // Check if we have a valid cached token
  if (cachedToken && Date.now() < tokenExpiry) {
    return { access_token: cachedToken };
  }

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });

    const data = await response.json();

    if (data.access_token) {
      cachedToken = data.access_token;
      // Set expiry with a 60-second buffer
      tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
    }

    return data;
  } catch (error) {
    console.error("Error fetching Spotify access token:", error);
    return {};
  }
};

export const searchTracks = async (query, excludeIds = []) => {
  try {
    const { access_token } = await getAccessToken();

    if (!access_token) {
      throw new Error("Failed to get Spotify access token");
    }

    // Ensure query is a string and not empty
    const baseQuery = (query || "chill").trim();

    // Create a lighter version of the query (first 3 words) for restrictive filters
    // This prevents zero results when combining many keywords with year/tag filters
    const words = baseQuery.split(" ");
    const lightQuery =
      words.length > 3 ? words.slice(0, 3).join(" ") : baseQuery;

    // 12 Different Search Strategies for variety (Oldest limit: 1985)
    const strategies = [
      (q, l) => q, // 1. Standard (Full Query)
      (q, l) => `year:2023-2025 ${l}`, // 2. Ultra Modern
      (q, l) => `year:2019-2022 ${l}`, // 3. Recent Hits
      (q, l) => `year:2015-2018 ${l}`, // 4. Late 2010s
      (q, l) => `year:2010-2014 ${l}`, // 5. Early 2010s
      (q, l) => `year:2005-2009 ${l}`, // 6. Late 2000s
      (q, l) => `year:2000-2004 ${l}`, // 7. Early 2000s
      (q, l) => `year:1995-1999 ${l}`, // 8. Late 90s
      (q, l) => `year:1990-1994 ${l}`, // 9. Early 90s
      (q, l) => `year:1985-1989 ${l}`, // 10. Mid-Late 80s (The Limit)
      (q, l) => `tag:new ${l}`, // 11. New Releases
      (q, l) => `tag:hipster ${l}`, // 12. Niche/Underground
    ];

    const strategyIndex = Math.floor(Math.random() * strategies.length);
    const modifiedQuery = strategies[strategyIndex](baseQuery, lightQuery);

    console.log(
      `Attempting Strategy #${strategyIndex + 1}: "${modifiedQuery}"`
    );

    // Spotify API limit is max 50 per request.
    const fetchLimit = 50;

    const url = `${SEARCH_ENDPOINT}?q=${encodeURIComponent(
      modifiedQuery
    )}&type=track&limit=${fetchLimit}`;
    console.log(`Fetching from Spotify: ${url}`);

    let response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    let data = await response.json();
    let tracks = data.tracks?.items || [];

    // FALLBACK: If modified query returns nothing, try the original query
    if (tracks.length === 0 && modifiedQuery !== query) {
      console.log(
        "Modified query returned no results, falling back to original query."
      );
      response = await fetch(
        `${SEARCH_ENDPOINT}?q=${encodeURIComponent(
          query
        )}&type=track&limit=${fetchLimit}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      data = await response.json();
      tracks = data.tracks?.items || [];
    }

    // Smart filtering to avoid repeated track suggestions
    if (excludeIds.length > 0) {
      const initialCount = tracks.length;
      tracks = tracks.filter((track) => !excludeIds.includes(track.id));
      console.log(
        `Filtered out ${initialCount - tracks.length} duplicate tracks.`
      );
    }

    // Shuffle results for more variety within the same search
    // This ensures that even if the same query is used, the order and selection varies
    tracks = tracks.sort(() => Math.random() - 0.5);

    // FINAL FALLBACK: If filtering left us with too few tracks, ignore filtering to show SOMETHING
    if (tracks.length === 0 && data.tracks?.items?.length > 0) {
      console.log(
        "Filtering removed all results, showing duplicates as fallback."
      );
      tracks = data.tracks.items;
    }

    return {
      tracks: {
        items: tracks.slice(0, 25),
      },
    };
  } catch (error) {
    console.error("Error in searchTracks:", error);
    return { tracks: { items: [] } };
  }
};
