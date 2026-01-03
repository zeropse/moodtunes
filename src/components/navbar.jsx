"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/style/mode-toggle";
import { IconMusic, IconInfoCircle } from "@tabler/icons-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            <IconMusic className="h-4 w-4" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-muted-foreground">
              MoodTunes
            </span>
            <span className="text-[11px] text-muted-foreground/70 hidden sm:inline">
              Get tunes based on your mood
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs font-medium text-muted-foreground hover:text-primary px-3"
          >
            <Link href="/faqs" className="inline-flex items-center gap-1.5">
              <IconInfoCircle className="h-3.5 w-3.5" />
              <span>FAQ</span>
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
