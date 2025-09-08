"use client";
import { Vortex } from "@/components/ui/vortex";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "What is MoodTunes?",
      answer:
        "MoodTunes is a web application that analyzes text descriptions of your mood and suggests songs that might match how you're feeling. You can describe your current mood or situation, and the app will provide music recommendations.",
    },
    {
      question: "How does MoodTunes analyze my mood?",
      answer:
        "You type in a description of how you're feeling or what you're doing, and MoodTunes processes this text to understand your mood. The app then suggests songs that might fit your emotional state or activity.",
    },
    {
      question: "Is MoodTunes free to use?",
      answer:
        "Yes, MoodTunes is free to use. You can get mood-based song suggestions without any cost.",
    },
    {
      question: "Do I need to create an account?",
      answer:
        "Yes creating an account is necessary to access all features and save your mood analysis history.",
    },
    {
      question: "Can I connect my Spotify account?",
      answer:
        "MoodTunes may have Spotify integration features in the future. For now, you can use the app without a Spotify account.",
    },
    {
      question: "What kind of music does MoodTunes suggest?",
      answer:
        "MoodTunes suggests various types of music based on your described mood. The suggestions can range across different genres and styles depending on what the system thinks matches your emotional state.",
    },
    {
      question: "Can I save my mood analysis results?",
      answer:
        "If you have an account, your mood analyses may be saved so you can look back at previous sessions and see what music was suggested for different moods. Check Local Storage for details.",
    },
    {
      question: "How do I use MoodTunes?",
      answer:
        "Simply visit the website, describe your current mood or what you're feeling in the text input, and MoodTunes will analyze your input and provide song suggestions that match your description.",
    },
    {
      question: "Is my data private?",
      answer:
        "Your mood descriptions and usage data are handled according to standard web application privacy practices. Check the privacy policy for specific details about data handling and storage.",
    },
    {
      question: "How can I get help or report issues?",
      answer:
        "If you encounter any issues or have questions, you can reach out through the contact methods provided on the website or report bugs through the appropriate channels.",
    },
  ];

  return (
    <Vortex>
      <div className="min-h-screen py-10">
        <div className="max-w-4xl mx-auto space-y-8 px-6">
          <header className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Everything you need to know about MoodTunes and how it works to
              bring you the perfect music for your mood.
            </p>
          </header>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gray-700 bg-black/20 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline cursor-pointer">
                  <div className="flex items-start text-white">
                    <span className="text-blue-400 mr-3 font-mono text-lg">
                      Q{index + 1}.
                    </span>
                    <span className="text-xl font-semibold">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <p className="text-gray-200 text-base leading-relaxed ml-8">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Vortex>
  );
};

export default FAQ;
