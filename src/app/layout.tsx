import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import SiteNav from "@/components/site-nav";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stealth Tools",
  description:
    "Local-first utilities for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="shell">
          <header className="top-bar">
            <Link href="/" className="brand">
              <span className="brand-dot" aria-hidden="true" />
              <div>
                <strong>Stealth Tools</strong>
              </div>
            </Link>
            <SiteNav />
          </header>

          <main className="site-main">{children}</main>

          <footer className="footer-note">
            Zero backend processing. Designed for safe use on shared workplace systems.
          </footer>
        </div>
      </body>
    </html>
  );
}
