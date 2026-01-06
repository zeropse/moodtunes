"use client";

import { usePlayer } from "@/contexts/player-context";
import { IconMusic } from "@tabler/icons-react";
import { useSidebar } from "@/components/ui/sidebar";

export function NowPlayingBar() {
  const { currentTrack } = usePlayer();
  const { isMobile, state } = useSidebar();

  return (
    <div
      className="fixed bottom-6 z-50 border border-border bg-background/60 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500 rounded-3xl overflow-hidden transition-all"
      style={{
        left: isMobile
          ? "1rem"
          : `calc(${
              state === "expanded"
                ? "var(--sidebar-width)"
                : "var(--sidebar-width-icon)"
            } + 1.5rem)`,
        right: "1.5rem",
      }}
    >
      <div className="w-full h-20 flex items-center">
        {currentTrack ? (
          <div className="flex w-full h-full items-center">
            <iframe
              data-testid="embed-iframe"
              src={`https://open.spotify.com/embed/track/${currentTrack.id}?utm_source=generator&theme=0`}
              width="100%"
              height="80"
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="flex-1"
            ></iframe>
          </div>
        ) : (
          <div className="items-center flex w-full h-full justify-center text-muted-foreground gap-2">
            <IconMusic size={20} />
            Select a track to play
          </div>
        )}
      </div>
    </div>
  );
}
