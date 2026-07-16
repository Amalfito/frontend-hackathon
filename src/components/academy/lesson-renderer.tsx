"use client";

import { Markdown } from "@/components/markdown";
import { Reveal } from "@/components/fx/reveal";
import type { AcademyBlock } from "@/lib/academy/types";
import { BeforeAfter } from "./before-after";
import { ExerciseCard } from "./exercise-card";
import { FlipCards } from "./flip-cards";
import { InlineQuiz } from "./inline-quiz";
import { PromptBox } from "./prompt-box";
import { SortGame } from "./sort-game";

function Callout({
  icon,
  tone,
  title,
  md,
}: {
  icon: string;
  tone: "concept" | "demo" | "warning" | "tip";
  title?: string;
  md: string;
}) {
  const styles: Record<typeof tone, string> = {
    concept: "border-border bg-card",
    demo: "border-primary/30 bg-primary/5",
    warning: "border-[var(--electra-orange)]/50 bg-[var(--electra-orange)]/8",
    tip: "border-[var(--electra-mint)]/50 bg-[var(--electra-mint)]/8",
  };
  const labels: Record<typeof tone, string> = {
    concept: "Concept",
    demo: "Démo",
    warning: "Piège classique",
    tip: "Réflexe pro",
  };
  return (
    <div className={`rounded-lg border p-5 ${styles[tone]}`}>
      <p className="mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon} {labels[tone]}
        {title ? ` — ${title}` : ""}
      </p>
      <Markdown content={md} />
    </div>
  );
}

/** Rend la séquence de blocs d'une leçon. `keyPrefix` = "module/lesson". */
export function LessonRenderer({
  keyPrefix,
  blocks,
}: {
  keyPrefix: string;
  blocks: AcademyBlock[];
}) {
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((b, i) => (
        <Reveal key={i} y={18}>
          {renderBlock(b, i, keyPrefix)}
        </Reveal>
      ))}
    </div>
  );
}

function renderBlock(b: AcademyBlock, i: number, keyPrefix: string) {
  switch (b.kind) {
          case "concept":
            return <Callout key={i} icon="🧠" tone="concept" title={b.title} md={b.md} />;
          case "demo":
            return <Callout key={i} icon="🎬" tone="demo" title={b.title} md={b.md} />;
          case "warning":
            return <Callout key={i} icon="⚠️" tone="warning" title={b.title} md={b.md} />;
          case "tip":
            return <Callout key={i} icon="💡" tone="tip" title={b.title} md={b.md} />;
          case "prompt":
            return <PromptBox key={i} title={b.title} prompt={b.prompt} note={b.note} />;
          case "beforeAfter":
            return (
              <BeforeAfter
                key={i}
                title={b.title}
                bad={b.bad}
                good={b.good}
                explanation={b.explanation}
              />
            );
          case "code":
            return (
              <div key={i} className="overflow-hidden rounded-lg border border-border">
                <p className="border-b border-border bg-muted px-4 py-1.5 font-mono text-[11px] font-semibold text-muted-foreground">
                  {b.title ?? b.lang}
                </p>
                <pre className="max-h-96 overflow-auto bg-[var(--electra-petrol)] px-4 py-3 font-mono text-[13px] leading-relaxed text-[var(--electra-mint-soft)]">
                  {b.code}
                </pre>
              </div>
            );
          case "flipcards":
            return <FlipCards key={i} title={b.title} cards={b.cards} />;
          case "sort":
            return (
              <SortGame
                key={i}
                awardKey={`sort:${keyPrefix}:${i}`}
                title={b.title}
                instructions={b.instructions}
                categories={b.categories}
                items={b.items}
              />
            );
          case "quiz":
            return (
              <InlineQuiz
                key={i}
                awardKey={`qz:${keyPrefix}:${i}`}
                title={b.title}
                questions={b.questions}
              />
            );
          case "exercise":
            return (
              <ExerciseCard
                key={i}
                awardKey={`ex:${keyPrefix}:${i}`}
                title={b.title}
                md={b.md}
                prompt={b.prompt}
                checklist={b.checklist}
              />
            );
  }
}
