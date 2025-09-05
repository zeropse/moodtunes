"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Sparkles, Heart } from "lucide-react";
import Link from "next/link";
import { Vortex } from "@/components/ui/vortex";

export default function About() {
  return (
    <Vortex>
      <div className="min-h-screen overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                About MoodTunes
              </h1>
              <p className="text-white/80 text-lg mt-2">
                Discover the perfect soundtrack for your emotions
              </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            {/* How to Use Section */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  How to Use MoodTunes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                      1
                    </div>
                    <h3 className="text-xl font-semibold">
                      Describe Your Mood
                    </h3>
                    <p className="text-white/80">
                      Tell us how you're feeling in your own words. Be as
                      descriptive as you like!
                    </p>
                  </div>

                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                      2
                    </div>
                    <h3 className="text-xl font-semibold">Fast Analysis</h3>
                    <p className="text-white/80">
                      Analyze your emotions fast and musical preferences to find
                      the perfect match.
                    </p>
                  </div>

                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                      3
                    </div>
                    <h3 className="text-xl font-semibold">Enjoy Your Music</h3>
                    <p className="text-white/80">
                      Get personalized song recommendations and listen on
                      Spotify instantly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* AI Analysis */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Fast Mood Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80">
                    Our sophisticated system understands the nuances of human
                    emotion, analyzing your mood description to identify the
                    perfect musical match.
                  </p>
                </CardContent>
              </Card>

              {/* Personalized Recommendations */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">
                    Personalized Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80">
                    Every recommendation is tailored to your specific emotional
                    state, ensuring you get music that truly resonates with how
                    you feel.
                  </p>
                </CardContent>
              </Card>

              {/* Spotify Integration */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Spotify Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80">
                    Seamlessly connect with Spotify to access millions of songs.
                    Click any suggestion to open it directly in Spotify.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="text-center py-8">
              <Link href="/">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-semibold text-lg px-8 py-3 rounded-xl shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform cursor-pointer"
                >
                  Try MoodTunes Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Vortex>
  );
}
