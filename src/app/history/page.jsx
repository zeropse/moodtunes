"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Clock, Trash2, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Vortex } from "@/components/ui/vortex";

export default function History() {
  const [moodHistory, setMoodHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadHistory = () => {
      try {
        const savedHistory = localStorage.getItem("moodMusicHistory");
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory);
          const sortedHistory = parsedHistory
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 3);
          setMoodHistory(sortedHistory);
        }
      } catch (error) {
        console.error("Error loading mood history:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    loadHistory();
  }, []);

  const clearHistory = () => {
    if (
      window.confirm("Are you sure you want to clear all your mood history?")
    ) {
      localStorage.removeItem("moodMusicHistory");
      setMoodHistory([]);
    }
  };

  const clearEntry = (indexToRemove, e) => {
    e.stopPropagation();
    const updatedHistory = moodHistory.filter(
      (_, index) => index !== indexToRemove
    );
    setMoodHistory(updatedHistory);
    localStorage.setItem("moodMusicHistory", JSON.stringify(updatedHistory));
  };

  const viewDetail = (index) => {
    const entry = moodHistory[index];
    sessionStorage.setItem("selectedHistoryEntry", JSON.stringify(entry));
    router.push(`/history/${index}`);
  };

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
      <Vortex>
        <div className="min-h-screen flex items-center justify-center px-4">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-2xl w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center space-y-6 py-12 px-6">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                <div className="absolute inset-2 w-8 h-8 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin animate-reverse"></div>
              </div>
              <p className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Loading your mood history...
              </p>
              <p className="text-sm text-white/60 text-center">
                Gathering your musical memories
              </p>
            </CardContent>
          </Card>
        </div>
      </Vortex>
    );
  }

  return (
    <Vortex>
      <div className="min-h-screen px-4 py-6 flex flex-col">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Mood History
          </h1>

          {moodHistory.length > 0 && (
            <Button
              size="sm"
              variant="destructive"
              onClick={clearHistory}
              className="text-white rounded-lg cursor-pointer"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All History
            </Button>
          )}
        </div>

        {/* Content  */}
        <div className="flex-1 flex items-center justify-center">
          {moodHistory.length === 0 ? (
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-2xl max-w-md w-full">
              <CardContent className="text-center py-12 px-6 space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 animate-pulse"></div>
                  <Clock className="w-10 h-10 text-white/80 relative z-10" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Your Story Awaits
                </h2>

                <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                  Begin your emotional musical journey. Share your feelings and
                  discover the perfect soundtrack.
                </p>

                <Link href="/">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white text-sm py-3 px-6 rounded-xl shadow-md cursor-pointer"
                  >
                    <Music className="w-4 h-4 mr-2" />
                    Start Your Journey
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="w-full max-w-4xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {moodHistory.map((entry, index) => (
                  <Card
                    key={index}
                    className="bg-white/5 backdrop-blur-xl border-white/10 text-white hover:bg-white/10 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 cursor-pointer group"
                    onClick={() => viewDetail(index)}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <CardContent className="p-4 sm:p-6 space-y-4 relative">
                      <div className="flex justify-between items-center text-xs text-white/60">
                        <span>{formatTimestamp(entry.timestamp)}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => clearEntry(index, e)}
                          className="text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-white/80">
                            Your Mood
                          </span>
                        </div>
                        <div className="bg-blue-500/10 border-l-4 border-blue-400 p-3 rounded-md">
                          <p className="text-sm">"{entry.mood}"</p>
                        </div>
                      </div>

                      {entry.moodAnalysis && (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Music className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium text-white/80">
                              AI Analysis
                            </span>
                          </div>
                          <div className="bg-green-500/10 p-3 rounded-md">
                            <p className="text-lg font-bold text-green-300">
                              {entry.moodAnalysis.mood}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t border-white/10 text-xs text-white/50 group-hover:text-white/80 flex justify-center items-center gap-2">
                        View Details
                        <ArrowRight
                          className={`w-4 h-4 transition-transform ${
                            hoveredCard === index ? "translate-x-1" : ""
                          }`}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        .animate-reverse {
          animation: reverse 2s linear infinite;
        }
      `}</style>
    </Vortex>
  );
}
