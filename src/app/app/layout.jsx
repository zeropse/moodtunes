"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/style/mode-toggle";
import { PlayerProvider } from "@/contexts/player-context";
import { NowPlayingBar } from "@/components/now-playing-bar";

export default function AppLayout({ children }) {
  return (
    <PlayerProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-sm">
            <div className="flex h-14 w-full items-center justify-between px-4">
              <div className="flex items-center">
                <SidebarTrigger className="cursor-pointer size-9" />
              </div>

              <div className="flex items-center gap-3">
                <ModeToggle />
              </div>
            </div>
          </header>

          <main className="flex flex-1 flex-col gap-4 p-4 pb-28">
            {children}
          </main>
          <NowPlayingBar />
        </SidebarInset>
      </SidebarProvider>
    </PlayerProvider>
  );
}
