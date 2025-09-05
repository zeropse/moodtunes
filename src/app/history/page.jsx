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
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function History() {
  const [moodHistory, setMoodHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
  const clearEntry = (indexToRemove) => {
    const updatedHistory = moodHistory.filter(
      (_, index) => index !== indexToRemove
    );
    setMoodHistory(updatedHistory);
    localStorage.setItem("moodMusicHistory", JSON.stringify(updatedHistory));
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
              Your Mood History
            </h1>
            <p className="text-white/80 text-lg mt-2">
              Explore your musical journey through emotions
            </p>
          </div>

          {moodHistory.length > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={clearHistory}
              className="text-white border-white/30 hover:bg-red-500/20 hover:border-red-400 transition-colors"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          {moodHistory.length === 0 ? (
            // Empty State
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="text-center py-16">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6">
                  <Clock className="w-10 h-10 text-white/60" />
                </div>
                <h2 className="text-2xl font-bold mb-4">No Mood History Yet</h2>
                <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
                  Start describing your moods to build your personal music
                  journey. We'll keep track of your mood analyses and song
                  recommendations here.
                </p>
                <Link href="/">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                  >
                    <Music className="w-5 h-5 mr-2" />
                    Start Your Musical Journey
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            // History List
            <div className="space-y-6">
              {moodHistory.map((entry, index) => (
                <Card
                  key={index}
                  className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-colors"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                          <span className="text-sm text-white/60 font-medium">
                            {formatTimestamp(entry.timestamp)}
                          </span>
                        </div>
                        <CardTitle className="text-xl mb-3">
                          "{entry.mood}"
                        </CardTitle>
                        {entry.moodAnalysis && (
                          <div className="space-y-2">
                            {entry.moodAnalysis.dominantEmotion && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-purple-300 font-medium">
                                  Emotion:
                                </span>
                                <span className="text-sm text-white/80 capitalize">
                                  {entry.moodAnalysis.dominantEmotion}
                                </span>
                              </div>
                            )}
                            {entry.moodAnalysis.energy && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-purple-300 font-medium">
                                  Energy:
                                </span>
                                <span className="text-sm text-white/80 capitalize">
                                  {entry.moodAnalysis.energy}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => clearEntry(index)}
                        className="text-white/60 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {entry.suggestions &&
                      entry.suggestions.tracks &&
                      entry.suggestions.tracks.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-purple-300 mb-3">
                            Recommended Songs ({entry.suggestions.tracks.length}
                            )
                          </h4>
                          <div className="space-y-2">
                            {entry.suggestions.tracks
                              .slice(0, 5)
                              .map((track, trackIndex) => (
                                <div
                                  key={trackIndex}
                                  className="flex items-center justify-between p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
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
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {track.album?.images &&
                                    track.album.images.length > 0 ? (
                                      <img
                                        src={
                                          track.album.images[
                                            track.album.images.length - 1
                                          ]?.url
                                        }
                                        alt={`${track.album.name} album cover`}
                                        className="w-8 h-8 rounded object-cover"
                                      />
                                    ) : (
                                      <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center">
                                        <Music className="w-4 h-4 text-white/60" />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-white truncate">
                                        {track.name}
                                      </p>
                                      <p className="text-xs text-white/60 truncate">
                                        {Array.isArray(track.artists)
                                          ? track.artists
                                              .map(
                                                (artist) =>
                                                  artist.name || artist
                                              )
                                              .join(", ")
                                          : track.artists}
                                      </p>
                                    </div>
                                  </div>
                                  {track.external_urls?.spotify && (
                                    <ExternalLink className="w-4 h-4 text-white/40" />
                                  )}
                                </div>
                              ))}
                            {entry.suggestions.tracks.length > 5 && (
                              <p className="text-xs text-white/60 text-center py-2">
                                +{entry.suggestions.tracks.length - 5} more
                                songs
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
