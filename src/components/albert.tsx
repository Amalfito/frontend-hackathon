"use client";

/* ============================================================================
 * ALBERT — l'agent renégat qui « parle ». Composant présentationnel réutilisé
 * pour la fausse victoire, la révélation du piège et la victoire collective.
 * Les répliques apparaissent l'une après l'autre (effet transmission).
 * Trois tons : friendly (il félicite), evil (il révèle le piège), victory
 * (il s'avoue vaincu). Respecte prefers-reduced-motion (les délais restent
 * cosmétiques, tout le texte finit visible).
 * ========================================================================== */

import type { ReactNode } from "react";

type Tone = "friendly" | "evil" | "victory";

const TONE: Record<
  Tone,
  { face: string; ring: string; title: string; tag: string; mouth: string; eyes: string }
> = {
  friendly: {
    face: "border-primary/60 bg-primary/10 shadow-[0_0_40px_rgb(67_245_185/0.25)]",
    ring: "border-primary/40",
    title: "text-primary text-glow",
    tag: "text-primary/80",
    mouth: "bg-primary",
    eyes: "bg-primary",
  },
  evil: {
    face: "border-destructive/70 bg-destructive/10 shadow-[0_0_45px_rgb(255_89_64/0.4)] albert-glitch",
    ring: "border-destructive/50",
    title: "text-destructive",
    tag: "text-destructive/90",
    mouth: "bg-destructive",
    eyes: "bg-destructive",
  },
  victory: {
    face: "border-[var(--electra-mint)] bg-[var(--electra-mint)]/10 shadow-[0_0_60px_rgb(67_245_185/0.45)]",
    ring: "border-[var(--electra-mint)]/50",
    title: "text-primary text-glow",
    tag: "text-primary/80",
    mouth: "bg-[var(--electra-mint)]",
    eyes: "bg-[var(--electra-mint)]",
  },
};

/** Tête d'Albert : petit robot stylisé, yeux + bouche animés selon le ton. */
function AlbertFace({ tone }: { tone: Tone }) {
  const c = TONE[tone];
  return (
    <div
      className={`relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 ${c.face}`}
      aria-hidden
    >
      {/* antenne */}
      <span className={`absolute -top-3 h-3 w-0.5 ${c.mouth}`} />
      <span className={`absolute -top-4 h-1.5 w-1.5 rounded-full ${c.mouth} albert-blink`} />
      {/* yeux */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-2.5">
          <span className={`h-2.5 w-2.5 rounded-full ${c.eyes} albert-blink`} />
          <span className={`h-2.5 w-2.5 rounded-full ${c.eyes} albert-blink`} />
        </div>
        {/* bouche : barre qui « parle » */}
        <span className={`h-1 w-8 origin-center rounded-full ${c.mouth} albert-talk`} />
      </div>
    </div>
  );
}

export function AlbertSpeech({
  tone,
  tag,
  title,
  lines,
  children,
}: {
  tone: Tone;
  tag?: string;
  title: string;
  lines: string[];
  children?: ReactNode;
}) {
  const c = TONE[tone];
  return (
    <div
      className={`mx-auto flex w-full max-w-xl flex-col items-center gap-6 rounded-2xl border-2 bg-card/90 p-8 text-center backdrop-blur ${c.ring}`}
    >
      <AlbertFace tone={tone} />

      {tag && (
        <p className={`font-mono text-[11px] uppercase tracking-[0.3em] ${c.tag}`}>
          {tag}
        </p>
      )}

      <h2 className={`font-elegant text-4xl font-bold ${c.title}`}>{title}</h2>

      <div className="flex flex-col gap-3">
        {lines.map((line, i) => (
          <p
            key={i}
            className="albert-line font-mono text-sm leading-relaxed text-foreground/90"
            style={{ animationDelay: `${i * 0.6}s` }}
          >
            {line}
          </p>
        ))}
      </div>

      {children && <div className="mt-2 w-full">{children}</div>}
    </div>
  );
}
