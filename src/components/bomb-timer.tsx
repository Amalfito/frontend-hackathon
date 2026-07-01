"use client";

import { useEffect, useState } from "react";
import { getGameState } from "@/app/actions";
import type { GameState } from "@/lib/types";

function fmt(total: number): string {
  const s = Math.max(0, Math.floor(total));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(h > 0 ? m : m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Secondes restantes déduites de l'état (ends_at pour running, sinon mémorisé). */
function computeRemaining(state: GameState, nowMs: number): number | null {
  if (state.status === "running" && state.ends_at) {
    return Math.max(0, (new Date(state.ends_at).getTime() - nowMs) / 1000);
  }
  if (state.status === "paused" || state.status === "stopped") {
    return state.remaining_seconds ?? null;
  }
  return null;
}

const STATUS_LABEL: Record<GameState["status"], string> = {
  idle: "EN ATTENTE",
  running: "ARMÉE",
  paused: "EN PAUSE",
  stopped: "GELÉE",
  defused: "DÉSAMORCÉE",
  exploded: "EXPLOSÉE",
};

export function BombTimer({
  initial,
  variant = "full",
}: {
  initial: GameState | null;
  variant?: "full" | "banner";
}) {
  const [state, setState] = useState<GameState | null>(initial);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  // Tick d'affichage (chaque seconde).
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Poll de l'état serveur (changements admin : arm/pause/stop…).
  useEffect(() => {
    let alive = true;
    const poll = async () => {
      const fresh = await getGameState();
      if (alive && fresh) setState(fresh);
    };
    const id = setInterval(poll, 4000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  if (!state || state.status === "idle") {
    if (variant === "banner") return null;
    return (
      <div className="rounded-md border border-border/50 bg-card/50 px-4 py-3 text-center font-mono text-xs text-muted-foreground">
        ⏱ Minuteur non armé — en attente du maître du jeu.
      </div>
    );
  }

  const remaining = computeRemaining(state, nowMs);
  const exploded =
    state.status === "exploded" ||
    (state.status === "running" && remaining !== null && remaining <= 0);
  const critical =
    !exploded &&
    state.status === "running" &&
    remaining !== null &&
    remaining <= 60;

  const display =
    remaining !== null ? fmt(remaining) : exploded ? "00:00" : "—:—";

  const tone = exploded
    ? "text-destructive"
    : critical
      ? "text-destructive"
      : state.status === "running"
        ? "text-accent"
        : "text-muted-foreground";

  if (variant === "banner") {
    return (
      <span
        className={`inline-flex items-center gap-2 font-mono text-xs ${tone} ${
          critical || exploded ? "bomb-critical rounded px-1.5" : ""
        }`}
      >
        <span aria-hidden>◉</span>
        <span className="tabular-nums font-bold">{display}</span>
        <span className="opacity-70">{STATUS_LABEL[state.status]}</span>
      </span>
    );
  }

  return (
    <div
      className={`bomb-frame relative overflow-hidden rounded-lg border border-accent/30 bg-black/40 px-6 py-5 ${
        critical || exploded ? "bomb-critical" : ""
      }`}
    >
      <div className="scanline pointer-events-none absolute inset-0" />
      <div className="relative flex flex-col items-center gap-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
          {exploded ? "// DÉTONATION" : "// COMPTE À REBOURS"}
        </span>
        <span
          className={`font-mono text-5xl font-bold tabular-nums tracking-widest ${tone}`}
        >
          {display}
        </span>
        <span className={`font-mono text-[11px] uppercase tracking-widest ${tone}`}>
          BOMBE {STATUS_LABEL[state.status]}
        </span>
        {state.submissions_locked && !exploded && (
          <span className="mt-1 font-mono text-[11px] text-destructive">
            🔒 Soumissions gelées
          </span>
        )}
        {state.message && (
          <p className="mt-2 max-w-md text-center font-mono text-xs text-accent">
            {state.message}
          </p>
        )}
      </div>
    </div>
  );
}
