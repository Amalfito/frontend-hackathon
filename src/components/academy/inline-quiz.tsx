"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { LocalQuizQuestion } from "@/lib/academy/types";
import { XP } from "@/lib/academy/gamification";
import { useAcademyProgress } from "@/lib/academy/progress";

type QState = { selected: Set<number>; validated: boolean };

/**
 * QCM formatif local : feedback + explication immédiats, jamais punitif.
 * XP versée une fois quand toutes les questions sont validées.
 * `onPassed(score, total)` permet aux checkpoints d'exiger un seuil.
 */
export function InlineQuiz({
  awardKey,
  title,
  questions,
  onFinished,
}: {
  awardKey: string;
  title?: string;
  questions: LocalQuizQuestion[];
  onFinished?: (correct: number, total: number) => void;
}) {
  const { award, isAwarded } = useAcademyProgress();
  const [states, setStates] = useState<QState[]>(() =>
    questions.map(() => ({ selected: new Set(), validated: false })),
  );

  const toggle = (qi: number, oi: number) => {
    setStates((prev) =>
      prev.map((s, i) => {
        if (i !== qi || s.validated) return s;
        const multi = questions[qi].multi;
        const next = new Set(multi ? s.selected : []);
        if (next.has(oi)) next.delete(oi);
        else next.add(oi);
        return { ...s, selected: next };
      }),
    );
  };

  const validate = (qi: number) => {
    setStates((prev) => {
      const next = prev.map((s, i) => (i === qi ? { ...s, validated: true } : s));
      const allDone = next.every((s) => s.validated);
      if (allDone) {
        const correct = next.filter((s, i) => isCorrect(questions[i], s.selected)).length;
        if (award(awardKey, XP.quiz)) {
          toast.success(`+${XP.quiz} XP — quiz terminé (${correct}/${questions.length}) ⚡`);
        }
        onFinished?.(correct, questions.length);
      }
      return next;
    });
  };

  const done = states.filter((s) => s.validated).length;
  const good = states.filter((s, i) => s.validated && isCorrect(questions[i], s.selected)).length;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
          🎯 {title ?? "Quiz express"}
        </p>
        <span className="font-mono text-[11px] text-muted-foreground">
          {done}/{questions.length} répondue{done > 1 ? "s" : ""} · {good} juste{good > 1 ? "s" : ""}
          {isAwarded(awardKey) ? " · ✓ XP" : ""}
        </span>
      </div>

      {questions.map((q, qi) => {
        const st = states[qi];
        return (
          <div key={qi} className="flex flex-col gap-2">
            <p className="text-sm font-semibold">
              <span className="mr-1.5 text-primary">{qi + 1}.</span>
              {q.q}
              {q.multi && (
                <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-normal text-muted-foreground">
                  plusieurs réponses
                </span>
              )}
            </p>
            <div className="flex flex-col gap-1.5">
              {q.options.map((o, oi) => {
                const checked = st.selected.has(oi);
                const cls = !st.validated
                  ? checked
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                  : o.correct
                    ? "border-emerald-600 bg-emerald-500/10"
                    : checked
                      ? "border-destructive bg-destructive/10"
                      : "border-border opacity-55";
                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={st.validated}
                    onClick={() => toggle(qi, oi)}
                    className={`flex w-full items-center gap-2.5 rounded-md border px-3 py-2 text-left text-sm transition-colors ${cls}`}
                  >
                    <span
                      className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center border ${
                        q.multi ? "rounded-sm" : "rounded-full"
                      } ${checked ? "border-primary bg-primary" : "border-muted-foreground"}`}
                    >
                      {checked && <span className="h-1 w-1 rounded-full bg-background" />}
                    </span>
                    <span className="flex-1">{o.label}</span>
                    {st.validated && o.correct && <span className="text-emerald-600">✔</span>}
                  </button>
                );
              })}
            </div>
            {!st.validated ? (
              <button
                type="button"
                disabled={st.selected.size === 0}
                onClick={() => validate(qi)}
                className="self-start rounded-md bg-primary px-3 py-1.5 font-mono text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-85 disabled:opacity-40"
              >
                Valider
              </button>
            ) : (
              <p
                className={`rounded-md border px-3 py-2 text-sm ${
                  isCorrect(q, st.selected)
                    ? "border-emerald-600/40 bg-emerald-500/10"
                    : "border-accent/50 bg-accent/10"
                }`}
              >
                <span className="font-semibold">
                  {isCorrect(q, st.selected) ? "✔ Bien joué ! " : "💡 Presque — "}
                </span>
                {q.explanation}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function isCorrect(q: LocalQuizQuestion, selected: Set<number>): boolean {
  const expected = new Set(
    q.options.map((o, i) => (o.correct ? i : -1)).filter((i) => i >= 0),
  );
  if (expected.size !== selected.size) return false;
  for (const i of expected) if (!selected.has(i)) return false;
  return true;
}
