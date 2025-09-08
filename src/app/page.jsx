"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Music, Sparkles, Heart, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { Vortex } from "@/components/ui/vortex";
import { toast } from "sonner";
import {
  getPreviousTrackIds,
  getRetryAttempt,
  isRepeatedMood,
} from "@/lib/history-utils";

export default function Home() {
  const [moodText, setMoodText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!moodText.trim()) {
      setError("Please tell us how you're feeling");
      toast.error("Please tell us how you're feeling", {
        style: { background: "#ef4444", color: "#fff", border: "none" },
      });
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // Analyze mood
      const moodResponse = await fetch("/api/analyze-mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moodText: moodText.trim() }),
      });

      if (!moodResponse.ok) {
        if (moodResponse.status === 401) {
          toast.error("Please sign in to analyze your mood", {
            style: { background: "#ef4444", color: "#fff", border: "none" },
            action: {
              label: "Sign In",
              onClick: () => router.push("/sign-in"),
            },
          });
          return;
        }
        throw new Error("Failed to analyze mood");
      }
      const moodData = await moodResponse.json();
      const analysisData = moodData.success ? moodData.data : moodData;

      toast.success("Mood analyzed successfully!", {
        style: { background: "#22c55e", color: "#fff", border: "none" },
      });

      // Check for previous similar moods and get retry attempt
      const previousTrackIds = getPreviousTrackIds();
      const retryAttempt = getRetryAttempt(moodText.trim(), analysisData);
      const isRepeated = isRepeatedMood(moodText.trim(), analysisData);

      console.log("Mood generation info:", {
        isRepeated,
        retryAttempt,
        previousTracksCount: previousTrackIds.length,
        mood: analysisData.mood,
      });

      // Generate suggestions with diversity for repeated moods
      const suggestionsResponse = await fetch("/api/suggest-songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: analysisData.mood,
          genres: analysisData.genres,
          energy: analysisData.energy,
          valence: analysisData.valence,
          tempo: analysisData.tempo,
          moodText: moodText.trim(),
          retryAttempt: retryAttempt,
          excludeTrackIds: previousTrackIds,
        }),
      });

      if (!suggestionsResponse.ok) {
        if (suggestionsResponse.status === 401) {
          toast.error("Please sign in to get song suggestions", {
            style: { background: "#ef4444", color: "#fff", border: "none" },
            action: {
              label: "Sign In",
              onClick: () => router.push("/sign-in"),
            },
          });
          return;
        }
        toast.error("Failed to generate song suggestions", {
          style: { background: "#ef4444", color: "#fff", border: "none" },
        });
        throw new Error("Failed to generate suggestions");
      }
      const suggestionsData = await suggestionsResponse.json();
      const suggestions = suggestionsData.success
        ? suggestionsData.suggestions
        : suggestionsData;

      toast.success("Perfect songs found for your mood!", {
        style: { background: "#22c55e", color: "#fff", border: "none" },
      });

      // Store and navigate
      sessionStorage.setItem(
        "moodData",
        JSON.stringify({
          mood: moodText.trim(),
          moodAnalysis: analysisData,
          suggestions: suggestions,
        })
      );

      router.push("/suggestions");
    } catch (err) {
      toast.error("Something went wrong. Please try again.", {
        style: { background: "#ef4444", color: "#fff", border: "none" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard shortcut for button
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key === "Enter" &&
        !isLoading &&
        moodText.trim()
      ) {
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moodText, isLoading]);

  return (
    <Vortex>
      <div className="min-h-screen  flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Music className="w-8 h-8 text-white" />
              <h1 className="text-4xl font-bold text-white">MoodTunes</h1>
            </div>
            <p className="text-xl text-gray-100 text-balance">
              Tell us how you're feeling and we'll find the perfect songs for
              your mood
            </p>
          </div>

          {/* Main Card */}
          <Card className="p-8 backdrop-blur-sm bg-[#000]/30 border-white/20 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label
                  htmlFor="mood"
                  className="text-lg font-medium text-white block"
                >
                  How are you feeling today?
                </label>
                <Textarea
                  id="mood"
                  value={moodText}
                  onChange={(e) => {
                    setMoodText(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="I'm feeling happy and energetic... or maybe sad and need some comfort music..."
                  className="min-h-[120px] text-base bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/25 focus:border-white/50"
                  disabled={isLoading}
                />
                {error && <p className="text-red-200 text-sm">{error}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading || !moodText.trim()}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-semibold text-lg h-12 rounded-xl shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin mr-2" />
                    Finding your perfect songs...
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 mr-2" />
                    Get My Music
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Feature Icons */}
          <div className="flex justify-center gap-8 mt-8 text-gray-300">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span className="text-sm">Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              <span className="text-sm">Personalized</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span className="text-sm">Mood-Based</span>
            </div>
          </div>
        </div>
      </div>
    </Vortex>
  );
}
