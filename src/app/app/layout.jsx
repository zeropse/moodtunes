"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/style/mode-toggle";

export default function AppLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-sm">
          <div className="flex h-14 w-full items-center justify-between px-2">
            <div className="flex items-center">
              <SidebarTrigger className="cursor-pointer size-10" />
            </div>

            <div className="flex items-center gap-3">
              <ModeToggle />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
