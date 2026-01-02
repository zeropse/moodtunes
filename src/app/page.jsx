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
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CTA from "@/components/cta";

const ICONS = {
  IconBolt,
  IconBrain,
  IconBrandSpotify,
  IconMessageCircle,
  IconSearch,
  IconMusic,
};

const featureCards = [
  {
    id: "lightning-fast",
    title: "Lightning Fast",
    description:
      "Get personalized music recommendations in seconds with our optimized mood analysis engine.",
    icon: "IconBolt",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    hoverShadow: "hover:shadow-purple-50",
  },
  {
    id: "mood-analysis",
    title: "Mood Analysis",
    description:
      "Advanced emotion analysis using sophisticated algorithms for perfect song matching.",
    icon: "IconBrain",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    hoverShadow: "hover:shadow-blue-50",
  },
  {
    id: "spotify-integration",
    title: "Spotify Integration",
    description:
      "Seamlessly play and save playlists to Spotify with one click.",
    icon: "IconBrandSpotify",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    hoverShadow: "hover:shadow-emerald-50",
  },
];

const howItWorksSteps = [
  {
    step: 1,
    title: "Share Your Mood",
    description:
      "Tell us how you're feeling in your own words. Our advanced mood analysis understands complex emotions and nuances.",
    icon: "IconMessageCircle",
  },
  {
    step: 2,
    title: "Advanced Analysis",
    description:
      "Our sophisticated algorithms analyze your emotional state and musical preferences to find perfect matches.",
    icon: "IconSearch",
  },
  {
    step: 3,
    title: "Discover Music",
    description:
      "Get a curated playlist of songs that perfectly match your current emotional state and energy level.",
    icon: "IconMusic",
  },
];

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
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-600">
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
              className="px-8 py-4 text-white bg-slate-900 rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
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
          {featureCards.map((feature) => {
            const Icon = ICONS[feature.icon];

            return (
              <Card
                key={feature.id}
                className={`p-8 border border-slate-100 rounded-3xl  hover:shadow-xl ${feature.hoverShadow} transition-all duration-300 group`}
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-2xl ${feature.iconBg} ${feature.iconColor} group-hover:scale-110 transition-transform`}
                >
                  <Icon size={28} stroke={2} />
                </div>

                <CardHeader className="p-0">
                  <CardTitle className="text-xl font-bold">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* --- How It Works --- */}
      <section className="px-6 py-24">
        <h2 className="text-3xl font-bold md:text-4xl">How It Works</h2>

        <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-3">
          {howItWorksSteps.map((step) => {
            const Icon = ICONS[step.icon];

            return (
              <div
                key={step.step}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-white border-4">
                  <Icon size={32} className="text-purple-500" />
                </div>

                <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                <p className="text-slate-600">{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- CTA --- */}
      <CTA />
    </div>
  );
}
