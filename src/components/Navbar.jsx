"use client";
import {
  Navbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavItems,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { IconMusic } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function NavbarMain() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "FAQ", link: "/faq" },
    { name: "History", link: "/history" },
  ];

  return (
    <div className="relative w-full bg-[#000]">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <div className="flex items-center gap-2">
            <IconMusic size={38} className="text-purple-500" />
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent cursor-pointer">
              MoodTunes
            </span>
          </div>
          <NavItems items={navItems} />

          <div className="flex items-center gap-4">
            <SignedOut>
              <NavbarButton
                variant="primary"
                onClick={() => router.push("/sign-in")}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-semibold text-lg rounded-xl shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:cursor-pointer"
              >
                Sign In
              </NavbarButton>
              <NavbarButton
                variant="primary"
                onClick={() => router.push("/sign-up")}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-semibold text-lg rounded-xl shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:cursor-pointer"
              >
                Sign Up
              </NavbarButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <div className="flex items-center gap-2">
              <IconMusic size={32} className="fill-current" />
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
            {/* Nav Items */}
            <div className="flex flex-col items-center gap-4 text-center justify-center w-full">
              {navItems.map((item, idx) => (
                <a
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-neutral-600 dark:text-neutral-300 text-center"
                >
                  <span className="block">{item.name}</span>
                </a>
              ))}
            </div>

            {/* Mobile Auth Section */}
            <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700 w-full flex flex-col items-center">
              <SignedOut>
                <div className="flex flex-col gap-4 w-full max-w-xs">
                  <NavbarButton
                    variant="primary"
                    className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-semibold text-lg rounded-xl shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:cursor-pointer"
                    onClick={() => {
                      router.push("/sign-in");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </NavbarButton>
                  <NavbarButton
                    variant="primary"
                    className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-semibold text-lg rounded-xl shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:cursor-pointer"
                    onClick={() => {
                      router.push("/sign-up");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </NavbarButton>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex justify-center mt-4">
                  <UserButton />
                </div>
              </SignedIn>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
