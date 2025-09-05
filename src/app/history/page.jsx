"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Music,
  Clock,
  Trash2,
  RefreshCw,
  MessageSquare,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function History() {
  const [moodHistory, setMoodHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load mood history from localStorage on component mount
  useEffect(() => {
    const loadHistory = () => {
      try {
        const savedHistory = localStorage.getItem("moodMusicHistory");
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory);
          // Sort by timestamp, most recent first
          const sortedHistory = parsedHistory.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
          setMoodHistory(sortedHistory);
        }
      } catch (error) {
        console.error("Error loading mood history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  // Clear all history
  const clearHistory = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all your mood history? This action cannot be undone."
      )
    ) {
      localStorage.removeItem("moodMusicHistory");
      setMoodHistory([]);
    }
  };

  // Clear individual entry
  const clearEntry = (indexToRemove, e) => {
    e.stopPropagation(); // Prevent card click when deleting
    const updatedHistory = moodHistory.filter(
      (_, index) => index !== indexToRemove
    );
    setMoodHistory(updatedHistory);
    localStorage.setItem("moodMusicHistory", JSON.stringify(updatedHistory));
  };

  // View detailed history entry
  const viewDetail = (index) => {
    const entry = moodHistory[index];
    // Store the selected entry in sessionStorage for the detail page
    sessionStorage.setItem("selectedHistoryEntry", JSON.stringify(entry));
    router.push(`/history/${index}`);
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
                <RefreshCw className="w-8 h-8 animate-spin text-white" />
                <p className="text-lg">Loading your mood history...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
          <Link href="/">
            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/20 transition-all duration-300 rounded-xl backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="text-center flex-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3">
              Your Mood History
            </h1>
            <p className="text-white/70 text-lg sm:text-xl">
              Explore your musical journey through emotions
            </p>
          </div>

          <div className="flex-shrink-0">
            {moodHistory.length > 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={clearHistory}
                className="text-white border-white/30 hover:bg-red-500/20 hover:border-red-400 transition-all duration-300 backdrop-blur-sm rounded-xl"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {moodHistory.length === 0 ? (
            // Empty State
            <div className="flex items-center justify-center min-h-[60vh]">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-2xl max-w-lg">
                <CardContent className="text-center py-16 px-8">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-8 shadow-lg">
                    <Clock className="w-12 h-12 text-white/60" />
                  </div>
                  <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    No Mood History Yet
                  </h2>
                  <p className="text-white/70 text-lg mb-10 leading-relaxed">
                    Start describing your moods to build your personal music
                    journey. We'll keep track of your mood analyses and song
                    recommendations here.
                  </p>
                  <Link href="/">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold text-lg py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Music className="w-6 h-6 mr-3" />
                      Start Your Musical Journey
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ) : (
            // History Stats and List
            <div className="space-y-8">
              {/* History List */}
              <div className="grid gap-4">
                {moodHistory.map((entry, index) => (
                  <Card
                    key={index}
                    className="bg-white/5 backdrop-blur-xl border-white/10 text-white hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 group cursor-pointer"
                    onClick={() => viewDetail(index)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          {/* Timestamp */}
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-white/60 font-medium bg-white/5 px-3 py-1 rounded-full">
                              {formatTimestamp(entry.timestamp)}
                            </span>
                          </div>

                          {/* User's Mood Input */}
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="w-5 h-5 text-blue-400" />
                              <span className="text-sm text-white/80 font-medium">
                                Your Mood
                              </span>
                            </div>
                            <p className="text-lg text-white bg-white/5 p-3 rounded-lg border-l-4 border-blue-400 font-medium">
                              "{entry.mood}"
                            </p>
                          </div>

                          {/* Analyzed Mood */}
                          {entry.moodAnalysis && (
                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Music className="w-5 h-5 text-green-400" />
                                <span className="text-sm text-white/80 font-medium">
                                  Detected Mood
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                  {entry.moodAnalysis.mood}
                                </span>
                                {entry.moodAnalysis.confidence && (
                                  <span className="text-sm text-white/60 bg-green-500/20 px-2 py-1 rounded-full">
                                    {Math.round(
                                      entry.moodAnalysis.confidence * 100
                                    )}
                                    % confidence
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Quick Stats */}
                          <div className="flex items-center gap-4 text-sm text-white/60">
                            {entry.suggestions?.tracks && (
                              <span className="flex items-center gap-1">
                                <Music className="w-4 h-4" />
                                {entry.suggestions.tracks.length} songs
                              </span>
                            )}
                            {entry.moodAnalysis?.genres && (
                              <span>
                                {entry.moodAnalysis.genres
                                  .slice(0, 2)
                                  .join(", ")}
                                {entry.moodAnalysis.genres.length > 2 && "..."}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => clearEntry(index, e)}
                          className="text-white/40 hover:text-red-400 hover:bg-red-500/20 transition-all duration-300 opacity-0 group-hover:opacity-100 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* Click indicator */}
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-xs text-white/50 text-center">
                          Click to view full details and song recommendations
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
