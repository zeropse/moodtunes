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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CTA from "@/components/cta";
import Link from "next/link";

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
  },
  {
    id: "mood-analysis",
    title: "Mood Analysis",
    description:
      "Advanced emotion analysis using sophisticated algorithms for perfect song matching.",
    icon: "IconBrain",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: "spotify-integration",
    title: "Spotify Integration",
    description:
      "Seamlessly play and save playlists to Spotify with one click.",
    icon: "IconBrandSpotify",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

const howItWorksSteps = [
  {
    step: 1,
    title: "Share Your Mood",
    description:
      "Tell us how you're feeling in your own words. Our advanced mood analysis understands complex emotions.",
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
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl">
            Your emotions, <span>your soundtrack</span>
          </h1>

          <p className="mb-10 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed">
            Transform your feelings into the perfect playlist. Our advanced mood
            analysis technology analyzes your mood and discovers songs that
            resonate with your emotional state.
          </p>

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <Button>
              Get Started Free <IconArrowRight size={20} />
            </Button>

            <Link href="/about">
              <Button variant="outline">Learn More</Button>
            </Link>
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
                className={`relative overflow-hidden border-none shadow-md transition-all duration-300 group hover:shadow-xl`}
              >
                <CardHeader className="relative">
                  <div
                    className={`w-14 h-14 flex items-center justify-center rounded-2xl ${feature.iconBg} ${feature.iconColor} group-hover:scale-110 transition-transform`}
                  >
                    <Icon size={28} strokeWidth={2.5} />
                  </div>
                  <CardTitle className="text-xl font-bold pt-2">
                    {feature.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* --- How It Works --- */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our streamlined process designed for
              efficiency.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {howItWorksSteps.map((step, index) => {
              const Icon = ICONS[step.icon];

              return (
                <Card
                  key={step.step}
                  className="relative overflow-hidden border-none shadow-md transition-all hover:shadow-xl"
                >
                  <CardHeader className="relative">
                    <div className="w-14 h-14 mb-2 flex items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                      <Icon size={28} strokeWidth={2.5} />
                    </div>
                    <CardTitle className="text-xl font-bold pt-2">
                      {step.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="relative">
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <CTA />
    </div>
  );
}
