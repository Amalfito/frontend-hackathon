/* ============================================================================
 * Gamification — barème XP et niveaux (cf. brief Academy §2.2).
 * Jamais punitif : on gagne, on ne perd pas.
 * ========================================================================== */

export const XP = {
  lesson: 10, // leçon terminée
  exercise: 25, // exercice / jeu validé
  quiz: 15, // QCM formatif complété
  checkpoint: 100, // checkpoint de module (→ badge)
} as const;

export type Level = { name: string; min: number; icon: string };

export const LEVELS: Level[] = [
  { name: "Étincelle", min: 0, icon: "✨" },
  { name: "Chargé", min: 250, icon: "🔋" },
  { name: "Haute Tension", min: 700, icon: "⚡" },
  { name: "Ultra-Rapide", min: 1500, icon: "🚀" },
  { name: "Superchargeur", min: 3000, icon: "🌩️" },
];

export function levelFor(xp: number): {
  level: Level;
  next: Level | null;
  /** Progression 0..1 vers le niveau suivant. */
  ratio: number;
} {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].min) idx = i;
  const level = LEVELS[idx];
  const next = LEVELS[idx + 1] ?? null;
  const ratio = next
    ? Math.min(1, (xp - level.min) / (next.min - level.min))
    : 1;
  return { level, next, ratio };
}
