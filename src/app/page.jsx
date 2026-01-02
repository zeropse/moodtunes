"use client";

import React, { useCallback } from "react";
import {
  IconBrandSpotify,
  IconMessageCircle,
  IconSearch,
  IconMusic,
  IconMessageHeart,
  IconArrowRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CTA from "@/components/cta";

const ICONS = {
  IconMessageCircle,
  IconSearch,
  IconMusic,
};

const howItWorksSteps = [
  {
    title: "Share Your Mood",
    description:
      "Tell us how you're feeling in your own words. Our advanced mood analysis understands complex emotions.",
    icon: "IconMessageCircle",
  },
  {
    title: "Advanced Analysis",
    description:
      "Our sophisticated algorithms analyze your emotional state and musical preferences to find perfect matches.",
    icon: "IconSearch",
  },
  {
    title: "Discover Music",
    description:
      "Get a curated playlist of songs that perfectly match your current emotional state and energy level.",
    icon: "IconMusic",
  },
];

const FEATURES = [
  {
    title: "Advanced Mood Analysis",
    description:
      "Our sophisticated system understands the nuances of human emotion, analyzing your mood description to identify the perfect musical match.",
    icon: IconMessageHeart,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    title: "Personalized Suggestions",
    description:
      "Every recommendation is tailored to your specific emotional state, ensuring you get music that truly resonates with how you feel.",
    icon: IconMusic,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    reverse: true,
  },
  {
    title: "Spotify Integration",
    description:
      "Seamlessly connect with Spotify to access songs. Click any suggestion to open it directly in Spotify.",
    icon: IconBrandSpotify,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

export default function HomePage() {
  const handleScrollToAbout = useCallback(() => {
    const el = document.getElementById("about");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="min-h-screen">
      {/* --- Hero Section --- */}
      <section className="relative px-6 pt-32 pb-20 text-center lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <h1 className="mb-8 text-6xl font-black tracking-tighter md:text-8xl lg:leading-[1.1]">
            Your emotions, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/60">
              your soundtrack
            </span>
          </h1>

          <p className="mb-12 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Transform your feelings into the perfect playlist. Our AI-driven
            technology discovers songs that resonate with your unique emotional
            state.
          </p>

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center items-center">
            <Button className="px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-xl cursor-pointer">
              Get Started <IconArrowRight size={18} />
            </Button>

            <Button
              variant="outline"
              className="px-8 h-12 text-base cursor-pointer"
              onClick={handleScrollToAbout}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* --- How It Works --- */}
      <section className="px-6 py-36">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h3 className="text-4xl font-bold tracking-tight md:text-5xl">
              How It Works
            </h3>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {howItWorksSteps.map((step) => {
              const Icon = ICONS[step.icon];
              return (
                <Card
                  key={step.title}
                  className="relative overflow-hidden border-none shadow-md"
                >
                  <CardHeader>
                    <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-xl bg-primary/10 transition-colors">
                      <Icon
                        size={24}
                        strokeWidth={2}
                        className="text-primary"
                      />
                    </div>
                    <CardTitle className="text-xl font-bold">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
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

      {/* ---  Features --- */}
      <section id="about" className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-32">
            {FEATURES.map(
              (
                { title, description, icon: Icon, reverse, iconBg, iconColor },
                index
              ) => (
                <div
                  key={title}
                  className={`flex flex-col items-center gap-12 lg:gap-24 ${
                    reverse ? "md:flex-row-reverse" : "md:flex-row"
                  }`}
                >
                  {/* Text Content */}
                  <div className="flex-1 space-y-6 w-full">
                    <h3 className="text-3xl font-bold tracking-tight md:text-4xl leading-tight">
                      {title}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
                      {description}
                    </p>
                  </div>

                  <div className="flex-1 flex justify-center w-full">
                    <div
                      className={`group relative h-48 w-48 md:h-64 md:w-64 rounded-4xl flex items-center justify-center shadow-xl border-2 transition-transform hover:scale-105 ${iconBg}`}
                    >
                      <Icon
                        size={120}
                        strokeWidth={1.25}
                        className={`${iconColor}`}
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <CTA />
    </div>
  );
}
