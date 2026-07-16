"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Persona } from "@/lib/academy/types";
import { useAcademyProgress } from "@/lib/academy/progress";
import { orientationQuestions, pathFor } from "@/content/academy/paths";

/** Quiz d'orientation 5 questions → persona → parcours recommandé. */
export function OrientationQuiz({ onDone }: { onDone?: () => void }) {
  const { setPersona } = useAcademyProgress();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const finish = (all: number[]) => {
    const totals: Record<Persona, number> = { explorateur: 0, power: 0, builder: 0 };
    all.forEach((oi, qi) => {
      const scores = orientationQuestions[qi].options[oi].scores;
      for (const [p, s] of Object.entries(scores)) totals[p as Persona] += s ?? 0;
    });
    // Ex æquo → le plus ambitieux gagne.
    const winner = (["builder", "power", "explorateur"] as Persona[]).reduce(
      (best, p) => (totals[p] > totals[best] ? p : best),
      "explorateur" as Persona,
    );
    setPersona(winner);
    const path = pathFor(winner);
    toast.success(`${path?.icon} Parcours recommandé : ${path?.label}`, {
      duration: 5000,
    });
    onDone?.();
  };

  const pick = (oi: number) => {
    const next = [...answers, oi];
    if (step + 1 < orientationQuestions.length) {
      setAnswers(next);
      setStep(step + 1);
    } else {
      finish(next);
    }
  };

  const q = orientationQuestions[step];

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-primary/40 bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
          🧭 Quiz d&apos;orientation
        </p>
        <span className="font-mono text-[11px] text-muted-foreground">
          {step + 1}/{orientationQuestions.length}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(step / orientationQuestions.length) * 100}%` }}
        />
      </div>
      <p className="text-lg font-semibold">{q.q}</p>
      <div className="flex flex-col gap-2">
        {q.options.map((o, oi) => (
          <button
            key={oi}
            type="button"
            onClick={() => pick(oi)}
            className="rounded-md border border-border bg-background px-4 py-3 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5"
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
