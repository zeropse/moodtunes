"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { History, Info } from "lucide-react";
import Link from "next/link";
import MoodInput from "@/components/MoodInput";
import SongSuggestions from "@/components/SongSuggestions";
import Footer from "@/components/Footer";

export default function Home() {
  // Application state
  const [moodText, setMoodText] = useState("");
  const [moodAnalysis, setMoodAnalysis] = useState(null); // Store full mood analysis
  const [suggestions, setSuggestions] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [error, setError] = useState(null);

  // Derived state
  const isLoading = isAnalyzing || isGeneratingSuggestions;
  const hasSuggestions =
    suggestions && suggestions.tracks && suggestions.tracks.length > 0;

  // Handle mood submission and song suggestions generation
  const handleMoodSubmit = useCallback(async (moodInput) => {
    try {
      setError(null);
      setMoodText(moodInput);
      setIsAnalyzing(true);

      // Step 1: Analyze mood with enhanced error handling
      let moodResponse;
      try {
        moodResponse = await fetch("/api/analyze-mood", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ moodText: moodInput }),
        });
      } catch (networkError) {
        throw new Error(
          "Unable to connect to our servers. Please check your internet connection and try again."
        );
      }

      if (!moodResponse.ok) {
        let errorMessage =
          "We're having trouble analyzing your mood. Please try again.";
        try {
          const errorData = await moodResponse.json();
          if (errorData.error?.message) {
            errorMessage = errorData.error.message;
          }
        } catch {
          // Use default error message if we can't parse the error response
        }
        throw new Error(errorMessage);
      }

      const moodData = await moodResponse.json();

      // Handle API response structure
      const analysisData = moodData.success ? moodData.data : moodData;
      setMoodAnalysis(analysisData); // Store the full mood analysis
      setIsAnalyzing(false);
      setIsGeneratingSuggestions(true);

      // Step 2: Generate song suggestions with enhanced error handling
      let suggestionsResponse;
      try {
        suggestionsResponse = await fetch("/api/suggest-songs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mood: analysisData.mood,
            genres: analysisData.genres,
            energy: analysisData.energy,
            valence: analysisData.valence,
            tempo: analysisData.tempo,
            moodText: moodInput,
          }),
        });
      } catch (networkError) {
        throw new Error(
          "Unable to connect to our music service. Please check your internet connection and try again."
        );
      }

      if (!suggestionsResponse.ok) {
        let errorMessage =
          "We couldn't generate song suggestions right now. Please try again.";
        try {
          const errorData = await suggestionsResponse.json();
          if (errorData.error?.message) {
            errorMessage = errorData.error.message;
          }
        } catch {
          // Use default error message if we can't parse the error response
        }
        throw new Error(errorMessage);
      }

      const suggestionsData = await suggestionsResponse.json();

      // Handle API response structure
      const suggestions = suggestionsData.success
        ? suggestionsData.suggestions
        : suggestionsData;
      setSuggestions(suggestions);
      setIsGeneratingSuggestions(false);

      // Save to history
      const historyEntry = {
        timestamp: new Date().toISOString(),
        mood: moodInput,
        moodAnalysis: analysisData,
        suggestions: suggestions,
      };

      try {
        const existingHistory = JSON.parse(
          localStorage.getItem("moodMusicHistory") || "[]"
        );
        const updatedHistory = [historyEntry, ...existingHistory.slice(0, 49)]; // Keep max 50 entries
        localStorage.setItem(
          "moodMusicHistory",
          JSON.stringify(updatedHistory)
        );
      } catch (error) {
        console.error("Error saving to history:", error);
      }
    } catch (err) {
      console.error("Error in mood submission:", err);

      // Provide user-friendly error messages
      let userMessage = err.message;
      if (err.message.includes("fetch")) {
        userMessage =
          "Unable to connect to our servers. Please check your internet connection and try again.";
      } else if (err.message.includes("timeout")) {
        userMessage = "The request is taking too long. Please try again.";
      } else if (!userMessage || userMessage === "Failed to fetch") {
        userMessage = "Something went wrong. Please try again.";
      }

      setError(userMessage);
      setIsAnalyzing(false);
      setIsGeneratingSuggestions(false);
    }
  }, []);

  // Handle retry functionality
  const handleRetry = useCallback(() => {
    if (moodText) {
      handleMoodSubmit(moodText);
    }
  }, [moodText, handleMoodSubmit]);

  // Handle starting over
  const handleStartOver = useCallback(() => {
    setMoodText("");
    setMoodAnalysis(null);
    setSuggestions(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Skip to main content link for keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full p-4 sm:p-6">
          {/* Navigation */}
          <nav className="flex justify-between items-start mb-6">
            <div className="flex gap-2">
              <Link href="/about">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                >
                  <Info className="w-4 h-4 mr-2" />
                  About
                </Button>
              </Link>
              <Link href="/history">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                >
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
              </Link>
            </div>
          </nav>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 drop-shadow-lg">
              Mood Music
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 drop-shadow-md max-w-2xl mx-auto">
              Get AI-powered song recommendations based on your mood
            </p>
          </div>
        </header>

        {/* Main Content Area */}
        <main
          id="main-content"
          className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-8"
          role="main"
        >
          {!hasSuggestions && !isLoading && !error && (
            <div className="w-full max-w-4xl">
              <MoodInput onSubmit={handleMoodSubmit} isLoading={isLoading} />
            </div>
          )}

          {(isLoading || hasSuggestions || error) && (
            <div className="w-full max-w-4xl">
              <SongSuggestions
                suggestions={suggestions}
                mood={moodText}
                moodAnalysis={moodAnalysis}
                isLoading={isLoading}
                error={error}
                onRetry={handleRetry}
              />

              {/* Start Over Button */}
              {(hasSuggestions || error) && (
                <div className="text-center mt-6">
                  <button
                    onClick={handleStartOver}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-white/20 hover:bg-white/30 focus:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-colors duration-200 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
                    aria-label="Start over and get new song suggestions with different mood"
                  >
                    Get New Suggestions
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
