"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
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
  Share2,
} from "lucide-react";
import { Vortex } from "@/components/ui/vortex";
import { toast } from "sonner";
import { getPreviousTrackIds, getRetryAttempt } from "@/lib/history-utils";

export default function SuggestionsPage() {
  const { userId, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [state, setState] = useState({
    mood: null,
    moodAnalysis: null,
    suggestions: null,
    isLoading: false,
    error: null,
    isInitialized: false,
    currentTrack: null,
  });

  const scrollContainerRef = useRef(null);
  const nowPlayingRef = useRef(null);

  const saveToHistory = useCallback((moodData, isRetry = false) => {
    try {
      const existingHistory = localStorage.getItem("moodMusicHistory");
      const history = existingHistory ? JSON.parse(existingHistory) : [];

      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const isDuplicate = history.some(
        (entry) =>
          entry.mood === moodData.mood &&
          new Date(entry.timestamp) > fiveMinutesAgo
      );

      if (isDuplicate && !isRetry) return;

      const newEntry = {
        mood: moodData.mood,
        moodAnalysis: moodData.moodAnalysis,
        suggestions: moodData.suggestions,
        timestamp: new Date().toISOString(),
      };

      if (isRetry) {
        const existingIndex = history.findIndex(
          (entry) =>
            entry.mood === moodData.mood &&
            new Date(entry.timestamp) > fiveMinutesAgo
        );
        if (existingIndex !== -1) {
          history[existingIndex] = newEntry;
        } else {
          history.unshift(newEntry);
        }
      } else {
        history.unshift(newEntry);
      }

      if (history.length > 3) {
        history.pop();
      }

      localStorage.setItem("moodMusicHistory", JSON.stringify(history));
    } catch (error) {
      console.error("Error saving to history:", error);
    }
  }, []);

  // Check authentication
  useEffect(() => {
    if (isLoaded && !userId) {
      toast.error("Please sign in to view song suggestions", {
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
    const initializeData = () => {
      try {
        const storedData = sessionStorage.getItem("moodData");

        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setState((prev) => ({
            ...prev,
            mood: parsedData.mood,
            moodAnalysis: parsedData.moodAnalysis,
            suggestions: parsedData.suggestions,
            isInitialized: true,
          }));

          if (parsedData.suggestions) {
            saveToHistory(parsedData);
          }
        } else {
          setState((prev) => ({
            ...prev,
            error:
              "No suggestions data found. Please start from the home page.",
            isInitialized: true,
          }));
          toast.error(
            "No suggestions data found. Please start from the home page.",
            {
              style: { background: "#ef4444", color: "#fff", border: "none" },
            }
          );
        }
      } catch (err) {
        console.error("Error loading suggestions data:", err);
        setState((prev) => ({
          ...prev,
          error: "Failed to load suggestions data",
          isInitialized: true,
        }));
        toast.error("Failed to load suggestions data", {
          style: { background: "#ef4444", color: "#fff", border: "none" },
        });
      }
    };

    initializeData();
  }, [saveToHistory]);

  const handleStartOver = useCallback(() => {
    sessionStorage.removeItem("moodData");
    router.push("/app");
  }, [router]);

  const handleGetNewSongs = useCallback(async () => {
    if (!state.mood || !state.moodAnalysis) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Get current track IDs to exclude from new suggestions
      const currentTrackIds =
        state.suggestions?.tracks?.map((track) => track.id) || [];
      const previousTrackIds = getPreviousTrackIds();
      const allExcludeIds = [
        ...new Set([...currentTrackIds, ...previousTrackIds]),
      ];

      // Get incremented retry attempt
      const retryAttempt = getRetryAttempt(state.mood, state.moodAnalysis) + 1;

      console.log("Getting new songs:", {
        retryAttempt,
        excludeCount: allExcludeIds.length,
        mood: state.moodAnalysis.mood,
      });

      const response = await fetch("/api/suggest-songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: state.moodAnalysis.mood,
          genres: state.moodAnalysis.genres,
          energy: state.moodAnalysis.energy,
          valence: state.moodAnalysis.valence,
          tempo: state.moodAnalysis.tempo,
          moodText: state.mood,
          retryAttempt: retryAttempt,
          excludeTrackIds: allExcludeIds,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Please sign in to get new song suggestions", {
            style: { background: "#ef4444", color: "#fff", border: "none" },
            action: {
              label: "Sign In",
              onClick: () => router.push("/sign-in"),
            },
          });
          return;
        }
        toast.error("Failed to get new suggestions", {
          style: { background: "#ef4444", color: "#fff", border: "none" },
        });
        throw new Error("Failed to get new suggestions");
      }

      const suggestionsData = await response.json();
      const suggestions = suggestionsData.success
        ? suggestionsData.suggestions
        : suggestionsData;

      toast.success("New songs found for your mood!", {
        style: { background: "#22c55e", color: "#fff", border: "none" },
      });

      const newMoodData = {
        mood: state.mood,
        moodAnalysis: state.moodAnalysis,
        suggestions: suggestions,
      };

      // Update session storage
      sessionStorage.setItem("moodData", JSON.stringify(newMoodData));

      // Update state
      setState((prev) => ({
        ...prev,
        suggestions: suggestions,
        currentTrack: null,
        isLoading: false,
      }));

      // Save to history as a retry
      saveToHistory(newMoodData, true);
    } catch (error) {
      console.error("Error getting new suggestions:", error);
      setState((prev) => ({
        ...prev,
        error: "Failed to get new suggestions. Please try again.",
        isLoading: false,
      }));
      toast.error("Failed to get new suggestions. Please try again.", {
        style: { background: "#ef4444", color: "#fff", border: "none" },
      });
    }
  }, [state.mood, state.moodAnalysis, state.suggestions, saveToHistory]);

  const handleShare = useCallback(async () => {
    if (!state.mood || !state.moodAnalysis || !state.suggestions) {
      toast.error("No mood data to share", {
        style: { background: "#ef4444", color: "#fff", border: "none" },
      });
      return;
    }

    try {
      const shareData = {
        mood: state.mood,
        moodAnalysis: state.moodAnalysis,
        suggestions: state.suggestions,
        sharedBy: user?.firstName
          ? `${user.firstName} ${user.lastName || ""}`.trim()
          : user?.username || "Anonymous",
      };

      toast.promise(
        fetch("/api/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(shareData),
        })
          .then(async (response) => {
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Failed to create share link");
            }
            return response.json();
          })
          .then((result) => {
            if (result.success) {
              navigator.clipboard.writeText(result.shareUrl);
              return result;
            }
            throw new Error(result.error || "Failed to create share link");
          }),
        {
          loading: "Creating shareable link...",
          success: () => ({
            message: "Link copied to clipboard!",
            style: { background: "#22c55e", color: "#fff", border: "none" },
          }),
          error: (err) => ({
            message: err.message || "Failed to create share link",
            style: { background: "#ef4444", color: "#fff", border: "none" },
          }),
        }
      );
    } catch (error) {
      console.error("Error sharing mood:", error);
      toast.error("Failed to create share link. Please try again.", {
        style: { background: "#ef4444", color: "#fff", border: "none" },
      });
    }
  }, [state.mood, state.moodAnalysis, state.suggestions, user]);

  const handleTrackSelect = useCallback((track) => {
    // Preserve scroll position before state update
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    setState((prev) => ({ ...prev, currentTrack: track }));
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollTop;
      }
      // Scroll to NowPlaying component after track selection
      if (nowPlayingRef.current) {
        nowPlayingRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }, []);

  const formatDuration = useCallback((ms) => {
    if (!ms) return "";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  const LoadingState = () => (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-2xl max-w-sm w-full mx-4">
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-12 px-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
            <Loader2 className="w-8 h-8 animate-spin text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">
              Finding Perfect Songs
            </h3>
            <p className="text-white/60 text-sm">
              Curating songs that match your mood...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ErrorState = () => (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="bg-red-500/5 backdrop-blur-xl border-red-400/20 text-white shadow-2xl max-w-md w-full mx-4">
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-8 px-6">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-white">
              Something went wrong
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              {state.error}
            </p>
            <Button
              onClick={handleStartOver}
              variant="ghost"
              className="w-full bg-white text-purple-600 hover:bg-white/90 font-semibold"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const MoodInfo = () => (
    <Card className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border-white/20 text-white shadow-2xl">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
          <Music className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Your Vibe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {state.mood && (
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <p className="text-sm font-medium text-center italic text-balance leading-relaxed">
              "{state.mood}"
            </p>
          </div>
        )}
        <div className="flex items-center justify-center space-x-2 text-white/60">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-sm">Curated for you</span>
        </div>
        <Button
          onClick={handleGetNewSongs}
          disabled={state.isLoading}
          className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-semibold text-sm py-3 rounded-xl shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Finding new songs...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Get New Suggestions
            </>
          )}
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          size="sm"
          className="w-full mt-2 bg-transparent border-green-400/20 text-green-400/70 hover:bg-green-400/5 hover:text-green-400 hover:border-green-400/40 text-xs py-6 cursor-pointer"
        >
          <Share2 className="w-3 h-3 mr-1" />
          Share This Mood
        </Button>
        <Button
          onClick={handleStartOver}
          variant="outline"
          size="sm"
          className="w-full mt-2 bg-transparent border-white/20 text-white/70 hover:bg-white/5 hover:text-white hover:border-white/40 text-xs py-6 cursor-pointer"
        >
          <Home className="w-3 h-3 mr-1" />
          Start Over with New Mood
        </Button>
      </CardContent>
    </Card>
  );

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

      {/* Duration  */}
      <div className="hidden sm:block text-white/50 text-xs flex-shrink-0">
        {track.duration_ms && formatDuration(track.duration_ms)}
      </div>

      {/* Play Indicator */}
      {isCurrentTrack && (
        <div className="flex-shrink-0 flex items-center justify-center w-6 h-6" />
      )}
    </div>
  );

  const SongsList = () => (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          <Play className="w-5 h-5 text-green-400" />
          Songs Just for You
          <span className="text-xs font-normal text-white/60 ml-auto">
            {state.suggestions.tracks.length} songs
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={scrollContainerRef}
          className="max-h-[60vh] overflow-y-auto px-4 pb-4"
        >
          <div className="space-y-1">
            {state.suggestions.tracks.map((track, index) => (
              <TrackItem
                key={track.id || index}
                track={track}
                index={index}
                isCurrentTrack={state.currentTrack?.id === track.id}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const NowPlaying = () => (
    <Card
      ref={nowPlayingRef}
      className="bg-black/30 backdrop-blur-xl border-white/20 shadow-2xl"
    >
      <CardContent className="p-4">
        {state.currentTrack ? (
          <div className="rounded-lg overflow-hidden">
            <iframe
              src={`https://open.spotify.com/embed/track/${state.currentTrack.id}?utm_source=generator&theme=0`}
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

  return (
    <Vortex>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {!state.isInitialized ? (
            <LoadingState />
          ) : state.isLoading ? (
            <LoadingState />
          ) : state.error ? (
            <ErrorState />
          ) : !state.suggestions?.tracks?.length ? (
            <ErrorState />
          ) : (
            <div className="space-y-6">
              {/* Mobile-first layout: stack vertically on small screens, side-by-side on larger */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Mood info - full width on mobile, sidebar on desktop */}
                <div className="lg:col-span-1">
                  <MoodInfo />
                </div>

                {/* Songs list - full width on mobile, main content on desktop */}
                <div className="lg:col-span-3">
                  <SongsList />
                </div>
              </div>

              {/* Now playing */}
              <NowPlaying />
            </div>
          )}
        </div>
      </div>
    </Vortex>
  );
}
