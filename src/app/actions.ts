"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  TEAM_COOKIE,
  ADMIN_COOKIE,
  COOKIE_MAX_AGE,
} from "@/lib/constants";
import type { GameState, QuizGrade } from "@/lib/types";

export type JoinState = { error?: string };
export type SubmitState = { ok?: boolean; message?: string };
export type AdminLoginState = { error?: string };

/* ==========================================================================
 * ÉQUIPES / DÉFIS
 * ======================================================================== */

/** Crée l'équipe (ou rejoint si le nom existe déjà) puis démarre la mission. */
export async function joinTeam(
  _prev: JoinState,
  formData: FormData,
): Promise<JoinState> {
  const name = String(formData.get("team") ?? "").trim();
  if (!name) return { error: "Nom d'équipe requis." };
  if (name.length > 40) return { error: "Nom trop long (40 caractères max)." };

  let data: { id?: string; error?: string } | null = null;
  try {
    const supabase = createAdminClient();
    const res = await supabase.rpc("join_team", { p_name: name });
    if (res.error) return { error: `Erreur base : ${res.error.message}` };
    data = res.data;
  } catch (e) {
    // Config manquante / client injoignable → message visible au lieu d'un 500.
    return { error: e instanceof Error ? e.message : "Erreur serveur inconnue." };
  }
  if (data?.error) return { error: "Nom d'équipe invalide." };
  if (!data?.id) return { error: "Réponse inattendue de la base (RPC join_team)." };

  const c = await cookies();
  c.set(TEAM_COOKIE, data.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/play");
}

const SUBMIT_ERRORS: Record<string, string> = {
  game_locked: "JEU EN PAUSE — le maître du jeu a gelé les soumissions.",
  time_up: "⏱ TEMPS ÉCOULÉ — la bombe a explosé. Attendez les consignes.",
  team_not_found: "Équipe introuvable.",
  stage_not_found: "Étape introuvable.",
};

/** Valide une réponse pour l'étape courante. Avance si correcte. */
export async function submitAnswer(
  _prev: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const slug = String(formData.get("slug") ?? "");
  const answer = String(formData.get("answer") ?? "");

  const c = await cookies();
  const teamId = c.get(TEAM_COOKIE)?.value;
  if (!teamId) redirect("/");

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("submit_answer", {
    p_team_id: teamId,
    p_slug: slug,
    p_answer: answer,
  });

  if (error) return { ok: false, message: `Erreur serveur : ${error.message}` };
  if (data?.error) {
    return { ok: false, message: SUBMIT_ERRORS[data.error] ?? "Erreur inconnue." };
  }
  if (!data.correct) {
    return { ok: false, message: "ACCÈS REFUSÉ — réponse incorrecte. Réessayez." };
  }

  // Réponse correcte : on recharge /play (étape suivante ou victoire).
  redirect("/play");
}

/** Quitte l'équipe courante (retour à l'accueil). */
export async function leaveTeam(): Promise<void> {
  const c = await cookies();
  c.delete(TEAM_COOKIE);
  redirect("/");
}

/* ==========================================================================
 * APPRENTISSAGE — notation d'un QCM (ludique, feedback immédiat)
 * ======================================================================== */
export async function gradeQuiz(
  questionId: string,
  optionIds: string[],
): Promise<QuizGrade | { error: string }> {
  const c = await cookies();
  const teamId = c.get(TEAM_COOKIE)?.value ?? null;

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("grade_quiz_question", {
    p_team_id: teamId,
    p_question_id: questionId,
    p_option_ids: optionIds,
  });

  if (error) return { error: error.message };
  if (data?.error) return { error: data.error };
  return {
    correct: Boolean(data.correct),
    correct_option_ids: (data.correct_option_ids ?? []) as string[],
    explanation: String(data.explanation ?? ""),
  };
}

/* ==========================================================================
 * ADMIN — authentification
 * ======================================================================== */
export async function adminLogin(
  _prev: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!username || !password) return { error: "Identifiants requis." };

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("admin_login", {
    p_username: username,
    p_password: password,
  });

  if (error) return { error: `Erreur serveur : ${error.message}` };
  if (data?.error) return { error: "Identifiants invalides." };

  const c = await cookies();
  c.set(ADMIN_COOKIE, data.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/admin");
}

export async function adminLogout(): Promise<void> {
  const c = await cookies();
  c.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

/** Récupère l'UUID admin depuis le cookie, ou null. */
async function currentAdminId(): Promise<string | null> {
  const c = await cookies();
  return c.get(ADMIN_COOKIE)?.value ?? null;
}

/* ==========================================================================
 * ADMIN — contrôle du jeu (minuteur bombe + verrou)
 * Chaque action revérifie l'admin côté RPC (is_admin) : défense en profondeur.
 * ======================================================================== */
type GameResult = { ok?: boolean; error?: string };

async function callGameRpc(
  fn: string,
  extra: Record<string, unknown> = {},
): Promise<GameResult> {
  const adminId = await currentAdminId();
  if (!adminId) return { error: "not_authenticated" };

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc(fn, {
    p_admin_id: adminId,
    ...extra,
  });

  if (error) return { error: error.message };
  if (data?.error) return { error: data.error };
  revalidatePath("/admin");
  revalidatePath("/play");
  return { ok: true };
}

export async function gameArm(formData: FormData): Promise<void> {
  const minutes = Math.max(1, Number(formData.get("minutes") ?? 60));
  await callGameRpc("game_arm", { p_minutes: minutes });
  revalidatePath("/admin");
}

export async function gamePause(): Promise<void> {
  await callGameRpc("game_pause");
  revalidatePath("/admin");
}

export async function gameResume(): Promise<void> {
  await callGameRpc("game_resume");
  revalidatePath("/admin");
}

export async function gameStop(): Promise<void> {
  await callGameRpc("game_stop");
  revalidatePath("/admin");
}

export async function gameDefuse(): Promise<void> {
  await callGameRpc("game_defuse");
  revalidatePath("/admin");
}

export async function gameReset(): Promise<void> {
  await callGameRpc("game_reset");
  revalidatePath("/admin");
}

export async function gameSetMessage(formData: FormData): Promise<void> {
  const message = String(formData.get("message") ?? "");
  await callGameRpc("game_set_message", { p_message: message });
  revalidatePath("/admin");
}

export async function gameSetLock(formData: FormData): Promise<void> {
  const locked = String(formData.get("locked") ?? "") === "true";
  await callGameRpc("game_set_lock", { p_locked: locked });
  revalidatePath("/admin");
}

/* ==========================================================================
 * LECTURE PUBLIQUE de l'état du jeu (pour le chrono côté joueur)
 * ======================================================================== */
export async function getGameState(): Promise<GameState | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("game_state_public")
    .select("*")
    .maybeSingle<GameState>();
  return data ?? null;
}
