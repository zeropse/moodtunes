export default function manifest() {
  return {
    name: "MoodTunes",
    short_name: "MoodTunes",
    description: "Personalized Music for Every Mood",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48 32x32 16x16",
        type: "image/x-icon",
      },
    ],
  };
}
