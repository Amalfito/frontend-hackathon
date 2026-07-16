import { PromptLibrary } from "@/components/academy/prompt-library";

export const metadata = {
  title: "Bibliothèque de prompts — Electra AI Academy",
};

export default function PromptsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent-foreground">
          ⚡ Electra AI Academy
        </p>
        <h1 className="font-elegant text-4xl font-bold text-primary">
          Bibliothèque de prompts
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Les prompts qui marchent, par métier, prêts à copier. Remplace les
          variables <code className="rounded bg-muted px-1 font-mono text-sm">{"{entre_accolades}"}</code>{" "}
          par ton contexte. Un bon prompt se capitalise : propose les tiens sur
          Slack <strong>#ia-academy</strong> pour enrichir la bibliothèque.
        </p>
      </header>
      <PromptLibrary />
    </div>
  );
}
