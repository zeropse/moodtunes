"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Music,
  Star,
  ExternalLink,
  Calendar,
  MessageSquare,
  Play,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Vortex } from "@/components/ui/vortex";

export default function HistoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [historyEntry, setHistoryEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHistoryEntry = () => {
      try {
        // Try to get from sessionStorage first (more reliable)
        const selectedEntry = sessionStorage.getItem("selectedHistoryEntry");

        if (selectedEntry) {
          setHistoryEntry(JSON.parse(selectedEntry));
          setIsLoading(false);
          return;
        }

        // Fallback: get from localStorage and find by index
        const savedHistory = localStorage.getItem("moodMusicHistory");
        if (savedHistory && params.id) {
          const history = JSON.parse(savedHistory);
          const index = parseInt(params.id);

          if (index >= 0 && index < history.length) {
            setHistoryEntry(history[index]);
          } else {
            setError("History entry not found");
          }
        } else {
          setError("No history data found");
        }
      } catch (err) {
        console.error("Error loading history entry:", err);
        setError("Failed to load history entry");
      } finally {
        setIsLoading(false);
      }
    };

    loadHistoryEntry();
  }, [params.id]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return (
      date.toLocaleDateString() +
      " at " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const handleGoBack = () => {
    router.push("/history");
  };

  const handleStartOver = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <Vortex>
        <div className="h-screen overflow-hidden">
          <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 h-full">
            <div className="flex items-center justify-center h-full">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-2xl">
                <CardContent className="flex flex-col items-center justify-center space-y-6 py-16 px-12">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                    <RefreshCw className="w-12 h-12 animate-spin text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">
                      Loading mood history
                    </h3>
                    <p className="text-white/60 sm:text-lg text-lg">
                      Retrieving your musical memories...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Vortex>
    );
  }

  if (error || !historyEntry) {
    return (
      <Vortex>
        <div className="h-screen overflow-hidden">
          <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 h-full">
            <div className="flex items-center justify-center h-full">
              <Card className="bg-red-500/5 backdrop-blur-xl border-red-400/20 text-white shadow-2xl max-w-md">
                <CardContent className="flex flex-col items-center justify-center space-y-6 py-12 px-8">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                  </div>
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold text-white">
                      Entry Not Found
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {error ||
                        "The history entry you're looking for doesn't exist or has been removed."}
                    </p>
                    <Button
                      onClick={handleGoBack}
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-semibold text-lg px-8 py-3 rounded-xl shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Vortex>
    );
  }

  return (
    <Vortex>
      <div className="h-screen overflow-hidden">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={handleGoBack}
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/20 transition-all duration-300 rounded-xl backdrop-blur-sm cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to History
            </Button>

            <div className="flex items-center gap-2 text-white/60">
              <Calendar className="w-5 h-5" />
              <span className="text-lg font-medium">
                {formatTimestamp(historyEntry.timestamp)}
              </span>
            </div>
          </div>

          <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] lg:h-[calc(100vh-8rem)] flex flex-col md:flex-row lg:flex-row gap-4 md:gap-6 lg:gap-8">
            {/* Mood Info Card */}
            <div className="w-full lg:w-80 flex-shrink-0 order-2 lg:order-1">
              <Card className="h-auto lg:h-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border-white/20 text-white shadow-2xl">
                <CardHeader className="text-center pb-4 md:pb-6">
                  <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg">
                    <Music className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Your Past Vibe
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6">
                  {/* Original Mood Input */}
                  {historyEntry.mood && (
                    <div className="p-4 md:p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                      <p className="text-lg md:text-xl font-medium text-center italic text-balance leading-relaxed">
                        "{historyEntry.mood}"
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-center space-x-3 text-white/60">
                    <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                    <span className="text-base md:text-lg">
                      Curated for you
                    </span>
                  </div>

                  <div className="pt-2 md:pt-4">
                    <Button
                      onClick={handleStartOver}
                      className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-semibold md:text-lg py-4 md:py-6 rounded-xl shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform cursor-pointer"
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
                    Songs Just for You
                    <span className="text-xs md:text-sm font-normal text-white/60 ml-auto">
                      {historyEntry.suggestions?.tracks?.length || 0} songs
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-[calc(100%-4rem)] md:h-[calc(100%-5rem)]">
                  {historyEntry.suggestions?.tracks?.length > 0 ? (
                    <div className="h-full overflow-y-auto px-3 md:px-6 pb-4 md:pb-6">
                      <div className="space-y-1 md:space-y-2">
                        {historyEntry.suggestions.tracks.map((track, index) => (
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
                            {/* Album Art */}
                            <div className="flex-shrink-0">
                              {track.album?.images?.[0]?.url ? (
                                <img
                                  src={
                                    track.album.images[0].url ||
                                    "/placeholder.svg"
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
                                  {new Date(
                                    track.album.release_date
                                  ).getFullYear()}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-white/60">
                        <Music className="w-16 h-16 mx-auto mb-4 text-white/40" />
                        <p className="text-lg">No song recommendations found</p>
                        <p className="text-sm">
                          This entry might be incomplete
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Vortex>
  );
}
