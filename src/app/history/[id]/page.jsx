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
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString();
  };

  const handleGoBack = () => {
    router.push("/history");
  };

  const handleStartOver = () => {
    router.push("/");
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
                <p className="text-lg">Loading mood history details...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !historyEntry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
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
                    className="bg-blue-600 hover:bg-blue-700 text-white border-0"
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
          <Button
            onClick={handleGoBack}
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/20 transition-all duration-300 rounded-xl backdrop-blur-sm"
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
                  Your Past Mood
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                {/* Original Mood Input */}
                {historyEntry.mood && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-white/80 font-medium">
                        What You Wrote
                      </span>
                    </div>
                    <div className="p-4 md:p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                      <p className="text-lg md:text-xl font-medium text-center italic text-balance leading-relaxed">
                        "{historyEntry.mood}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Analyzed Mood */}
                {historyEntry.moodAnalysis && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm text-white/80 font-medium">
                        AI Analysis
                      </span>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl border border-yellow-400/20">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-300 mb-2">
                          {historyEntry.moodAnalysis.mood}
                        </p>
                        {historyEntry.moodAnalysis.confidence && (
                          <p className="text-sm text-white/60">
                            {Math.round(
                              historyEntry.moodAnalysis.confidence * 100
                            )}
                            % confidence
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Mood Attributes */}
                {historyEntry.moodAnalysis && (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {historyEntry.moodAnalysis.energy && (
                      <div className="bg-white/5 p-3 rounded-xl text-center">
                        <p className="text-white/60 mb-1">Energy</p>
                        <p className="font-bold text-green-400">
                          {Math.round(historyEntry.moodAnalysis.energy * 100)}%
                        </p>
                      </div>
                    )}
                    {historyEntry.moodAnalysis.valence && (
                      <div className="bg-white/5 p-3 rounded-xl text-center">
                        <p className="text-white/60 mb-1">Valence</p>
                        <p className="font-bold text-purple-400">
                          {Math.round(historyEntry.moodAnalysis.valence * 100)}%
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2 md:pt-4">
                  <Button
                    onClick={handleStartOver}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 text-base md:text-lg py-4 md:py-6"
                    size="lg"
                  >
                    <RefreshCw className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                    Analyze New Mood
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
                  <Music className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                  Song Recommendations
                  <span className="text-base md:text-lg text-white/60 bg-white/10 px-2 md:px-3 py-1 rounded-full ml-auto">
                    {historyEntry.suggestions?.tracks?.length || 0} tracks
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto custom-scrollbar px-3 md:px-6">
                {historyEntry.suggestions?.tracks?.length > 0 ? (
                  <div className="space-y-3 md:space-y-4 pb-4">
                    {historyEntry.suggestions.tracks.map((track, index) => (
                      <div
                        key={index}
                        className="group flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer border border-transparent hover:border-white/20"
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
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center text-white/60 text-sm md:text-base font-bold flex-shrink-0">
                          {index + 1}
                        </div>

                        {track.album?.images &&
                        track.album.images.length > 0 ? (
                          <img
                            src={
                              track.album.images[track.album.images.length - 1]
                                ?.url
                            }
                            alt={`${track.album.name} album cover`}
                            className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover shadow-lg group-hover:scale-105 transition-transform duration-300 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                            <Music className="w-6 h-6 md:w-8 md:h-8 text-white/60" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="text-base md:text-lg font-semibold text-white truncate group-hover:text-blue-300 transition-colors leading-tight">
                            {track.name}
                          </p>
                          <p className="text-sm md:text-base text-white/60 truncate mt-1">
                            {Array.isArray(track.artists)
                              ? track.artists
                                  .map((artist) => artist.name || artist)
                                  .join(", ")
                              : track.artists}
                          </p>
                          {track.album?.name && (
                            <p className="text-xs md:text-sm text-white/40 truncate mt-1">
                              {track.album.name}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                          {track.external_urls?.spotify && (
                            <ExternalLink className="w-5 h-5 md:w-6 md:h-6 text-white/40 group-hover:text-green-400 transition-colors" />
                          )}
                          <Play className="w-5 h-5 md:w-6 md:h-6 text-white/40 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-white/60">
                      <Music className="w-16 h-16 mx-auto mb-4 text-white/40" />
                      <p className="text-lg">No song recommendations found</p>
                      <p className="text-sm">This entry might be incomplete</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
