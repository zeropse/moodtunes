"use client";
import { Vortex } from "@/components/ui/vortex";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <Vortex>
      <div className="flex min-h-screen items-center justify-center">
        <SignIn forceRedirectUrl="/app" signUpUrl="/sign-up" />
      </div>
    </Vortex>
  );
}
