import Link from "next/link";
import { ElectraBolt } from "@/components/brand/electra-logo";

export const metadata = {
  title: "Knowledge Base — Electra Hackathon IA",
};

/** Portail Knowledge Base : le savoir complet, ou l'essentiel pour le jeu. */
export default function KbPage() {
  return (
    <div className="mx-auto flex min-h-[62vh] max-w-4xl flex-col justify-center gap-10 py-8">
      <header className="flex flex-col items-center gap-3 text-center">
        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-primary text-glow">
          <ElectraBolt className="h-4 w-4" /> Knowledge Base
        </p>
        <h1 className="hero-title font-elegant font-semibold">
          Deux façons de <span className="text-primary text-glow">charger</span>
        </h1>
        <p className="max-w-lg font-mono text-sm text-muted-foreground">
          Le grand réservoir, ou la charge rapide avant l&apos;arène.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Knowledge complet → académie */}
        <Link
          href="/learn"
          className="group flex flex-col gap-4 rounded-2xl border-2 border-primary/50 bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-[0_0_50px_rgb(67_245_185/0.25)]"
        >
          <span className="text-5xl transition-transform group-hover:scale-110">🎓</span>
          <div>
            <h2 className="font-elegant text-3xl font-bold text-primary">
              Knowledge complet
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              L&apos;académie entière : 12 modules, 49 leçons interactives, 3
              parcours guidés, XP, badges et certificat. Pour devenir vraiment
              bon — ça prend quelques heures, ça change une carrière.
            </p>
          </div>
          <span className="mt-auto font-mono text-xs font-semibold uppercase tracking-wider text-primary">
            Ouvrir l&apos;académie →
          </span>
        </Link>

        {/* Knowledge express → jeu */}
        <Link
          href="/kb/express"
          className="group flex flex-col gap-4 rounded-2xl border-2 border-accent/50 bg-card p-8 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_50px_rgb(255_122_0/0.25)]"
        >
          <span className="text-5xl transition-transform group-hover:scale-110">⚡</span>
          <div>
            <h2 className="font-elegant text-3xl font-bold text-accent">
              Express · spécial Escape Game
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              L&apos;essentiel, ultra-condensé : une douzaine de fiches qui
              contiennent <strong className="text-foreground">tout ce qu&apos;il faut pour
              répondre aux 20 verrous d&apos;Albert</strong>. 10 minutes de lecture,
              charge complète.
            </p>
          </div>
          <span className="mt-auto font-mono text-xs font-semibold uppercase tracking-wider text-accent">
            Charge rapide →
          </span>
        </Link>
      </div>

      <p className="text-center font-mono text-xs text-muted-foreground">
        Déjà chargé ?{" "}
        <Link href="/game" className="nav-underline text-accent hover:text-accent">
          Entrer dans l&apos;arène →
        </Link>
      </p>
    </div>
  );
}
