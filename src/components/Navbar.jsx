"use client";

import { useState } from "react";
import { IconMusic, IconMenu2, IconX } from "@tabler/icons-react";
import { useRouter, usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";

// Logo Component
const Logo = () => (
  <div className="flex items-center gap-2">
    <IconMusic size={38} className="text-purple-500" />
    <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
      MoodTunes
    </span>
  </div>
);

// Navigation Link Component
const NavLink = ({ href, children, onClick, isActive, isMobile = false }) => {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
    if (onClick) onClick();
  };

  if (isMobile) {
    return (
      <Button
        onClick={handleClick}
        variant="ghost"
        className={`w-full py-4 text-lg font-medium transition-all duration-200${
          isActive
            ? "text-purple-400 bg-purple-500/10 border border-purple-500/20"
            : "text-gray-300 hover:text-white hover:bg-gray-800/50"
        }`}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      className={`relative px-3 py-2 text-sm md:text-base font-medium transition-colors duration-200 hover:text-purple-400${
        isActive ? "text-purple-400" : "text-gray-300 hover:text-white"
      }`}
    >
      {children}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
          layoutId="activeTab"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </Button>
  );
};

// Mobile Menu Component
const MobileDrawer = ({ isOpen, onClose, navItems, router }) => {
  const pathname = usePathname();

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-black/95 backdrop-blur-xl border-gray-800 lg:hidden">
        <DrawerHeader className="border-b border-gray-800">
          <div className="flex items-center justify-between">
            <DrawerTitle>
              <Logo />
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-800">
                <IconX size={24} className="text-gray-400" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex flex-col flex-1 p-6 space-y-6">
          {/* Navigation Links - Centered */}
          <div className="flex flex-col items-center space-y-4">
            {navItems.map((item, idx) => (
              <NavLink
                key={idx}
                href={item.link}
                onClick={onClose}
                isActive={pathname === item.link}
                isMobile={true}
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Auth Section - Full Width Buttons */}
          <div className="mt-auto pt-6 border-t border-gray-800">
            <SignedOut>
              <div className="flex flex-col space-y-4">
                <Button
                  onClick={() => {
                    router.push("/sign-in");
                    onClose();
                  }}
                  variant="outline"
                  className="w-full border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => {
                    router.push("/sign-up");
                    onClose();
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white shadow-lg hover:shadow-purple-500/25"
                >
                  Sign Up
                </Button>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex justify-center">
                <UserButton forceRedirectUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

// Main Navbar Component
export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "FAQ", link: "/faq" },
    { name: "History", link: "/history" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-30 w-full bg-black/90 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16 md:h-20">
            {/* Logo - Left Section */}
            <div className="flex justify-start">
              <Logo />
            </div>

            {/* Desktop Navigation - Center Section */}
            <div className="hidden md:flex justify-center">
              <div className="flex items-center space-x-8">
                {navItems.map((item, idx) => (
                  <NavLink
                    key={idx}
                    href={item.link}
                    isActive={pathname === item.link}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Desktop Auth - Right Section */}
            <div className="hidden md:flex justify-end items-center">
              <SignedOut>
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => router.push("/sign-in")}
                    variant="outline"
                    className="cursor-pointer border-purple-500 text-purple-400 hover:bg-purple-500  hover:text-purple-400"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => router.push("/sign-up")}
                    className="cursor-pointer bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white shadow-lg hover:shadow-purple-500/25"
                  >
                    Sign Up
                  </Button>
                </div>
              </SignedOut>
              <SignedIn>
                <UserButton forceRedirectUrl="/" />
              </SignedIn>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                onClick={() => setIsMobileMenuOpen(true)}
                variant="ghost"
                size="icon"
                className="hover:bg-gray-800"
              >
                <IconMenu2 size={24} className="text-gray-400" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        router={router}
      />
    </>
  );
}
