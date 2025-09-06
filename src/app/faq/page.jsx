"use client";
import { Vortex } from "@/components/ui/vortex";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "What is MoodTunes?",
      answer:
        "MoodTunes is a platform that analyzes your mood and suggests songs to match it.",
    },
    {
      question: "How does MoodTunes analyze my mood?",
      answer:
        "MoodTunes uses advanced algorithms and your input to determine your mood.",
    },
    {
      question: "Is MoodTunes free to use?",
      answer: "Yes, MoodTunes is completely free to use.",
    },
    {
      question: "Can I connect my Spotify account?",
      answer:
        "Yes, you can connect your Spotify account to directly play suggested songs.",
    },
    {
      question: "How can I provide feedback?",
      answer:
        "You can provide feedback through the contact form on our website.",
    },
  ];

  return (
    <Vortex>
      <div className="min-h-screen py-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="text-center">
            <h1 className="text-3xl font-bold text-white">
              Frequently Asked Questions
            </h1>
          </header>
          {faqs.map((faq, index) => (
            <Card key={index} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  {faq.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white text-base">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Vortex>
  );
};

export default FAQ;
