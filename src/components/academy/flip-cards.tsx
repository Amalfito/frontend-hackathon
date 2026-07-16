"use client";

import { useState } from "react";

function FlipCard({ front, back }: { front: string; back: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      className="flip-scene min-h-36 text-left"
    >
      <div className="flip-inner h-full min-h-36" data-flipped={flipped}>
        {/* Recto */}
        <div className="flip-face flex h-full min-h-36 flex-col justify-between rounded-lg border border-border bg-card p-4 transition-shadow hover:border-[var(--electra-mint)]/60 hover:shadow-[0_4px_20px_rgb(11_41_54/0.08)]">
          <span className="text-base font-semibold">{front}</span>
          <span className="font-mono text-[11px] text-muted-foreground">
            cliquer pour retourner ↻
          </span>
        </div>
        {/* Verso */}
        <div className="flip-face flip-back rounded-lg border border-[var(--electra-mint)]/60 bg-[var(--electra-mint)]/8 p-4">
          <span className="block text-sm leading-relaxed text-foreground">
            {back}
          </span>
        </div>
      </div>
    </button>
  );
}

/** Cartes recto/verso — flip 3D, mémorisation active. */
export function FlipCards({
  title,
  cards,
}: {
  title?: string;
  cards: { front: string; back: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      {title && (
        <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          🃏 {title}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((c, i) => (
          <FlipCard key={i} front={c.front} back={c.back} />
        ))}
      </div>
    </div>
  );
}
