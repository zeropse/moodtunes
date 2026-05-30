export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/app/"], // Disallow internal app routes and api routes if needed
      },
    ],
    sitemap: "https://moodtunes.zeropse.me/sitemap.xml",
  };
}
