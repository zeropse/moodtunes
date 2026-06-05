import CTA from "@/components/cta";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about MoodTunes, how it works, and how your data is handled.",
};

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
    question: "Where is my data stored?",
    answer:
      "To ensure maximum privacy and speed, all your mood results, history, and account settings are stored locally in your browser's storage. We do not maintain a central database of your personal moods.",
  },
  {
    question: "What happens if I clear my browser's cache?",
    answer:
      "Since your data is stored locally, clearing your browser's 'Local Storage' or 'Site Data' will remove your history and local account profile. Your account cannot be recovered once this data is wiped.",
  },
  {
    question: "Can I access my history on another device?",
    answer:
      "Not at this time. Because the data lives inside your specific browser, your history is unique to the device and browser you used to generate it.",
  },
  {
    question: "Is my password safe if it's stored locally?",
    answer:
      "Yes. Your password is never stored in plain text. We use industry-standard SHA-256 cryptographic hashing to ensure that your actual password is never readable, even by someone with access to your device.",
  },
  {
    question: "Can I connect my Spotify account?",
    answer:
      "No, all features of MoodTunes are available without requiring a Spotify login at this time.",
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
                className="border rounded-lg px-4 bg-card transition-all hover:bg-accent/20">
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
