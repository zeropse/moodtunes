"use client";

import { useState, useEffect } from "react";
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
import { IconSend2, IconMusic, IconAlertCircle } from "@tabler/icons-react";
import prompts from "@/data/prompts.json";
import models from "@/data/models.json";
import { Spinner } from "@/components/ui/spinner";
import { saveMoodToHistory, getHistory } from "@/lib/history-utils";
import { useSession } from "next-auth/react";

export default function AppPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    setMounted(true);
    setPlaceholder(
      prompts.placeholders[
        Math.floor(Math.random() * prompts.placeholders.length)
      ]
    );
  }, []);

  const [input, setInput] = useState("");
  const [model, setModel] = useState("gemini-2.5-flash-lite");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const history = getHistory(session?.user?.id);
      const excludeIds = history.flatMap((entry) =>
        entry.tracks.map((track) => track.id)
      );

      const response = await fetch("/api/generate-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, excludeIds, model }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate playlist. Please try again.");
      }

      const data = await response.json();
      const newEntry = saveMoodToHistory(
        data.mood,
        data.tracks,
        session?.user?.id
      );
      router.push(`/app/${newEntry.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-12">
      <div className="w-full max-w-2xl mx-auto">
        <Card className="border-none sm:border backdrop-blur-md shadow-xl">
          <CardHeader className="items-center text-center space-y-2 px-4 sm:px-6">
            <CardTitle className="flex items-center justify-center gap-3 text-lg sm:text-2xl font-bold">
              <span className="p-2 rounded-xl bg-primary/10 text-primary">
                <IconMusic size={24} />
              </span>
              How are you feeling today?
            </CardTitle>

            <CardDescription className="text-sm sm:text-base max-w-sm mx-auto">
              Type anything from a specific mood to your current surroundings.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 sm:px-6">
            <Textarea
              placeholder={placeholder}
              className="min-h-40 md:min-h-55 text-base md:text-lg leading-relaxed bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/50 transition-all resize-none p-4 md:p-5 rounded-xl"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </CardContent>

          <CardFooter className="flex flex-col gap-4 px-4 sm:px-6 pb-6">
            <div className="flex flex-col md:flex-row items-center justify-end gap-3 w-full">
              {mounted && (
                <div className="w-full md:w-48">
                  <Select
                    value={model}
                    onValueChange={setModel}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-full cursor-pointer">
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((m) => (
                        <SelectItem
                          key={m.id}
                          value={m.id}
                          className={"cursor-pointer"}
                        >
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                size="lg"
                className="w-full md:w-auto px-8 font-semibold shadow-lg hover:shadow-primary/20 transition-all cursor-pointer"
                onClick={handleGenerate}
                disabled={loading || !input.trim()}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" />
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Generate Playlist</span>
                    <IconSend2 className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </div>

            {error && (
              <div className="flex items-start gap-2 w-full text-sm text-destructive font-medium bg-destructive/10 border border-destructive/20 p-3 rounded-lg animate-in fade-in slide-in-from-top-1">
                <IconAlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <p className="text-[10px] text-center text-muted-foreground md:hidden">
              Press &quot;Generate&quot; to continue
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
