"use client";

import { XpNumber } from "@/components/fx/xp-number";
import { levelFor } from "@/lib/academy/gamification";
import { useAcademyProgress } from "@/lib/academy/progress";

/** Barre de niveau + XP (compteur roulant), bandeau de l'académie. */
export function XpBar({ compact = false }: { compact?: boolean }) {
  const { progress, ready } = useAcademyProgress();
  const { level, next, ratio } = levelFor(ready ? progress.xp : 0);

  return (
    <div className={`flex items-center gap-3 ${compact ? "" : "w-full max-w-sm"}`}>
      <span className="whitespace-nowrap font-mono text-[11px] font-semibold text-primary">
        {level.icon} {level.name}
      </span>
      <div className="h-2 min-w-16 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-[var(--electra-mint)] shadow-[0_0_8px_rgb(67_245_185/0.5)] transition-all duration-500"
          style={{ width: `${Math.round(ratio * 100)}%` }}
        />
      </div>
      <span className="whitespace-nowrap font-mono text-[11px] text-muted-foreground">
        <XpNumber value={ready ? progress.xp : 0} /> XP
        {next ? ` / ${next.min}` : " · max !"}
      </span>
    </div>
  );
}
