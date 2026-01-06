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
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconUser, IconLogout } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect } from "react";
import { saveUser } from "@/lib/history-utils";

export default function AppLayout({ children }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      saveUser({
        name: session.user.name,
        email: session.user.email,
        id: session.user.id || session.user.email,
      });
    }
  }, [session]);

  return (
    <PlayerProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-40 border-b border-border backdrop-blur-sm">
            <div className="flex h-14 w-full items-center justify-between px-4">
              <div className="flex items-center">
                <SidebarTrigger className="cursor-pointer size-9" />
              </div>

              <div className="flex items-center gap-3">
                {session?.user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-9 px-2 gap-2 hover:bg-accent cursor-pointer"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary overflow-hidden relative">
                          {session.user.image ? (
                            <Image
                              fill
                              src={session.user.image}
                              alt={session.user.name}
                              className="object-cover"
                            />
                          ) : (
                            <IconUser className="h-4 w-4" />
                          )}
                        </div>
                        <span className="hidden sm:inline-block text-sm font-medium max-w">
                          {session.user.name}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-2">
                          <p className="text-sm font-medium leading-none">
                            {session.user.name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {session.user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive cursor-pointer"
                        onClick={() => signOut()}
                      >
                        <IconLogout className="h-4 w-4 text-destructive" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
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
