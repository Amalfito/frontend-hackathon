"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useAcademyProgress } from "@/lib/academy/progress";
import { SpotlightCard } from "@/components/fx/spotlight-card";

export type LessonSummary = {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
};

/**
 * Sommaire des leçons — pattern « ligne de charge » : un rail vertical se
 * remplit de menthe au scroll et chaque leçon complétée allume son nœud.
 */
export function ModuleLessons({
  moduleSlug,
  lessons,
}: {
  moduleSlug: string;
  lessons: LessonSummary[];
}) {
  const { progress, ready } = useAcademyProgress();
  const listRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.75", "end 0.55"],
  });
  const charge = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });

  const doneCount = ready
    ? lessons.filter((l) => progress.lessons.includes(`${moduleSlug}/${l.slug}`)).length
    : 0;

  return (
    <div className="relative">
      {/* Rail + remplissage « charge » (info aussi portée en texte ci-dessous). */}
      <div
        aria-hidden="true"
        className="absolute bottom-5 left-[19px] top-5 w-[3px] rounded-full bg-border"
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-5 left-[19px] top-5 w-[3px] origin-top rounded-full bg-[var(--electra-mint)] shadow-[0_0_12px_rgb(67_245_185/0.55)]"
        style={{ scaleY: reduced ? 1 : charge }}
      />

      <ol ref={listRef} className="flex flex-col gap-2.5">
        {lessons.map((l, i) => {
          const done =
            ready && progress.lessons.includes(`${moduleSlug}/${l.slug}`);
          return (
            <li key={l.slug} className="relative pl-11">
              {/* Nœud sur le rail. */}
              <span
                aria-hidden="true"
                className={`absolute left-[9px] top-1/2 z-[1] flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border-2 font-mono text-[11px] font-bold transition-all duration-500 ${
                  done
                    ? "border-[var(--electra-mint)] bg-[var(--electra-mint)] text-[var(--electra-petrol)] shadow-[0_0_14px_rgb(67_245_185/0.7)]"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              <SpotlightCard>
                <Link
                  href={`/learn/${moduleSlug}/${l.slug}`}
                  className={`flex items-center gap-4 rounded-lg border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    done
                      ? "border-[var(--electra-mint)]/50 bg-[var(--electra-mint)]/5"
                      : "border-border bg-card"
                  }`}
                >
                  <span className="flex-1">
                    <span className="block font-semibold">{l.title}</span>
                    <span className="block text-sm text-muted-foreground">
                      {l.summary}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 font-mono text-[11px] text-secondary-foreground">
                    {l.minutes} min
                  </span>
                </Link>
              </SpotlightCard>
            </li>
          );
        })}
      </ol>

      <p className="mt-3 pl-11 font-mono text-[11px] text-muted-foreground">
        ⚡ Charge du module : {doneCount}/{lessons.length} leçon
        {lessons.length > 1 ? "s" : ""} ({Math.round((doneCount / lessons.length) * 100)} %)
      </p>
    </div>
  );
}
