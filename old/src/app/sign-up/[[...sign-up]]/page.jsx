"use client";
import { Vortex } from "@/components/ui/vortex";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <Vortex>
      <div className="flex min-h-screen items-center justify-center">
        <SignUp forceRedirectUrl="/app" signInUrl="/sign-in" />
      </div>
    </Vortex>
  );
}
