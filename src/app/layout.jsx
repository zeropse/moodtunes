import { Roboto, Roboto_Mono } from "next/font/google";
import "@/style/globals.css";
import { ThemeProvider } from "@/style/theme-provider";
import RouteFrame from "@/components/route-frame";
import { AuthProvider } from "@/lib/auth-context";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MoodTunes",
  description: "Get Tunes based on your mood",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} ${robotoMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <AuthProvider>
            <RouteFrame>{children}</RouteFrame>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
