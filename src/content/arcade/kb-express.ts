/* ============================================================================
 * KNOWLEDGE BASE EXPRESS — les fiches de survie de l'Arcade Albert.
 * Chaque réponse des 40 questions est déductible d'au moins une puce
 * (sauf les codes des énigmes cachées, révélés en jeu).
 * ========================================================================== */

export type ExpressCard = {
  id: string;
  icon: string;
  title: string;
  points: string[];
};

export const kbExpress: ExpressCard[] = [
  {
    id: "bases",
    icon: "🧩",
    title: "Les bases du modèle",
    points: [
      "Un LLM prédit la suite la plus probable d'un texte — il ne « sait » pas, il prédit.",
      "Fenêtre de contexte = la mémoire de travail de la conversation ; hors contexte = invisible pour le modèle.",
      "Tokens = morceaux de mots (~3-4 caractères) : l'unité dans laquelle on compte et on paie.",
      "Hallucination = réponse plausible mais FAUSSE, dite avec aplomb ; propriété du système, pas bug rare → on vérifie.",
      "Problème de langage (rédiger, résumer, poster) → LLM ; problème de chiffres (prévision 12 mois, séries temporelles, scoring d'anomalies) → ML classique.",
    ],
  },
  {
    id: "famille-claude",
    icon: "🤖",
    title: "La famille Claude",
    points: [
      "Choisir un modèle = arbitrage intelligence / vitesse / coût, pas un classement.",
      "Chat quotidien → le modèle par défaut de claude.ai suffit.",
      "Gros volume simple via API (ex. classifier 10 000 tickets par nuit) → modèle rapide et ÉCONOMIQUE : le coût par appel domine.",
      "Enjeu élevé + document complexe (ex. contrat de raccordement de 80 pages) → le modèle le plus CAPABLE : le surcoût est dérisoire face au risque.",
      "Repères de gamme : Opus = le plus puissant, Sonnet = l'équilibre puissance/vitesse, Haiku = le plus rapide.",
    ],
  },
  {
    id: "prompting",
    icon: "🎯",
    title: "Prompting : R.O.C.C.F. & techniques",
    points: [
      "La grille, dans l'ordre : Rôle → Objectif → Contexte → Critères → Feedback-exemples.",
      "Rôle expert : « Tu es juriste spécialisé… » active le bon registre et le bon niveau d'exigence.",
      "Few-shot = donner des exemples de ce qu'on attend ; chain of thought = demander de raisonner étape par étape.",
      "Balises XML = structurer le prompt en sections délimitées ; sortie JSON stricte = imposer un schéma exact, rien d'autre.",
      "Négatif explicite = dire ce qu'il ne faut PAS faire (« évite le jargon », « jamais de chiffre non sourcé »).",
      "Critères de forme : format, structure, longueur maximum, ton — un bon brief les impose toujours.",
    ],
  },
  {
    id: "projets-artefacts",
    icon: "📌",
    title: "Projets & artéfacts",
    points: [
      "Artéfact = le panneau à part de claude.ai où Claude produit un contenu qui compte (doc, code, page).",
      "On itère sur l'artéfact existant (« raccourcis », « ajoute une section ») au lieu de redemander de zéro.",
      "Projet = instructions + connaissances chargées UNE fois pour toutes → Claude devient un collègue du domaine.",
      "Le Projet est l'outil du travail récurrent ; un projet par périmètre, pas de fourre-tout.",
    ],
  },
  {
    id: "mcp",
    icon: "🔌",
    title: "MCP & connecteurs",
    points: [
      "MCP = Model Context Protocol : standard ouvert créé par Anthropic, le « USB-C de l'IA ».",
      "Serveur MCP = le programme qui EXPOSE des capacités (le serveur Notion expose « créer une page »).",
      "Client MCP = l'application côté modèle qui se branche : claude.ai, Claude Desktop, Claude Code.",
      "Outils = ACTIONS appelables (« envoyer un message Slack », « créer un ticket Linear ») ; Ressources = données en lecture.",
      "Connecteurs déjà branchés chez Electra : Slack, Notion, Linear, Datadog, Gmail/Drive/Calendar, Intercom, Sitetracker…",
    ],
  },
  {
    id: "bon-outil",
    icon: "🧭",
    title: "Le bon outil pour la bonne tâche",
    points: [
      "Question ponctuelle, brouillon, brainstorm (email, idées de post) → Chat.",
      "Travail récurrent, mêmes consignes et documents (synthèse du lundi, glossaire du pôle) → Projet.",
      "Tâche multi-étapes sur des FICHIERS (trier 40 CR, consolider 12 Excel en un livrable) → Cowork.",
      "Code, repo, bug à corriger, ticket Linear à mettre à jour → Claude Code.",
      "Automatisation autonome en production (à chaque événement, sans humain) → n8n + API.",
      "Volume massif programmatique (50 000 tickets) → l'API directement.",
      "Deux questions qui tranchent : « récurrent ou ponctuel ? » et « ça doit tourner sans moi ? »",
    ],
  },
  {
    id: "claude-code",
    icon: "💻",
    title: "Claude Code : l'atelier",
    points: [
      "CLAUDE.md = fichier à la racine du repo, mémoire longue durée du projet (conventions, commandes, contexte).",
      "Le workflow gagnant, dans l'ordre : Explore → Plan → Code → Verify.",
      "Skills = dossiers de savoir-faire (SKILL.md + ressources) que Claude charge quand c'est pertinent.",
      "Slash commands = un fichier Markdown = une commande partagée ; hooks = scripts auto sur événements.",
      "Sous-agents = agents parallèles lancés par Claude Code, chacun avec son PROPRE contexte (l'un explore les logs, l'autre code).",
    ],
  },
  {
    id: "n8n",
    icon: "🔁",
    title: "n8n × Claude : les 3 modes",
    points: [
      "Mode 1 — Claude DANS n8n : un node AI Agent appelle Claude à chaque exécution → automatisation autonome en prod, sans humain (« à chaque ticket / courrier reçu… »).",
      "Mode 2 — n8n comme OUTIL de Claude : les workflows deviennent déclenchables depuis le chat via MCP (« lance la relance foncier pour Annecy », rapport à la demande).",
      "Mode 3 — Claude Code BÂTISSEUR : via un serveur MCP n8n, Claude Code crée et modifie les workflows (15 workflows dans la semaine, ajouter une branche email).",
      "La question qui route tout : qui appuie sur le bouton — un événement (1), un humain (2), ou personne car on construit (3) ?",
      "Workflow type, dans l'ordre : Déclencheur → node AI Agent (Claude) → aiguillage IF/Switch → notification Slack.",
    ],
  },
  {
    id: "agents",
    icon: "🕸️",
    title: "Agents : boucle & composants",
    points: [
      "Un chatbot répond ; un agent AGIT avec des outils.",
      "La boucle, dans l'ordre : Objectif → Plan → Action (outil) → Observation → Ajustement.",
      "Les 5 composants : Modèle (le cerveau qui raisonne et décide), Instructions (la mission : quoi faire, quoi ne jamais faire, quand c'est fini), Outils (ses mains : MCP, API, fichiers), Mémoire/contexte (ce qu'il sait au moment d'agir), Garde-fous (permissions, validation humaine, journalisation).",
      "Quand un agent déraille, c'est presque toujours l'un des 5 composants qui est mal réglé — 80 % du temps : les Instructions.",
    ],
  },
  {
    id: "patterns",
    icon: "🧱",
    title: "Patterns d'agents",
    points: [
      "Chaînage de prompts = étapes FIXES, chaque sortie nourrit la suivante (extraire → vérifier → rédiger).",
      "Routage = classer la demande puis l'envoyer au traitement spécialisé (ticket → facturation / technique / commercial).",
      "Parallélisation = plusieurs analyses indépendantes en même temps, puis agréger (contrat relu sous 3 angles).",
      "Orchestrateur-workers = un chef décompose dynamiquement et délègue à des workers (le pattern des sous-agents).",
      "Évaluateur-optimiseur = un agent produit, un autre critique selon des critères explicites, on boucle.",
      "Principe directeur : commencer par la solution la plus SIMPLE — un bon prompt bat souvent un agent complexe.",
    ],
  },
  {
    id: "securite",
    icon: "🛡️",
    title: "Sécurité : injection, PII, garde-fous",
    points: [
      "Prompt injection = instructions malveillantes glissées dans le contenu que l'agent LIT (email, page web, ticket) — la faille n°1 des agents connectés.",
      "La règle absolue : tout contenu lu = des DONNÉES à traiter, jamais des ordres à exécuter — à écrire noir sur blanc dans le system prompt.",
      "Moindre privilège = ne donner à l'agent QUE les outils et accès nécessaires à sa mission.",
      "L'irréversible (envoyer un email, supprimer, payer) passe par une VALIDATION HUMAINE ; un message Slack ou une lecture se corrige → action libre.",
      "Clés API, mots de passe, secrets : JAMAIS dans un prompt — placeholder type API_KEY_ICI.",
      "RGPD / données personnelles : finalité ? destination ? anonymisation suffisante ? → minimiser et anonymiser (client_1, client_2).",
      "Mode dégradé : si une donnée manque ou un outil échoue, l'agent S'ARRÊTE et demande — jamais inventer. Anti-hallucination : exiger les sources, autoriser « je ne sais pas », interdire les chiffres inventés.",
    ],
  },
];
