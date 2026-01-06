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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ctaData = [
  {
    title: "Ready to find your soundtrack?",
    description:
      "Tell us how you're feeling and get personalized song recommendations instantly.",
    href: "/app",
  },
];

export default function CTA() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        {ctaData.map((cta, index) => (
          <Card key={index} className="border-none bg-muted-foreground/20">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-center">
                {cta.title}
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground text-base md:text-lg">
                {cta.description}
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex justify-center">
              {session ? (
                <Button
                  size="lg"
                  className="group inline-flex items-center gap-2 px-8 py-6 shadow-md transition-all hover:shadow-xl active:scale-95 cursor-pointer"
                  onClick={() => router.push(cta.href)}
                >
                  Launch App
                  <IconArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              ) : (
                <Button
                  asChild
                  size="lg"
                  className="group inline-flex items-center gap-2 px-8 py-6 shadow-md transition-all hover:shadow-xl active:scale-95 cursor-pointer"
                >
                  <Link href="/signup">
                    Get Started
                    <IconArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
