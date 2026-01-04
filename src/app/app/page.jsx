"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconSend2, IconMusic } from "@tabler/icons-react";
import prompts from "@/data/prompts.json";
import { Spinner } from "@/components/ui/spinner";
import { saveMoodToHistory } from "@/lib/history-utils";

export default function AppPage() {
  const router = useRouter();
  const [placeholder] = useState(
    () =>
      prompts.placeholders[
        Math.floor(Math.random() * prompts.placeholders.length)
      ]
  );

  const [footer] = useState(
    () => prompts.footers[Math.floor(Math.random() * prompts.footers.length)]
  );

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate playlist. Please try again.");
      }

      const data = await response.json();
      const newEntry = saveMoodToHistory(data.mood, data.tracks);
      router.push(`/app/${newEntry.id}`);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle keydown
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-y-auto">
      <div className="relative flex min-h-full flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-2xl space-y-10">
          <Card>
            <CardHeader className="items-center text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-xl font-semibold">
                <span className="p-2 rounded-lg bg-secondary text-primary">
                  <IconMusic size={20} />
                </span>
                How are you feeling today?
              </CardTitle>

              <CardDescription className="text-base">
                Type anything from a specific mood to your current surroundings.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Textarea
                suppressHydrationWarning
                placeholder={placeholder}
                className="min-h-45 text-lg leading-relaxed bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/50 transition-all resize-none p-5 rounded-xl"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pb-8 px-6">
              <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-4">
                <p
                  suppressHydrationWarning
                  className="text-xs text-muted-foreground italic"
                >
                  {footer}
                </p>

                <Button
                  size="lg"
                  className="w-full sm:w-auto px-8 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all cursor-pointer"
                  onClick={handleGenerate}
                  disabled={loading || !input.trim()}
                >
                  {loading ? (
                    <>
                      <Spinner /> Analyzing...
                    </>
                  ) : (
                    "Generate Playlist"
                  )}
                  {!loading && <IconSend2 className="h-4 w-4 ml-2" />}
                </Button>
              </div>

              {error && (
                <p className="w-full text-sm text-destructive bg-secondary/50 p-3 rounded-md">
                  {error}
                </p>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
