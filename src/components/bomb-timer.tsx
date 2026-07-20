"use client";

import { useEffect, useState } from "react";
import { getGameState } from "@/app/actions";
import { useI18n } from "@/components/i18n-provider";
import type { GameState, GameStatus } from "@/lib/types";

function fmt(total: number): string {
  const s = Math.max(0, Math.floor(total));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
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

/** Regroupe l'affichage (chiffres, ton, états critiques) au même endroit. */
function derive(state: GameState | null, nowMs: number) {
  if (!state) {
    return {
      display: "--:--",
      statusKey: "idle" as GameStatus,
      tone: "text-muted-foreground",
      critical: false,
      exploded: false,
      victory: false,
      locked: false,
      message: "",
    };
  }
  const victory = !!state.victory_at;
  const remaining = computeRemaining(state, nowMs);
  const exploded =
    state.status === "exploded" ||
    (state.status === "running" && remaining !== null && remaining <= 0);
  const critical =
    !exploded &&
    state.status === "running" &&
    remaining !== null &&
    remaining <= 60;

  // Au repos on montre la durée configurée (aperçu), sinon le temps restant.
  const display =
    state.status === "idle"
      ? fmt(state.duration_seconds)
      : remaining !== null
        ? fmt(remaining)
        : exploded
          ? "00:00"
          : "--:--";

  const tone = exploded
    ? "text-destructive"
    : critical
      ? "text-destructive"
      : state.status === "running"
        ? "text-accent"
        : "text-muted-foreground";

  return {
    display,
    statusKey: state.status,
    tone,
    critical,
    exploded,
    victory,
    locked: state.submissions_locked,
    message: state.message,
  };
}

/** Hook commun : état initial + tick 1s + poll serveur 4s. */
function useLiveState(initial: GameState | null) {
  const [state, setState] = useState<GameState | null>(initial);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

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

  return { state, nowMs };
}

export function BombTimer({
  initial,
  variant = "full",
}: {
  initial: GameState | null;
  variant?: "full" | "bar";
}) {
  const { t } = useI18n();
  const { state, nowMs } = useLiveState(initial);
  const d = derive(state, nowMs);
  const statusLabel = t.bomb.status[d.statusKey];

  /* --- Victoire collective : le chrono est remplacé par une bannière ------- */
  if (d.victory) {
    if (variant === "bar") {
      return (
        <div className="w-full border-b border-primary/40 bg-background/80 backdrop-blur-sm">
          <div className="victory-glow mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-none px-4 py-3">
            <span className="text-xl text-primary" aria-hidden>
              🏆
            </span>
            <span className="font-mono text-sm font-bold uppercase tracking-[0.25em] text-primary text-glow">
              {t.bomb.victoryTitle}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              {t.bomb.victorySub}
            </span>
          </div>
        </div>
      );
    }
    return (
      <div className="victory-glow relative overflow-hidden rounded-lg border border-primary/50 bg-black/40 px-6 py-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary/80">
          {t.bomb.victoryLabel}
        </p>
        <p className="mt-2 font-elegant text-3xl font-bold text-primary text-glow">
          🏆 {t.bomb.victoryTitle}
        </p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {t.bomb.victorySub}
        </p>
      </div>
    );
  }

  /* --- Barre globale, pleine largeur, gros chiffres ------------------------ */
  if (variant === "bar") {
    return (
      <div
        className={`w-full border-b border-border/60 bg-background/80 backdrop-blur-sm ${
          d.critical || d.exploded ? "bomb-critical" : ""
        }`}
      >
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2.5">
          <span className={`text-lg ${d.tone}`} aria-hidden>
            ◉
          </span>
          <span
            className={`font-mono text-3xl font-bold tabular-nums tracking-widest sm:text-4xl ${d.tone}`}
          >
            {d.display}
          </span>
          <span
            className={`font-mono text-[11px] font-semibold uppercase tracking-[0.25em] ${d.tone}`}
          >
            {t.bomb.label} {statusLabel}
          </span>
          {d.locked && !d.exploded && (
            <span className="font-mono text-[11px] text-destructive">
              {t.bomb.frozen}
            </span>
          )}
          {d.message && (
            <span className="w-full text-center font-mono text-xs text-accent">
              {d.message}
            </span>
          )}
        </div>
      </div>
    );
  }

  /* --- Carte "full" (grande, style bombe) ---------------------------------- */
  return (
    <div
      className={`bomb-frame relative overflow-hidden rounded-lg border px-6 py-5 ${
        d.critical || d.exploded ? "bomb-critical border-destructive/40" : "border-accent/30"
      } bg-black/40`}
    >
      <div className="scanline pointer-events-none absolute inset-0" />
      <div className="relative flex flex-col items-center gap-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
          {d.exploded ? t.bomb.detonation : t.bomb.countdown}
        </span>
        <span
          className={`font-mono text-6xl font-bold tabular-nums tracking-widest ${d.tone}`}
        >
          {d.display}
        </span>
        <span className={`font-mono text-xs uppercase tracking-widest ${d.tone}`}>
          {t.bomb.label} {statusLabel}
        </span>
        {d.locked && !d.exploded && (
          <span className="mt-1 font-mono text-[11px] text-destructive">
            {t.bomb.frozen}
          </span>
        )}
        {d.message && (
          <p className="mt-2 max-w-md text-center font-mono text-xs text-accent">
            {d.message}
          </p>
        )}
      </div>
    </div>
  );
}
