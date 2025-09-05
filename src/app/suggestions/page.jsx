"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Music,
  Star,
  Home,
  Play,
} from "lucide-react";

export default function SuggestionsPage() {
  const router = useRouter();

  // State management
  const [mood, setMood] = useState(null);
  const [moodAnalysis, setMoodAnalysis] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from sessionStorage
  useEffect(() => {
    const initializeData = () => {
      try {
        const storedData = sessionStorage.getItem("moodData");

        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setMood(parsedData.mood);
          setMoodAnalysis(parsedData.moodAnalysis);
          setSuggestions(parsedData.suggestions);
          setIsInitialized(true);
        } else {
          setError(
            "No suggestions data found. Please start from the home page."
          );
          setIsInitialized(true);
        }
      } catch (err) {
        console.error("Error loading suggestions data:", err);
        setError("Failed to load suggestions data");
        setIsInitialized(true);
      }
    };

    initializeData();
  }, []);

  // Handle retry functionality
  const handleRetry = useCallback(async () => {
    if (!mood || !moodAnalysis) {
      router.push("/");
      return;
    }

    try {
      setError(null);
      setIsLoading(true);

      const suggestionsResponse = await fetch("/api/suggest-songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: moodAnalysis.mood,
          genres: moodAnalysis.genres,
          energy: moodAnalysis.energy,
          valence: moodAnalysis.valence,
          tempo: moodAnalysis.tempo,
          moodText: mood,
        }),
      });

      if (!suggestionsResponse.ok) {
        let errorMessage =
          "We couldn't generate song suggestions right now. Please try again.";
        try {
          const errorData = await suggestionsResponse.json();
          if (errorData.error?.message) {
            errorMessage = errorData.error.message;
          }
        } catch {}
        throw new Error(errorMessage);
      }

      const suggestionsData = await suggestionsResponse.json();
      const newSuggestions = suggestionsData.success
        ? suggestionsData.suggestions
        : suggestionsData;

      setSuggestions(newSuggestions);

      sessionStorage.setItem(
        "moodData",
        JSON.stringify({
          mood: mood,
          moodAnalysis: moodAnalysis,
          suggestions: newSuggestions,
        })
      );
    } catch (err) {
      console.error("Error retrying suggestions:", err);
      let userMessage = err.message;
      if (err.message.includes("fetch")) {
        userMessage =
          "Unable to connect to our music service. Please check your internet connection and try again.";
      } else if (err.message.includes("timeout")) {
        userMessage = "The request is taking too long. Please try again.";
      } else if (!userMessage || userMessage === "Failed to fetch") {
        userMessage = "Something went wrong. Please try again.";
      }
      setError(userMessage);
    } finally {
      setIsLoading(false);
    }
  }, [mood, moodAnalysis]);

  const handleStartOver = useCallback(() => {
    sessionStorage.removeItem("moodData");
    router.push("/");
  }, [router]);

  const renderSuggestions = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-4rem)] sm:h-[calc(100vh-6rem)] lg:h-[calc(100vh-8rem)]">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-2xl">
            <CardContent className="flex flex-col items-center justify-center space-y-6 py-16 px-12">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                <Loader2 className="w-12 h-12 animate-spin text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Finding Perfect Songs
                </h3>
                <p className="text-white/60 sm:text-lg text-lg">
                  Curating songs that match your mood...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-4rem)] sm:h-[calc(100vh-6rem)] lg:h-[calc(100vh-8rem)]">
          <Card className="bg-red-500/5 backdrop-blur-xl border-red-400/20 text-white shadow-2xl max-w-md">
            <CardContent className="flex flex-col items-center justify-center space-y-6 py-12 px-8">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-white">
                  Something went wrong
                </h3>
                <p className="text-white/70 sm:text-lg leading-relaxed">
                  {error}
                </p>
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleRetry}
                    className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                  >
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                    Try Again
                  </Button>
                  <Button
                    onClick={handleStartOver}
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-white/20 border border-white/30"
                  >
                    <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                    Go Home
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (!suggestions?.tracks?.length) {
      return null;
    }

    return (
      <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] lg:h-[calc(100vh-8rem)] flex flex-col md:flex-row lg:flex-row gap-4 md:gap-6 lg:gap-8">
        {/* Mood Info Card */}
        <div className="w-full lg:w-80 flex-shrink-0 order-2 lg:order-1">
          <Card className="h-auto lg:h-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border-white/20 text-white shadow-2xl">
            <CardHeader className="text-center pb-4 md:pb-6">
              <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg">
                <Music className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your Vibe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              {mood && (
                <div className="p-4 md:p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="text-lg md:text-xl font-medium text-center italic text-balance leading-relaxed">
                    "{mood}"
                  </p>
                </div>
              )}
              <div className="flex items-center justify-center space-x-3 text-white/60">
                <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                <span className="text-base md:text-lg">AI-curated for you</span>
              </div>
              <div className="pt-2 md:pt-4">
                <Button
                  onClick={handleStartOver}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 text-base md:text-lg py-4 md:py-6"
                  size="lg"
                >
                  <RefreshCw className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                  Get New Suggestions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Songs List */}
        <div className="flex-1 min-h-0 order-1 lg:order-2">
          <Card className="h-full bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-2xl">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 md:gap-3">
                <Play className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                Your Playlist
                <span className="text-xs md:text-sm font-normal text-white/60 ml-auto">
                  {suggestions.tracks.length} songs
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-4rem)] md:h-[calc(100%-5rem)]">
              <div className="h-full overflow-y-auto px-3 md:px-6 pb-4 md:pb-6">
                <div className="space-y-1 md:space-y-2">
                  {suggestions.tracks.map((track, index) => (
                    <div
                      key={track.id || index}
                      className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white/0 hover:bg-white/5 rounded-xl transition-all duration-300 cursor-pointer group border border-transparent hover:border-white/10"
                      onClick={() => {
                        if (track.external_urls?.spotify) {
                          window.open(
                            track.external_urls.spotify,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }
                      }}
                    >
                      {/* Track Number */}
                      <div className="w-6 md:w-8 text-center flex-shrink-0">
                        <span className="text-white/40 group-hover:hidden text-xs md:text-sm font-medium">
                          {index + 1}
                        </span>
                        <Play className="w-3 h-3 md:w-4 md:h-4 text-white hidden group-hover:block mx-auto" />
                      </div>

                      {/* Album Art */}
                      <div className="flex-shrink-0">
                        {track.album?.images?.[0]?.url ? (
                          <img
                            src={
                              track.album.images[0].url || "/placeholder.svg"
                            }
                            alt={`${track.album.name} cover`}
                            className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300 shadow-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-white/10 flex items-center justify-center">
                            <Music className="w-6 h-6 md:w-7 md:h-7 text-white/40" />
                          </div>
                        )}
                      </div>

                      {/* Track Info */}
                      <div className="flex-1 min-w-0 space-y-0.5 md:space-y-1">
                        <p className="font-semibold truncate text-white group-hover:text-blue-300 transition-colors text-base md:text-lg">
                          {track.name}
                        </p>
                        <p className="text-white/60 truncate text-sm md:text-base">
                          {Array.isArray(track.artists)
                            ? track.artists
                                .map((artist) => artist.name || artist)
                                .join(", ")
                            : track.artists}
                        </p>
                      </div>

                      {/* Album Info */}
                      <div className="text-right text-white/50 hidden md:block min-w-0 max-w-32 md:max-w-48 flex-shrink-0">
                        <p className="truncate text-xs md:text-sm">
                          {track.album?.name}
                        </p>
                        {track.album?.release_date && (
                          <p className="text-xs text-white/30">
                            {new Date(track.album.release_date).getFullYear()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900/90 to-indigo-900 overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 h-full">
        {!isInitialized ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-center">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse mx-auto"></div>
                <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-lg sm:text-xl font-medium">
                Loading suggestions...
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">{renderSuggestions()}</div>
        )}
      </div>
    </div>
  );
}
