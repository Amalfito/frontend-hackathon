"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { celebrateSmall } from "@/components/fx/celebrate";
import { XP } from "@/lib/academy/gamification";
import { useAcademyProgress } from "@/lib/academy/progress";

type Item = { label: string; category: string };

/**
 * Mini-jeu de tri, pensé mobile : sélectionne un item, tape la catégorie.
 * Corrigé d'un coup à la fin ; les erreurs se rejouent (jamais punitif).
 */
export function SortGame({
  awardKey,
  title,
  instructions,
  categories,
  items,
}: {
  awardKey: string;
  title: string;
  instructions: string;
  categories: string[];
  items: Item[];
}) {
  // Mélange stable (pseudo-aléatoire déterministe : pas de mismatch SSR).
  const shuffled = useMemo(() => {
    const arr = items.map((it, i) => ({ ...it, id: i }));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (i * 7 + 3) % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [items]);

  const { award, isAwarded } = useAcademyProgress();
  const [placed, setPlaced] = useState<Record<number, string>>({});
  const [active, setActive] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const remaining = shuffled.filter((it) => !(it.id in placed));
  const allPlaced = remaining.length === 0;
  const errors = shuffled.filter((it) => placed[it.id] && placed[it.id] !== it.category);

  const assign = (cat: string) => {
    if (active === null) return;
    setPlaced((p) => ({ ...p, [active]: cat }));
    setActive(null);
  };

  const check = () => {
    setChecked(true);
    if (errors.length === 0) {
      if (award(awardKey, XP.exercise)) {
        celebrateSmall();
        toast.success(`+${XP.exercise} XP — tri parfait ⚡`);
      }
    }
  };

  const retry = () => {
    setChecked(false);
    setPlaced((p) => {
      const next = { ...p };
      for (const it of errors) delete next[it.id];
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-accent/40 bg-accent/5 p-5">
      <div>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-accent-foreground">
          🎮 {title} {isAwarded(awardKey) && "· ✓ validé"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{instructions}</p>
      </div>

      {/* Items à trier */}
      {!allPlaced && (
        <div className="flex flex-wrap gap-2">
          {remaining.map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => setActive(active === it.id ? null : it.id)}
              className={`rounded-md border px-3 py-1.5 text-left text-sm transition-colors ${
                active === it.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
      {active !== null && (
        <p className="font-mono text-[11px] text-primary">
          → maintenant, choisis sa catégorie ↓
        </p>
      )}

      {/* Catégories */}
      <div
        className={`grid gap-3 ${
          categories.length <= 2
            ? "md:grid-cols-2"
            : categories.length === 3
              ? "md:grid-cols-3"
              : "sm:grid-cols-2 md:grid-cols-4"
        }`}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => assign(cat)}
            disabled={active === null}
            className={`flex min-h-24 flex-col gap-1.5 rounded-lg border p-3 text-left transition-colors ${
              active !== null
                ? "border-primary/60 bg-primary/5 hover:bg-primary/10"
                : "border-border bg-card"
            }`}
          >
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
              {cat}
            </span>
            {shuffled
              .filter((it) => placed[it.id] === cat)
              .map((it) => {
                const wrong = checked && it.category !== cat;
                const right = checked && it.category === cat;
                return (
                  <span
                    key={it.id}
                    className={`rounded border px-2 py-1 text-xs ${
                      wrong
                        ? "border-destructive bg-destructive/10 line-through"
                        : right
                          ? "border-emerald-600/50 bg-emerald-500/10"
                          : "border-border bg-background"
                    }`}
                  >
                    {wrong ? "✘ " : right ? "✔ " : ""}
                    {it.label}
                  </span>
                );
              })}
          </button>
        ))}
      </div>

      {!checked ? (
        <button
          type="button"
          onClick={check}
          disabled={!allPlaced}
          className="self-start rounded-md bg-primary px-4 py-2 font-mono text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-85 disabled:opacity-40"
        >
          {allPlaced ? "Corriger" : `Encore ${remaining.length} à placer…`}
        </button>
      ) : errors.length === 0 ? (
        <p className="rounded-md border border-emerald-600/40 bg-emerald-500/10 px-3 py-2 text-sm font-semibold">
          ⚡ Tri parfait ! Tout est à sa place.
        </p>
      ) : (
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {errors.length} erreur{errors.length > 1 ? "s" : ""} — les items barrés
            retournent dans le paquet.
          </p>
          <button
            type="button"
            onClick={retry}
            className="rounded-md border border-primary px-3 py-1.5 font-mono text-xs font-semibold text-primary hover:bg-primary/10"
          >
            Rejouer les erreurs
          </button>
        </div>
      )}
    </div>
  );
}
