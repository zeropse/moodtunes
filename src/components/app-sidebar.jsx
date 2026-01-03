"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  IconMusic,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconSquareRoundedPlusFilled,
} from "@tabler/icons-react";
import Link from "next/link";

export function AppSidebar({ ...props }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="MoodTunes">
              <Link href="/" className="flex items-center justify-center">
                <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <IconMusic className="size-5" />
                </div>
                {!isCollapsed && (
                  <div className="ml-3 grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">MoodTunes</span>
                    <span className="truncate text-xs text-muted-foreground">
                      Get tunes based on your mood
                    </span>
                  </div>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className={"my-2"} />

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="New Mood Entry"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground transition-all"
            >
              <Link href="/app" className="flex items-center">
                <IconSquareRoundedPlusFilled className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>New Mood Entry</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex flex-col items-center justify-center w-full">
              <div
                className={`flex ${
                  isCollapsed ? "flex-col py-4" : "flex-row px-2"
                } items-center justify-center gap-4 text-muted-foreground/80`}
              >
                <a
                  href="https://github.com/zeropse/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  <IconBrandGithub className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/zeropse/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  <IconBrandLinkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://x.com/zer0pse/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  <IconBrandX className="h-5 w-5" />
                </a>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
