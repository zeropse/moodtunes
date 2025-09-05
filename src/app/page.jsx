"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Music, Sparkles, Heart, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [moodText, setMoodText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!moodText.trim()) {
      setError("Please tell us how you're feeling");
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

      if (!moodResponse.ok) throw new Error("Failed to analyze mood");
      const moodData = await moodResponse.json();
      const analysisData = moodData.success ? moodData.data : moodData;

      // Generate suggestions
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
        }),
      });

      if (!suggestionsResponse.ok)
        throw new Error("Failed to generate suggestions");
      const suggestionsData = await suggestionsResponse.json();
      const suggestions = suggestionsData.success
        ? suggestionsData.suggestions
        : suggestionsData;

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
      setError("Something went wrong. Please try again.");
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
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Music className="w-8 h-8 text-white" />
            <h1 className="text-4xl font-bold text-white">MoodTunes</h1>
          </div>
          <p className="text-xl text-gray-100 text-balance">
            Tell us how you're feeling and we'll find the perfect songs for your
            mood
          </p>
        </div>

        {/* Main Card */}
        <Card className="p-8 backdrop-blur-sm bg-black/30 border-white/20 shadow-2xl">
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
              className="w-full bg-white text-purple-600 hover:bg-white/90 font-semibold text-lg h-12 cursor-pointer"
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
  );
}
