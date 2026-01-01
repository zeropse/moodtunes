"use client";

import { Button } from "@/components/ui/button";
import {
  IconCode,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 text-[11px] text-muted-foreground/80">
        <span className="uppercase">&copy; {year} Moodtunes.</span>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-[11px] font-medium text-muted-foreground hover:text-primary"
          >
            <a
              href="https://github.com/zeropse/moodtunes"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5"
            >
              <IconCode className="h-3 w-3" />
              <span>Contribute</span>
            </a>
          </Button>

          <div className="flex items-center gap-3 text-muted-foreground/80">
            <a
              href="https://github.com/zeropse/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="GitHub profile"
            >
              <IconBrandGithub className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/zeropse/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="LinkedIn profile"
            >
              <IconBrandLinkedin className="h-4 w-4" />
            </a>
            <a
              href="https://x.com/zer0pse"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="X profile"
            >
              <IconBrandX className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
