/* ============================================================================
 * ELECTRA AI ACADEMY — modèle de contenu du curriculum.
 * Le contenu vit dans `src/content/academy/` (typé, versionné avec le code).
 * Les champs `md` sont rendus par le composant <Markdown/> maison :
 * titres #/##/###, listes - et 1., **gras**, `code`. Pas de liens ni tableaux.
 * ========================================================================== */

export type LocalQuizQuestion = {
  q: string;
  /** true = cases à cocher (plusieurs bonnes réponses). */
  multi?: boolean;
  options: { label: string; correct?: boolean }[];
  explanation: string;
};

export type AcademyBlock =
  /** 🧠 Concept court à lire (2-4 min max). */
  | { kind: "concept"; title?: string; md: string }
  /** 🎬 Démo pas-à-pas / scénario illustré. */
  | { kind: "demo"; title?: string; md: string }
  /** ⚠️ Piège classique / mise en garde. */
  | { kind: "warning"; title?: string; md: string }
  /** 💡 Astuce / réflexe pro. */
  | { kind: "tip"; title?: string; md: string }
  /** Prompt prêt à copier + bouton « Ouvrir dans Claude ». */
  | { kind: "prompt"; title?: string; prompt: string; note?: string }
  /** ❌ mauvais prompt vs ✅ bon prompt. */
  | {
      kind: "beforeAfter";
      title?: string;
      bad: string;
      good: string;
      explanation?: string;
    }
  /** Bloc de code affiché (non exécutable). */
  | { kind: "code"; title?: string; lang: string; code: string }
  /** Cartes recto/verso à retourner (mémorisation active). */
  | { kind: "flipcards"; title?: string; cards: { front: string; back: string }[] }
  /** Mini-jeu de tri : ranger chaque item dans la bonne catégorie. +XP. */
  | {
      kind: "sort";
      title: string;
      instructions: string;
      categories: string[];
      items: { label: string; category: string }[];
    }
  /** QCM formatif local, feedback immédiat. +XP. */
  | { kind: "quiz"; title?: string; questions: LocalQuizQuestion[] }
  /** 🛠️ Exercice à faire dans Claude : consignes + prompt + checklist. +XP. */
  | {
      kind: "exercise";
      title: string;
      md: string;
      prompt?: string;
      checklist: string[];
    };

export type AcademyLesson = {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  blocks: AcademyBlock[];
};

export type AcademyCheckpoint = {
  title: string;
  md: string;
  /** Livrable auto-déclaré : toutes les cases cochées → badge + 100 XP. */
  checklist: string[];
  /** Quiz final local optionnel (doit être réussi à 80 %). */
  quiz?: LocalQuizQuestion[];
  /** Slug `lessons.slug` en base → affiche le QCM Supabase noté (learn_score équipe). */
  dbQuizLessonSlug?: string;
};

export type AcademyModule = {
  slug: string;
  /** Code court affiché : "M0" … "M11". */
  code: string;
  title: string;
  tagline: string;
  /** Emoji d'illustration. */
  icon: string;
  /** Nom du badge débloqué au checkpoint. */
  badge: string;
  /** Public visé, affiché tel quel ("Tous", "Builders", …). */
  audience: string;
  /** Module requis pour le certificat final (M11). */
  required?: boolean;
  lessons: AcademyLesson[];
  checkpoint: AcademyCheckpoint;
};

export type Persona = "explorateur" | "power" | "builder";

export type AcademyPath = {
  persona: Persona;
  label: string;
  description: string;
  icon: string;
  /** Slugs de modules, dans l'ordre recommandé. */
  modules: string[];
};

export type GlossaryEntry = {
  term: string;
  en?: string;
  def: string;
};

export type LibraryPrompt = {
  id: string;
  metier: string;
  title: string;
  prompt: string;
};
