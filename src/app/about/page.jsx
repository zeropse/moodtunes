import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  IconMusic,
  IconMessageHeart,
  IconSparkles,
  IconPlayerPlay,
  IconBrandSpotify,
  IconMicrophone,
  IconArrowRight,
} from "@tabler/icons-react";

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
          <StepCard
            icon={<IconMicrophone size={28} stroke={1.5} />}
            title="Describe Your Mood"
            description="Tell us how you're feeling in your own words. Be as descriptive as you like!"
          />
          <StepCard
            icon={<IconSparkles size={28} stroke={1.5} />}
            title="Advanced Analysis"
            description="Analyze your emotions and musical preferences to find the perfect match."
          />
          <StepCard
            icon={<IconPlayerPlay size={28} stroke={1.5} />}
            title="Enjoy Your Music"
            description="Get personalized song recommendations and listen on Spotify instantly."
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-center tracking-tight">
            Features
          </h2>
          <div className="space-y-12">
            <FeatureRow
              title="Advanced Mood Analysis"
              description="Our sophisticated system understands the nuances of human emotion, analyzing your mood description to identify the perfect musical match."
              icon={<IconMessageHeart size={32} stroke={1.5} />}
            />
            <FeatureRow
              title="Personalized Suggestions"
              description="Every recommendation is tailored to your specific emotional state, ensuring you get music that truly resonates with how you feel."
              icon={<IconMusic size={32} stroke={1.5} />}
              reverse
            />
            <FeatureRow
              title="Spotify Integration"
              description="Seamlessly connect with Spotify to access songs. Click any suggestion to open it directly in Spotify."
              icon={<IconBrandSpotify size={32} stroke={1.5} />}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to find your soundtrack?
          </h2>
          <p className="text-zinc-600 mb-6">
            Tell us how you&apos;re feeling and get personalized song
            recommendations instantly.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full shadow-lg transition-transform hover:shadow-xl"
            >
              <Link href="/" aria-label="Get started">
                Get Started
                <IconArrowRight
                  size={18}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StepCard({ icon, title, description }) {
  return (
    <div className="p-8 rounded-3xl border border-zinc-100 hover:border-zinc-300 transition-all duration-300 shadow-sm hover:shadow-md">
      <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center mb-6 text-zinc-900">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <p className="text-zinc-500 leading-relaxed text-sm">{description}</p>
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
