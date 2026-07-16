import Link from "next/link";
import { Reveal } from "@/components/fx/reveal";
import { kbExpress } from "@/content/arcade/kb-express";

export const metadata = {
  title: "Knowledge Express — spécial Escape Game",
};

/**
 * La charge rapide : tout ce qu'il faut pour les 20 verrous d'Albert,
 * en une douzaine de fiches denses. Zéro blabla.
 */
export default function KbExpressPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 py-4">
      <header className="flex flex-col gap-2">
        <Link
          href="/kb"
          className="font-mono text-xs text-muted-foreground hover:text-primary"
        >
          ← Knowledge Base
        </Link>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
          ⚡ Charge rapide · spécial Escape Game
        </p>
        <h1 className="font-elegant text-4xl font-semibold text-primary text-glow">
          Knowledge Express
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {kbExpress.length} fiches, ~10 minutes de lecture :{" "}
          <strong className="text-foreground">
            chaque réponse des 20 verrous d&apos;Albert se trouve ici
          </strong>
          . Lisez en équipe, répartissez-vous les fiches, gardez cet onglet
          ouvert pendant le jeu.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {kbExpress.map((card, i) => (
          <Reveal key={card.id} delay={(i % 2) * 0.08} className="h-full">
            <section className="flex h-full flex-col gap-3 rounded-xl border border-primary/30 bg-card p-5 transition-colors hover:border-primary/60">
              <h2 className="flex items-center gap-2 font-elegant text-xl font-bold text-primary">
                <span className="text-2xl">{card.icon}</span> {card.title}
              </h2>
              <ul className="flex flex-col gap-2">
                {card.points.map((p, j) => (
                  <li
                    key={j}
                    className="border-l-2 border-primary/30 pl-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        ))}
      </div>

      <div className="terminal-glow flex flex-col items-center gap-3 rounded-xl border border-accent/50 bg-card p-6 text-center">
        <p className="font-mono text-sm text-muted-foreground">
          Chargé à 100 % ? Albert vous attend.
        </p>
        <Link
          href="/game"
          className="btn-charge rounded-md bg-accent px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-accent-foreground"
        >
          🎮 Entrer dans l&apos;arène
        </Link>
        <p className="font-mono text-[11px] text-muted-foreground">
          Envie d&apos;aller plus loin après le jeu ?{" "}
          <Link href="/learn" className="text-primary hover:underline">
            L&apos;académie complète est là.
          </Link>
        </p>
      </div>
    </div>
  );
}
