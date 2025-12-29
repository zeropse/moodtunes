"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useState, useCallback, useRef, use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Music, Star, Home, Play, Loader2 } from "lucide-react";
import { Vortex } from "@/components/ui/vortex";
import { notFound } from "next/navigation";

export default function DemoPage({ params }) {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentMoodData, setCurrentMoodData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const nowPlayingRef = useRef(null);

  const { mood } = use(params);

  // Handle authentication redirect
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/sign-in");
    }
  }, [isLoaded, userId, router]);

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

  // Return null while redirecting to sign-in
  if (!userId) {
    return null;
  }

  // Lazy load the demo mood data
  useEffect(() => {
    const loadMoodData = async () => {
      setIsLoading(true);
      try {
        const { demoMoodData } = await import("@/lib/demo-mood-data");
        const moodData = demoMoodData[mood];

        if (!moodData) {
          notFound();
        }

        setCurrentMoodData(moodData);
      } catch (error) {
        console.error("Failed to load mood data:", error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    loadMoodData();
  }, [mood]);

  const handleStartOver = useCallback(() => {
    router.push("/app");
  }, [router]);

  const handleTrackSelect = useCallback((track) => {
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    setCurrentTrack(track);
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollTop;
      }
      if (nowPlayingRef.current) {
        nowPlayingRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }, []);

  // Loading state component
  const LoadingState = () => (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-2xl max-w-sm w-full mx-4">
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-12 px-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
            <Loader2 className="w-8 h-8 animate-spin text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">Loading Demo...</h3>
            <p className="text-white/60 text-sm">
              Preparing your {mood} mood playlist...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Show loading state while data is being loaded
  if (isLoading || !currentMoodData) {
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

  const MoodInfo = () => (
    <Card
      className={`bg-gradient-to-br ${currentMoodData.colors.gradient} backdrop-blur-xl border-white/20 text-white shadow-2xl`}
    >
      <CardHeader className="text-center pb-4">
        <div
          className={`mx-auto w-12 h-12 bg-gradient-to-br ${currentMoodData.colors.iconGradient} rounded-xl flex items-center justify-center mb-3 shadow-lg`}
        >
          <Music className="w-6 h-6 text-white" />
        </div>
        <CardTitle
          className={`text-lg font-bold bg-gradient-to-r ${currentMoodData.colors.textGradient} bg-clip-text text-transparent`}
        >
          {currentMoodData.title} {currentMoodData.emoji}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
          <p className="text-sm font-medium text-center italic text-balance leading-relaxed">
            "{currentMoodData.mood}"
          </p>
        </div>
        <div className="flex items-center justify-center space-x-2 text-white/60">
          <Star className={`w-4 h-4 ${currentMoodData.colors.accent}`} />
          <span className="text-sm">Demo playlist for you</span>
        </div>
        <Button
          onClick={handleStartOver}
          variant="outline"
          size="sm"
          className="w-full mt-2 bg-transparent border-white/20 text-white/70 hover:bg-white/5 hover:text-white hover:border-white/40 text-xs py-6 cursor-pointer"
        >
          <Home className="w-3 h-3 mr-1" />
          Try Your Own Mood
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
      <div className="hidden xs:flex flex-shrink-0 w-6 text-center">
        <span className="text-white/40 text-xs font-mono">
          {(index + 1).toString().padStart(2, "0")}
        </span>
      </div>

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

      <div className="flex-1 min-w-0 space-y-0.5">
        <p
          className={`font-semibold truncate text-white ${currentMoodData.colors.hover} transition-colors text-sm`}
        >
          {track.name}
        </p>
        <p className="text-white/60 truncate text-xs">
          {Array.isArray(track.artists)
            ? track.artists.map((artist) => artist.name || artist).join(", ")
            : track.artists}
        </p>
      </div>

      {isCurrentTrack && (
        <div className="flex-shrink-0 flex items-center justify-center w-6 h-6" />
      )}
    </div>
  );

  const SongsList = () => (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          <Play className={`w-5 h-5 ${currentMoodData.colors.accent}`} />
          {currentMoodData.title} Songs Just for You
          <span className="text-xs font-normal text-white/60 ml-auto">
            {currentMoodData.suggestions.tracks.length} songs
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={scrollContainerRef}
          className="max-h-[60vh] overflow-y-auto px-4 pb-4"
        >
          <div className="space-y-1">
            {currentMoodData.suggestions.tracks.map((track, index) => (
              <TrackItem
                key={track.id || index}
                track={track}
                index={index}
                isCurrentTrack={currentTrack?.id === track.id}
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

  return (
    <Vortex>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <MoodInfo />
              </div>
              <div className="lg:col-span-3">
                <SongsList />
              </div>
            </div>
            <NowPlaying />
          </div>
        </div>
      </div>
    </Vortex>
  );
}
