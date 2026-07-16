import type { AcademyModule } from "@/lib/academy/types";

/* ============================================================================
 * MODULE 0 — L'IA sans bullshit : comprendre en 30 minutes.
 * Module de référence : structure, ton et densité à imiter dans M1..M11.
 * ========================================================================== */

export const m0Decoder: AcademyModule = {
  slug: "decoder",
  code: "M0",
  title: "L'IA sans bullshit",
  tagline: "Comprendre ce qu'est vraiment un modèle d'IA — en 30 minutes chrono.",
  icon: "🧩",
  badge: "Décodeur",
  audience: "Tous",
  lessons: [
    {
      slug: "modele-ia",
      title: "C'est quoi un modèle d'IA, vraiment ?",
      summary: "LLM, tokens, contexte, hallucinations : les 4 notions qui expliquent 90 % de ce que tu observes.",
      minutes: 6,
      blocks: [
        {
          kind: "concept",
          title: "Un moteur de prédiction, pas un cerveau",
          md: `Un **modèle de langage (LLM)** est un système entraîné sur d'énormes volumes de texte pour **prédire la suite la plus probable** d'une séquence. Il ne « sait » pas, il ne « pense » pas comme un humain : il a compressé des régularités statistiques du langage et du monde.

C'est extraordinairement utile ET faillible — et tout ce module sert à te donner les bons réflexes face à cette dualité.`,
        },
        {
          kind: "flipcards",
          title: "Les 4 notions à connaître (clique pour retourner)",
          cards: [
            {
              front: "🔩 Paramètres",
              back: "Les « réglages internes » appris pendant l'entraînement. Il y en a des milliards. Plus il y en a, plus le modèle capture de nuances — et plus il coûte cher à faire tourner.",
            },
            {
              front: "🔋 Contexte (context window)",
              back: "La mémoire de travail d'une conversation. Tout ce qui n'y est pas, le modèle l'IGNORE. Métaphore Electra : c'est la batterie de la conversation — quand elle est pleine, il faut trier ce qu'on garde.",
            },
            {
              front: "🧱 Tokens",
              back: "Les « morceaux de mots » que le modèle lit et produit (≈ 3-4 caractères). On paie et on compte en tokens : un CR de visite foncière de 2 pages ≈ 1 500 tokens.",
            },
            {
              front: "🎭 Hallucination",
              back: "Quand le modèle produit une réponse plausible mais FAUSSE. Ce n'est pas un bug rare, c'est une propriété du système → d'où les réflexes de vérification (Module 11).",
            },
          ],
        },
        {
          kind: "warning",
          title: "Le piège du « il a l'air sûr de lui »",
          md: `Un LLM répond toujours avec le même aplomb, qu'il ait raison ou qu'il invente. La confiance du ton ne dit **rien** de la fiabilité du contenu. Chiffres, dates, références réglementaires IRVE : on vérifie. Toujours.`,
        },
        {
          kind: "quiz",
          title: "Vérifie que c'est branché",
          questions: [
            {
              q: "Claude ne mentionne pas la réunion réseau d'hier dans sa réponse. Pourquoi ?",
              options: [
                { label: "Elle n'est pas dans son contexte : personne ne lui en a parlé", correct: true },
                { label: "Il l'a oubliée par paresse" },
                { label: "Il boycotte les réunions" },
                { label: "Le modèle est en panne" },
              ],
              explanation: "Le modèle ne voit QUE ce qui est dans la fenêtre de contexte. Pas dedans = inexistant pour lui. C'est LE réflexe n°1 : donner le contexte.",
            },
            {
              q: "Claude te sort un taux de disponibilité « officiel » de 99,4 % pour une station, sans source. Ton réflexe ?",
              options: [
                { label: "Le vérifier dans Omni/Datadog avant de le réutiliser", correct: true },
                { label: "Le copier dans le rapport du comité, il avait l'air sûr" },
                { label: "Demander à Claude s'il est sûr (et le croire)" },
                { label: "Arrondir à 99,5 % pour faire propre" },
              ],
              explanation: "Un chiffre non sourcé produit par un LLM est une hypothèse, pas une donnée. On recoupe avec la source de vérité.",
            },
          ],
        },
      ],
    },
    {
      slug: "types-apprentissage",
      title: "Les 3 grands types d'apprentissage machine",
      summary: "Supervisé, non supervisé, renforcement — et où les LLM se situent là-dedans.",
      minutes: 7,
      blocks: [
        {
          kind: "concept",
          title: "Trois façons d'apprendre",
          md: `1. **Apprentissage supervisé** : on montre des exemples étiquetés (entrée → bonne réponse). Ex. Electra : prédire la durée d'une session de charge à partir de l'historique (heure, station, modèle de véhicule → durée).
2. **Apprentissage non supervisé** : pas d'étiquettes, le modèle trouve des structures tout seul. Ex. Electra : regrouper les stations en clusters de comportement d'usage (pendulaire, autoroute, urbain).
3. **Apprentissage par renforcement** : un agent apprend par essai/erreur avec des récompenses. Ex. : optimiser dynamiquement la répartition de puissance entre bornes d'un hub.`,
        },
        {
          kind: "tip",
          title: "Et les LLM alors ?",
          md: `Les LLM combinent un **pré-entraînement auto-supervisé** (prédire le mot suivant sur des téraoctets de texte) + un **affinage avec feedback humain (RLHF)** pour les rendre utiles et sûrs. C'est pour ça qu'ils « parlent bien » ET suivent des consignes.`,
        },
        {
          kind: "sort",
          title: "Mini-jeu : trie les 9 cas d'usage Electra",
          instructions: "Range chaque cas d'usage dans le bon type d'apprentissage. Réfléchis : y a-t-il des exemples étiquetés ? Une récompense ? Ou juste des données brutes à structurer ?",
          categories: ["Supervisé", "Non supervisé", "Renforcement"],
          items: [
            { label: "Prédire la durée d'une session à partir de l'historique étiqueté", category: "Supervisé" },
            { label: "Classer les tickets Intercom en panne / facturation / roaming (exemples fournis)", category: "Supervisé" },
            { label: "Estimer le kWh consommé d'après le modèle de véhicule et la météo", category: "Supervisé" },
            { label: "Découvrir des groupes de stations au comportement similaire", category: "Non supervisé" },
            { label: "Détecter des sessions « anormales » sans définition préalable de l'anomalie", category: "Non supervisé" },
            { label: "Segmenter les clients CRM sans catégories prédéfinies", category: "Non supervisé" },
            { label: "Optimiser la répartition de puissance d'un hub par essai/erreur", category: "Renforcement" },
            { label: "Apprendre une politique de tarification dynamique qui maximise l'usage", category: "Renforcement" },
            { label: "Piloter la charge/décharge d'un stockage batterie selon le prix spot", category: "Renforcement" },
          ],
        },
      ],
    },
    {
      slug: "familles-modeles",
      title: "Panorama express des familles de modèles",
      summary: "LLM, image, audio, multimodal, ML classique : le bon outil pour le bon problème.",
      minutes: 5,
      blocks: [
        {
          kind: "flipcards",
          title: "La carte des familles",
          cards: [
            { front: "💬 LLM texte", back: "Claude, GPT, Gemini, Llama, Mistral. Conversation, rédaction, code, analyse. Ton couteau suisse quotidien." },
            { front: "🖼️ Modèles d'image", back: "Génération/édition d'images par diffusion. Utile marketing (visuels de campagne), mais vérifie les droits d'usage et la charte." },
            { front: "🎙️ Audio / voix", back: "Transcription (parole→texte, ex. compte-rendu auto d'une réunion terrain) et synthèse (texte→parole)." },
            { front: "👁️ Multimodaux", back: "Lisent texte + images + PDF. Claude lit tes captures de bornes en panne, tes plans de station, tes exports Pigment en screenshot." },
            { front: "📈 ML classique / spécialisé", back: "Prévision de séries temporelles, scoring, détection d'anomalies. Souvent PLUS adapté que les LLM pour du chiffre pur." },
          ],
        },
        {
          kind: "warning",
          title: "LLM ≠ solution universelle",
          md: `Prévoir la consommation énergétique d'un hub sur 12 mois = **ML classique** (série temporelle). Rédiger le rapport qui l'explique au comité = **LLM**. Le réflexe pro : se demander « est-ce un problème de langage ou un problème de chiffres ? » avant de choisir l'outil.`,
        },
        {
          kind: "quiz",
          questions: [
            {
              q: "L'équipe énergie veut prévoir la conso des hubs DACH heure par heure sur 6 mois. Le bon outil ?",
              options: [
                { label: "Un modèle de série temporelle (ML classique)", correct: true },
                { label: "Claude, en lui demandant très poliment" },
                { label: "Un modèle d'image" },
                { label: "Un tableur avec des couleurs" },
              ],
              explanation: "Prévision chiffrée récurrente = ML spécialisé. Claude interviendra ensuite pour expliquer et rédiger la synthèse.",
            },
          ],
        },
      ],
    },
    {
      slug: "famille-claude",
      title: "La famille Claude et comment choisir",
      summary: "Puissance vs vitesse vs coût : quel modèle pour quelle tâche Electra.",
      minutes: 5,
      blocks: [
        {
          kind: "concept",
          title: "Un arbitrage, pas un classement",
          md: `Anthropic propose plusieurs modèles avec un arbitrage **intelligence / vitesse / coût** (les gammes évoluent vite : la source de vérité est docs.claude.com).

Règle pratique Electra :
- **Chat quotidien** → le modèle par défaut de claude.ai fait très bien le travail.
- **Automatisation massive via API** (ex. classifier 10 000 tickets Intercom) → un modèle rapide et économique.
- **Agent complexe multi-étapes** (raisonnement long, code, orchestration) → le modèle le plus capable.`,
        },
        {
          kind: "quiz",
          title: "6 scénarios, 6 arbitrages",
          questions: [
            {
              q: "Classifier automatiquement 10 000 tickets Intercom par nuit via l'API.",
              options: [
                { label: "Modèle rapide/économique : tâche simple × gros volume", correct: true },
                { label: "Le modèle le plus puissant : c'est important" },
                { label: "Un modèle d'image" },
              ],
              explanation: "Une classification simple répétée 10 000 fois : c'est le coût par appel qui domine. Le modèle éco suffit largement.",
            },
            {
              q: "Analyser un contrat de raccordement réseau de 80 pages et en extraire les risques.",
              options: [
                { label: "Le modèle le plus capable : raisonnement long et enjeu élevé", correct: true },
                { label: "Le modèle le plus rapide : 80 pages c'est long" },
                { label: "N'importe lequel, c'est pareil" },
              ],
              explanation: "Enjeu fort + document complexe = on met la puissance. Le surcoût est dérisoire face au risque d'une mauvaise lecture.",
            },
            {
              q: "Rédiger 3 variantes d'un post LinkedIn pour l'ouverture d'un hub.",
              options: [
                { label: "Le modèle par défaut de claude.ai, en itérant", correct: true },
                { label: "Un batch API de nuit" },
                { label: "Un modèle de renforcement" },
              ],
              explanation: "Tâche créative interactive : le chat standard + 2-3 itérations est le chemin le plus court.",
            },
          ],
        },
      ],
    },
    {
      slug: "agent-ia",
      title: "Agent IA : la définition qui change tout",
      summary: "Chatbot vs agent : la boucle objectif → plan → action → observation.",
      minutes: 6,
      blocks: [
        {
          kind: "concept",
          title: "Un chatbot répond. Un agent agit.",
          md: `Un **agent** reçoit un objectif, **planifie**, **utilise des outils** (lire un fichier, appeler une API, chercher sur le web, écrire dans Notion), **observe le résultat**, et **itère** jusqu'à l'objectif.

La boucle : **Objectif → Plan → Action (outil) → Observation → Ajustement → Résultat.**

Chez Electra, Claude devient agent quand :
- il a accès à vos outils via **connecteurs et MCP** (Module 4) ;
- il travaille dans vos fichiers via **Cowork** (Module 6) ;
- il travaille dans votre code via **Claude Code** (Module 5).`,
        },
        {
          kind: "demo",
          title: "La boucle en action (exemple réel)",
          md: `Demande : « Prépare le brief de ma réunion de 14h. »
1. **Plan** : trouver l'événement → identifier les participants → chercher les derniers échanges → lister les docs liés.
2. **Action** : appel de l'outil calendrier → lecture de l'événement.
3. **Observation** : réunion « Hub Bordeaux — arbitrage puissance » avec 4 participants.
4. **Action** : recherche Gmail + Drive sur « Hub Bordeaux ».
5. **Synthèse** : brief structuré avec points ouverts et docs sources.

À chaque étape, l'agent décide de la suivante en fonction de ce qu'il vient d'observer. C'est ça, l'agentique.`,
        },
        {
          kind: "exercise",
          title: "🛠️ Repère la boucle",
          md: `Ouvre Claude et pose-lui la demande ci-dessous. Observe sa réponse : tu dois pouvoir reconnaître un **plan**, des **actions envisagées** et des **critères de fin**. C'est ta première dissection d'agent.`,
          prompt: "Tu es un agent IA chez Electra (recharge rapide pour VE). Objectif : préparer un comité déploiement sur l'ouverture d'une station à Annecy. Décris ton plan d'action étape par étape : quels outils tu utiliserais (agenda, mails, Notion, Sitetracker...), dans quel ordre, ce que tu observerais à chaque étape, et ton critère pour dire « c'est terminé ». Ne produis pas le brief : montre-moi seulement ta boucle d'agent.",
          checklist: [
            "J'ai lancé le prompt dans Claude",
            "J'ai identifié le PLAN dans sa réponse",
            "J'ai identifié au moins 2 OUTILS qu'il propose d'utiliser",
            "J'ai identifié son critère de FIN (quand s'arrête-t-il ?)",
          ],
        },
      ],
    },
  ],
  checkpoint: {
    title: "Checkpoint — Décodeur",
    md: `Le quiz final valide les fondamentaux : **80 % requis** pour débloquer le badge. Prends 3 minutes, sans tricher — c'est pour toi.`,
    checklist: [
      "J'ai lu les 5 leçons du module",
      "J'ai fait le jeu de tri des types d'apprentissage",
      "J'ai disséqué une boucle d'agent dans Claude (exercice 0.5)",
    ],
    quiz: [
      {
        q: "Que fait fondamentalement un LLM ?",
        options: [
          { label: "Il prédit la suite la plus probable d'une séquence de texte", correct: true },
          { label: "Il cherche la réponse dans une base de données de faits" },
          { label: "Il exécute un raisonnement logique formel garanti exact" },
        ],
        explanation: "Prédiction statistique de la suite — d'où sa puissance ET ses hallucinations.",
      },
      {
        q: "Qu'est-ce que la fenêtre de contexte ?",
        options: [
          { label: "La mémoire de travail de la conversation : hors contexte = invisible", correct: true },
          { label: "La vitesse maximale du modèle" },
          { label: "L'historique complet de tous tes chats, pour toujours" },
        ],
        explanation: "Tout ce que le modèle « voit » tient dans cette fenêtre. La gérer, c'est le Module 3.",
      },
      {
        q: "Une hallucination, c'est…",
        options: [
          { label: "Une réponse plausible mais fausse — une propriété du système, pas un bug rare", correct: true },
          { label: "Un bug corrigé depuis 2024" },
          { label: "Un problème d'écran" },
        ],
        explanation: "D'où le réflexe : vérifier chiffres, noms, dates, références avant réutilisation.",
      },
      {
        q: "Regrouper les stations par comportement d'usage sans catégories prédéfinies, c'est…",
        options: [
          { label: "De l'apprentissage non supervisé", correct: true },
          { label: "De l'apprentissage supervisé" },
          { label: "Du renforcement" },
        ],
        explanation: "Pas d'étiquettes → le modèle découvre la structure : non supervisé.",
      },
      {
        q: "Prévoir la consommation électrique d'un hub sur 12 mois : le bon outil ?",
        options: [
          { label: "Un modèle ML de série temporelle (et Claude pour rédiger l'explication)", correct: true },
          { label: "Un LLM seul, c'est un problème de langage" },
          { label: "Un modèle d'image" },
        ],
        explanation: "Problème de chiffres = ML spécialisé. Problème de langage = LLM. Les deux se complètent.",
      },
      {
        q: "Ce qui distingue un agent d'un chatbot ? (plusieurs réponses)",
        multi: true,
        options: [
          { label: "Il utilise des outils pour agir", correct: true },
          { label: "Il observe les résultats et ajuste son plan", correct: true },
          { label: "Il répond plus poliment" },
          { label: "Il n'a pas besoin d'objectif" },
        ],
        explanation: "La boucle plan → action → observation → ajustement, outillée : c'est ça un agent.",
      },
    ],
  },
};
