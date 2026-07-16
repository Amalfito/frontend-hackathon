"use client";

import NumberFlow from "@number-flow/react";

/** Compteur d'XP qui « roule » à chaque gain. */
export function XpNumber({ value, suffix }: { value: number; suffix?: string }) {
  return (
    <span className="tabular-nums">
      <NumberFlow value={value} suffix={suffix} />
    </span>
  );
}
