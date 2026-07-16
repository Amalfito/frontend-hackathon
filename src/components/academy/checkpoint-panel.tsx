"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Markdown } from "@/components/markdown";
import { celebrateBadge } from "@/components/fx/celebrate";
import type { AcademyCheckpoint } from "@/lib/academy/types";
import { XP } from "@/lib/academy/gamification";
import { useAcademyProgress } from "@/lib/academy/progress";
import { InlineQuiz } from "./inline-quiz";

/**
 * Checkpoint de fin de module : checklist de livrable auto-déclarée
 * (+ quiz final optionnel à ≥ 80 %) → badge + 100 XP.
 */
export function CheckpointPanel({
  moduleSlug,
  badge,
  checkpoint,
}: {
  moduleSlug: string;
  badge: string;
  checkpoint: AcademyCheckpoint;
}) {
  const { progress, ready, completeCheckpoint } = useAcademyProgress();
  const done = ready && progress.checkpoints.includes(moduleSlug);

  const [checked, setChecked] = useState<boolean[]>(() =>
    checkpoint.checklist.map(() => false),
  );
  // null = quiz pas (encore) terminé ; sinon ratio de réussite.
  const [quizRatio, setQuizRatio] = useState<number | null>(null);

  const needQuiz = Boolean(checkpoint.quiz?.length);
  const quizOk = !needQuiz || (quizRatio !== null && quizRatio >= 0.8);
  const allChecked = checked.every(Boolean);

  const unlock = () => {
    if (completeCheckpoint(moduleSlug)) {
      celebrateBadge();
      toast.success(`🏆 Badge « ${badge} » débloqué ! +${XP.checkpoint} XP`, {
        duration: 5000,
      });
    }
  };

  return (
    <section
      id="checkpoint"
      className={`flex flex-col gap-4 rounded-lg border-2 p-6 ${
        done ? "border-emerald-600/50 bg-emerald-500/5" : "border-accent/60 bg-accent/5"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-elegant text-2xl font-bold">
          🏆 {checkpoint.title}
        </h2>
        {done && (
          <span className="rounded-full border border-emerald-600/50 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold">
            ✓ Badge « {badge} » débloqué
          </span>
        )}
      </div>

      <Markdown content={checkpoint.md} />

      {checkpoint.quiz && (
        <InlineQuiz
          awardKey={`qz:checkpoint:${moduleSlug}`}
          title="Quiz final du module (80 % requis)"
          questions={checkpoint.quiz}
          onFinished={(correct, total) => setQuizRatio(correct / total)}
        />
      )}
      {needQuiz && quizRatio !== null && !quizOk && !done && (
        <p className="rounded-md border border-accent/60 bg-accent/10 px-3 py-2 text-sm">
          Score {Math.round(quizRatio * 100)} % — il faut 80 %. Relis les leçons
          concernées et recharge la page pour retenter : rien n&apos;est perdu. ⚡
        </p>
      )}

      <div className="flex flex-col gap-1.5 rounded-md bg-muted/60 p-3">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Livrable — je certifie que :
        </p>
        {checkpoint.checklist.map((item, i) => (
          <label key={i} className="flex cursor-pointer items-start gap-2.5 text-sm">
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
          onClick={unlock}
          disabled={!allChecked || !quizOk}
          className="btn-charge self-start rounded-md bg-primary px-5 py-2.5 font-mono text-sm font-semibold text-primary-foreground disabled:opacity-40"
        >
          {allChecked && quizOk
            ? `Débloquer le badge « ${badge} » (+${XP.checkpoint} XP)`
            : needQuiz && !quizOk
              ? "Réussis le quiz à 80 % + coche le livrable"
              : "Coche tout le livrable pour débloquer"}
        </button>
      )}
    </section>
  );
}
