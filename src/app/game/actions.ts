"use server";

/* ============================================================================
 * ARCADE ALBERT — server actions. Toute la vérification des réponses se fait
 * ICI : le client ne reçoit jamais les solutions (cf. toPublic()).
 * État par équipe dans public.arcade_state (service_role uniquement).
 * ========================================================================== */

import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { TEAM_COOKIE } from "@/lib/constants";
import {
  checkSubmission,
  slotPoints,
  toPublic,
  type ArcadeSubmission,
  type PublicArcadeQuestion,
} from "@/lib/arcade/types";
import { arcadeQuestions } from "@/content/arcade/questions";

const TOTAL_SLOTS = 20;
const SABOTAGE_PENALTY = 5;

type ArcadeRow = {
  team_id: string;
  q: number;
  variant: number;
  restarts: number;
  score: number;
  sabotage_used: boolean;
  sabotaged_by: string;
  finished_at: string | null;
};

/** État de fin de partie partagé (piège d'Albert + victoire collective). */
export type EndgameView = {
  /** Nb d'équipes de l'arcade ayant fini / total connecté. */
  finishedCount: number;
  totalCount: number;
  /** Cette équipe est-elle celle qui a déclenché le piège (1re à finir) ? */
  isFirstFinisher: boolean;
  /** Le piège est armé (fausse victoire, bombe en pause) et pas encore déclenché. */
  trapArmed: boolean;
  /** Le piège a été déclenché : la bombe est repartie. */
  trapSprung: boolean;
  /** Toutes les équipes ont fini : vraie victoire. */
  victory: boolean;
};

export type ArcadeView = {
  teamName: string;
  q: number;
  total: number;
  score: number;
  restarts: number;
  sabotageUsed: boolean;
  /** Nom du saboteur si l'équipe vient d'être frappée (notification one-shot). */
  sabotagedBy: string | null;
  finished: boolean;
  question: PublicArcadeQuestion | null;
  /** Équipes ciblables (id + nom), pour le panneau sabotage. */
  rivals: { id: string; name: string }[];
  /** État de fin de partie (piège / victoire). */
  endgame: EndgameView;
};

function findQuestion(slot: number, variant: number) {
  return (
    arcadeQuestions.find((x) => x.slot === slot && x.variant === variant) ??
    arcadeQuestions.find((x) => x.slot === slot && x.variant === 0) ??
    null
  );
}

async function teamId(): Promise<string | null> {
  const c = await cookies();
  return c.get(TEAM_COOKIE)?.value ?? null;
}

async function loadState(tid: string): Promise<ArcadeRow> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("arcade_state")
    .select("*")
    .eq("team_id", tid)
    .maybeSingle<ArcadeRow>();
  if (data) return data;
  const { data: created, error } = await supabase
    .from("arcade_state")
    .insert({ team_id: tid })
    .select("*")
    .single<ArcadeRow>();
  if (error || !created) {
    throw new Error(
      `arcade_state indisponible (${error?.message ?? "?"}) — la migration 0002_arcade.sql a-t-elle été jouée ?`,
    );
  }
  return created;
}

/**
 * L'escape game est-il ouvert ? (bombe armée au moins une fois : status ≠ idle).
 * Le chrono « learn » ne compte PAS — seule la bombe ouvre le jeu.
 * Best-effort : toute erreur → true (fail-open), on ne bloque pas par accident.
 */
async function bombStarted(
  supabase: ReturnType<typeof createAdminClient>,
): Promise<boolean> {
  try {
    const { data } = await supabase
      .from("game_state")
      .select("status")
      .eq("id", 1)
      .maybeSingle<{ status: string }>();
    if (!data) return true;
    return data.status !== "idle";
  } catch {
    return true;
  }
}

/**
 * La bombe globale a-t-elle explosé ? (armée et chrono dépassé, ou 'exploded').
 * Best-effort : toute erreur (base non prête) → false, le jeu reste jouable.
 */
async function bombDetonated(
  supabase: ReturnType<typeof createAdminClient>,
): Promise<boolean> {
  try {
    const { data } = await supabase
      .from("game_state")
      .select("status,ends_at")
      .eq("id", 1)
      .maybeSingle<{ status: string; ends_at: string | null }>();
    if (!data) return false;
    if (data.status === "exploded") return true;
    return (
      data.status === "running" &&
      !!data.ends_at &&
      new Date(data.ends_at).getTime() < Date.now()
    );
  } catch {
    return false;
  }
}

/**
 * État de fin de partie, lu côté serveur (service_role). Dégrade en douceur si
 * la migration endgame (0003) n'a pas encore tourné : tout à false/0.
 */
async function loadEndgame(tid: string): Promise<EndgameView> {
  const empty: EndgameView = {
    finishedCount: 0,
    totalCount: 0,
    isFirstFinisher: false,
    trapArmed: false,
    trapSprung: false,
    victory: false,
  };
  try {
    const supabase = createAdminClient();
    const [{ count: totalCount }, { count: finishedCount }, { data: gs }] =
      await Promise.all([
        supabase.from("arcade_state").select("team_id", { count: "exact", head: true }),
        supabase
          .from("arcade_state")
          .select("team_id", { count: "exact", head: true })
          .not("finished_at", "is", null),
        supabase.from("game_state").select("*").eq("id", 1).maybeSingle(),
      ]);

    const g = (gs ?? {}) as Record<string, unknown>;
    const trapArmedAt = g.trap_armed_at as string | null | undefined;
    const trapSprungAt = g.trap_sprung_at as string | null | undefined;
    const victoryAt = g.victory_at as string | null | undefined;
    const firstFinisherId = g.first_finisher_id as string | null | undefined;

    return {
      finishedCount: finishedCount ?? 0,
      totalCount: totalCount ?? 0,
      isFirstFinisher: !!firstFinisherId && firstFinisherId === tid,
      trapArmed: !!trapArmedAt && !trapSprungAt,
      trapSprung: !!trapSprungAt,
      victory: !!victoryAt,
    };
  } catch {
    return empty;
  }
}

async function buildView(tid: string, row: ArcadeRow): Promise<ArcadeView> {
  const supabase = createAdminClient();
  const { data: team } = await supabase
    .from("teams")
    .select("name")
    .eq("id", tid)
    .maybeSingle<{ name: string }>();
  const { data: others } = await supabase
    .from("teams")
    .select("id, name")
    .neq("id", tid)
    .order("name")
    .returns<{ id: string; name: string }[]>();

  // Notification de sabotage : one-shot (on la vide après lecture).
  let sabotagedBy: string | null = null;
  if (row.sabotaged_by) {
    sabotagedBy = row.sabotaged_by;
    await supabase
      .from("arcade_state")
      .update({ sabotaged_by: "" })
      .eq("team_id", tid);
  }

  const finished = row.q >= TOTAL_SLOTS;
  const question = finished ? null : findQuestion(row.q + 1, row.variant);
  return {
    teamName: team?.name ?? "?",
    q: row.q,
    total: TOTAL_SLOTS,
    score: row.score,
    restarts: row.restarts,
    sabotageUsed: row.sabotage_used,
    sabotagedBy,
    finished,
    question: question ? toPublic(question) : null,
    rivals: others ?? [],
    endgame: await loadEndgame(tid),
  };
}

/** État courant (null si pas d'équipe — la page affiche alors le join). */
export async function getArcade(): Promise<ArcadeView | { error: string } | null> {
  const tid = await teamId();
  if (!tid) return null;
  try {
    const row = await loadState(tid);
    return await buildView(tid, row);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue." };
  }
}

export type SubmitResult =
  | { correct: true; points: number; finished: boolean; view: ArcadeView }
  | { correct: false; view: ArcadeView }
  | { error: string };

/** Soumission d'une réponse pour la question courante. */
export async function submitArcade(sub: ArcadeSubmission): Promise<SubmitResult> {
  const tid = await teamId();
  if (!tid) return { error: "Pas d'équipe — retourne à l'accueil." };
  try {
    const supabase = createAdminClient();

    // L'escape game n'est pas ouvert tant que la bombe n'a pas été armée.
    if (!(await bombStarted(supabase))) {
      return {
        error:
          "⏳ L'escape game n'a pas encore démarré — attendez que le maître du jeu lance le chronomètre.",
      };
    }

    // Chrono d'Albert écoulé (bombe armée & expirée) → plus aucune soumission :
    // les données ont fuité, il faut attendre les consignes du maître du jeu.
    if (await bombDetonated(supabase)) {
      return {
        error:
          "⏱ TEMPS ÉCOULÉ — le chrono d'Albert a expiré. Attendez le maître du jeu.",
      };
    }

    const row = await loadState(tid);
    if (row.q >= TOTAL_SLOTS) return { error: "Run déjà terminé." };
    const question = findQuestion(row.q + 1, row.variant);
    if (!question) return { error: "Question introuvable." };

    if (!checkSubmission(question, sub)) {
      return { correct: false, view: await buildView(tid, row) };
    }

    const points = slotPoints(question.slot);
    const nextQ = row.q + 1;
    const finished = nextQ >= TOTAL_SLOTS;
    const { data: updated } = await supabase
      .from("arcade_state")
      .update({
        q: nextQ,
        score: row.score + points,
        finished_at: finished ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("team_id", tid)
      .select("*")
      .single<ArcadeRow>();

    // Fin des 20 verrous → déclenche l'endgame (piège ou victoire collective).
    // Best-effort : si la migration endgame n'est pas jouée, on ignore l'erreur.
    if (finished) {
      try {
        await supabase.rpc("arcade_on_finish", { p_team_id: tid });
      } catch {
        /* endgame indisponible — le jeu reste jouable sans le piège */
      }
    }

    return {
      correct: true,
      points,
      finished,
      view: await buildView(tid, updated ?? { ...row, q: nextQ }),
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue." };
  }
}

/** Timeout d'une question punitive : retour à ZÉRO, nouvelles questions. */
export async function arcadeTimeout(): Promise<ArcadeView | { error: string }> {
  const tid = await teamId();
  if (!tid) return { error: "Pas d'équipe." };
  try {
    const supabase = createAdminClient();
    const row = await loadState(tid);
    const restarts = row.restarts + 1;
    const { data: updated } = await supabase
      .from("arcade_state")
      .update({
        q: 0,
        score: 0,
        restarts,
        variant: restarts % 4,
        finished_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("team_id", tid)
      .select("*")
      .single<ArcadeRow>();
    return await buildView(tid, updated ?? row);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue." };
  }
}

/** Sabotage : une seule fois par session d'équipe, -5 questions pour la cible. */
export async function sabotage(
  targetId: string,
): Promise<{ ok: true; target: string; view: ArcadeView } | { error: string }> {
  const tid = await teamId();
  if (!tid) return { error: "Pas d'équipe." };
  if (targetId === tid) return { error: "S'auto-saboter ? Albert apprécierait, mais non." };
  try {
    const supabase = createAdminClient();
    const row = await loadState(tid);
    if (row.sabotage_used) return { error: "Sabotage déjà utilisé — un seul par session !" };

    const { data: me } = await supabase
      .from("teams")
      .select("name")
      .eq("id", tid)
      .maybeSingle<{ name: string }>();
    const { data: target } = await supabase
      .from("teams")
      .select("id, name")
      .eq("id", targetId)
      .maybeSingle<{ id: string; name: string }>();
    if (!target) return { error: "Équipe cible introuvable." };

    const targetRow = await loadState(target.id);
    await supabase
      .from("arcade_state")
      .update({
        q: Math.max(0, targetRow.q - SABOTAGE_PENALTY),
        sabotaged_by: me?.name ?? "une équipe rivale",
        finished_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("team_id", target.id);
    const { data: mine } = await supabase
      .from("arcade_state")
      .update({ sabotage_used: true, updated_at: new Date().toISOString() })
      .eq("team_id", tid)
      .select("*")
      .single<ArcadeRow>();

    return { ok: true, target: target.name, view: await buildView(tid, mine ?? row) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue." };
  }
}

/**
 * Le 1er finisher clique « voir le podium » → il RÉACTIVE la bombe (le piège
 * se referme). Renvoie l'état de fin de partie mis à jour pour l'animation.
 */
export async function springTrap(): Promise<
  { ok: true; endgame: EndgameView } | { error: string }
> {
  const tid = await teamId();
  if (!tid) return { error: "Pas d'équipe." };
  try {
    const supabase = createAdminClient();
    await supabase.rpc("arcade_spring_trap", { p_team_id: tid });
    return { ok: true, endgame: await loadEndgame(tid) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue." };
  }
}

/** Énigme cachée : révèle le code quand l'élément dissimulé est cliqué. */
export async function revealHidden(): Promise<{ code: string } | { error: string }> {
  const tid = await teamId();
  if (!tid) return { error: "Pas d'équipe." };
  try {
    const row = await loadState(tid);
    const question = findQuestion(row.q + 1, row.variant);
    if (!question || question.mechanic.kind !== "hidden") {
      return { error: "Rien à révéler ici." };
    }
    return { code: question.mechanic.code };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue." };
  }
}
