"use client";

import { CopyButton } from "./prompt-box";

/** ❌ mauvais prompt vs ✅ bon prompt, côte à côte. */
export function BeforeAfter({
  title,
  bad,
  good,
  explanation,
}: {
  title?: string;
  bad: string;
  good: string;
  explanation?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {title && (
        <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          ⚖️ {title}
        </p>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-destructive/40 bg-destructive/5">
          <p className="border-b border-destructive/30 px-3 py-1.5 font-mono text-[11px] font-semibold text-destructive">
            ❌ AVANT — le prompt qui court-circuite
          </p>
          <p className="whitespace-pre-wrap px-3 py-2.5 font-mono text-[13px] leading-relaxed text-muted-foreground">
            {bad}
          </p>
        </div>
        <div className="rounded-lg border border-emerald-600/40 bg-emerald-500/5">
          <div className="flex items-center justify-between border-b border-emerald-600/30 px-3 py-1.5">
            <p className="font-mono text-[11px] font-semibold text-emerald-700">
              ✅ APRÈS — le prompt qui charge à 300 kW
            </p>
            <CopyButton text={good} />
          </div>
          <p className="whitespace-pre-wrap px-3 py-2.5 font-mono text-[13px] leading-relaxed text-foreground">
            {good}
          </p>
        </div>
      </div>
      {explanation && (
        <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
          💬 {explanation}
        </p>
      )}
    </div>
  );
}
