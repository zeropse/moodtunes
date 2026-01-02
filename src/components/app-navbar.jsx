"use client";

import { ModeToggle } from "@/style/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AppNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="flex h-14 w-full items-center justify-between px-4">
        <div className="flex items-center">
          <SidebarTrigger className="cursor-pointer size-10" />
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
