"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Music, Sparkles } from "lucide-react";
import Link from "next/link";
import { Vortex } from "@/components/ui/vortex";
import { useState, useEffect } from "react";

export default function NotFound() {
  const [glitchText, setGlitchText] = useState("404");

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const glitchChars = ["4", "0", "4", "Ø", "∅"];
      const randomText = Array.from(
        { length: 3 },
        () => glitchChars[Math.floor(Math.random() * glitchChars.length)]
      ).join("");

      setGlitchText(randomText);
      setTimeout(() => setGlitchText("404"), 100);
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <Vortex>
      <div className="min-h-screen overflow-hidden flex items-center justify-center px-4">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white w-full max-w-[90%] sm:max-w-sm md:max-w-md shadow-2xl transform hover:scale-[1.03] transition-all duration-300 relative overflow-hidden">
          {/* Background particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-20"></div>
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-pulse opacity-30"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce opacity-25"></div>
          </div>

          <CardContent className="text-center py-6 px-4 relative z-10">
            {/* Icon section */}
            <div className="mb-6">
              <div className="relative mx-auto w-24 h-24 mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 animate-spin-slow">
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm">
                    <div className="absolute inset-3 rounded-full bg-gradient-to-br from-purple-500/40 to-pink-500/40 animate-pulse">
                      <div className="absolute inset-2 rounded-full bg-purple-900/80 backdrop-blur-md flex items-center justify-center border border-white/10">
                        <Music className="w-6 h-6 text-white animate-bounce" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-3 -right-3 text-xl animate-bounce delay-100">
                  🎵
                </div>
                <div className="absolute -bottom-3 -left-3 text-lg animate-bounce delay-300">
                  🎶
                </div>
              </div>

              <h1 className="text-7xl sm:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3 relative">
                {glitchText}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent opacity-20 animate-pulse">
                  404
                </div>
              </h1>

              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Beat Not Found
                </h2>
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse delay-150" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 mb-6">
              <p className="text-lg sm:text-xl text-white/90 font-medium max-w-md mx-auto leading-relaxed">
                Oops! This page seems to have dropped the beat.
              </p>

              <p className="text-sm sm:text-base text-white/70 max-w-sm mx-auto leading-relaxed">
                The page you're looking for might have been moved, deleted, or
                is taking a solo break.
              </p>
            </div>

            {/* Button */}
            <div className="flex justify-center">
              <Link href="/">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-semibold text-base px-8 py-4 rounded-xl shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 group cursor-pointer"
                >
                  <Home className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Animations */}
        <style jsx>{`
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .animate-spin-slow {
            animation: spin-slow 4s linear infinite;
          }
        `}</style>
      </div>
    </Vortex>
  );
}
