import AppLayoutClient from "./app-layout-client";

export const metadata = {
  title: "Dashboard",
  description: "Manage your mood-based playlists and explore new music.",
};

export default function AppLayout({ children }) {
  return <AppLayoutClient>{children}</AppLayoutClient>;
}
