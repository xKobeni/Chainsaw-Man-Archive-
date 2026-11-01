import type { Metadata } from "next";
import Script from "next/script";
import { ArchiveShell } from "@/components/ArchiveShell";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: { default: "CHAINSAW MAN — Archive", template: "%s — CSM Archive" },
  description: "A cinematic fan archive of Chainsaw Man: characters, devils, story arcs, locations, volumes and connections.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning><body>
    <Script id="archive-intro-session" strategy="beforeInteractive">{`try { if (sessionStorage.getItem("csm") === "1") document.documentElement.dataset.csmSeen = "1"; } catch {}`}</Script>
    <ArchiveShell>{children}</ArchiveShell>
  </body></html>;
}
