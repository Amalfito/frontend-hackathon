"use client";

import Link from "next/link";
import { useState } from "react";
import { levelFor } from "@/lib/academy/gamification";
import { useAcademyProgress } from "@/lib/academy/progress";
import { modules } from "@/content/academy";
import { pathFor } from "@/content/academy/paths";

/** Certificat imprimable : parcours complet + M11 obligatoire. */
export function Certificate() {
  const { progress, ready } = useAcademyProgress();
  const [name, setName] = useState("");

  const path = pathFor(progress.persona);
  const requiredSlugs = path
    ? [...new Set([...path.modules, "securite"])]
    : ["securite"];
  const missing = requiredSlugs.filter((s) => !progress.checkpoints.includes(s));
  const eligible = ready && path && missing.length === 0;

  const earned = modules.filter((m) => progress.checkpoints.includes(m.slug));
  const { level } = levelFor(progress.xp);
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!ready) return null;

  if (!eligible) {
    return (
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
        <h1 className="font-elegant text-3xl font-bold text-primary">
          🎓 Certificat Electra AI Academy
        </h1>
        <p className="text-muted-foreground">
          Le certificat se débloque quand tous les checkpoints de ton parcours
          {path ? ` (${path.label})` : ""} <strong>et le module Sécurité (M11)</strong>{" "}
          sont validés.
        </p>
        {!path ? (
          <p className="text-sm">
            Commence par choisir ton parcours sur la{" "}
            <Link href="/learn" className="font-semibold text-primary hover:underline">
              page d&apos;accueil de l&apos;académie
            </Link>
            .
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Il te reste :
            </p>
            {missing.map((slug) => {
              const m = modules.find((mm) => mm.slug === slug);
              return (
                <Link
                  key={slug}
                  href={`/learn/${slug}`}
                  className="text-sm text-primary hover:underline"
                >
                  → {m?.icon} {m?.code} · {m?.title}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ton prénom et nom"
          className="w-64 rounded-md border border-border bg-card px-4 py-2.5 text-sm outline-none ring-primary/40 focus:ring-2"
        />
        <button
          type="button"
          onClick={() => window.print()}
          disabled={!name.trim()}
          className="rounded-md bg-primary px-5 py-2.5 font-mono text-sm font-semibold text-primary-foreground hover:opacity-85 disabled:opacity-40"
        >
          🖨 Imprimer / PDF
        </button>
      </div>

      <div className="mx-auto w-full max-w-2xl rounded-lg border-4 border-double border-primary bg-card p-10 text-center print:border-2">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-foreground">
          ⚡ Electra AI Academy
        </p>
        <h1 className="mt-4 font-elegant text-4xl font-bold text-primary">
          Certificat de réussite
        </h1>
        <p className="mt-6 text-muted-foreground">décerné à</p>
        <p className="mt-1 font-elegant text-3xl font-semibold">
          {name.trim() || "________________"}
        </p>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
          pour avoir complété le parcours <strong>{path!.label}</strong> de
          l&apos;académie IA d&apos;Electra — {earned.length} badges,{" "}
          {progress.xp} XP, niveau {level.icon} {level.name} — dont le module
          obligatoire « Sécurité &amp; IA responsable ».
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-1.5">
          {earned.map((m) => (
            <span
              key={m.slug}
              className="rounded-full border border-primary/40 bg-primary/5 px-2.5 py-0.5 font-mono text-[10px] font-semibold"
            >
              {m.icon} {m.badge}
            </span>
          ))}
        </div>
        <p className="mt-8 font-mono text-[11px] text-muted-foreground">
          Fait le {today} · apprendre, brancher, désamorcer 🔋
        </p>
      </div>
    </div>
  );
}
