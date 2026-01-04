"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconExternalLink, IconArrowLeft, IconPlus } from "@tabler/icons-react";
import Image from "next/image";

export function PlaylistResults({ result, onReset }) {
  const handleAddToSpotify = async (tracks) => {
    try {
      const response = await fetch("/api/add-to-spotify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracks, mood: result.mood }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Playlist added to Spotify!");
      } else if (response.status === 501) {
        alert(data.message || "Feature not implemented yet.");
      } else {
        alert("Failed to add playlist to Spotify. Please try again.");
      }
    } catch (error) {
      console.error("Error adding to Spotify:", error);
      alert("Error adding to Spotify. Please try again.");
    }
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            className={"cursor-pointer"}
          >
            <IconArrowLeft size="20" />
          </Button>
          <h2 className="text-xl font-bold sm:text-2xl">
            Current Mood:{" "}
            <span className="text-primary capitalize">{result.mood}</span>
          </h2>
        </div>
        <Button
          variant="default"
          onClick={() => handleAddToSpotify(result.tracks)}
          className="cursor-pointer"
        >
          <IconPlus size="20" />
          Add to Spotify
        </Button>
      </div>

      <div className="grid gap-4">
        {result.tracks.map((track) => (
          <Card
            key={track.id}
            className="overflow-hidden transition-colors hover:bg-secondary/50"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                  {track.image && (
                    <Image
                      src={track.image}
                      alt={track.album}
                      fill
                      sizes="64px"
                      loading="eager"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{track.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {track.artist}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-10 w-10 rounded-lg cursor-pointer"
                >
                  <a
                    href={track.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in Spotify"
                  >
                    <IconExternalLink size="20" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
