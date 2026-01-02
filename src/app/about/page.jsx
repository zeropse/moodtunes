"use client";

import CTA from "@/components/cta";
import {
  IconMusic,
  IconMessageHeart,
  IconSparkles,
  IconPlayerPlay,
  IconBrandSpotify,
  IconMicrophone,
} from "@tabler/icons-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const HOW_TO_USE = [
  {
    title: "Describe Your Mood",
    description:
      "Tell us how you're feeling in your own words. Be as descriptive as you like!",
    icon: IconMicrophone,
  },
  {
    title: "Advanced Analysis",
    description:
      "Analyze your emotions and musical preferences to find the perfect match.",
    icon: IconSparkles,
  },
  {
    title: "Enjoy Your Music",
    description:
      "Get personalized song recommendations and listen on Spotify instantly.",
    icon: IconPlayerPlay,
  },
];

const FEATURES = [
  {
    title: "Advanced Mood Analysis",
    description:
      "Our sophisticated system understands the nuances of human emotion, analyzing your mood description to identify the perfect musical match.",
    icon: IconMessageHeart,
  },
  {
    title: "Personalized Suggestions",
    description:
      "Every recommendation is tailored to your specific emotional state, ensuring you get music that truly resonates with how you feel.",
    icon: IconMusic,
    reverse: true,
  },
  {
    title: "Spotify Integration",
    description:
      "Seamlessly connect with Spotify to access songs. Click any suggestion to open it directly in Spotify.",
    icon: IconBrandSpotify,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-6 pt-32 pb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            About MoodTunes
          </h1>
          <p className="text-xl md:text-2xl text-zinc-500 font-light max-w-2xl mx-auto">
            Discover the perfect soundtrack for your emotions.
          </p>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {HOW_TO_USE.map(({ title, description, icon: Icon }) => (
            <Card
              key={title}
              className="p-8 rounded-3xl border border-zinc-100 hover:border-zinc-300 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-200 dark:bg-zinc-50 flex items-center justify-center text-zinc-900">
                <Icon size={28} stroke={1.5} />
              </div>

              <CardHeader className="p-0">
                <CardTitle className="text-lg font-bold">{title}</CardTitle>
                <CardDescription className="text-zinc-500 leading-relaxed text-sm">
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-center tracking-tight">
            Features
          </h2>

          <div className="space-y-12">
            {FEATURES.map(({ title, description, icon: Icon, reverse }) => (
              <FeatureRow
                key={title}
                title={title}
                description={description}
                reverse={reverse}
                icon={<Icon size={32} stroke={1.5} />}
              />
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </div>
  );
}

function FeatureRow({ title, description, icon, reverse = false }) {
  return (
    <div
      className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
        <p className="text-zinc-600 leading-relaxed">{description}</p>
      </div>

      <div className="shrink-0">
        <div className="w-20 h-20 rounded-full border border-zinc-200 flex items-center justify-center shadow-inner">
          {icon}
        </div>
      </div>
    </div>
  );
}
