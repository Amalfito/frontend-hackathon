"use client";

import type { ReactNode } from "react";

/**
 * Halo radial menthe qui suit le curseur (pattern « hover spotlight »).
 * Pur CSS piloté par --x/--y ; inerte au clavier et sur touch.
 */
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`spotlight-card rounded-lg ${className ?? ""}`}
      onMouseMove={(e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--y", `${e.clientY - rect.top}px`);
      }}
    >
      {children}
    </div>
  );
}
