"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Music,
  Sparkles,
  Heart,
  Zap,
  ArrowRight,
  Users,
  Globe,
  Headphones,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight-new";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push("/app");
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <div className="min-h-screen">
      <Spotlight />
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl text-center">
          {/* Main Hero Content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Music className="w-12 h-12 text-white animate-pulse" />
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                MoodTunes
              </h1>
            </div>

            <p className="text-2xl md:text-3xl text-gray-100 mb-4 font-light">
              Your emotions, your soundtrack
            </p>

            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your feelings into the perfect playlist. Our AI analyzes
              your mood and discovers songs that resonate with your emotional
              state.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <Heart className="w-5 h-5 mr-2" />
                {isLoaded && isSignedIn ? "Go to App" : "Get Started"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300 cursor-pointer"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div
            className={`grid md:grid-cols-3 gap-6 max-w-4xl mx-auto transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Card className="p-6 backdrop-blur-sm bg-[#000]/20 border-white/20 hover:bg-[#000]/30 transition-all duration-300 transform hover:scale-105">
              <div className="text-center">
                <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Lightning Fast
                </h3>
                <p className="text-gray-300">
                  Get personalized music recommendations in seconds
                </p>
              </div>
            </Card>

            <Card className="p-6 backdrop-blur-sm bg-[#000]/20 border-white/20 hover:bg-[#000]/30 transition-all duration-300 transform hover:scale-105">
              <div className="text-center">
                <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Mood Analysis
                </h3>
                <p className="text-gray-300">
                  Advanced emotion analysis for perfect song matching
                </p>
              </div>
            </Card>

            <Card className="p-6 backdrop-blur-sm bg-[#000]/20 border-white/20 hover:bg-[#000]/30 transition-all duration-300 transform hover:scale-105">
              <div className="text-center">
                <Headphones className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Spotify Integration
                </h3>
                <p className="text-gray-300">
                  Seamlessly Play on Spotify with one click
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 mb-16">
            Three simple steps to discover your perfect soundtrack
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div
              className={`transition-all duration-1000 delay-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Share Your Mood
              </h3>
              <p className="text-gray-300">
                Tell us how you're feeling in your own words. Our AI understands
                complex emotions and nuances.
              </p>
            </div>

            <div
              className={`transition-all duration-1000 delay-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Mood Analysis
              </h3>
              <p className="text-gray-300">
                Our advanced algorithms analyze your emotional state and musical
                preferences to find perfect matches.
              </p>
            </div>

            <div
              className={`transition-all duration-1000 delay-900 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Discover Music
              </h3>
              <p className="text-gray-300">
                Get a curated playlist of songs that perfectly match your
                current emotional state and energy level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to discover your soundtrack?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who have found their perfect music match
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-semibold text-xl px-12 py-6 rounded-xl shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            <Heart className="w-6 h-6 mr-3" />
            {isLoaded && isSignedIn ? "Go to App" : "Start Your Journey"}
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </div>
      </section>
    </div>
  );
}
