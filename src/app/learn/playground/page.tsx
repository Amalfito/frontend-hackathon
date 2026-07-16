import { PlaygroundTabs } from "@/components/academy/playground-tabs";

export const metadata = {
  title: "Playground — Electra AI Academy",
};

export default function PlaygroundPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent-foreground">
          ⚡ Electra AI Academy
        </p>
        <h1 className="font-elegant text-4xl font-bold text-primary">Playground</h1>
        <p className="max-w-2xl text-muted-foreground">
          Ton labo permanent : affûte tes prompts au banc d&apos;essai R.O.C.C.F.,
          câble des workflows dans le Flow Lab, et récupère les datasets fictifs
          pour t&apos;entraîner sans toucher à la moindre donnée réelle.
        </p>
      </header>
      <PlaygroundTabs />
    </div>
  );
}
