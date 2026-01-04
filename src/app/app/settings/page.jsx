"use client";

import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IconBrandSpotify } from "@tabler/icons-react";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="container max-w-3xl mx-auto py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and integrations
        </p>
      </div>

      {/* Vertical Stack */}
      <div className="space-y-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {user ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No user information available.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Spotify Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBrandSpotify className="h-8 w-8" />
              Spotify
            </CardTitle>
            <CardDescription>
              Connect Spotify to create mood-based playlists.
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Button className="w-full cursor-pointer">
              Connect to Spotify
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
