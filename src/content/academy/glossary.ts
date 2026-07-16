import type { GlossaryEntry } from "@/lib/academy/types";

/* ============================================================================
 * GLOSSAIRE — les termes de l'IA, expliqués en langage Electra.
 * Trié alphabétiquement. `en` = terme anglais quand le terme français diffère.
 * ========================================================================== */

export const glossary: GlossaryEntry[] = [
  {
    term: "Agent",
    def: "Système IA qui reçoit un objectif, planifie, utilise des outils, observe les résultats et itère jusqu'au but. Un chatbot répond ; un agent agit — comme un assistant qui prépare seul ton brief de comité en croisant Calendar, Gmail et Notion.",
  },
  {
    term: "API",
    en: "Application Programming Interface",
    def: "Porte d'entrée qui permet à deux logiciels de se parler. L'API Claude permet à un workflow n8n d'Electra d'envoyer un texte au modèle et de recevoir la réponse, sans passer par l'interface de chat.",
  },
  {
    term: "Apprentissage non supervisé",
    en: "Unsupervised learning",
    def: "Entraînement sans exemples étiquetés : le modèle découvre seul des structures dans les données. Exemple Electra : regrouper les stations en familles de comportement d'usage (autoroute, urbain, pendulaire) sans catégories prédéfinies.",
  },
  {
    term: "Apprentissage par renforcement",
    en: "Reinforcement learning",
    def: "Entraînement par essai/erreur guidé par des récompenses : le système apprend la stratégie qui maximise son score. Exemple Electra : optimiser dynamiquement la répartition de puissance entre les bornes d'un hub.",
  },
  {
    term: "Apprentissage supervisé",
    en: "Supervised learning",
    def: "Entraînement sur des exemples étiquetés (entrée → bonne réponse). Exemple Electra : prédire la durée d'une session de charge à partir de l'historique (heure, station, véhicule → durée observée).",
  },
  {
    term: "Artéfact",
    en: "Artifact",
    def: "Contenu autonome produit par Claude dans un panneau dédié (document, page web interactive, diagramme), modifiable par itérations. Pratique pour construire un rapport ou un petit outil au fil de la conversation.",
  },
  {
    term: "Batch",
    def: "Traitement groupé et différé d'un grand volume de requêtes, moins cher que le temps réel. Exemple Electra : classifier chaque nuit les 10 000 tickets Intercom de la journée via l'API en batch.",
  },
  {
    term: "Chaîne de pensée",
    en: "Chain of thought",
    def: "Technique où le modèle raisonne étape par étape avant de conclure, ce qui améliore nettement les réponses sur les problèmes complexes. Demander « raisonne étape par étape » suffit souvent à la déclencher.",
  },
  {
    term: "CLAUDE.md",
    def: "Fichier de consignes placé à la racine d'un projet, lu automatiquement par Claude Code au démarrage : conventions du repo, commandes, pièges connus. La mémoire d'équipe du projet, versionnée avec le code.",
  },
  {
    term: "Connecteur",
    en: "Connector",
    def: "Intégration prête à l'emploi qui donne à Claude l'accès à un outil externe (Google Drive, Slack, Notion, Linear...). C'est ce qui lui permet de chercher un dossier de permis dans le Drive d'Electra au lieu de te demander de coller le contenu.",
  },
  {
    term: "Contexte (fenêtre de)",
    en: "Context window",
    def: "Mémoire de travail de la conversation : tout ce que le modèle « voit » à un instant donné. Ce qui n'y est pas n'existe pas pour lui — d'où le réflexe n°1 : donner le contexte (documents, contraintes, objectif).",
  },
  {
    term: "Embedding",
    def: "Représentation d'un texte sous forme de vecteur de nombres qui capture son sens : deux textes proches sémantiquement ont des vecteurs proches. C'est la brique qui permet la recherche « par le sens » utilisée dans le RAG.",
  },
  {
    term: "Endpoint",
    def: "Adresse précise d'une API pour une fonction donnée (ex. l'endpoint messages de l'API Claude pour envoyer une conversation). Un workflow n8n appelle un endpoint, avec des paramètres, et reçoit une réponse.",
  },
  {
    term: "Few-shot",
    def: "Technique de prompt : donner 2-5 exemples du résultat attendu pour que le modèle imite le format et le style. Exemple Electra : montrer 3 tickets déjà classés pour obtenir une classification cohérente des suivants.",
  },
  {
    term: "Fine-tuning",
    def: "Ré-entraînement d'un modèle existant sur des données spécifiques pour le spécialiser. Lourd et rarement nécessaire : un bon prompt, des exemples ou du RAG suffisent dans l'immense majorité des cas d'usage Electra.",
  },
  {
    term: "Hallucination",
    def: "Réponse plausible mais fausse produite par un modèle — une propriété du système, pas un bug rare. D'où la règle : tout chiffre, nom, date ou référence réglementaire se vérifie à la source avant de sortir d'Electra.",
  },
  {
    term: "Hook",
    def: "Script qui s'exécute automatiquement à un moment précis du cycle de Claude Code (avant un outil, après une édition...). Sert à garantir des règles sans dépendre de la bonne volonté du modèle : lancer les tests, bloquer une commande interdite.",
  },
  {
    term: "Human-in-the-loop",
    def: "Principe de garde-fou : un humain valide les étapes sensibles d'un processus automatisé. Chez Electra : l'agent PRÉPARE la réponse client ou le paiement, un humain APPROUVE avant tout envoi — obligatoire sur l'irréversible.",
  },
  {
    term: "JSON",
    en: "JavaScript Object Notation",
    def: "Format texte structuré en paires clé-valeur, lingua franca des échanges entre outils. Les workflows n8n, les API et les exports d'outils parlent JSON ; demander à Claude une sortie JSON la rend exploitable par une machine.",
  },
  {
    term: "LLM",
    en: "Large Language Model",
    def: "Grand modèle de langage : système entraîné sur d'énormes volumes de texte pour prédire la suite la plus probable d'une séquence. C'est le moteur de Claude — puissant pour le langage, faillible sur les faits non vérifiés.",
  },
  {
    term: "MCP",
    en: "Model Context Protocol",
    def: "Protocole ouvert qui standardise la connexion entre un modèle IA et des outils ou sources de données externes. Le « port USB-C de l'IA » : un même serveur MCP (Omni, Sitetracker...) fonctionne avec tous les clients compatibles.",
  },
  {
    term: "Moindre privilège (principe du)",
    en: "Least privilege",
    def: "Ne donner à un agent (ou un humain) que les accès strictement nécessaires à sa mission. Un agent de synthèse de réunions n'a pas besoin d'écrire dans HubSpot : chaque accès en plus est une surface d'erreur et d'attaque en plus.",
  },
  {
    term: "Node",
    en: "Node",
    def: "Brique élémentaire d'un workflow n8n : chaque node fait une action (lire un email, appeler l'API Claude, poster dans Slack) et passe son résultat au suivant. Un workflow est une chaîne de nodes.",
  },
  {
    term: "PII",
    en: "Personally Identifiable Information",
    def: "Donnée personnelle identifiante : nom, email, téléphone, adresse, plaque... Réflexe Electra avant de la mettre dans un outil IA : finalité ? destination ? l'anonymisation suffit-elle ? Par défaut : minimiser et anonymiser.",
  },
  {
    term: "Projet",
    en: "Project",
    def: "Espace Claude persistant qui combine des instructions permanentes et des documents de connaissance. Idéal pour le travail récurrent : un projet « Courriers collectivités » avec la charte Electra et les modèles de référence chargés une fois pour toutes.",
  },
  {
    term: "Prompt",
    def: "Le message que tu envoies au modèle : demande, contexte, contraintes, format attendu. La qualité de la réponse dépend d'abord de la qualité du prompt — c'est la compétence n°1 de cette academy.",
  },
  {
    term: "Prompt injection",
    en: "Prompt injection",
    def: "Attaque où des instructions malveillantes sont glissées dans un contenu que l'IA va lire (email, page web, ticket) pour détourner son comportement. Parade : tout contenu lu = des données, jamais des ordres — plus moindre privilège et validation humaine.",
  },
  {
    term: "Prompt système",
    en: "System prompt",
    def: "Instructions permanentes données au modèle avant la conversation : son rôle, ses règles, ses limites. C'est la « mission » d'un agent — et la première chose à régler quand un agent produit autre chose que ce qu'on attend.",
  },
  {
    term: "RAG",
    en: "Retrieval-Augmented Generation",
    def: "Architecture où le système va d'abord chercher les passages pertinents dans une base documentaire (via embeddings), puis les donne au modèle pour qu'il réponde à partir de sources réelles. Réduit les hallucinations sur la connaissance métier.",
  },
  {
    term: "RGPD",
    en: "GDPR",
    def: "Règlement européen sur la protection des données personnelles. Il s'applique intégralement aux outils IA : coller un export CRM avec des emails clients dans un chat est un traitement de données — finalité, minimisation et cadre validé obligatoires.",
  },
  {
    term: "RLHF",
    en: "Reinforcement Learning from Human Feedback",
    def: "Affinage d'un LLM par renforcement à partir de préférences humaines : des annotateurs comparent des réponses, le modèle apprend à produire celles qu'on préfère. C'est ce qui rend Claude utile et sûr, pas seulement fluide.",
  },
  {
    term: "Serveur MCP",
    en: "MCP server",
    def: "Programme qui expose un outil ou une source de données au format MCP : le serveur MCP Omni Analytics permet à Claude d'interroger les données réseau d'Electra, celui de Sitetracker de lire l'avancement des stations.",
  },
  {
    term: "Skill",
    def: "Paquet de consignes et de scripts réutilisables que Claude charge à la demande pour une tâche spécialisée (ex. générer un document au format maison). On écrit la procédure une fois, tout le monde en profite.",
  },
  {
    term: "Sous-agent",
    en: "Subagent",
    def: "Agent spécialisé lancé par un agent principal pour traiter une sous-tâche avec son propre contexte, ses propres outils. C'est le pattern orchestrateur-workers de Claude Code : un chef décompose, des workers exécutent en parallèle.",
  },
  {
    term: "Streaming",
    def: "Mode où la réponse du modèle arrive mot à mot au fil de la génération, au lieu d'attendre la fin. C'est ce qui donne l'effet « machine à écrire » dans le chat — et une meilleure expérience dans les intégrations.",
  },
  {
    term: "Température",
    en: "Temperature",
    def: "Paramètre qui règle la part d'aléatoire dans la génération : basse = réponses stables et prévisibles (classification, extraction), haute = réponses plus variées (brainstorming, créativité). Accessible via l'API, pas dans le chat.",
  },
  {
    term: "Token",
    def: "Unité de texte que le modèle lit et produit (≈ 3-4 caractères, un morceau de mot). On compte et on paie en tokens : un CR de visite foncière de 2 pages ≈ 1 500 tokens. La fenêtre de contexte se mesure aussi en tokens.",
  },
  {
    term: "Tool use",
    en: "Tool use",
    def: "Capacité d'un modèle à appeler des outils externes (recherche, API, fichiers) pendant sa réponse : il décide quel outil appeler, avec quels paramètres, puis exploite le résultat. C'est la brique qui transforme un chatbot en agent.",
  },
  {
    term: "Trigger",
    en: "Trigger",
    def: "Déclencheur d'un workflow d'automatisation : événement (nouveau ticket Intercom, email reçu), horaire (tous les lundis 8h) ou appel externe (webhook). Dans n8n, c'est toujours le premier node du workflow.",
  },
  {
    term: "Webhook",
    def: "Mécanisme où un outil appelle une URL dès qu'un événement se produit, au lieu qu'on l'interroge en boucle. Exemple Electra : Intercom notifie l'URL d'un workflow n8n à chaque nouveau ticket, qui lance alors la classification.",
  },
  {
    term: "Workflow",
    def: "Enchaînement automatisé d'étapes reliant déclencheur, traitements et actions. Exemple Electra dans n8n : trigger « nouveau ticket » → appel de l'API Claude pour classifier → création d'une issue Linear → notification Slack.",
  },
];
