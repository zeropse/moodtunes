"use client";

import React from "react";
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
import Link from "next/link";

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
  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      {/* --- Hero Section --- */}
      <section className="relative px-6 pt-32 pb-20 text-center lg:pt-48 lg:pb-32 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 blur-3xl"
          aria-hidden="true"
        >
          <div className="aspect-square w-[60%] rounded-full bg-linear-to-tr from-primary/20 to-secondary/20 mx-auto" />
        </div>

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
            <Button
              size="lg"
              className="px-8 h-12 text-base rounded-full shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
            >
              Get Started Free <IconArrowRight className="ml-2" size={18} />
            </Button>

            <Link href="#about">
              <Button
                variant="ghost"
                size="lg"
                className="px-8 h-12 text-base rounded-full"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- How It Works --- */}
      <section className="px-6 py-32 bg-secondary/50">
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
                  className="relative overflow-hidden border-none shadow-md bg-background"
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

      {/* --- About / Features --- */}
      <section id="about" className="px-6 py-32">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-32">
            {FEATURES.map(
              ({
                title,
                description,
                icon: Icon,
                reverse,
                iconBg,
                iconColor,
              }) => (
                <div
                  key={title}
                  className={`flex flex-col md:flex-row items-center gap-12 lg:gap-24 ${
                    reverse ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1 space-y-6">
                    <div
                      className={`inline-flex p-3 rounded-2xl ${iconBg} ${iconColor} mb-2`}
                    >
                      <Icon size={32} />
                    </div>
                    <h3 className="text-3xl font-bold tracking-tight md:text-4xl leading-tight">
                      {title}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
                      {description}
                    </p>
                  </div>

                  <div className="flex-1 w-full aspect-square max-w-96 relative group">
                    <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent rounded-3xl -rotate-3 group-hover:rotate-0 transition-transform" />
                    <div className="relative h-full w-full bg-background border-2 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden">
                      <Icon
                        size={120}
                        strokeWidth={0.5}
                        className={`${iconColor} opacity-20`}
                      />
                      <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-background/80 backdrop-blur-md border shadow-sm">
                        <div className="h-2 w-24 bg-muted rounded-full mb-2" />
                        <div className="h-2 w-16 bg-muted/60 rounded-full" />
                      </div>
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
