import Link from "next/link";
import { ElectraBolt } from "@/components/brand/electra-logo";

/**
 * Portail d'entrée : DEUX choix, rien d'autre.
 * L'escape game (Arcade Albert) ou la Knowledge Base.
 */
export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-[62vh] max-w-4xl flex-col justify-center gap-10 py-8">
      <header className="flex flex-col items-center gap-3 text-center">
        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-primary text-glow">
          <ElectraBolt className="h-4 w-4" /> Electra · Hackathon IA
        </p>
        <h1 className="hero-title font-elegant font-semibold">
          OPÉRATION <span className="text-primary text-glow blink">ALBERT</span>
        </h1>
        <p className="max-w-lg font-mono text-sm text-muted-foreground">
          Un agent IA renégat. Un réseau à reprendre. Deux portes.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Porte 1 — Escape Game */}
        <Link
          href="/game"
          className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border-2 border-accent/50 bg-card p-8 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_50px_rgb(255_122_0/0.25)]"
        >
          <span
            aria-hidden="true"
            className="scanline pointer-events-none absolute inset-0 opacity-40"
          />
          <span className="text-5xl transition-transform group-hover:scale-110">🎮</span>
          <div>
            <h2 className="font-elegant text-3xl font-bold text-accent">
              Escape Game
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              20 verrous de difficulté croissante, des questions piégées à 30
              secondes, un sabotage par équipe. Traquez Albert, en équipe,
              contre la montre.
            </p>
          </div>
          <span className="mt-auto font-mono text-xs font-semibold uppercase tracking-wider text-accent">
            Entrer dans l&apos;arène →
          </span>
        </Link>

        {/* Porte 2 — Knowledge Base */}
        <Link
          href="/kb"
          className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border-2 border-primary/50 bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-[0_0_50px_rgb(67_245_185/0.25)]"
        >
          <span className="text-5xl transition-transform group-hover:scale-110">📚</span>
          <div>
            <h2 className="font-elegant text-3xl font-bold text-primary">
              Knowledge Base
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Tout ce qu&apos;il faut savoir sur Claude, les agents, MCP et n8n —
              en version académie complète ou en fiches express pour le jeu.
            </p>
          </div>
          <span className="mt-auto font-mono text-xs font-semibold uppercase tracking-wider text-primary">
            Charger les connaissances →
          </span>
        </Link>
      </div>

      <p className="text-center font-mono text-xs text-muted-foreground">
        <Link href="/leaderboard" className="nav-underline hover:text-primary">
          Voir le classement
        </Link>
      </p>
    </div>
  );
}
