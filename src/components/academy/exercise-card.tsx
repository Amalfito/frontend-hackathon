"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Markdown } from "@/components/markdown";
import { celebrateSmall } from "@/components/fx/celebrate";
import { XP } from "@/lib/academy/gamification";
import { useAcademyProgress } from "@/lib/academy/progress";
import { PromptBox } from "./prompt-box";

/**
 * 🛠️ Exercice « split learning » : consignes + prompt à ouvrir dans Claude,
 * puis auto-validation par checklist de qualité (toutes cochées → XP).
 */
export function ExerciseCard({
  awardKey,
  title,
  md,
  prompt,
  checklist,
}: {
  awardKey: string;
  title: string;
  md: string;
  prompt?: string;
  checklist: string[];
}) {
  const { award, isAwarded } = useAcademyProgress();
  const done = isAwarded(awardKey);
  const [checked, setChecked] = useState<boolean[]>(() => checklist.map(() => false));
  const allChecked = checked.every(Boolean);

  const validate = () => {
    if (award(awardKey, XP.exercise)) {
      celebrateSmall();
      toast.success(`+${XP.exercise} XP — exercice validé ⚡`);
    }
  };

  return (
    <div
      className={`flex flex-col gap-4 rounded-lg border p-5 ${
        done ? "border-emerald-600/40 bg-emerald-500/5" : "border-primary/40 bg-card"
      }`}
    >
      <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
        🛠️ À toi de jouer — {title} {done && "· ✓ validé"}
      </p>
      <Markdown content={md} />
      {prompt && <PromptBox title="Ton point de départ" prompt={prompt} />}

      <div className="flex flex-col gap-1.5 rounded-md bg-muted/60 p-3">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Checklist de validation
        </p>
        {checklist.map((item, i) => (
          <label
            key={i}
            className={`flex cursor-pointer items-start gap-2.5 rounded px-1 py-0.5 text-sm ${
              done ? "text-muted-foreground" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={done || checked[i]}
              disabled={done}
              onChange={() =>
                setChecked((prev) => prev.map((c, j) => (j === i ? !c : c)))
              }
              className="mt-0.5 h-4 w-4 accent-[var(--primary)]"
            />
            <span>{item}</span>
          </label>
        ))}
      </div>

      {!done && (
        <button
          type="button"
          onClick={validate}
          disabled={!allChecked}
          className="self-start rounded-md bg-primary px-4 py-2 font-mono text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-85 disabled:opacity-40"
        >
          {allChecked ? `Valider l'exercice (+${XP.exercise} XP)` : "Coche tout pour valider"}
        </button>
      )}
    </div>
  );
}
