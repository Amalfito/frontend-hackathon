"use client";

import Link from "next/link";
import { toast } from "sonner";
import { XP } from "@/lib/academy/gamification";
import { useAcademyProgress } from "@/lib/academy/progress";

/** Bas de leçon : marquer comme terminée (+XP) et naviguer. */
export function LessonFooter({
  moduleSlug,
  lessonSlug,
  prevHref,
  nextHref,
  nextLabel,
}: {
  moduleSlug: string;
  lessonSlug: string;
  prevHref: string;
  nextHref: string;
  nextLabel: string;
}) {
  const { progress, ready, completeLesson } = useAcademyProgress();
  const key = `${moduleSlug}/${lessonSlug}`;
  const done = ready && progress.lessons.includes(key);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center">
        {done ? (
          <p className="rounded-full border border-emerald-600/50 bg-emerald-500/10 px-4 py-1.5 font-mono text-xs font-semibold">
            ✓ Leçon terminée
          </p>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (completeLesson(key)) {
                toast.success(`+${XP.lesson} XP — leçon terminée ⚡`);
              }
            }}
            className="btn-charge rounded-md bg-primary px-5 py-2.5 font-mono text-sm font-semibold text-primary-foreground"
          >
            J&apos;ai terminé cette leçon (+{XP.lesson} XP)
          </button>
        )}
      </div>
      <div className="flex items-center justify-between text-sm">
        <Link href={prevHref} className="text-muted-foreground hover:text-primary">
          ← Précédent
        </Link>
        <Link href={nextHref} className="font-semibold text-primary hover:underline">
          {nextLabel} →
        </Link>
      </div>
    </div>
  );
}
