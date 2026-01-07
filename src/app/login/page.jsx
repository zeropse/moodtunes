"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconMusic } from "@tabler/icons-react";
import { Spinner } from "@/components/ui/spinner";
import { getUserByEmail, hashPassword } from "@/lib/history-utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find user locally to verify password
      const localUser = getUserByEmail(email);
      const hashedPassword = await hashPassword(password);

      if (!localUser || localUser.password !== hashedPassword) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        fullName: localUser?.name || "MoodTunes User",
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/app");
      }
    } catch (err) {
      setError("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <Card className="border-border/60 shadow-xl">
          <CardHeader className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <IconMusic className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to your MoodTunes account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/15 text-destructive text-xs p-3 rounded-md border border-destructive/20 text-center">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="bg-muted/30"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="bg-muted/30"
                />
              </div>
              <Button
                type="submit"
                className="w-full font-bold h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-primary font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
            <div className="text-[10px] text-muted-foreground/60">
              Dev Mode: Any credentials will work
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
