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
} from "@tabler/icons-react";
import Link from "next/link";

export function AppSidebar({ ...props }) {
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
    { href: "https://x.com/zer0pse/", Icon: IconBrandX, label: "X" },
  ];

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="MoodTunes">
              <Link href="/">
                <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
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

      <SidebarContent>
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

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <IconHistory className="size-4" />
            <span>Your Mood History</span>
          </SidebarGroupLabel>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu className="flex-row group-data-[collapsible=icon]:flex-col items-center justify-between group-data-[collapsible=icon]:justify-center gap-1">
          {footerLinks.map(({ href, Icon, label }) => (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton
                asChild
                tooltip={label}
                className="hover:bg-secondary hover:text-secondary-foreground transition-colors"
              >
                <a href={href} target="_blank" rel="noreferrer">
                  <Icon className="size-10" />
                  <span className="sr-only">{label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
