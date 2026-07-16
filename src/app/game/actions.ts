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
        variant: restarts % 2,
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
