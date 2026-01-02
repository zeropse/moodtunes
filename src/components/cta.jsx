"use client";

import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CTA({
  title = "Ready to find your soundtrack?",
  description = "Tell us how you're feeling and get personalized song recommendations instantly.",
  href = "/",
  className = "",
  sectionClass = "py-16 px-4",
  containerClass = "max-w-3xl mx-auto",
}) {
  return (
    <section className={sectionClass}>
      <div className={containerClass}>
        <Card
          className={`border-none bg-zinc-50/50 dark:bg-zinc-700/50 ${className}`}
        >
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold text-center">
              {title}
            </CardTitle>
            <CardDescription className="text-center text-zinc-600 dark:text-zinc-400 text-base md:text-lg mt-2">
              {description}
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex justify-center">
            <Button
              asChild
              size="lg"
              className="group inline-flex items-center gap-2 px-8 py-6 rounded-full shadow-md transition-all hover:shadow-xl active:scale-95"
            >
              <Link href={href} aria-label="Get started">
                Get Started
                <IconArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
