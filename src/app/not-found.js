"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Music } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-2xl mx-auto">
            <CardContent className="text-center py-16 px-8">
              {/* 404 Animation */}
              <div className="mb-8">
                <div className="relative mx-auto w-32 h-32">
                  {/* Spinning record effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-spin-slow">
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-900 to-blue-900">
                      <div className="absolute inset-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                        <div className="absolute inset-2 rounded-full bg-purple-900 flex items-center justify-center">
                          <Music className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 404 Text */}
              <div className="mb-8">
                <h1 className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                  404
                </h1>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Page Not Found
                </h2>
                <p className="text-lg text-white/80 mb-6 max-w-md mx-auto">
                  Looks like this page went off-beat! The page you're looking
                  for doesn't exist or may have been moved to a different
                  rhythm.
                </p>
              </div>

              {/* Suggestions */}
              <div className="space-y-6">
                {/* Main Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Link href="/">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8"
                    >
                      <Home className="w-5 h-5 mr-2" />
                      Go Home
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
