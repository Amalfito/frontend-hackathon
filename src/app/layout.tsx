import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { ElectraWordmark } from "@/components/brand/electra-logo";
import { Toaster } from "@/components/ui/sonner";
import { GameBanner } from "@/components/game-banner";
import { I18nProvider } from "@/components/i18n-provider";
import { LanguageSwitch } from "@/components/language-switch";
import { getI18n } from "@/lib/locale";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display géométrique « énergie » (même esprit que l'Aeonik d'Electra).
const spaceGrotesk = Space_Grotesk({
  variable: "--font-elegant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ELECTRA · AI Hackathon — Portal",
  description:
    "Electra AI hackathon portal: learn (agents, prompting, MCP), then take on the challenges. Decipher, unlock, defuse.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, t } = await getI18n();

  return (
    <html
      lang={locale}
      className={`dark ${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider locale={locale}>
          <header className="border-b border-border/60 backdrop-blur-sm sticky top-0 z-20 bg-background/70">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
              <Link
                href="/"
                className="group flex items-center gap-2 text-primary"
                aria-label={t.brand}
              >
                <ElectraWordmark className="h-5 w-auto transition-all group-hover:drop-shadow-[0_0_10px_rgb(67_245_185/0.6)]" />
                <span className="rounded-sm border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-primary/90">
                  hack
                </span>
              </Link>
              <div className="flex items-center gap-4">
                <nav className="flex items-center gap-5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  <Link
                    href="/kb"
                    className="nav-underline hover:text-primary transition-colors"
                  >
                    {t.nav.learn}
                  </Link>
                  <Link
                    href="/game"
                    className="nav-underline hover:text-primary transition-colors"
                  >
                    {t.nav.play}
                  </Link>
                  <Link
                    href="/leaderboard"
                    className="nav-underline hover:text-primary transition-colors"
                  >
                    {t.nav.leaderboard}
                  </Link>
                  <Link href="/admin" className="hover:text-accent transition-colors">
                    {t.nav.admin}
                  </Link>
                </nav>
                <LanguageSwitch />
              </div>
            </div>
          </header>
          {/* Chrono global (masqué sur /learn) */}
          <GameBanner />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
            {children}
          </main>
          <footer className="border-t border-border/60 py-4">
            <div className="mx-auto flex max-w-5xl items-center gap-3 px-4">
              <ElectraWordmark className="h-3.5 w-auto text-primary/60" />
              <p className="font-mono text-[11px] text-muted-foreground">
                {t.footer.org} —{" "}
                <span className="text-primary/70">{t.footer.tagline}</span>
              </p>
            </div>
          </footer>
          <Toaster position="top-center" theme="dark" />
        </I18nProvider>
      </body>
    </html>
  );
}
