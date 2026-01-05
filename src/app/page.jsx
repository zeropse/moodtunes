"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Spinner } from "@/components/ui/spinner";
import CTA from "@/components/cta";

const howItWorksSteps = [
  {
    title: "Share Your Mood",
    description:
      "Tell us how you're feeling in your own words. Our advanced mood analysis understands complex emotions.",
    icon: IconMessageCircle,
  },
  {
    title: "Advanced Analysis",
    description:
      "Our sophisticated algorithms analyze your emotional state and musical preferences to find perfect matches.",
    icon: IconSearch,
  },
  {
    title: "Discover Music",
    description:
      "Get a curated playlist of songs that perfectly match your current emotional state and energy level.",
    icon: IconMusic,
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
      "Instantly find songs on Spotify that match your mood. Click any suggestion to listen to a preview or open it in the Spotify app.",
    icon: IconBrandSpotify,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is MoodTunes free?",
    answer:
      "Yes, MoodTunes is currently free to use for all basic mood-based song suggestions.",
  },
  {
    question: "How does it work?",
    answer:
      "We use Gemini AI to analyze the emotional sentiment of your text and match it with songs that share similar emotional characteristics.",
  },
  {
    question: "Do I need to connect Spotify?",
    answer:
      "No, you can get recommendations without a Spotify account. However, you can click on any song to open it in Spotify and listen to the full track.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);

  const handleScrollToAbout = useCallback(() => {
    const el = document.getElementById("about");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleGetStarted = useCallback(() => {
    router.push("/app");
  }, [router]);

  return (
    <div className="min-h-screen">
      {/* --- Hero Section --- */}
      <section className="relative px-6 pt-24 pb-16 md:pt-40 md:pb-32 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl lg:leading-[1.05]">
            Your emotions, <br />
            <span className="text-primary">your soundtrack</span>
          </h1>

          <p className="mb-10 text-lg text-muted-foreground md:text-xl max-w-xl mx-auto leading-relaxed">
            Transform your feelings into the perfect playlist. Our advanced mood
            analysis technology analyzes your mood and discovers songs that
            resonate with your emotional state.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              className="px-8 h-12 text-base font-bold transition-all hover:shadow-lg group cursor-pointer"
              onClick={handleGetStarted}
            >
              Get Started
              <IconArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              className="px-8 h-12 text-base font-medium transition-all hover:bg-secondary/80 cursor-pointer"
              onClick={handleScrollToAbout}
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* App Preview Image */}
        <div className="mt-16 max-w-5xl mx-auto">
          <Card className="overflow-hidden shadow-2xl border border-border/50 bg-muted/30 p-2 relative min-h-50 flex items-center justify-center">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                <Spinner className="size-8 text-primary" />
              </div>
            )}
            <Image
              src="/landing.png"
              alt="MoodTunes App Preview"
              width={1200}
              height={800}
              className={`rounded-xl w-full h-auto transition-opacity duration-500 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setImageLoading(false)}
              priority
            />
          </Card>
        </div>
      </section>

      {/* --- How It Works --- */}
      <section className="px-6 py-24 bg-secondary/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              How It Works
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {howItWorksSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <Card
                  key={step.title}
                  className="group border-none shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <CardHeader>
                    <div className="w-14 h-14 mb-4 flex items-center justify-center rounded-2xl bg-muted shadow-inner text-primary group-hover:scale-110 transition-transform duration-300">
                      <Icon size={28} strokeWidth={1.5} />
                    </div>
                    <CardTitle className="text-xl font-bold flex items-center">
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

      {/* --- Features --- */}
      <section id="about" className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-24 md:space-y-40">
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
                  className={`flex flex-col items-center justify-between gap-12 md:gap-20 ${
                    reverse ? "md:flex-row-reverse" : "md:flex-row"
                  }`}
                >
                  {/* Text Content */}
                  <div
                    className={`flex-1 space-y-5 text-center ${
                      reverse ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    <h3 className="text-3xl font-bold tracking-tight md:text-4xl">
                      {title}
                    </h3>
                    <p
                      className={`text-muted-foreground text-lg leading-relaxed md:max-w-md ${
                        reverse ? "md:ml-auto" : "md:mr-auto"
                      }`}
                    >
                      {description}
                    </p>
                  </div>

                  {/* Icon Visual */}
                  <div
                    className={`flex-1 flex ${
                      reverse ? "md:justify-start" : "md:justify-end"
                    }`}
                  >
                    <div
                      className={`relative aspect-square w-full max-w-70 rounded-[3rem] flex items-center justify-center shadow-2xl transition-all duration-1500 hover:rotate-360 ${iconBg}`}
                    >
                      <Icon
                        size={100}
                        strokeWidth={1}
                        className={`${iconColor} drop-shadow-sm`}
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* --- FAQ Preview --- */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Common Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Button
            variant="link"
            onClick={() => router.push("/faqs")}
            className="mx-auto block cursor-pointer"
          >
            View all FAQs
          </Button>
        </div>
      </section>

      {/* --- CTA --- */}
      <CTA />
    </div>
  );
}
