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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconSend2, IconMusic } from "@tabler/icons-react";
import prompts from "@/data/prompts.json";
import { Spinner } from "@/components/ui/spinner";
import { saveMoodToHistory } from "@/lib/history-utils";
import { IconAlertCircle } from "@tabler/icons-react";

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
  const [numTracks, setNumTracks] = useState(25);

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
        body: JSON.stringify({ text: input, numTracks }),
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
                disabled={loading}
              />
            </CardContent>

            <CardFooter className="flex flex-col gap-4 px-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                <p
                  suppressHydrationWarning
                  className="text-xs text-muted-foreground italic leading-relaxed"
                >
                  {footer}
                </p>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                      Tracks:
                    </span>
                    <Select
                      value={numTracks.toString()}
                      onValueChange={(value) => setNumTracks(parseInt(value))}
                      disabled={loading}
                    >
                      <SelectTrigger
                        className="h-10 cursor-pointer bg-background"
                        suppressHydrationWarning
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[25, 30, 40, 50].map((num) => (
                          <SelectItem
                            key={num}
                            value={num.toString()}
                            className="cursor-pointer"
                          >
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    size="lg"
                    className="flex-1 md:flex-none px-8 font-semibold shadow-md hover:shadow-primary/20 transition-all cursor-pointer"
                    onClick={handleGenerate}
                    disabled={loading || !input.trim()}
                  >
                    {loading ? (
                      <>
                        <Spinner />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <span>Generate Playlist</span>
                        <IconSend2 className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 w-full text-sm text-destructive font-medium bg-destructive/10 border border-destructive/20 p-3 rounded-lg animate-in fade-in slide-in-from-top-1">
                  <IconAlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
