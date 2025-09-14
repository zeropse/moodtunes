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
  Headphones,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5"></div>
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative w-full max-w-7xl text-center z-10">
          {/* Main Hero Content */}
          <div
            className={`transition-all duration-1200 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
              <div className="relative">
                <Music className="w-12 h-12 sm:w-16 sm:h-16 text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text animate-pulse" />
                <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-lg blur-xl opacity-20 animate-pulse"></div>
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent tracking-tight leading-none">
                MoodTunes
              </h1>
            </div>

            <div className="space-y-4 sm:space-y-6 mb-12 sm:mb-16">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white/90 font-light tracking-wide leading-tight">
                Your emotions, your soundtrack
              </p>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto leading-relaxed font-light px-4 sm:px-0">
                Transform your feelings into the perfect playlist. Our advanced
                mood analysis technology analyzes your mood and discovers songs
                that resonate with your emotional state.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16 sm:mb-20 px-4 sm:px-0">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="group relative w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-bold text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-2xl shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 transform hover:scale-105 cursor-pointer border-0 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:animate-bounce" />
                {isLoaded && isSignedIn ? "Go to App" : "Get Started"}
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>

              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="group w-full sm:w-auto border-2 border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/40 font-bold text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-2xl transition-all duration-500 cursor-pointer hover:scale-105"
                >
                  <span className="group-hover:text-purple-200 transition-colors duration-300">
                    Learn More
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto transition-all duration-1200 delay-500 px-4 sm:px-0 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <Card className="group p-6 sm:p-8 backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="text-center">
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform duration-500">
                    <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute inset-0 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur-xl opacity-20 mx-auto group-hover:opacity-40 transition-opacity duration-500"></div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-yellow-200 transition-colors duration-300">
                  Lightning Fast
                </h3>
                <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                  Get personalized music recommendations in seconds with our
                  optimized mood analysis engine
                </p>
              </div>
            </Card>

            <Card className="group p-6 sm:p-8 backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="text-center">
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform duration-500">
                    <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute inset-0 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-xl opacity-20 mx-auto group-hover:opacity-40 transition-opacity duration-500"></div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-purple-200 transition-colors duration-300">
                  Mood Analysis
                </h3>
                <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                  Advanced emotion analysis using sophisticated algorithms for
                  perfect song matching
                </p>
              </div>
            </Card>

            <Card className="group p-6 sm:p-8 backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 sm:col-span-2 lg:col-span-1">
              <div className="text-center">
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform duration-500">
                    <Headphones className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute inset-0 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl blur-xl opacity-20 mx-auto group-hover:opacity-40 transition-opacity duration-500"></div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-green-200 transition-colors duration-300">
                  Spotify Integration
                </h3>
                <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                  Seamlessly play and save playlists to Spotify with one click
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 sm:mb-8 tracking-tight">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 mb-12 sm:mb-16 lg:mb-20 font-light max-w-3xl mx-auto">
            Three simple steps to discover your perfect soundtrack
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            <div
              className={`group transition-all duration-1200 delay-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              <div className="relative mb-6 sm:mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    1
                  </span>
                </div>
                <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 mx-auto group-hover:opacity-50 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 group-hover:text-purple-200 transition-colors duration-300">
                Share Your Mood
              </h3>
              <p className="text-white/70 text-lg sm:text-xl leading-relaxed">
                Tell us how you're feeling in your own words. Our advanced mood
                analysis understands complex emotions and nuances.
              </p>
            </div>

            <div
              className={`group transition-all duration-1200 delay-900 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              <div className="relative mb-6 sm:mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-pink-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    2
                  </span>
                </div>
                <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-pink-500 to-blue-500 rounded-3xl blur-xl opacity-30 mx-auto group-hover:opacity-50 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 group-hover:text-pink-200 transition-colors duration-300">
                Advanced Analysis
              </h3>
              <p className="text-white/70 text-lg sm:text-xl leading-relaxed">
                Our sophisticated algorithms analyze your emotional state and
                musical preferences to find perfect matches.
              </p>
            </div>

            <div
              className={`group transition-all duration-1200 delay-1100 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              <div className="relative mb-6 sm:mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    3
                  </span>
                </div>
                <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-xl opacity-30 mx-auto group-hover:opacity-50 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 group-hover:text-blue-200 transition-colors duration-300">
                Discover Music
              </h3>
              <p className="text-white/70 text-lg sm:text-xl leading-relaxed">
                Get a curated playlist of songs that perfectly match your
                current emotional state and energy level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 sm:mb-8 tracking-tight">
            Ready to discover your soundtrack?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 mb-8 sm:mb-12 font-light max-w-3xl mx-auto">
            Join thousands of users who have found their perfect music match
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-black text-lg sm:text-xl lg:text-2xl px-12 sm:px-16 py-6 sm:py-8 rounded-3xl shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 transform hover:scale-105 cursor-pointer border-0 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 group-hover:animate-bounce" />
            {isLoaded && isSignedIn ? "Go to App" : "Start Your Journey"}
            <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 ml-3 sm:ml-4 group-hover:translate-x-2 transition-transform duration-500" />
          </Button>
        </div>
      </section>
    </div>
  );
}
