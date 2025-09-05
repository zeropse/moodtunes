"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music, Brain, Sparkles, Heart } from "lucide-react";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              About MoodTunes
            </h1>
            <p className="text-white/80 text-lg mt-2">
              Discover the perfect soundtrack for your emotions
            </p>
          </div>
          <div className="w-[120px]" /> {/* Spacer for centering */}
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
                  <Music className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold">How It Works</h2>
                <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  MoodTunes uses advanced AI to analyze your emotions and curate
                  the perfect playlist. Simply describe how you're feeling, and
                  we'll find songs that match your vibe perfectly.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* AI Analysis */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">AI Mood Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Our sophisticated AI understands the nuances of human emotion,
                  analyzing your mood description to identify the perfect
                  musical match.
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
                  <h3 className="text-xl font-semibold">Describe Your Mood</h3>
                  <p className="text-white/80">
                    Tell us how you're feeling in your own words. Be as
                    descriptive as you like!
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-semibold">AI Analysis</h3>
                  <p className="text-white/80">
                    Our AI analyzes your emotions and musical preferences to
                    find the perfect match.
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-semibold">Enjoy Your Music</h3>
                  <p className="text-white/80">
                    Get personalized song recommendations and listen on Spotify
                    instantly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-purple-300 mb-2">
                    What kind of moods can I describe?
                  </h4>
                  <p className="text-white/80">
                    Any mood! Whether you're happy, sad, energetic,
                    contemplative, angry, or anything in between. The more
                    descriptive you are, the better our recommendations will be.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-purple-300 mb-2">
                    Do I need a Spotify account?
                  </h4>
                  <p className="text-white/80">
                    You don't need a Spotify account to get recommendations, but
                    you'll need one to listen to the full songs. The links will
                    open in Spotify's web player or app.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-purple-300 mb-2">
                    How accurate are the recommendations?
                  </h4>
                  <p className="text-white/80">
                    Our AI continuously learns and improves. The more specific
                    you are about your mood, the more accurate the
                    recommendations will be.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center py-8">
            <Link href="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 text-lg"
              >
                Try MoodTunes Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
