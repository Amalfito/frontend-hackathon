import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { AutoRefresh } from "@/components/auto-refresh";
import { createClient } from "@/lib/supabase/server";
import type { Team } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
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
          <span className="text-primary text-glow">›</span> CLASSEMENT
        </h1>
        <span className="font-mono text-[11px] text-muted-foreground">
          maj auto · 5s
        </span>
      </div>

      {error && (
        <p className="font-mono text-sm text-destructive">
          Supabase non configuré ({error.message}). Voir README.md.
        </p>
      )}

      {!error && (!teams || teams.length === 0) && (
        <p className="font-mono text-sm text-muted-foreground">
          Aucune équipe pour l&apos;instant. La chasse n&apos;a pas commencé.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {teams?.map((t, i) => (
          <Card key={t.id} className={i === 0 ? "border-accent/50" : ""}>
            <CardContent className="flex items-center gap-4 py-3">
              <span
                className={`w-8 font-mono text-lg font-bold ${
                  i === 0 ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <p className="font-mono font-semibold">{t.name}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {t.finished_at
                    ? "★ mission accomplie"
                    : `étape ${t.current_stage_order}`}
                </p>
              </div>
              <span className="font-mono text-xl font-bold text-primary">
                {t.score}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-center font-mono text-xs text-muted-foreground">
        <Link href="/play" className="hover:text-primary">
          › Retour à la mission
        </Link>
      </p>
    </div>
  );
}
