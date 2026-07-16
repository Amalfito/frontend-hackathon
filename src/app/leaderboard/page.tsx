import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { AutoRefresh } from "@/components/auto-refresh";
import { createClient } from "@/lib/supabase/server";
import { getI18n } from "@/lib/locale";
import type { Team } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const { t } = await getI18n();
  const supabase = await createClient();
  const { data: teams, error } = await supabase
    .from("teams")
    .select("id,name,current_stage_order,score,started_at,finished_at")
    .order("score", { ascending: false })
    .order("finished_at", { ascending: true, nullsFirst: false })
    .order("current_stage_order", { ascending: false })
    .returns<Team[]>();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <AutoRefresh intervalMs={5000} />
      <div className="flex items-baseline justify-between">
        <h1 className="font-mono text-2xl font-bold tracking-tight">
          <span className="text-primary text-glow">›</span> {t.leaderboard.title}
        </h1>
        <span className="font-mono text-[11px] text-muted-foreground">
          {t.leaderboard.autoUpdate}
        </span>
      </div>

      {error && (
        <p className="font-mono text-sm text-destructive">
          {t.leaderboard.notConfigured} ({error.message}).
        </p>
      )}

      {!error && (!teams || teams.length === 0) && (
        <p className="font-mono text-sm text-muted-foreground">
          {t.leaderboard.empty}
        </p>
      )}

      <div className="flex flex-col gap-2">
        {teams?.map((team, i) => (
          <Card key={team.id} className={i === 0 ? "border-accent/50" : ""}>
            <CardContent className="flex items-center gap-4 py-3">
              <span
                className={`w-8 font-mono text-lg font-bold ${
                  i === 0 ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <p className="font-mono font-semibold">{team.name}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {team.finished_at
                    ? t.leaderboard.missionDone
                    : `${t.leaderboard.stage} ${team.current_stage_order}`}
                </p>
              </div>
              <span className="font-mono text-xl font-bold text-primary">
                {team.score}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-center font-mono text-xs text-muted-foreground">
        <Link href="/play" className="hover:text-primary">
          {t.leaderboard.back}
        </Link>
      </p>
    </div>
  );
}
