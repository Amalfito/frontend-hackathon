"use client";

import { useState } from "react";
import { glossary } from "@/content/academy/glossary";

export function GlossaryList() {
  const [query, setQuery] = useState("");
  const filtered = glossary.filter((g) =>
    `${g.term} ${g.en ?? ""} ${g.def}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Chercher un terme (ex. token, MCP, hallucination…)"
        className="w-full max-w-md rounded-md border border-border bg-card px-4 py-2.5 text-sm outline-none ring-primary/40 focus:ring-2"
      />
      <dl className="grid gap-3 md:grid-cols-2">
        {filtered.map((g) => (
          <div key={g.term} className="rounded-lg border border-border bg-card p-4">
            <dt className="flex items-baseline gap-2">
              <span className="font-semibold text-primary">{g.term}</span>
              {g.en && (
                <span className="font-mono text-[11px] text-muted-foreground">
                  EN : {g.en}
                </span>
              )}
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {g.def}
            </dd>
          </div>
        ))}
      </dl>
      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Terme introuvable — demande sur #ia-academy, on l&apos;ajoutera !
        </p>
      )}
    </div>
  );
}
