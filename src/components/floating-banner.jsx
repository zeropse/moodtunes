"use client";

import { usePathname } from "next/navigation";
import { IconAlertTriangle, IconExternalLink } from "@tabler/icons-react";

export default function FloatingBanner() {
  const pathname = usePathname() || "";
  if (pathname.startsWith("/app")) {
    return null;
  }

  return (
    <div className="border-b bg-red-800 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-3 text-center">
        <div>
          <p className="font-medium">
            <IconAlertTriangle className="mx-auto mb-2 h-6 w-6 text-red-500" />
            Spotify API restrictions are affecting this website
          </p>

          <p className="mt-1 text-sm">
            Due to Spotify&apos;s February 2026 Developer Mode changes, the
            spotify-based features of this website are not working as intended.
            I&apos;m really sorry about this but there&apos;s nothing I can do
            about it. Please check the links below for more information.
          </p>

          <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm">
            <a
              href="https://developer.spotify.com/blog/2026-02-06-update-on-developer-access-and-platform-security"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline">
              Spotify announcement
              <IconExternalLink size={14} />
            </a>

            <a
              href="https://developer.spotify.com/documentation/web-api/references/changes/february-2026"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline">
              API changes
              <IconExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
