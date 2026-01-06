"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function RouteFrame({ children }) {
  const pathname = usePathname() || "";
  const hide = pathname.startsWith("/app");

  return (
    <>
      {!hide && <Navbar />}
      {children}
      {!hide && <Footer />}
    </>
  );
}
