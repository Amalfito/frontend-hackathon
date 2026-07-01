import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { GameBanner } from "@/components/game-banner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Police élégante (serif) pour la partie instructive / apprentissage.
const fraunces = Fraunces({
  variable: "--font-elegant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ELECTRA · Hackathon IA — Portail",
  description:
    "Portail hackathon IA d'Electra : apprends (agents, prompting, MCP), puis affronte les défis. Déchiffrez, débloquez, désamorcez.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-border/60 backdrop-blur-sm sticky top-0 z-20 bg-background/70">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <Link
              href="/"
              className="font-mono text-sm font-bold tracking-widest text-primary text-glow"
            >
              ◢ ELECTRA_HACK
            </Link>
            <div className="flex items-center gap-4">
              <GameBanner />
              <nav className="flex items-center gap-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                <Link href="/learn" className="hover:text-primary transition-colors">
                  Apprendre
                </Link>
                <Link href="/play" className="hover:text-primary transition-colors">
                  Défis
                </Link>
                <Link
                  href="/leaderboard"
                  className="hover:text-primary transition-colors"
                >
                  Classement
                </Link>
                <Link
                  href="/admin"
                  className="hover:text-accent transition-colors"
                >
                  Admin
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-border/60 py-4">
          <p className="mx-auto max-w-5xl px-4 font-mono text-[11px] text-muted-foreground">
            Electra · Network Operations · Hackathon IA —{" "}
            <span className="text-primary/70">
              apprendre, déchiffrer, désamorcer
            </span>
          </p>
        </footer>
        <Toaster position="top-center" theme="dark" />
      </body>
    </html>
  );
}
