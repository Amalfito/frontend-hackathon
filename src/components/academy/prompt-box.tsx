"use client";

import { useState } from "react";

/** URL d'ouverture d'un nouveau chat Claude pré-rempli. */
export function claudeUrl(prompt: string): string {
  return `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
}

export function CopyButton({
  text,
  label = "Copier",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard indisponible : tant pis, le texte reste sélectionnable */
        }
      }}
      className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-[11px] font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      {copied ? "✓ Copié !" : label}
    </button>
  );
}

/** Prompt prêt à l'emploi : copie en un clic + ouverture directe dans Claude. */
export function PromptBox({
  title,
  prompt,
  note,
}: {
  title?: string;
  prompt: string;
  note?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-primary/30 bg-primary/5">
      <div className="flex items-center justify-between gap-2 border-b border-primary/20 px-4 py-2">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
          ⚡ {title ?? "Prompt à copier"}
        </span>
        <div className="flex items-center gap-2">
          <CopyButton text={prompt} />
          <a
            href={claudeUrl(prompt)}
            target="_blank"
            rel="noreferrer"
            className="btn-charge rounded-md bg-primary px-2.5 py-1 font-mono text-[11px] font-semibold text-primary-foreground"
          >
            Ouvrir dans Claude ↗
          </a>
        </div>
      </div>
      <pre className="max-h-64 overflow-auto whitespace-pre-wrap px-4 py-3 font-mono text-[13px] leading-relaxed text-foreground">
        {prompt}
      </pre>
      {note && (
        <p className="border-t border-primary/20 px-4 py-2 text-xs text-muted-foreground">
          {note}
        </p>
      )}
    </div>
  );
}
