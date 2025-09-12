"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Music,
  Star,
  Calendar,
  Play,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Vortex } from "@/components/ui/vortex";
import { toast } from "sonner";

export default function HistoryDetailPage() {
  const { userId, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const [historyEntry, setHistoryEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const scrollContainerRef = useRef(null);

  // Check authentication
  useEffect(() => {
    if (isLoaded && !userId) {
      toast.error("Please sign in to view your mood history", {
        style: { background: "#ef4444", color: "#fff", border: "none" },
        action: {
          label: "Sign In",
          onClick: () => router.push("/sign-in"),
        },
      });
      router.push("/sign-in");
    }
  }, [isLoaded, userId, router]);

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
        toast.error("Failed to load history entry", {
          style: { background: "#ef4444", color: "#fff", border: "none" },
        });
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

  const handleTrackSelect = useCallback((track) => {
    // Preserve scroll position before state update
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;

    setCurrentTrack(track);

    toast.success(`Now playing: ${track.name}`, {
      style: { background: "#22c55e", color: "#fff", border: "none" },
    });

    // Restore scroll position after state update
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollTop;
      }
    });
  }, []);

  const formatDuration = useCallback((ms) => {
    if (!ms) return "";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  const handleGoBack = () => {
    router.push("/app/history");
  };

  const handleStartOver = () => {
    router.push("/app");
  };

  const TrackItem = ({ track, index, isCurrentTrack }) => (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer group border ${
        isCurrentTrack
          ? "bg-green-500/10 border-green-400/30 hover:bg-green-500/15"
          : "bg-white/0 hover:bg-white/5 border-transparent hover:border-white/10"
      }`}
      onClick={() => handleTrackSelect(track)}
    >
      {/* Track Number */}
      <div className="hidden xs:flex flex-shrink-0 w-6 text-center">
        <span className="text-white/40 text-xs font-mono">
          {(index + 1).toString().padStart(2, "0")}
        </span>
      </div>

      {/* Album Art */}
      <div className="flex-shrink-0">
        {track.album?.images?.[0]?.url ? (
          <img
            src={track.album.images[0].url || "/placeholder.svg"}
            alt={`${track.album.name} cover`}
            className="w-10 h-10 rounded-md object-cover group-hover:scale-105 transition-transform duration-300 shadow-md"
          />
        ) : (
          <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center">
            <Music className="w-5 h-5 text-white/40" />
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="font-semibold truncate text-white group-hover:text-blue-300 transition-colors text-sm">
          {track.name}
        </p>
        <p className="text-white/60 truncate text-xs">
          {Array.isArray(track.artists)
            ? track.artists.map((artist) => artist.name || artist).join(", ")
            : track.artists}
        </p>
      </div>

      {/* Duration */}
      <div className="hidden sm:block text-white/50 text-xs flex-shrink-0">
        {track.duration_ms && formatDuration(track.duration_ms)}
      </div>

      {/* Play Indicator */}
      {isCurrentTrack && (
        <div className="flex-shrink-0 flex items-center justify-center w-6 h-6" />
      )}
    </div>
  );

  const NowPlaying = () => (
    <Card className="bg-black/30 backdrop-blur-xl border-white/20 shadow-2xl">
      <CardContent className="p-4">
        {currentTrack ? (
          <div className="rounded-lg overflow-hidden">
            <iframe
              src={`https://open.spotify.com/embed/track/${currentTrack.id}?utm_source=generator&theme=0`}
              width="100%"
              height="152"
              frameBorder="0"
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>
        ) : (
          <div className="flex items-center justify-center py-6">
            <div className="text-center text-white/40">
              <div className="w-12 h-12 mx-auto mb-3 bg-white/5 rounded-full flex items-center justify-center">
                <Music className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium mb-1">No song selected</p>
              <p className="text-xs text-white/30">
                Choose a track from your suggestions to start playing
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Show loading while checking auth
  if (!isLoaded) {
    return (
      <Vortex>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </Vortex>
    );
  }

  // Redirect if not authenticated
  if (!userId) {
    router.push("/sign-in");
    return null;
  }

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
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
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

          <div className="space-y-6">
            {/* Mobile-first layout: stack vertically on small screens, side-by-side on larger */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Mood info - full width on mobile, sidebar on desktop */}
              <div className="lg:col-span-1">
                <Card className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border-white/20 text-white shadow-2xl">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                      <Music className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Your Past Vibe
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Original Mood Input */}
                    {historyEntry.mood && (
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                        <p className="text-sm font-medium text-center italic text-balance leading-relaxed">
                          "{historyEntry.mood}"
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-center space-x-2 text-white/60">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm">Curated for you</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Songs list - full width on mobile, main content on desktop */}
              <div className="lg:col-span-3">
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-2xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                      <Play className="w-5 h-5 text-green-400" />
                      Songs Just for You
                      <span className="text-xs font-normal text-white/60 ml-auto">
                        {historyEntry.suggestions?.tracks?.length || 0} songs
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {historyEntry.suggestions?.tracks?.length > 0 ? (
                      <div
                        ref={scrollContainerRef}
                        className="max-h-[60vh] overflow-y-auto px-4 pb-4"
                      >
                        <div className="space-y-1">
                          {historyEntry.suggestions.tracks.map(
                            (track, index) => (
                              <TrackItem
                                key={track.id || index}
                                track={track}
                                index={index}
                                isCurrentTrack={currentTrack?.id === track.id}
                              />
                            )
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center text-white/60">
                          <Music className="w-16 h-16 mx-auto mb-4 text-white/40" />
                          <p className="text-lg">
                            No song recommendations found
                          </p>
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

            {/* Now playing */}
            <NowPlaying />
          </div>
        </div>
      </div>
    </Vortex>
  );
}
