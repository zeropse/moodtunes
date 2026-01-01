"use client";

import React from "react";
import {
  IconBolt,
  IconBrain,
  IconBrandSpotify,
  IconMessageCircle,
  IconSearch,
  IconMusic,
  IconArrowRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* --- Hero Section --- */}
      <section className="relative px-6 pt-24 pb-16 text-center md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-300 blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-300 blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl">
            Your emotions,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              your soundtrack
            </span>
          </h1>
          <p className="mb-10 text-lg text-slate-600 md:text-xl max-w-2xl mx-auto leading-relaxed">
            Transform your feelings into the perfect playlist. Our advanced mood
            analysis technology analyzes your mood and discovers songs that
            resonate with your emotional state.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <Button
              size="lg"
              className="px-8 py-4 text-white bg-slate-900 rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
            >
              Get Started Free <IconArrowRight size={20} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 bg-white border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all shadow-sm"
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* --- Feature Cards --- */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
          {/* Lightning Fast */}
          <Card className="p-8 border border-slate-100 rounded-3xl bg-slate-50/50 hover:shadow-xl hover:shadow-purple-50 transition-all duration-300 group">
            <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-2xl bg-amber-100 text-amber-600 group-hover:scale-110 transition-transform">
              <IconBolt size={28} stroke={2} />
            </div>
            <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-slate-600 leading-relaxed">
              Get personalized music recommendations in seconds with our
              optimized mood analysis engine.
            </p>
          </Card>

          {/* Mood Analysis */}
          <Card className="p-8 border border-slate-100 rounded-3xl bg-slate-50/50 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 group">
            <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-2xl bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform">
              <IconBrain size={28} stroke={2} />
            </div>
            <h3 className="text-xl font-bold mb-3">Mood Analysis</h3>
            <p className="text-slate-600 leading-relaxed">
              Advanced emotion analysis using sophisticated algorithms for
              perfect song matching.
            </p>
          </Card>

          {/* Spotify Integration */}
          <Card className="p-8 border border-slate-100 rounded-3xl bg-slate-50/50 hover:shadow-xl hover:shadow-emerald-50 transition-all duration-300 group">
            <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform">
              <IconBrandSpotify size={28} stroke={2} />
            </div>
            <h3 className="text-xl font-bold mb-3">Spotify Integration</h3>
            <p className="text-slate-600 leading-relaxed">
              Seamlessly play and save playlists to Spotify with one click.
            </p>
          </Card>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold md:text-4xl">How It Works</h2>
          <div className="w-20 h-1.5 bg-purple-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-3 relative">
          {/* Step 1 */}
          <div className="relative flex flex-col items-center text-center">
            <div className="z-10 w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-white border-4 border-purple-50 shadow-md">
              <IconMessageCircle size={32} className="text-purple-500" />
            </div>
            <h4 className="text-xl font-bold mb-3">Share Your Mood</h4>
            <p className="text-slate-600">
              Tell us how you're feeling in your own words. Our advanced mood
              analysis understands complex emotions and nuances.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col items-center text-center">
            <div className="z-10 w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-white border-4 border-purple-50 shadow-md">
              <IconSearch size={32} className="text-purple-500" />
            </div>
            <h4 className="text-xl font-bold mb-3">Advanced Analysis</h4>
            <p className="text-slate-600">
              Our sophisticated algorithms analyze your emotional state and
              musical preferences to find perfect matches.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col items-center text-center">
            <div className="z-10 w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-white border-4 border-purple-50 shadow-md">
              <IconMusic size={32} className="text-purple-500" />
            </div>
            <h4 className="text-xl font-bold mb-3">Discover Music</h4>
            <p className="text-slate-600">
              Get a curated playlist of songs that perfectly match your current
              emotional state and energy level.
            </p>
          </div>
        </div>
      </section>

      {/* --- Final CTA --- */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto p-12 md:p-20 rounded-[3rem] bg-slate-900 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-[80px]" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold md:text-5xl mb-6">
              Ready to discover your soundtrack?
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of users who have found their perfect music match.
              Start your emotional journey today.
            </p>
            <Button
              size="lg"
              className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-100 transition-colors shadow-xl"
            >
              Create My Playlist Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
