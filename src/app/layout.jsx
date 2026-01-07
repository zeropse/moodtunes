import { Roboto, Roboto_Mono } from "next/font/google";
import "@/style/globals.css";
import { ThemeProvider } from "@/style/theme-provider";
import RouteFrame from "@/components/route-frame";
import SessionWrapper from "@/components/session-wrapper";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://moodtunes.zeropse.org"),
  title: {
    default: "MoodTunes - Personalized Music for Every Mood",
    template: "%s | MoodTunes",
  },
  description:
    "Discover the perfect music for your current mood. MoodTunes uses AI to curate personalized playlists based on how you feel.",
  keywords: [
    "music",
    "mood",
    "playlists",
    "AI music",
    "personalized music",
    "Spotify",
  ],
  authors: [{ name: "MoodTunes Team" }],
  creator: "MoodTunes Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://moodtunes.zeropse.org",
    siteName: "MoodTunes",
    title: "MoodTunes - Personalized Music for Every Mood",
    description:
      "Discover the perfect music for your current mood. MoodTunes uses AI to curate personalized playlists based on how you feel.",
    images: [
      {
        url: "/landing.png",
        width: 1200,
        height: 630,
        alt: "MoodTunes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoodTunes - Personalized Music for Every Mood",
    description:
      "Discover the perfect music for your current mood. MoodTunes uses AI to curate personalized playlists based on how you feel.",
    images: ["/landing.png"],
    creator: "@moodtunes",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} ${robotoMono.variable} antialiased`}>
        <SessionWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <RouteFrame>{children}</RouteFrame>
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
