/* ============================================================================
 * ARCADE ALBERT — escape game v2 : 20 slots de difficulté croissante,
 * 2 variantes par slot (A = premier run, B = après un reset punitif).
 * Les réponses vivent CÔTÉ SERVEUR uniquement : le client reçoit une version
 * sanitisée (`PublicArcadeQuestion`), la validation passe par server action.
 * ========================================================================== */

export type ArcadeMechanic =
  /** QCM simple — échauffement. */
  | { kind: "qcm"; question: string; options: string[]; answerIndex: number }
  /** Réponse texte libre (normalisée : minuscules, sans accents/espaces superflus). */
  | { kind: "text"; question: string; placeholder?: string; answers: string[] }
  /**
   * Prompter dans le site : le texte doit satisfaire chaque critère
   * (regex, flags "i" appliqués côté serveur ET client pour la checklist live).
   */
  | {
      kind: "prompt";
      question: string;
      mustInclude: { label: string; pattern: string }[];
      minLength?: number;
    }
  /** Drag & drop : déposer chaque item dans la bonne boîte. */
  | {
      kind: "drag";
      question: string;
      boxes: string[];
      items: { label: string; box: number }[];
    }
  /** Relier : associer chaque élément de gauche à son partenaire de droite. */
  | { kind: "match"; question: string; pairs: { left: string; right: string }[] }
  /** Remettre des étapes dans l'ordre (steps = ordre correct ; mélangé côté client). */
  | { kind: "order"; question: string; steps: string[] }
  /** Cible mobile : attraper N fois l'objet qui traverse l'écran. */
  | { kind: "target"; question: string; catches: number; emoji: string }
  /**
   * Acronymes : `needed` sous-questions ; pour chacune, les propositions
   * traversent l'écran à l'horizontale (sens alternés, sans se croiser) et on
   * clique la bonne. `answerIndex` reste CÔTÉ SERVEUR (validation par label).
   */
  | {
      kind: "acronym";
      question: string;
      needed: number;
      items: {
        acronym: string;
        prompt: string;
        options: string[];
        answerIndex: number;
      }[];
    }
  /**
   * Énigme cachée : un élément quasi invisible est dissimulé dans la page ;
   * le cliquer révèle un code (via server action) à saisir. `spot` = indice
   * de placement ("corner-tl" | "corner-tr" | "corner-bl" | "corner-br" | "header").
   */
  | { kind: "hidden"; question: string; code: string; spot: string };

export type ArcadeQuestion = {
  /** Unique : "q01a", "q01b", … */
  id: string;
  /** 1..20 — position dans le run. */
  slot: number;
  /** 0..3 = série A/B/C/D. On change de série à chaque reset punitif (cycle). */
  variant: 0 | 1 | 2 | 3;
  title: string;
  /** 1..5 — informatif, croît avec le slot. */
  difficulty: number;
  /** Secondes. Présent = question PUNITIVE : timeout → retour à zéro, variante B. */
  timeLimit?: number;
  /** Contexte narratif Albert (markdown light non supporté : texte brut). */
  intro?: string;
  hint?: string;
  mechanic: ArcadeMechanic;
};

/* --------------------------------------------------------------------------
 * Version publique (sans réponses) envoyée au client.
 * ------------------------------------------------------------------------ */

export type PublicMechanic =
  | { kind: "qcm"; question: string; options: string[] }
  | { kind: "text"; question: string; placeholder?: string }
  | {
      kind: "prompt";
      question: string;
      criteria: { label: string; pattern: string }[];
      minLength?: number;
    }
  | { kind: "drag"; question: string; boxes: string[]; items: string[] }
  | { kind: "match"; question: string; left: string[]; right: string[] }
  | { kind: "order"; question: string; steps: string[] }
  | { kind: "target"; question: string; catches: number; emoji: string }
  | {
      kind: "acronym";
      question: string;
      needed: number;
      items: { acronym: string; prompt: string; options: string[] }[];
    }
  | { kind: "hidden"; question: string; spot: string };

export type PublicArcadeQuestion = {
  id: string;
  slot: number;
  title: string;
  difficulty: number;
  timeLimit?: number;
  intro?: string;
  hint?: string;
  mechanic: PublicMechanic;
};

/** Payload de soumission, par mécanique. */
export type ArcadeSubmission =
  | { kind: "qcm"; index: number }
  | { kind: "text"; text: string }
  | { kind: "prompt"; text: string }
  | { kind: "drag"; assignment: Record<string, number> } // label item → index boîte
  | { kind: "match"; pairs: [string, string][] } // [gauche, droite]
  | { kind: "order"; steps: string[] }
  | { kind: "target"; caught: number }
  | { kind: "acronym"; picks: string[] }
  | { kind: "hidden"; code: string };

/** Mélange déterministe (seed = id) pour ne pas trahir l'ordre des réponses. */
export function seededShuffle<T>(arr: T[], seedStr: string): T[] {
  let seed = 0;
  for (const c of seedStr) seed = (seed * 31 + c.charCodeAt(0)) | 0;
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const j = seed % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Retire toute information de réponse avant envoi au client. */
export function toPublic(q: ArcadeQuestion): PublicArcadeQuestion {
  const m = q.mechanic;
  let pub: PublicMechanic;
  switch (m.kind) {
    case "qcm":
      pub = { kind: "qcm", question: m.question, options: m.options };
      break;
    case "text":
      pub = { kind: "text", question: m.question, placeholder: m.placeholder };
      break;
    case "prompt":
      pub = {
        kind: "prompt",
        question: m.question,
        criteria: m.mustInclude,
        minLength: m.minLength,
      };
      break;
    case "drag":
      pub = {
        kind: "drag",
        question: m.question,
        boxes: m.boxes,
        items: seededShuffle(m.items.map((it) => it.label), q.id),
      };
      break;
    case "match":
      pub = {
        kind: "match",
        question: m.question,
        left: m.pairs.map((p) => p.left),
        right: seededShuffle(m.pairs.map((p) => p.right), q.id),
      };
      break;
    case "order":
      pub = {
        kind: "order",
        question: m.question,
        steps: seededShuffle(m.steps, q.id),
      };
      break;
    case "target":
      pub = { kind: "target", question: m.question, catches: m.catches, emoji: m.emoji };
      break;
    case "acronym":
      pub = {
        kind: "acronym",
        question: m.question,
        needed: m.needed,
        items: m.items.map((it) => ({
          acronym: it.acronym,
          prompt: it.prompt,
          // Ordre mélangé côté client : answerIndex jamais exposé.
          options: seededShuffle(it.options, q.id + it.acronym),
        })),
      };
      break;
    case "hidden":
      pub = { kind: "hidden", question: m.question, spot: m.spot };
      break;
  }
  return {
    id: q.id,
    slot: q.slot,
    title: q.title,
    difficulty: q.difficulty,
    timeLimit: q.timeLimit,
    intro: q.intro,
    hint: q.hint,
    mechanic: pub,
  };
}

export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Vérifie une soumission contre la définition serveur. */
export function checkSubmission(q: ArcadeQuestion, sub: ArcadeSubmission): boolean {
  const m = q.mechanic;
  if (m.kind !== sub.kind) return false;
  switch (m.kind) {
    case "qcm":
      return (sub as { index: number }).index === m.answerIndex;
    case "text": {
      const t = normalizeText((sub as { text: string }).text);
      return m.answers.some((a) => normalizeText(a) === t);
    }
    case "prompt": {
      const t = (sub as { text: string }).text;
      if (m.minLength && t.length < m.minLength) return false;
      return m.mustInclude.every((c) => new RegExp(c.pattern, "i").test(t));
    }
    case "drag": {
      const a = (sub as { assignment: Record<string, number> }).assignment;
      return m.items.every((it) => a[it.label] === it.box);
    }
    case "match": {
      const pairs = (sub as { pairs: [string, string][] }).pairs;
      if (pairs.length !== m.pairs.length) return false;
      return m.pairs.every((p) =>
        pairs.some(([l, r]) => l === p.left && r === p.right),
      );
    }
    case "order": {
      const steps = (sub as { steps: string[] }).steps;
      return (
        steps.length === m.steps.length &&
        m.steps.every((s, i) => steps[i] === s)
      );
    }
    case "target":
      return (sub as { caught: number }).caught >= m.catches;
    case "acronym": {
      const picks = (sub as { picks: string[] }).picks ?? [];
      if (picks.length < m.needed) return false;
      // Chaque sous-question validée par LABEL (l'index correct n'est jamais envoyé).
      return m.items
        .slice(0, m.needed)
        .every(
          (it, i) =>
            normalizeText(picks[i] ?? "") === normalizeText(it.options[it.answerIndex]),
        );
    }
    case "hidden":
      return normalizeText((sub as { code: string }).code) === normalizeText(m.code);
  }
}

/** Points d'un slot : la difficulté paye. */
export function slotPoints(slot: number): number {
  return 50 + slot * 10;
}
