"use client";

import CTA from "@/components/cta";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is MoodTunes?",
    answer:
      "MoodTunes is a web application that analyzes text descriptions of your mood and suggests songs that might match how you're feeling.",
  },
  {
    question: "How does MoodTunes analyze my mood?",
    answer:
      "The app analyzes your text input using Gemini AI for faster and more accurate results. If Gemini AI is unavailable, it falls back on natural language processing to understand your emotional state and match it with appropriate musical characteristics.",
  },
  {
    question: "Is MoodTunes free to use?",
    answer:
      "Yes, MoodTunes is currently free to use for all basic mood-based song suggestions.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "Yes, creating an account is necessary to access all features and save your mood analysis history.",
  },
  {
    question: "Can I connect my Spotify account?",
    answer:
      "No all features are available without Spotify integration at this time.",
  },
  {
    question: "What kind of music does MoodTunes suggest?",
    answer:
      "It suggests various genres and styles, ranging from lo-fi and classical to upbeat pop, depending on your input.",
  },
  {
    question: "Can I save my mood analysis results?",
    answer: "If you have an account, your results are saved to your profile.",
  },
  {
    question: "Is my data private?",
    answer:
      "Your descriptions are handled according to standard privacy practices. We do not sell your personal mood data to third parties.",
  },
];

const FAQPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-6 pt-32 pb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto">
            Find answers to common questions about MoodTunes.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={`faq-${index}`}
                value={`item-${index}`}
                className="border rounded-lg px-4 bg-card transition-all hover:bg-accent/20"
              >
                <AccordionTrigger className="hover:no-underline py-4 text-left font-medium cursor-pointer">
                  <span className="text-base sm:text-lg">{faq.question}</span>
                </AccordionTrigger>

                <AccordionContent className="pb-4 text-muted-foreground leading-relaxed">
                  <div className="pt-1">{faq.answer}</div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CTA />
    </div>
  );
};

export default FAQPage;
