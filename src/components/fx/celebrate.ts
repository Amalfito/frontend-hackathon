"use client";

import confetti from "canvas-confetti";

const ELECTRA_COLORS = ["#43f5b9", "#b9ffe6", "#e7fffc", "#ff7a00", "#0b2936"];

function reducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Petit burst — exercice / quiz validé. */
export function celebrateSmall() {
  if (reducedMotion()) return;
  confetti({
    particleCount: 45,
    spread: 60,
    startVelocity: 32,
    scalar: 0.85,
    colors: ELECTRA_COLORS,
    origin: { y: 0.75 },
    disableForReducedMotion: true,
  });
}

/** Grande décharge — badge / checkpoint débloqué. */
export function celebrateBadge() {
  if (reducedMotion()) return;
  const defaults = { colors: ELECTRA_COLORS, disableForReducedMotion: true };
  confetti({ ...defaults, particleCount: 90, spread: 75, origin: { x: 0.2, y: 0.7 }, angle: 60 });
  confetti({ ...defaults, particleCount: 90, spread: 75, origin: { x: 0.8, y: 0.7 }, angle: 120 });
  setTimeout(() => {
    if (reducedMotion()) return;
    confetti({ ...defaults, particleCount: 60, spread: 100, startVelocity: 40, origin: { y: 0.6 } });
  }, 250);
}
