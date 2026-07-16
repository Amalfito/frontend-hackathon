export type StageType = "quiz" | "cipher" | "password" | "final";

/** Étape CHALLENGE telle qu'exposée publiquement (vue `stages_public`, sans la réponse). */
export type PublicStage = {
  id: string;
  stage_order: number;
  slug: string;
  type: StageType;
  title: string;
  title_en?: string | null;
  narrative_en?: string | null;
  prompt_en?: string | null;
  hint_en?: string | null;
  narrative: string;
  prompt: string;
  hint: string;
  points: number;
};

export type Team = {
  id: string;
  name: string;
  current_stage_order: number;
  score: number;
  learn_score: number;
  started_at: string;
  finished_at: string | null;
};

/** État du jeu (minuteur bombe + verrou), vue `game_state_public`. */
export type GameStatus =
  | "idle"
  | "running"
  | "paused"
  | "stopped"
  | "defused"
  | "exploded";

export type GameState = {
  status: GameStatus;
  duration_seconds: number;
  started_at: string | null;
  ends_at: string | null;
  remaining_seconds: number | null;
  submissions_locked: boolean;
  message: string;
  updated_at: string;
};

/** Documentation ludique (vue `lessons_public`). */
export type Lesson = {
  id: string;
  category: string;
  slug: string;
  order_index: number;
  title: string;
  summary: string;
  content: string;
  title_en?: string | null;
  summary_en?: string | null;
  content_en?: string | null;
  icon: string;
  estimated_minutes: number;
};

/** QCM (vues `quizzes_public` / `quiz_questions_public` / `quiz_options_public`). */
export type Quiz = {
  id: string;
  slug: string;
  lesson_slug: string | null;
  title: string;
  description: string;
  title_en?: string | null;
  description_en?: string | null;
  order_index: number;
};

export type QuizQuestion = {
  id: string;
  quiz_id: string;
  qkey: string;
  order_index: number;
  question: string;
  question_en?: string | null;
  question_type: "single" | "multiple";
  points: number;
};

export type QuizOption = {
  id: string;
  question_id: string;
  order_index: number;
  label: string;
  label_en?: string | null;
};

/** Réponse de la RPC `grade_quiz_question` (bonnes options révélées après coup). */
export type QuizGrade = {
  correct: boolean;
  correct_option_ids: string[];
  explanation: string;
};

export type Admin = {
  id: string;
  username: string;
  display_name: string;
};
