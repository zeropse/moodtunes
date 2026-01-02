"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  IconMusic,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import Link from "next/link";

export function AppSidebar({ ...props }) {
  const year = new Date().getFullYear();

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader>
        <Link
          href="/"
          className="flex items-center gap-3 group my-2 hover:bg-secondary rounded-lg transition-colors"
          title="MoodTunes — Get tunes based on your mood"
          aria-label="MoodTunes home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IconMusic className="h-5 w-5" />
          </span>

          <div className="flex flex-col leading-tight truncate">
            <span className="text-sm font-semibold text-foreground truncate">
              MoodTunes
            </span>
            <span className="text-[11px] text-muted-foreground/70 hidden sm:inline truncate">
              Get tunes based on your mood
            </span>
          </div>

          <span className="sr-only">
            MoodTunes — Get tunes based on your mood
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>Home</SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>Discover</SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>History</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />

        <div className="flex items-center justify-between gap-3 px-2">
          <div className="text-xs text-muted-foreground">
            &copy; {year} Moodtunes.
          </div>

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
      </SidebarFooter>
    </Sidebar>
  );
}
