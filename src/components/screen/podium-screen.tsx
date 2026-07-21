"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { getBoard, type Board, type BoardRow } from "@/app/screen/actions";

const TOTAL = 20;
const MEDALS = ["🥇", "🥈", "🥉"];
const PODIUM_ORDER = [1, 0, 2]; // 2e · 1er · 3e (le 1er au centre, plus haut)

function rank(rows: BoardRow[]): BoardRow[] {
  return [...rows].sort((a, b) => {
    const af = !!a.finished_at;
    const bf = !!b.finished_at;
    if (af !== bf) return af ? -1 : 1;
    if (af && bf)
      return new Date(a.finished_at!).getTime() - new Date(b.finished_at!).getTime();
    if (b.q !== a.q) return b.q - a.q;
    return b.score - a.score;
  });
}

function clock(finishedAt: string | null, startedAt: string | null): string | null {
  if (!finishedAt || !startedAt) return null;
  const s = Math.max(
    0,
    Math.floor((new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 1000),
  );
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function PodiumScreen({ initial }: { initial: Board }) {
  const [board, setBoard] = useState<Board>(initial);

  useEffect(() => {
    let alive = true;
    const id = setInterval(async () => {
      const b = await getBoard();
      if (alive) setBoard(b);
    }, 3000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const rows = rank(board.rows);
  const podium = rows.slice(0, 3);
  const startedAt = board.game?.started_at ?? null;
  const finished = rows.filter((r) => r.finished_at).length;
  const victory = !!board.game?.victory_at;

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 px-6 py-2">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent">
            Supervision · podium live
          </p>
          <h1 className="font-elegant text-3xl font-bold text-primary text-glow sm:text-4xl">
            Le classement
          </h1>
        </div>
        <div className="flex items-center gap-4 font-mono text-sm text-muted-foreground">
          <span>
            <span className="text-2xl font-bold text-primary">{finished}</span>/
            {rows.length} évadées
          </span>
          <Link
            href="/screen"
            className="rounded-md border border-primary/40 px-3 py-1.5 text-xs uppercase tracking-wider text-primary hover:bg-primary/10"
          >
            ← La course
          </Link>
        </div>
      </div>

      {victory && (
        <div className="victory-glow mb-6 rounded-xl border border-primary/50 bg-primary/5 p-4 text-center">
          <p className="font-elegant text-2xl font-bold text-primary text-glow">
            🏆 Albert est vaincu — toutes les équipes évadées
          </p>
        </div>
      )}

      {/* Podium 3 marches */}
      {podium.length > 0 && (
        <div className="mb-8 grid grid-cols-3 items-end gap-4">
          {PODIUM_ORDER.map((slot) => {
            const r = podium[slot];
            if (!r) return <div key={slot} />;
            const first = slot === 0;
            const c = clock(r.finished_at, startedAt);
            return (
              <motion.div
                key={slot}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * slot, type: "spring", stiffness: 120, damping: 18 }}
                className={`flex flex-col items-center gap-1 rounded-t-2xl border bg-card px-3 text-center ${
                  first
                    ? "border-accent/60 pb-8 pt-8 shadow-[0_0_60px_rgb(255_122_0/0.25)]"
                    : "border-border pb-6 pt-5"
                }`}
              >
                <span className={first ? "text-6xl" : "text-4xl"}>{MEDALS[slot]}</span>
                <p className={`font-elegant font-bold ${first ? "text-3xl text-accent" : "text-xl"}`}>
                  {r.name}
                </p>
                <p className="font-mono text-sm text-primary">{r.score} pts</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {r.finished_at ? (c ? `évadée · ${c}` : "évadée") : `verrou ${r.q}/${TOTAL}`}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Classement complet compact */}
      <ul className="flex flex-col gap-1.5">
        {rows.map((r, i) => (
          <li
            key={r.name}
            className="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-2.5 font-mono"
          >
            <span className="w-8 text-lg font-bold text-muted-foreground">
              {i < 3 ? MEDALS[i] : String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 font-semibold">{r.name}</span>
            <span className="text-sm text-muted-foreground">
              {r.finished_at ? "🏁" : `${r.q}/${TOTAL}`}
            </span>
            <span className="w-16 text-right text-lg font-bold text-primary">{r.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
