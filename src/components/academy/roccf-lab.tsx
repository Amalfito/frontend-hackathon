"use client";

import { useMemo, useState } from "react";
import { claudeUrl, CopyButton } from "./prompt-box";

/* ============================================================================
 * Prompt Lab — analyse R.O.C.C.F. en direct : les lettres s'allument quand
 * le prompt contient les signaux correspondants. Heuristique volontairement
 * indulgente : c'est un guide, pas un juge.
 * ========================================================================== */

type Criterion = {
  letter: string;
  name: string;
  hint: string;
  test: (p: string) => boolean;
};

const CRITERIA: Criterion[] = [
  {
    letter: "R",
    name: "Rôle",
    hint: "Donne un rôle : « Tu es analyste énergie chez un opérateur de recharge rapide… »",
    test: (p) => /\b(tu es|vous êtes|en tant que|agis comme|you are|joue le rôle)\b/i.test(p),
  },
  {
    letter: "O",
    name: "Objectif",
    hint: "Un verbe d'action précis : rédige, analyse, extrais, compare, synthétise, classe…",
    test: (p) =>
      /\b(rédige|écris|analyse|extrais|synthétise|résume|compare|classe|liste|propose|génère|crée|identifie|prépare|traduis|corrige|évalue|priorise)\b/i.test(p),
  },
  {
    letter: "C",
    name: "Contexte",
    hint: "Les infos qu'il ne peut pas deviner : données, situation, audience. « Voici… », « Contexte : … »",
    test: (p) =>
      /\b(contexte|voici|ci-dessous|ci-joint|d'après|à partir de|chez electra|notre|données suivantes)\b/i.test(p) || p.length > 400,
  },
  {
    letter: "C",
    name: "Critères",
    hint: "Format, longueur, ton, langue, interdits : « 120 mots max », « en JSON », « ton empathique », « sans jargon »…",
    test: (p) =>
      /\b(format|mots max|maximum|caractères|ton\s|json|bullet|puces|tableau|structure|en français|en anglais|n'inclus pas|sans jargon|évite|ne pas|pas de)\b/i.test(p),
  },
  {
    letter: "F",
    name: "Feedback / exemples",
    hint: "L'arme secrète : 1-2 exemples de ce que tu attends. « Exemple : … », « comme ceci : … »",
    test: (p) => /\b(exemple|par ex\.|comme ceci|voici le style|modèle attendu|few-shot)\b/i.test(p) || /<exemple/i.test(p),
  },
];

const STARTERS = [
  {
    label: "Email post-incident (Support)",
    text: "fais un mail pour la panne d'hier",
  },
  {
    label: "Analyse de sessions (Data)",
    text: "analyse ce csv de sessions de charge",
  },
  {
    label: "Courrier mairie (Déploiement)",
    text: "écris un courrier à la mairie pour notre projet de station",
  },
];

export function RoccfLab() {
  const [prompt, setPrompt] = useState("");

  const results = useMemo(
    () => CRITERIA.map((c) => ({ ...c, ok: prompt.trim().length > 0 && c.test(prompt) })),
    [prompt],
  );
  const score = results.filter((r) => r.ok).length;
  const words = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Écris (ou colle) un prompt : la jauge R.O.C.C.F. s&apos;allume en direct.
        Objectif : 5/5 avant d&apos;appuyer sur le bouton. Besoin d&apos;un point de
        départ volontairement raté ?
        {STARTERS.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setPrompt(s.text)}
            className="ml-2 rounded border border-border px-2 py-0.5 font-mono text-[11px] text-primary hover:bg-primary/10"
          >
            {s.label}
          </button>
        ))}
      </p>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={9}
        placeholder="Tu es… Rédige… Voici le contexte… Critères : … Exemple : …"
        className="w-full rounded-lg border border-border bg-card p-4 font-mono text-sm leading-relaxed outline-none ring-primary/40 focus:ring-2"
      />

      <div className="grid gap-2 sm:grid-cols-5">
        {results.map((r, i) => (
          <div
            key={i}
            title={r.hint}
            className={`flex flex-col gap-1 rounded-lg border p-3 transition-colors ${
              r.ok
                ? "border-emerald-600/50 bg-emerald-500/10"
                : "border-border bg-card opacity-80"
            }`}
          >
            <span
              className={`font-mono text-xl font-bold ${
                r.ok ? "text-emerald-700" : "text-muted-foreground"
              }`}
            >
              {r.ok ? "✓" : "○"} {r.letter}
            </span>
            <span className="text-xs font-semibold">{r.name}</span>
            {!r.ok && <span className="text-[11px] text-muted-foreground">{r.hint}</span>}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground">
          {score}/5 · {words} mots
        </span>
        <CopyButton text={prompt} label="Copier le prompt" />
        <a
          href={claudeUrl(prompt)}
          target="_blank"
          rel="noreferrer"
          className={`rounded-md px-4 py-2 font-mono text-xs font-semibold transition-opacity ${
            prompt.trim()
              ? "bg-primary text-primary-foreground hover:opacity-85"
              : "pointer-events-none bg-muted text-muted-foreground"
          }`}
        >
          Tester dans Claude ↗
        </a>
        {score === 5 && (
          <span className="font-mono text-xs font-semibold text-emerald-700">
            ⚡ Prompt haute tension — envoie !
          </span>
        )}
      </div>
    </div>
  );
}
