"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/style/mode-toggle";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconUserFilled } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppLayout({ children }) {
  const { user, logout, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This setState is necessary to handle hydration mismatch for auth state eslint-disable-next-line react-hooks/exhaustive-deps
    setMounted(true);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-sm">
          <div className="flex h-14 w-full items-center justify-between px-4">
            <div className="flex items-center">
              <SidebarTrigger className="cursor-pointer size-9" />
            </div>

            <div className="flex items-center gap-3">
              {/* Auth State Logic */}
              {!mounted || isLoading ? (
                <Skeleton className="h-9 rounded-md w-16" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 px-2 hover:bg-accent cursor-pointer"
                    >
                      <div className="flex size-7 items-center justify-center rounded-full bg-muted">
                        <IconUserFilled className="size-4 text-muted-foreground" />
                      </div>
                      <span className="hidden sm:inline-block text-sm font-medium">
                        {user.name}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56" forceMount>
                    {/* Identity Section */}
                    <DropdownMenuLabel className="font-normal flex flex-col space-y-2">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {/* Action Section */}
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={logout}
                      className="cursor-pointer"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}

              <ModeToggle />
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
