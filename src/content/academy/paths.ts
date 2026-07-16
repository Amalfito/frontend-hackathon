import type { AcademyPath } from "@/lib/academy/types";

/* ============================================================================
 * Les 3 parcours de l'académie. Tout reste accessible à tous : le parcours
 * n'est qu'un ordre recommandé. M0 ouvre, M11 (obligatoire) ferme.
 * ========================================================================== */

export const paths: AcademyPath[] = [
  {
    persona: "explorateur",
    label: "L'Explorateur",
    icon: "🧭",
    description:
      "Marketing, ops, finance, support… Tu as peu (ou jamais) utilisé l'IA. Objectif : devenir autonome sur Claude, les Projets et les connecteurs.",
    modules: [
      "decoder",
      "prise-en-main",
      "prompting",
      "contexte",
      "mcp",
      "cowork",
      "securite",
    ],
  },
  {
    persona: "power",
    label: "Le Power User",
    icon: "⚡",
    description:
      "PM, data analyst, ops senior… Tu utilises déjà l'IA au quotidien. Objectif : MCP, Cowork, prompt engineering avancé, agents et n8n.",
    modules: [
      "decoder",
      "prompting",
      "mcp",
      "cowork",
      "n8n",
      "agents",
      "securite",
    ],
  },
  {
    persona: "builder",
    label: "Le Builder",
    icon: "🛠️",
    description:
      "Dev, data eng, automation… Objectif : Claude Code à fond, API Anthropic, Python, n8n et conception d'agents fiables.",
    modules: [
      "decoder",
      "claude-code",
      "python",
      "api",
      "n8n",
      "agents",
      "securite",
    ],
  },
];

export function pathFor(persona: string | null): AcademyPath | null {
  return paths.find((p) => p.persona === persona) ?? null;
}

/* ============================================================================
 * Quiz d'orientation — 5 questions, score par persona, ex æquo → le plus
 * ambitieux l'emporte (builder > power > explorateur).
 * ========================================================================== */

export type OrientationQuestion = {
  q: string;
  options: { label: string; scores: Partial<Record<AcademyPath["persona"], number>> }[];
};

export const orientationQuestions: OrientationQuestion[] = [
  {
    q: "Aujourd'hui, ton usage de l'IA ressemble à…",
    options: [
      { label: "Quasi rien, ou quelques questions de temps en temps", scores: { explorateur: 2 } },
      { label: "Tous les jours : rédaction, analyse, brainstorming", scores: { power: 2 } },
      { label: "J'appelle des modèles depuis du code ou des workflows", scores: { builder: 2 } },
    ],
  },
  {
    q: "Ton terrain de jeu quotidien chez Electra ?",
    options: [
      { label: "Slack, Notion, Gmail, tableurs — le bureau classique", scores: { explorateur: 1, power: 1 } },
      { label: "Dashboards, tickets, données : Omni, Linear, Intercom, Datadog", scores: { power: 2 } },
      { label: "Un terminal, un IDE, des API, des repos", scores: { builder: 2 } },
    ],
  },
  {
    q: "« Ouvre un terminal et tape une commande » — ta réaction ?",
    options: [
      { label: "Un quoi ? 😅", scores: { explorateur: 2 } },
      { label: "Je sais faire, mais ce n'est pas mon quotidien", scores: { power: 2 } },
      { label: "C'est mon environnement naturel", scores: { builder: 2 } },
    ],
  },
  {
    q: "Ce que tu veux surtout automatiser…",
    options: [
      { label: "Mes tâches perso répétitives : synthèses, mails, comptes-rendus", scores: { explorateur: 2, power: 1 } },
      { label: "Des process d'équipe : tickets routés, rapports auto, alertes", scores: { power: 2, builder: 1 } },
      { label: "Des systèmes : pipelines, intégrations, agents en prod", scores: { builder: 2 } },
    ],
  },
  {
    q: "Dans 3 mois, ta victoire idéale ?",
    options: [
      { label: "Claude est devenu mon collègue du quotidien", scores: { explorateur: 2 } },
      { label: "Mon équipe utilise mes workflows n8n et mes prompts", scores: { power: 2 } },
      { label: "J'ai shippé un agent fiable branché sur nos outils", scores: { builder: 2 } },
    ],
  },
];
