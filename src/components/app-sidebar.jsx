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
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  IconMusic,
  IconHistory,
  IconSquareRoundedPlus,
  IconMessage,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getHistory } from "@/lib/history-utils";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "next-auth/react";

const socials = [
  {
    name: "GitHub",
    href: "https://github.com/zeropse/",
    icon: IconBrandGithub,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/zeropse/",
    icon: IconBrandLinkedin,
  },
  { name: "X/Twitter", href: "https://x.com/zer0pse/", icon: IconBrandX },
];

export function AppSidebar(props) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const loadHistory = () => {
      if (!session?.user?.id) return;
      setIsLoading(true);
      const data = getHistory(session.user.id);
      setHistory(data.slice(0, 17));
      setIsLoading(false);
    };

    loadHistory();
    const handleHistoryUpdate = loadHistory;
    window.addEventListener("moodHistoryUpdated", handleHistoryUpdate);
    return () =>
      window.removeEventListener("moodHistoryUpdated", handleHistoryUpdate);
  }, [session?.user?.id]);

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className={"mt-1"}>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
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

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="New Mood">
                  <Link href="/app" className="font-medium text-primary">
                    <IconSquareRoundedPlus />
                    <span>New Mood Entry</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="History">
                  <Link href="/app/history">
                    <IconHistory />
                    <span>History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Recent Moods</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading ? (
                <div className="flex p-4 justify-center">
                  <Spinner className="size-4" />
                </div>
              ) : history.length > 0 ? (
                history.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild>
                      <Link href={`/app/${item.id}`}>
                        <IconMessage className="size-4 opacity-70" />
                        <span className="truncate capitalize">{item.mood}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <div className="px-4 py-2 text-xs text-muted-foreground">
                  No recent moods
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu className="flex-row items-center justify-center gap-5 group-data-[collapsible=icon]:flex-col">
          {socials.map((social) => (
            <SidebarMenuItem key={social.name}>
              <SidebarMenuButton
                asChild
                tooltip={social.name}
                className="flex justify-center cursor-pointer bg-accent"
              >
                <a href={social.href} target="_blank" rel="noopener noreferrer">
                  <social.icon className="size-5" />
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
