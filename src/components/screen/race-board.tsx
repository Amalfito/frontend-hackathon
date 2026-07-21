"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getBoard, type Board, type BoardRow } from "@/app/screen/actions";
import { BombTimer } from "@/components/bomb-timer";

const TOTAL = 20;
const MEDALS = ["🥇", "🥈", "🥉"];

/** Évadés d'abord (par heure de sortie), puis progression, puis score. */
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

export function RaceBoard({ initial }: { initial: Board }) {
  const reduced = useReducedMotion();
  const [board, setBoard] = useState<Board>(initial);
  const prevQ = useRef<Record<string, number>>({});
  // name → recul (delta négatif) transitoire, pour l'animation de sabotage.
  const [hits, setHits] = useState<Record<string, number>>({});

  useEffect(() => {
    for (const r of initial.rows) prevQ.current[r.name] = r.q;
  }, [initial.rows]);

  useEffect(() => {
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const poll = async () => {
      const b = await getBoard();
      if (!alive) return;
      const fresh: Record<string, number> = {};
      for (const r of b.rows) {
        const p = prevQ.current[r.name];
        if (p !== undefined && r.q < p) fresh[r.name] = r.q - p; // recul
        prevQ.current[r.name] = r.q;
      }
      if (Object.keys(fresh).length) {
        setHits((h) => ({ ...h, ...fresh }));
        for (const name of Object.keys(fresh)) {
          timers.push(
            setTimeout(
              () => setHits((h) => {
                const n = { ...h };
                delete n[name];
                return n;
              }),
              2400,
            ),
          );
        }
      }
      setBoard(b);
    };
    const id = setInterval(poll, 3000);
    return () => {
      alive = false;
      clearInterval(id);
      timers.forEach(clearTimeout);
    };
  }, []);

  const rows = rank(board.rows);
  const finished = rows.filter((r) => r.finished_at).length;
  const resets = rows.reduce((a, r) => a + r.restarts, 0);
  const victory = !!board.game?.victory_at;
  const spring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 120, damping: 20 };

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 px-6 py-2">
      {/* En-tête */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent">
            Supervision · temps réel
          </p>
          <h1 className="font-elegant text-3xl font-bold text-primary text-glow sm:text-4xl">
            OPÉRATION ALBERT — la course
          </h1>
        </div>
        <div className="flex items-center gap-4 font-mono text-sm">
          <span className="text-muted-foreground">
            <span className="text-2xl font-bold text-primary">{finished}</span>/
            {rows.length} évadées
          </span>
          <span className="text-muted-foreground">
            <span className="text-2xl font-bold text-accent">{resets}</span> resets
          </span>
          <Link
            href="/screen/podium"
            className="rounded-md border border-primary/40 px-3 py-1.5 text-xs uppercase tracking-wider text-primary hover:bg-primary/10"
          >
            Podium →
          </Link>
        </div>
      </div>

      {/* Chrono global (bombe) */}
      <div className="mb-5">
        <BombTimer initial={board.game} variant="bar" />
      </div>

      {board.error && (
        <p className="font-mono text-sm text-destructive">
          Supervision indisponible ({board.error}). La table arcade est-elle en base ?
        </p>
      )}
      {!board.error && rows.length === 0 && (
        <p className="font-mono text-lg text-muted-foreground">
          En attente des équipes… ⚡
        </p>
      )}

      {/* Barres par équipe */}
      <motion.ul layout className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {rows.map((r, i) => {
            const done = !!r.finished_at || r.q >= TOTAL;
            const pct = Math.min(100, (r.q / TOTAL) * 100);
            const hit = hits[r.name];
            const sabotaged = hit !== undefined;
            return (
              <motion.li
                layout
                key={r.name}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className={`rounded-xl border px-4 py-3 ${
                  sabotaged
                    ? "border-destructive bg-destructive/10"
                    : done
                      ? "border-primary/50 bg-primary/5"
                      : i === 0
                        ? "border-accent/50 bg-accent/5"
                        : "border-border bg-card"
                }`}
              >
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 font-mono font-bold">
                    <span className="w-7 text-center text-lg">
                      {i < 3 ? MEDALS[i] : String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg">{r.name}</span>
                    {done && <span className="text-primary">🏁 évadée</span>}
                  </span>
                  <span className="flex items-center gap-3 font-mono text-sm text-muted-foreground">
                    {r.restarts > 0 && (
                      <span className="text-accent">↺ {r.restarts}</span>
                    )}
                    <span>
                      <span className="text-xl font-bold text-primary">
                        {Math.min(r.q, TOTAL)}
                      </span>
                      /{TOTAL}
                    </span>
                    <span className="text-xl font-bold text-accent">{r.score}</span>
                  </span>
                </div>

                {/* Piste de progression sur 20 questions */}
                <div className="relative h-9 overflow-hidden rounded-lg bg-secondary">
                  {/* remplissage animé */}
                  <motion.div
                    className={`absolute inset-y-0 left-0 rounded-lg ${
                      sabotaged
                        ? "bg-destructive"
                        : done
                          ? "bg-primary"
                          : "bg-accent"
                    }`}
                    animate={{ width: `${pct}%` }}
                    transition={spring}
                  />
                  {/* ticks des 20 questions */}
                  <div className="pointer-events-none absolute inset-0 flex">
                    {Array.from({ length: TOTAL }).map((_, k) => (
                      <div
                        key={k}
                        className="flex-1 border-r border-background/40 last:border-r-0"
                      />
                    ))}
                  </div>
                  {/* flash de sabotage */}
                  <AnimatePresence>
                    {sabotaged && (
                      <motion.div
                        initial={{ opacity: 0.85 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2 }}
                        className="absolute inset-0 bg-destructive"
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* badge sabotage / reset */}
                <AnimatePresence>
                  {sabotaged && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1.5 font-mono text-xs font-bold text-destructive"
                    >
                      {r.q === 0
                        ? "💥 RESET TOTAL — Albert l'a renvoyée au départ"
                        : `⚡ SABOTÉE ${hit} — retour à la question ${r.q + 1}`}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      {victory && (
        <div className="victory-glow mt-6 rounded-xl border border-primary/50 bg-primary/5 p-5 text-center">
          <p className="font-elegant text-2xl font-bold text-primary text-glow">
            🏆 Toutes les équipes évadées — Albert est vaincu
          </p>
        </div>
      )}
    </div>
  );
}
