"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";

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

export default function SettingsPage() {
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
        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Connect</CardTitle>
            <CardDescription>
              Find me on my professional and social networks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {socials.map((social) => (
                <Button
                  key={social.name}
                  variant="outline"
                  className="w-full justify-center gap-3 transition-all hover:bg-accent hover:text-accent-foreground"
                  asChild
                >
                  <a href={social.href} target="_blank" rel="noreferrer">
                    <social.icon className="h-5 w-5" />
                    <span className="font-medium">{social.name}</span>
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
