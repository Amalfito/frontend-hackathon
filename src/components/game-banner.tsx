"use client";

import { useEffect, useState } from "react";
import { getGameState } from "@/app/actions";
import { BombTimer } from "@/components/bomb-timer";
import type { GameState } from "@/lib/types";

/** Chrono compact affiché dans l'en-tête global dès que la bombe est active. */
export function GameBanner() {
  const [state, setState] = useState<GameState | null>(null);

  useEffect(() => {
    let alive = true;
    getGameState().then((s) => {
      if (alive) setState(s);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!state || state.status === "idle") return null;
  return <BombTimer initial={state} variant="banner" />;
}
