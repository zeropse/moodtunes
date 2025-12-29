"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Loader2,
  AlertCircle,
  Music,
  Home,
  Play,
  Share2,
  ExternalLink,
  Clock,
  User,
} from "lucide-react";
import { Vortex } from "@/components/ui/vortex";
import { toast } from "sonner";

export default function SharedMoodPage() {
  const params = useParams();
  const router = useRouter();
  const shareId = params.id;

  const [state, setState] = useState({
    sharedData: null,
    isLoading: true,
    error: null,
    currentTrack: null,
  });

  useEffect(() => {
    const fetchSharedData = async () => {
      if (!shareId) {
        setState((prev) => ({
          ...prev,
          error: "Invalid share link",
          isLoading: false,
        }));
        return;
      }

      try {
        const response = await fetch(`/api/share?id=${shareId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setState((prev) => ({
              ...prev,
              error: "This shared mood was not found or may have expired",
              isLoading: false,
            }));
            return;
          }
          throw new Error("Failed to load shared mood");
        }

        const result = await response.json();
        if (result.success && result.data) {
          setState((prev) => ({
            ...prev,
            sharedData: result.data,
            isLoading: false,
          }));
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching shared data:", error);
        setState((prev) => ({
          ...prev,
          error: "Failed to load shared mood. Please try again.",
          isLoading: false,
        }));
      }
    };

    fetchSharedData();
  }, [shareId]);

  const handleTrackSelect = useCallback((track) => {
    setState((prev) => ({ ...prev, currentTrack: track }));
  }, []);

  const formatDuration = useCallback((ms) => {
    if (!ms) return "";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  const handleShareAgain = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!", {
      style: { background: "#22c55e", color: "#fff", border: "none" },
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
              Loading Shared Mood
            </h3>
            <p className="text-white/60 text-sm">
              Fetching the shared mood and songs...
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
              Couldn't Load Shared Mood
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              {state.error}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => router.push("/app")}
                variant="ghost"
                className="flex-1 bg-white text-purple-600 hover:bg-white/90 font-semibold"
              >
                <Home className="w-4 h-4 mr-2" />
                Try MoodTunes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SharedMoodInfo = () => (
    <Card className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border-white/20 text-white shadow-2xl">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
          <Share2 className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Shared Mood
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Original Mood */}
        <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
          <p className="text-sm font-medium text-center italic text-balance leading-relaxed">
            "{state.sharedData.mood}"
          </p>
        </div>

        {/* Share Details */}
        <div className="space-y-2 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <User className="w-3 h-3" />
            <span>Shared by {state.sharedData.sharedBy}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>{formatDate(state.sharedData.sharedAt)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent border-white/20 text-white/70 hover:bg-white/5 hover:text-white hover:border-white/40 text-xs py-6 cursor-pointer"
          >
            <Home className="w-3 h-3 mr-1" />
            Try App
          </Button>
        </div>
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

      {/* Duration */}
      <div className="hidden sm:block text-white/50 text-xs flex-shrink-0">
        {track.duration_ms && formatDuration(track.duration_ms)}
      </div>

      {/* External Link */}
      <div className="flex-shrink-0">
        {track.external_urls?.spotify && (
          <a
            href={track.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-md hover:bg-white/10 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4 text-white/40 hover:text-white/60" />
          </a>
        )}
      </div>
    </div>
  );

  const SongsList = () => (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          <Play className="w-5 h-5 text-green-400" />
          Mood Playlist
          <span className="text-xs font-normal text-white/60 ml-auto">
            {state.sharedData.suggestions.tracks.length} songs
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[60vh] overflow-y-auto px-4 pb-4">
          <div className="space-y-1">
            {state.sharedData.suggestions.tracks.map((track, index) => (
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
    <Card className="bg-black/30 backdrop-blur-xl border-white/20 shadow-2xl">
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
                Choose a track from the playlist to start playing
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (state.isLoading) {
    return (
      <Vortex>
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            <LoadingState />
          </div>
        </div>
      </Vortex>
    );
  }

  if (state.error) {
    return (
      <Vortex>
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            <ErrorState />
          </div>
        </div>
      </Vortex>
    );
  }

  return (
    <Vortex>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="space-y-6">
            {/* Header with App Info */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-white">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  MoodTunes
                </span>
                <span className="text-white/60 text-lg ml-2">Shared Mood</span>
              </h1>
              <p className="text-white/60 text-sm">
                Someone shared their mood and perfect playlist with you
              </p>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Mood info */}
              <div className="lg:col-span-1">
                <SharedMoodInfo />
              </div>

              {/* Songs list */}
              <div className="lg:col-span-3">
                <SongsList />
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
