const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const SEARCH_ENDPOINT = "https://api.spotify.com/v1/search";

const getAccessToken = async () => {
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

  return response.json();
};

export const searchTracks = async (query, limit = 25) => {
  try {
    const { access_token } = await getAccessToken();

    if (!access_token) {
      throw new Error("Failed to get Spotify access token");
    }

    const response = await fetch(
      `${SEARCH_ENDPOINT}?q=${encodeURIComponent(
        query
      )}&type=track&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Spotify API error:", errorData);
      throw new Error(`Spotify API responded with ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error in searchTracks:", error);
    return { tracks: { items: [] } };
  }
};
