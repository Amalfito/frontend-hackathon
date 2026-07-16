"use client";

import { useState, useTransition } from "react";
import { gradeQuiz } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";
import type { QuizGrade, QuizOption, QuizQuestion } from "@/lib/types";

export type QuizItem = {
  question: QuizQuestion;
  options: QuizOption[];
};

type QState = {
  selected: Set<string>;
  grade: QuizGrade | null;
};

function OptionRow({
  option,
  multiple,
  checked,
  disabled,
  graded,
  isCorrect,
  onToggle,
}: {
  option: QuizOption;
  multiple: boolean;
  checked: boolean;
  disabled: boolean;
  graded: boolean;
  isCorrect: boolean;
  onToggle: () => void;
}) {
  const state = !graded
    ? checked
      ? "border-primary bg-primary/10"
      : "border-border hover:border-primary/50"
    : isCorrect
      ? "border-emerald-500 bg-emerald-500/10"
      : checked
        ? "border-destructive bg-destructive/10"
        : "border-border opacity-60";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={`flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left text-sm transition-colors ${state}`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center border ${
          multiple ? "rounded-sm" : "rounded-full"
        } ${checked ? "border-primary bg-primary" : "border-muted-foreground"}`}
      >
        {checked && <span className="h-1.5 w-1.5 rounded-full bg-background" />}
      </span>
      <span className="flex-1">{option.label}</span>
      {graded && isCorrect && <span className="text-emerald-500">✔</span>}
    </button>
  );
}

export function QuizRunner({ items }: { items: QuizItem[] }) {
  const { t } = useI18n();
  const [pending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [states, setStates] = useState<Record<string, QState>>(() =>
    Object.fromEntries(
      items.map((it) => [it.question.id, { selected: new Set<string>(), grade: null }]),
    ),
  );

  const toggle = (qid: string, oid: string, multiple: boolean) => {
    setStates((prev) => {
      const cur = prev[qid];
      if (cur.grade) return prev; // déjà corrigé → verrouillé
      const next = new Set(multiple ? cur.selected : []);
      if (next.has(oid)) next.delete(oid);
      else next.add(oid);
      return { ...prev, [qid]: { ...cur, selected: next } };
    });
  };

  const validate = (qid: string) => {
    const cur = states[qid];
    if (!cur || cur.selected.size === 0) return;
    setPendingId(qid);
    startTransition(async () => {
      const res = await gradeQuiz(qid, Array.from(cur.selected));
      setPendingId(null);
      if ("error" in res) return;
      setStates((prev) => ({ ...prev, [qid]: { ...prev[qid], grade: res } }));
    });
  };

  const done = items.filter((it) => states[it.question.id]?.grade).length;
  const good = items.filter((it) => states[it.question.id]?.grade?.correct).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {done}/{items.length}{" "}
          {items.length > 1 ? t.quiz.questions : t.quiz.question1} · {good}{" "}
          {t.quiz.correctCount}
        </span>
      </div>

      {items.map((it, idx) => {
        const q = it.question;
        const st = states[q.id];
        const graded = Boolean(st?.grade);
        const correctIds = new Set(st?.grade?.correct_option_ids ?? []);
        const multiple = q.question_type === "multiple";

        return (
          <div key={q.id} className="rounded-lg border border-border bg-card p-5">
            <div className="mb-3 flex items-start justify-between gap-3">
              <p className="font-semibold">
                <span className="mr-2 text-primary">{idx + 1}.</span>
                {q.question}
              </p>
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                {multiple ? t.quiz.multiple : t.quiz.single} · {q.points}{" "}
                {t.quiz.pts}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {it.options.map((o) => (
                <OptionRow
                  key={o.id}
                  option={o}
                  multiple={multiple}
                  checked={st?.selected.has(o.id) ?? false}
                  disabled={graded || pending}
                  graded={graded}
                  isCorrect={correctIds.has(o.id)}
                  onToggle={() => toggle(q.id, o.id, multiple)}
                />
              ))}
            </div>

            {!graded ? (
              <Button
                type="button"
                onClick={() => validate(q.id)}
                disabled={(st?.selected.size ?? 0) === 0 || pending}
                className="mt-4"
              >
                {pending && pendingId === q.id ? t.quiz.checking : t.quiz.validate}
              </Button>
            ) : (
              <div
                className={`mt-4 rounded-md border p-3 text-sm ${
                  st?.grade?.correct
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-destructive/40 bg-destructive/10"
                }`}
              >
                <p className="mb-1 font-semibold">
                  {st?.grade?.correct ? t.quiz.correct : t.quiz.almost}
                </p>
                {st?.grade?.explanation && (
                  <p className="text-muted-foreground">{st.grade.explanation}</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
