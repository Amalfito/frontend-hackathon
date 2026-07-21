import Link from "next/link";
import { AutoRefresh } from "@/components/auto-refresh";
import { AlbertSpeech } from "@/components/albert";
import { VictoryConfetti } from "@/components/fx/victory-confetti";
import { createClient } from "@/lib/supabase/server";
import { getI18n } from "@/lib/locale";
import type { GameState } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Ligne du classement arcade (vue `arcade_leaderboard`, sans détails internes). */
type Row = {
  name: string;
  q: number;
  score: number;
  restarts: number;
  finished_at: string | null;
};

const TOTAL_SLOTS = 20;
const MEDALS = ["🥇", "🥈", "🥉"];

/** Durée d'évasion (start du jeu → finished_at) formatée mm:ss, sinon null. */
function escapeClock(row: Row, startedAt: string | null): string | null {
  if (!row.finished_at || !startedAt) return null;
  const secs = Math.max(
    0,
    Math.floor(
      (new Date(row.finished_at).getTime() - new Date(startedAt).getTime()) / 1000,
    ),
  );
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Tri « escape game » : évadés d'abord (par heure de sortie), puis progression. */
function rank(rows: Row[]): Row[] {
  return [...rows].sort((a, b) => {
    const af = !!a.finished_at;
    const bf = !!b.finished_at;
    if (af !== bf) return af ? -1 : 1;
    if (af && bf) {
      return (
        new Date(a.finished_at!).getTime() - new Date(b.finished_at!).getTime()
      );
    }
    if (b.q !== a.q) return b.q - a.q;
    return b.score - a.score;
  });
}

export default async function LeaderboardPage() {
  const { t } = await getI18n();
  const supabase = await createClient();

  const [{ data: rowsRaw, error }, { data: game }] = await Promise.all([
    supabase
      .from("arcade_leaderboard")
      .select("name,q,score,restarts,finished_at")
      .returns<Row[]>(),
    supabase.from("game_state_public").select("*").maybeSingle<GameState>(),
  ]);

  const rows = rank(rowsRaw ?? []);
  const finishedCount = rows.filter((r) => r.finished_at).length;
  const totalCount = rows.length;
  const victory = !!game?.victory_at;
  const trapArmed = !!game?.trap_armed_at && !game?.trap_sprung_at;
  const startedAt = game?.started_at ?? null;
  const podium = rows.slice(0, 3);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <AutoRefresh intervalMs={5000} />

      {/* En-tête */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-mono text-2xl font-bold tracking-tight">
          <span className="text-primary text-glow">›</span> {t.leaderboard.title}
        </h1>
        <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
          {totalCount > 0 && (
            <span>
              <span className="text-accent">{finishedCount}</span>/{totalCount}{" "}
              {t.leaderboard.teamsDone}
            </span>
          )}
          <span className="flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            {t.leaderboard.autoUpdate}
          </span>
        </div>
      </div>

      {error && (
        <p className="font-mono text-sm text-destructive">
          {t.leaderboard.notConfigured} ({error.message}).
        </p>
      )}

      {!error && totalCount === 0 && (
        <p className="font-mono text-sm text-muted-foreground">
          {t.leaderboard.empty}
        </p>
      )}

      {/* Victoire collective : Albert vaincu + confettis */}
      {victory && (
        <>
          <VictoryConfetti />
          <AlbertSpeech
            tone="victory"
            tag={t.albert.victoryTag}
            title={t.albert.victoryTitle}
            lines={t.albert.victoryLines}
          />
        </>
      )}

      {/* Piège armé : la bombe est repartie, tout le monde doit sortir */}
      {!victory && trapArmed && (
        <div className="bomb-critical rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 font-mono text-sm text-destructive">
          {t.leaderboard.trapWarning}
        </div>
      )}

      {/* Podium (top 3) */}
      {podium.length > 0 && (
        <div className="grid grid-cols-3 items-end gap-3">
          {[1, 0, 2].map((slot) => {
            const r = podium[slot];
            if (!r) return <div key={slot} />;
            const isFirst = slot === 0;
            const clock = escapeClock(r, startedAt);
            return (
              <div
                key={slot}
                className={`flex flex-col items-center gap-1 rounded-t-xl border bg-card px-2 pb-4 text-center ${
                  isFirst
                    ? "border-accent/60 pt-6 shadow-[0_0_40px_rgb(255_122_0/0.2)]"
                    : "border-border pt-4"
                }`}
              >
                <span className={isFirst ? "text-4xl" : "text-2xl"}>
                  {MEDALS[slot]}
                </span>
                <p
                  className={`font-mono font-bold ${
                    isFirst ? "text-accent" : "text-foreground"
                  }`}
                >
                  {r.name}
                </p>
                <p className="font-mono text-xs text-primary">{r.score} pts</p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  {r.finished_at
                    ? clock
                      ? `${t.leaderboard.escaped} · ${clock}`
                      : t.leaderboard.escaped
                    : `${t.leaderboard.lock} ${r.q}/${TOTAL_SLOTS}`}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Classement complet */}
      <div className="flex flex-col gap-2">
        {rows.map((r, i) => {
          const done = !!r.finished_at;
          const clock = escapeClock(r, startedAt);
          return (
            <div
              key={`${r.name}-${i}`}
              className={`flex items-center gap-4 rounded-lg border px-4 py-3 ${
                i === 0 ? "border-accent/50 bg-accent/5" : "border-border bg-card"
              }`}
            >
              <span
                className={`w-8 font-mono text-lg font-bold ${
                  i === 0 ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {i < 3 ? MEDALS[i] : String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <p className="font-mono font-semibold">{r.name}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {done
                    ? clock
                      ? `${t.leaderboard.escaped} · ${clock}`
                      : t.leaderboard.escaped
                    : `${t.leaderboard.lock} ${r.q}/${TOTAL_SLOTS} · ${t.leaderboard.inProgress}`}
                  {r.restarts > 0 && ` · ${r.restarts} ${t.leaderboard.restarts}`}
                </p>
              </div>
              {/* mini-jauge de progression */}
              <div className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-secondary sm:block">
                <div
                  className={`h-full rounded-full ${done ? "bg-primary" : "bg-accent"}`}
                  style={{ width: `${Math.min(100, (r.q / TOTAL_SLOTS) * 100)}%` }}
                />
              </div>
              <span className="w-16 text-right font-mono text-xl font-bold text-primary">
                {r.score}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-center font-mono text-xs text-muted-foreground">
        <Link href="/game" className="hover:text-primary">
          {t.leaderboard.back}
        </Link>
      </p>
    </div>
  );
}
