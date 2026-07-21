"use client";

import { useEffect } from "react";
import { celebrateBadge } from "@/components/fx/celebrate";

/** Décharge de confettis une fois au montage (écran de victoire collective). */
export function VictoryConfetti() {
  useEffect(() => {
    celebrateBadge();
    const id = setTimeout(celebrateBadge, 900);
    return () => clearTimeout(id);
  }, []);
  return null;
}
