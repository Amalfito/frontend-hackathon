import Link from "next/link";
import { ArcadeGame } from "@/components/arcade/arcade-game";
import { JoinForm } from "@/components/join-form";
import { getArcade } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Escape Game — Opération Albert",
};

export default async function GamePage() {
  const state = await getArcade();

  // Pas d'équipe → briefing + connexion.
  if (state === null) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-8 py-8">
        <header className="flex flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
            ⚠ Opération Albert · niveau d&apos;alerte maximal
          </p>
          <h1 className="hero-title font-elegant font-semibold text-primary text-glow">
            20 verrous.
            <br />
            Un agent renégat.
          </h1>
          <p className="leading-relaxed text-muted-foreground">
            Albert, notre agent IA, a verrouillé le réseau derrière{" "}
            <strong className="text-foreground">20 épreuves de difficulté croissante</strong>{" "}
            : énigmes, tris, liaisons, cibles mobiles, prompts à forger… Certaines
            sont <strong className="text-accent">piégées</strong> : 30 secondes pour
            répondre, sinon tout votre run est réinitialisé avec de nouvelles
            questions. Et chaque équipe dispose d&apos;<strong className="text-accent">un
            sabotage</strong> à utiliser contre une rivale. Choisissez bien votre
            moment.
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Besoin de réviser d&apos;abord ? La{" "}
            <Link href="/kb/express" className="text-primary hover:underline">
              Knowledge Base Express
            </Link>{" "}
            contient tout.
          </p>
        </header>
        <div className="terminal-glow rounded-lg border border-primary/40 bg-card p-6">
          <JoinForm next="/game" />
        </div>
      </div>
    );
  }

  // Base non migrée / erreur serveur.
  if ("error" in state) {
    return (
      <div className="mx-auto max-w-2xl py-10">
        <p className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 font-mono text-sm">
          ⚠ Arcade indisponible : {state.error}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl py-4">
      <ArcadeGame initial={state} />
    </div>
  );
}
