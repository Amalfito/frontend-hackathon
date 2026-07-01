import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { StageForm } from "@/components/stage-form";
import { BombTimer } from "@/components/bomb-timer";
import { leaveTeam } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";
import { TEAM_COOKIE } from "@/lib/constants";
import type { GameState, PublicStage, Team } from "@/lib/types";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<PublicStage["type"], string> = {
  quiz: "QUIZ",
  cipher: "CHIFFREMENT",
  password: "MOT DE PASSE",
  final: "DÉSAMORÇAGE",
};

function SetupNotice({ detail }: { detail: string }) {
  return (
    <Card className="mx-auto max-w-2xl border-destructive/40">
      <CardHeader>
        <CardTitle className="font-mono text-destructive">
          Supabase non configuré
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 font-mono text-sm text-muted-foreground">
        <p>
          Renseigne les clés dans <code className="text-accent">.env.local</code> et
          exécute les migrations (voir <code className="text-accent">README.md</code>).
        </p>
        <p className="text-xs opacity-70">Détail : {detail}</p>
      </CardContent>
    </Card>
  );
}

export default async function PlayPage() {
  const c = await cookies();
  const teamId = c.get(TEAM_COOKIE)?.value;
  if (!teamId) redirect("/");

  const supabase = await createClient();

  const { data: team, error: teamErr } = await supabase
    .from("teams")
    .select("*")
    .eq("id", teamId)
    .maybeSingle<Team>();

  if (teamErr) return <SetupNotice detail={teamErr.message} />;
  if (!team) {
    // Cookie orphelin (équipe supprimée / autre base) → on repart de zéro.
    redirect("/");
  }

  const { data: maxRow } = await supabase
    .from("stages_public")
    .select("stage_order")
    .order("stage_order", { ascending: false })
    .limit(1)
    .maybeSingle<{ stage_order: number }>();

  const { data: game } = await supabase
    .from("game_state_public")
    .select("*")
    .maybeSingle<GameState>();

  const maxOrder = maxRow?.stage_order ?? 0;
  const solved = Math.max(0, team.current_stage_order - 1);

  // Mission terminée
  if (maxOrder > 0 && team.current_stage_order > maxOrder) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <Card className="terminal-glow border-primary/40">
          <CardContent className="flex flex-col items-center gap-4 pt-8 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              {"// MISSION ACCOMPLIE"}
            </p>
            <h1 className="font-mono text-3xl font-bold text-primary text-glow">
              ALBERT NEUTRALISÉ
            </h1>
            <p className="font-mono text-sm text-muted-foreground">
              Les données sont sauvées. Score final de l&apos;équipe{" "}
              <span className="text-foreground">{team.name}</span> :
            </p>
            <p className="font-mono text-5xl font-bold text-accent">{team.score}</p>
            <Link
              href="/leaderboard"
              className={buttonVariants({
                className: "mt-2 font-mono uppercase tracking-wider",
              })}
            >
              Voir le classement ▸
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: stage, error: stageErr } = await supabase
    .from("stages_public")
    .select("*")
    .eq("stage_order", team.current_stage_order)
    .maybeSingle<PublicStage>();

  if (stageErr) return <SetupNotice detail={stageErr.message} />;
  if (!stage) {
    return (
      <SetupNotice detail="Aucune étape trouvée. As-tu exécuté supabase/seed.sql ?" />
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      {/* Chrono type bombe (piloté par l'admin) */}
      <BombTimer initial={game ?? null} variant="full" />

      {/* Barre de progression */}
      <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
        <span>
          ÉQUIPE <span className="text-primary">{team.name}</span>
        </span>
        <span>
          SCORE <span className="text-accent">{team.score}</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        {Array.from({ length: maxOrder }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < solved
                ? "bg-primary"
                : i === solved
                  ? "bg-accent"
                  : "bg-secondary"
            }`}
          />
        ))}
      </div>

      <Card className="terminal-glow border-primary/25">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="font-mono text-lg">{stage.title}</CardTitle>
          <Badge
            variant="outline"
            className="shrink-0 border-primary/40 font-mono text-[10px] text-primary"
          >
            {TYPE_LABEL[stage.type]} · {stage.points} PTS
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {stage.narrative}
          </p>
          <p className="font-mono text-base leading-relaxed whitespace-pre-wrap text-foreground">
            {stage.prompt}
          </p>
          <StageForm slug={stage.slug} type={stage.type} hint={stage.hint} />
        </CardContent>
      </Card>

      <form action={leaveTeam} className="text-center">
        <button
          type="submit"
          className="font-mono text-xs text-muted-foreground underline underline-offset-4 hover:text-destructive"
        >
          Abandonner / changer d&apos;équipe
        </button>
      </form>
    </div>
  );
}
