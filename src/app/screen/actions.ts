"use server";

/* ============================================================================
 * Source de données de la SUPERVISION (écrans). Lecture seule des vues
 * publiques — ne touche à rien du moteur de jeu. Pollé par les composants écran.
 * ========================================================================== */
import { createClient } from "@/lib/supabase/server";
import type { GameState } from "@/lib/types";

export type BoardRow = {
  name: string;
  q: number;
  score: number;
  restarts: number;
  finished_at: string | null;
};

export type Board = {
  rows: BoardRow[];
  game: GameState | null;
  error?: string;
};

export async function getBoard(): Promise<Board> {
  const supabase = await createClient();
  const [lb, gs] = await Promise.all([
    supabase
      .from("arcade_leaderboard")
      .select("name,q,score,restarts,finished_at")
      .returns<BoardRow[]>(),
    supabase.from("game_state_public").select("*").maybeSingle<GameState>(),
  ]);
  if (lb.error) return { rows: [], game: gs.data ?? null, error: lb.error.message };
  return { rows: lb.data ?? [], game: gs.data ?? null };
}
