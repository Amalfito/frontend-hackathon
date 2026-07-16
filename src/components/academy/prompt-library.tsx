"use client";

import { useMemo, useState } from "react";
import { libraryPrompts } from "@/content/academy/prompts";
import { claudeUrl, CopyButton } from "./prompt-box";

export function PromptLibrary() {
  const metiers = useMemo(
    () => [...new Set(libraryPrompts.map((p) => p.metier))],
    [],
  );
  const [metier, setMetier] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const filtered = libraryPrompts.filter(
    (p) =>
      (!metier || p.metier === metier) &&
      (!query ||
        `${p.title} ${p.prompt}`.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMetier(null)}
          className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-colors ${
            metier === null
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border hover:border-primary/50"
          }`}
        >
          Tous ({libraryPrompts.length})
        </button>
        {metiers.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMetier(metier === m ? null : m)}
            className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-colors ${
              metier === m
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:border-primary/50"
            }`}
          >
            {m}
          </button>
        ))}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher…"
          className="ml-auto w-44 rounded-md border border-border bg-card px-3 py-1.5 text-sm outline-none ring-primary/40 focus:ring-2"
        />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((p) => (
          <div key={p.id} className="rounded-lg border border-border bg-card">
            <button
              type="button"
              onClick={() => setOpen(open === p.id ? null : p.id)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
            >
              <span>
                <span className="mr-2 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                  {p.metier}
                </span>
                <span className="font-semibold">{p.title}</span>
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {open === p.id ? "▲" : "▼"}
              </span>
            </button>
            {open === p.id && (
              <div className="border-t border-border">
                <pre className="max-h-80 overflow-auto whitespace-pre-wrap px-4 py-3 font-mono text-[13px] leading-relaxed">
                  {p.prompt}
                </pre>
                <div className="flex gap-2 border-t border-border px-4 py-2">
                  <CopyButton text={p.prompt} />
                  <a
                    href={claudeUrl(p.prompt)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md bg-primary px-2.5 py-1 font-mono text-[11px] font-semibold text-primary-foreground hover:opacity-85"
                  >
                    Ouvrir dans Claude ↗
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Aucun prompt ne correspond — élargis ta recherche.
          </p>
        )}
      </div>
    </div>
  );
}
