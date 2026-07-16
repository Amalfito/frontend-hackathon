"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/** Barre de progression de lecture, en haut de la page leçon. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });
  const reduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-[var(--electra-mint)]"
      style={{ scaleX: reduced ? scrollYProgress : scaleX }}
    />
  );
}
