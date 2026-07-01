import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminControls } from "@/components/admin-controls";
import { AutoRefresh } from "@/components/auto-refresh";
import { adminLogout } from "@/app/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { ADMIN_COOKIE } from "@/lib/constants";
import type { GameState, Team } from "@/lib/types";

export const dynamic = "force-dynamic";

type Attempt = {
  id: string;
  submitted: string | null;
  is_correct: boolean;
  created_at: string;
  teams: { name: string } | null;
  stages: { title: string } | null;
};

export default async function AdminPage() {
  const c = await cookies();
  const adminId = c.get(ADMIN_COOKIE)?.value;
  if (!adminId) redirect("/admin/login");

  const supabase = createAdminClient();

  // Vérifie que la session admin est valide (cookie ⇒ admin existant).
  const { data: admin } = await supabase
    .from("admins")
    .select("id,username,display_name")
    .eq("id", adminId)
    .maybeSingle<{ id: string; username: string; display_name: string }>();
  if (!admin) redirect("/admin/login");

  const [{ data: game }, { data: teams }, { data: attempts }] = await Promise.all([
    supabase.from("game_state_public").select("*").maybeSingle<GameState>(),
    supabase
      .from("teams")
      .select("id,name,current_stage_order,score,learn_score,started_at,finished_at")
      .order("score", { ascending: false })
      .returns<Team[]>(),
    supabase
      .from("attempts")
      .select("id,submitted,is_correct,created_at,teams(name),stages(title)")
      .order("created_at", { ascending: false })
      .limit(40)
      .returns<Attempt[]>(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <AutoRefresh intervalMs={5000} />
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-2xl font-bold">
          <span className="text-primary">›</span> ADMIN · maître du jeu
        </h1>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            {admin.display_name || admin.username}
          </span>
          <form action={adminLogout}>
            <Button
              type="submit"
              variant="ghost"
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
            >
              Déconnexion
            </Button>
          </form>
        </div>
      </div>

      {/* Contrôle du jeu / bombe */}
      <section className="flex flex-col gap-3">
        <h2 className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
          Contrôle du jeu
        </h2>
        <Card className="terminal-glow border-accent/25">
          <CardContent className="pt-6">
            <AdminControls state={game ?? null} />
          </CardContent>
        </Card>
      </section>

      {/* Supervision équipes */}
      <section className="flex flex-col gap-3">
        <h2 className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
          Équipes ({teams?.length ?? 0})
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {teams?.map((t) => (
            <Card key={t.id}>
              <CardContent className="flex items-center justify-between py-3 font-mono text-sm">
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.finished_at ? "★ terminé" : `étape ${t.current_stage_order}`}
                    {" · "}
                    <span className="text-primary/70">learn {t.learn_score}</span>
                  </p>
                </div>
                <span className="text-lg font-bold text-primary">{t.score}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Journal des tentatives */}
      <section className="flex flex-col gap-3">
        <h2 className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
          Dernières tentatives
        </h2>
        <div className="flex flex-col gap-1">
          {attempts?.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 border-b border-border/40 py-2 font-mono text-xs"
            >
              <Badge
                variant="outline"
                className={
                  a.is_correct
                    ? "border-primary/50 text-primary"
                    : "border-destructive/50 text-destructive"
                }
              >
                {a.is_correct ? "OK" : "KO"}
              </Badge>
              <span className="w-32 shrink-0 truncate text-muted-foreground">
                {a.teams?.name ?? "?"}
              </span>
              <span className="w-40 shrink-0 truncate text-muted-foreground">
                {a.stages?.title ?? "?"}
              </span>
              <span className="flex-1 truncate">{a.submitted}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
