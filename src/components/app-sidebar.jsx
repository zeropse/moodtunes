"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  IconMusic,
  IconHistory,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconSquareRoundedPlus,
  IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getHistory } from "@/lib/history-utils";
import { Spinner } from "@/components/ui/spinner";

export function AppSidebar(props) {
  const [history, setHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = () => {
      setIsLoading(true);
      const data = getHistory();
      setHistory(data);
      setIsLoading(false);
    };

    loadHistory();

    const handleHistoryUpdate = () => {
      loadHistory();
    };

    window.addEventListener("moodHistoryUpdated", handleHistoryUpdate);
    return () => {
      window.removeEventListener("moodHistoryUpdated", handleHistoryUpdate);
    };
  }, []);

  const footerLinks = [
    {
      href: "https://github.com/zeropse/",
      Icon: IconBrandGithub,
      label: "GitHub",
    },
    {
      href: "https://www.linkedin.com/in/zeropse/",
      Icon: IconBrandLinkedin,
      label: "LinkedIn",
    },
    {
      href: "https://x.com/zer0pse/",
      Icon: IconBrandX,
      label: "X",
    },
  ];

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="MoodTunes">
              <Link href="/">
                <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                  <IconMusic className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">MoodTunes</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Your mood, your music
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Content */}
      <SidebarContent>
        {/* New Mood Entry */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="New Mood Entry"
                className="bg-secondary text-primary hover:bg-primary/90 hover:text-primary-foreground"
              >
                <Link href="/app">
                  <IconSquareRoundedPlus className="size-5" />
                  <span>New Mood Entry</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Recent */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel className="flex items-center gap-2">
            <IconHistory className="size-4" />
            <span>Recent</span>
          </SidebarGroupLabel>

          <SidebarMenu>
            {isLoading ? (
              <SidebarMenuItem>
                <div className="flex items-center justify-center">
                  <Spinner />
                </div>
              </SidebarMenuItem>
            ) : history && history.length === 0 ? (
              <SidebarMenuItem>
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No recent entries yet
                </div>
              </SidebarMenuItem>
            ) : (
              history &&
              history.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild tooltip={`Mood: ${item.mood}`}>
                    <Link href={`/app/history/${item.id}`}>
                      <span className="capitalize">Mood: {item.mood}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu className="flex-row items-center justify-between group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:justify-center gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Settings"
              className="hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              <Link href="/app/settings">
                <IconSettings className="size-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <div className="flex items-center gap-1 group-data-[collapsible=icon]:flex-col">
            {footerLinks.map(({ href, Icon, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                title={label}
                className="hover:bg-secondary hover:text-secondary-foreground transition-colors p-2 rounded"
              >
                <Icon className="size-5" />
                <span className="sr-only">{label}</span>
              </a>
            ))}
          </div>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
