"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getGameState } from "@/app/actions";
import { BombTimer } from "@/components/bomb-timer";
import type { GameState } from "@/lib/types";

/**
 * Barre chrono globale (pleine largeur, gros chiffres) affichée sous l'en-tête.
 * Visible sur tout le site MÊME quand la bombe n'est pas armée — sauf sur la
 * partie apprentissage (`/learn`), qui doit rester pédagogique et non stressante.
 */
export function GameBanner() {
  const pathname = usePathname();
  const [state, setState] = useState<GameState | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    getGameState().then((s) => {
      if (!alive) return;
      setState(s);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Zone apprentissage : pas de chrono.
  if (pathname?.startsWith("/learn")) return null;
  // Évite un flash avant le premier chargement de l'état.
  if (!loaded) return null;

  return <BombTimer initial={state} variant="bar" />;
}
