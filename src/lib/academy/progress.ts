"use client";

/* ============================================================================
 * Progression apprenant — localStorage, hydration-safe (useSyncExternalStore).
 * Chaque récompense a une clé unique (`awarded`) : l'XP n'est versée qu'une
 * fois, jamais reprise (gamification non punitive).
 * Un event `academy:progress` synchronise tous les composants montés.
 * ========================================================================== */

import { useCallback, useSyncExternalStore } from "react";
import type { Persona } from "./types";

const STORAGE_KEY = "electra-academy-v1";
const EVENT = "academy:progress";

export type AcademyProgress = {
  persona: Persona | null;
  xp: number;
  /** Clé de récompense → XP versée (idempotence). */
  awarded: Record<string, number>;
  /** "module/lesson" terminées. */
  lessons: string[];
  /** Slugs de modules dont le checkpoint est validé (→ badge). */
  checkpoints: string[];
};

const EMPTY: AcademyProgress = {
  persona: null,
  xp: 0,
  awarded: {},
  lessons: [],
  checkpoints: [],
};

function parse(raw: string | null): AcademyProgress {
  if (!raw) return EMPTY;
  try {
    const p = JSON.parse(raw) as Partial<AcademyProgress>;
    return {
      persona: p.persona ?? null,
      xp: typeof p.xp === "number" ? p.xp : 0,
      awarded: p.awarded ?? {},
      lessons: Array.isArray(p.lessons) ? p.lessons : [],
      checkpoints: Array.isArray(p.checkpoints) ? p.checkpoints : [],
    };
  } catch {
    return EMPTY;
  }
}

// Snapshot mémoïsé par valeur brute : useSyncExternalStore exige une
// référence stable tant que rien n'a changé.
let cachedRaw: string | null | undefined;
let cachedValue: AcademyProgress = EMPTY;

function getSnapshot(): AcademyProgress {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = parse(raw);
  }
  return cachedValue;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function load(): AcademyProgress {
  return getSnapshot();
}

function save(p: AcademyProgress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Hook de progression. `ready` passe à true après hydratation : afficher un
 * état neutre tant que c'est false (évite les mismatches SSR).
 */
export function useAcademyProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  /** Verse `xp` une seule fois pour `key`. Retourne true si nouvellement versé. */
  const award = useCallback((key: string, xp: number): boolean => {
    const cur = load();
    if (key in cur.awarded) return false;
    save({ ...cur, xp: cur.xp + xp, awarded: { ...cur.awarded, [key]: xp } });
    return true;
  }, []);

  const isAwarded = useCallback(
    (key: string) => key in progress.awarded,
    [progress.awarded],
  );

  const completeLesson = useCallback((key: string): boolean => {
    const cur = load();
    if (cur.lessons.includes(key)) return false;
    save({
      ...cur,
      lessons: [...cur.lessons, key],
      xp: cur.xp + (key in cur.awarded ? 0 : 10),
      awarded: { ...cur.awarded, [key]: 10 },
    });
    return true;
  }, []);

  const completeCheckpoint = useCallback((moduleSlug: string): boolean => {
    const cur = load();
    if (cur.checkpoints.includes(moduleSlug)) return false;
    const key = `checkpoint:${moduleSlug}`;
    save({
      ...cur,
      checkpoints: [...cur.checkpoints, moduleSlug],
      xp: cur.xp + (key in cur.awarded ? 0 : 100),
      awarded: { ...cur.awarded, [key]: 100 },
    });
    return true;
  }, []);

  const setPersona = useCallback((persona: Persona) => {
    save({ ...load(), persona });
  }, []);

  const reset = useCallback(() => {
    save({ ...EMPTY });
  }, []);

  return {
    progress,
    ready,
    award,
    isAwarded,
    completeLesson,
    completeCheckpoint,
    setPersona,
    reset,
  };
}
