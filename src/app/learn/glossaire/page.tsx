import { GlossaryList } from "@/components/academy/glossary-list";

export const metadata = {
  title: "Glossaire — Electra AI Academy",
};

export default function GlossairePage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent-foreground">
          ⚡ Electra AI Academy
        </p>
        <h1 className="font-elegant text-4xl font-bold text-primary">
          Glossaire FR ↔ EN
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          L&apos;écosystème IA parle anglais, pas de panique : voici les ~40 termes
          qui couvrent 95 % des conversations, expliqués simplement et à la sauce
          Electra.
        </p>
      </header>
      <GlossaryList />
    </div>
  );
}
