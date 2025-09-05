"use client";
import {
  Navbar,
  NavBody,
  MobileNav,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { IconMusic } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export function NavbarMain() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative w-full bg-[#000]">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <IconMusic size={32} className="text-white" />
            <span className="text-lg font-bold text-white">MoodTunes</span>
          </div>
          <div className="flex items-center gap-4">
            <NavbarButton
              variant="primary"
              onClick={() => router.push("/about")}
            >
              About
            </NavbarButton>
            <NavbarButton
              variant="primary"
              onClick={() => router.push("/history")}
            >
              History
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <div className="flex items-center gap-2">
              <IconMusic size={32} />
              <span className="text-lg font-bold">MoodTunes</span>
            </div>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex flex-col items-center justify-center text-center w-full">
              <p
                className="text-center w-3/4 cursor-pointer"
                onClick={() => router.push("/about")}
              >
                About
              </p>
              <p
                className="text-center w-3/4 cursor-pointer"
                onClick={() => router.push("/history")}
              >
                History
              </p>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
