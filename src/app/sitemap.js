export default function sitemap() {
  const baseUrl = "https://moodtunes.zeropse.org";

  // Define your routes
  const routes = ["", "/faqs", "/login", "/signup"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  return [...routes];
}
