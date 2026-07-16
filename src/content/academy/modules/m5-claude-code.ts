import type { AcademyModule } from "@/lib/academy/types";

/* ============================================================================
 * MODULE 5 — Claude Code : la vraie puissance. Un agent dans ton système de
 * fichiers : il lit, planifie, code, teste et itère. Leçons 5.1–5.2 pour
 * tous ; 5.3–5.4 pour les builders.
 * ========================================================================== */

export const m5ClaudeCode: AcademyModule = {
  slug: "claude-code",
  code: "M5",
  title: "Claude Code : la vraie puissance",
  tagline: "Un agent dans ton terminal qui lit ton projet, planifie, modifie, teste et itère — tu délègues, il livre.",
  icon: "⌨️",
  badge: "Code Commandant",
  audience: "Builders (5.1–5.2 pour tous)",
  lessons: [
    {
      slug: "cest-quoi-claude-code",
      title: "C'est quoi — et pourquoi c'est plus grand que le code",
      summary: "Pas un autocomplete : un agent complet dans ton système de fichiers. Installation en 2 commandes, session type déroulée pas à pas.",
      minutes: 8,
      blocks: [
        {
          kind: "concept",
          title: "Un agent, pas une saisie semi-automatique",
          md: `**Claude Code** est l'agent d'Anthropic disponible en **ligne de commande** (terminal), sur **desktop** et sur **mobile**. Le principe : tu **délègues** une tâche, et il **lit ton projet, planifie, modifie des fichiers, lance des commandes, teste et itère** jusqu'au résultat.

La différence avec un autocomplete de code est la même qu'entre un GPS qui suggère le prochain virage et un collègue à qui tu dis « emmène le van de maintenance au hub de Grenoble » : Claude Code prend **la tâche entière**, pas la prochaine ligne.

Et « code » est presque trompeur. Dans ton système de fichiers, il sait :
- **refactorer un module** ou migrer une lib dans un vrai projet ;
- **écrire les tests** qui manquent depuis 6 mois ;
- **analyser un repo inconnu** et t'expliquer son architecture (« comment marche le service de pricing des sessions ? ») ;
- **générer un script d'analyse de données** (parser un export CSV de sessions de charge et sortir les stats d'uptime par borne) ;
- **automatiser des tâches sur fichiers** : renommer 200 photos de visites de sites, consolider 12 exports Pigment, nettoyer un dossier de CR.

Tu n'es pas dev et le terminal te fait fuir ? La même architecture agentique existe **sans terminal** : c'est **Cowork**, ton Module 6.`,
        },
        {
          kind: "code",
          title: "Installation : 2 commandes, 30 secondes",
          lang: "bash",
          code: `# 1. Installer (une seule fois)
npm install -g @anthropic-ai/claude-code

# 2. Se placer dans un projet et lancer l'agent
cd mon-projet
claude

# Docs complètes : docs.claude.com/en/docs/claude-code/overview`,
        },
        {
          kind: "demo",
          title: "Une session type, déroulée pas à pas",
          md: `Tâche : « Ajoute la gestion du statut \`maintenance\` des bornes dans l'API stations, avec les tests. »

1. **Plan** : Claude Code annonce son plan — repérer le modèle de données, le endpoint concerné, les tests existants. Tu valides.
2. **Lecture** : il ouvre \`models/station.py\`, \`api/stations.py\`, \`tests/test_stations.py\`. Il constate qu'un enum \`StationStatus\` existe déjà.
3. **Diff proposé** : il te montre les modifications fichier par fichier — ajout de la valeur \`MAINTENANCE\`, règle métier (une borne en maintenance n'accepte pas de session), migration éventuelle. **Tu relis avant d'accepter.**
4. **Tests** : il lance \`pytest\` lui-même. 2 tests cassent → il lit l'erreur, corrige, relance. Vert.
5. **Commit** : il propose un message de commit propre et attend ton feu vert.

À chaque étape tu peux interrompre, rediriger, refuser. Tu restes le commandant — d'où le badge.`,
        },
        {
          kind: "quiz",
          title: "As-tu saisi la nature de la bête ?",
          questions: [
            {
              q: "Ce qui distingue fondamentalement Claude Code d'un autocomplete de code ?",
              options: [
                { label: "Il prend une tâche entière : il lit le projet, planifie, modifie, exécute des commandes, teste et itère", correct: true },
                { label: "Il complète les lignes plus vite" },
                { label: "Il a plus de couleurs dans le terminal" },
                { label: "Rien, c'est marketing" },
              ],
              explanation: "Autocomplete = suggérer la ligne suivante. Claude Code = boucle d'agent complète dans ton système de fichiers.",
            },
            {
              q: "L'équipe data reçoit chaque lundi un export CSV des sessions de charge à nettoyer et agréger. Claude Code peut-il aider ?",
              options: [
                { label: "Oui : lui faire écrire (et tester) un script réutilisable qui fait le nettoyage et l'agrégation", correct: true },
                { label: "Non, Claude Code ne fait que des sites web" },
                { label: "Non, les CSV ne sont pas du code" },
                { label: "Oui, mais uniquement le lundi" },
              ],
              explanation: "« Plus grand que le code » : générer un outil d'analyse de données est un cas d'usage parfait — la tâche devient un script versionné.",
            },
            {
              q: "Tu n'es pas développeur et tu veux cette puissance sans terminal. Ta porte d'entrée ?",
              options: [
                { label: "Claude Cowork (Module 6) : même architecture agentique, interface sans terminal", correct: true },
                { label: "Apprendre le C++ d'abord" },
                { label: "Demander à un dev de te prêter son terminal" },
                { label: "Ça n'existe pas" },
              ],
              explanation: "Cowork = l'agentique de Claude Code pour tous. Les leçons 5.1 et 5.2 te préparent exactement à ça.",
            },
          ],
        },
      ],
    },
    {
      slug: "claude-md",
      title: "CLAUDE.md, le fichier qui change tout",
      summary: "Le contexte permanent de ton projet : stack, conventions, commandes, interdits. Écris-le une fois, gagne à chaque session.",
      minutes: 8,
      blocks: [
        {
          kind: "concept",
          title: "La mémoire longue durée du projet",
          md: `À chaque nouvelle session, Claude Code repart de zéro… sauf s'il trouve un **CLAUDE.md à la racine du projet** : il le lit **automatiquement à chaque session**. C'est LE levier au meilleur ratio effort/impact.

Ce qu'on y met :
- **La stack** : langages, frameworks, versions.
- **Les conventions** : style de code, nommage, format de commits.
- **Les commandes** : comment builder, tester, linter — pour qu'il vérifie lui-même son travail.
- **Les interdits** : ce qu'il ne doit jamais toucher sans demander.

Bonus : les CLAUDE.md peuvent être **imbriqués**. Un CLAUDE.md racine pour le repo, un autre dans \`billing/\` avec les règles spécifiques de la facturation des sessions. Claude lit celui du dossier où il travaille.

Pense-y comme au **dossier technique d'une station** : le technicien qui arrive en intervention ne redécouvre pas le site, il lit la fiche et travaille selon les règles du lieu.`,
        },
        {
          kind: "code",
          title: "Template Electra copiable",
          lang: "markdown",
          code: `# CLAUDE.md

## Stack
- Python 3.12, FastAPI, PostgreSQL 16
- Gestion des dépendances : uv

## Commandes
- Tests : pytest (lancer avant tout commit)
- Lint/format : ruff check . && ruff format .
- Lancer en local : make dev

## Conventions
- Commits conventionnels : feat:, fix:, chore:, docs:
- Documentation et commentaires en francais ; code en anglais
  (variables, fonctions, noms de fichiers)
- Une fonction = une responsabilite ; typage explicite partout

## Interdits
- Ne JAMAIS modifier les migrations (dossier migrations/) sans demander
- Pas de secrets en clair : utiliser les variables d'environnement (.env
  est gitignore et doit le rester)
- Ne pas toucher aux integrations paiement sans validation humaine

## Contexte metier
- Ce service gere les sessions de charge : demarrage, suivi kWh, arret
- "station" = site physique ; "borne" = point de charge ; une station
  a 4 a 16 bornes`,
        },
        {
          kind: "tip",
          title: "Le test du nouveau collègue",
          md: `Un bon CLAUDE.md répond à la question : « qu'est-ce que je dirais à un nouveau dev le premier jour pour qu'il ne casse rien ? ». S'il manque une règle et que Claude fait une bêtise, ne t'énerve pas : **ajoute la règle au CLAUDE.md**. Le fichier s'améliore bêtise après bêtise — comme une base de connaissance d'incidents.`,
        },
        {
          kind: "exercise",
          title: "🛠️ Rédige le CLAUDE.md d'un vrai projet",
          md: `Choisis un projet réel sur lequel tu travailles (repo de code, mais aussi dossier de scripts data, projet n8n…). Pas de projet sous la main ? Utilise le projet fictif du prompt : \`ev-uptime-reporter\`, un outil interne qui calcule l'uptime des bornes à partir des logs de supervision. Fais rédiger un premier jet par Claude, puis **corrige-le toi-même** : c'est TOI qui connais les interdits.`,
          prompt: `Aide-moi à rédiger le CLAUDE.md d'un projet. Contexte : le projet s'appelle ev-uptime-reporter, un outil interne Electra qui lit les logs de supervision des bornes (exports Datadog en JSON), calcule l'uptime par borne et par station, et génère un rapport hebdomadaire Markdown pour l'équipe ops. Stack : Python 3.12, pandas, pytest, ruff. Le rapport est envoyé sur Slack par un job n8n — le script ne doit JAMAIS poster sur Slack lui-même. Les seuils d'alerte (uptime < 97 %) sont dans config/thresholds.yaml et ne doivent pas être modifiés sans validation de l'équipe ops.
Structure attendue : ## Stack, ## Commandes, ## Conventions, ## Interdits, ## Contexte métier. Sois concis : un CLAUDE.md se lit en 1 minute.`,
          checklist: [
            "Mon CLAUDE.md contient les commandes de test et de lint (Claude peut s'auto-vérifier)",
            "Il contient au moins 2 interdits explicites (« ne jamais... sans demander »)",
            "Il contient le vocabulaire métier essentiel (station vs borne, kWh, uptime…)",
            "Il se lit en moins d'une minute — j'ai coupé le superflu",
            "Je l'ai relu et corrigé moi-même : il reflète MES règles, pas celles inventées par Claude",
          ],
        },
      ],
    },
    {
      slug: "explore-plan-code-verify",
      title: "Le workflow gagnant : Explore → Plan → Code → Verify",
      summary: "La méthode en 4 temps qui sépare les sessions magiques des sessions cauchemar. Avec le jeu de tri bonnes pratiques vs anti-patterns.",
      minutes: 8,
      blocks: [
        {
          kind: "concept",
          title: "Les 4 temps",
          md: `Le réflexe débutant : balancer « code-moi la feature » et prier. Le réflexe pro : dérouler 4 phases distinctes.

1. **Explore** — « Lis \`api/sessions.py\` et \`models/station.py\`, explique-moi comment le statut d'une borne est géré. **Ne code rien encore.** » Claude construit sa carte du terrain.
2. **Plan** — Exige un plan et **valide-le avant toute modification** (Claude Code a un mode plan dédié). Un plan bancal coûte 30 secondes à corriger ; un code bancal, 30 minutes.
3. **Code** — Par **petites étapes vérifiables**. « Étape 1 : ajoute l'enum. Montre-moi. » Puis étape 2. Tu corriges tôt, quand c'est encore pas cher.
4. **Verify** — Tests, lint, et surtout **relecture des diffs**. C'est lui qui tape, c'est toi qui signes.

C'est le protocole de mise en service d'une borne : inspection du site, plan d'intervention validé, travaux par étapes, tests de charge avant ouverture au public. Personne n'ouvre une station sans la phase de tests.`,
        },
        {
          kind: "tip",
          title: "Les 4 leviers qui démultiplient",
          md: `- **Critères de « fini » vérifiables** : « fini = \`pytest\` vert + \`ruff\` sans erreur + le endpoint renvoie 409 si la borne est en maintenance ». L'agent sait viser, et toi vérifier.
- **Corriger tôt** : une dérive à l'étape 1 se rattrape en une phrase. À l'étape 9, tu jettes tout.
- **/clear entre deux tâches sans rapport** : un contexte pollué par la tâche précédente produit des réponses confuses. Nouvelle mission = contexte propre.
- **Git comme filet de sécurité** : commit avant de lancer une grosse tâche. Au pire, \`git checkout .\` et on recommence — zéro stress.`,
        },
        {
          kind: "warning",
          title: "Les 3 anti-patterns qui coûtent cher",
          md: `- **Accepter des diffs sans les lire.** C'est signer un procès-verbal de réception sans visiter la station. Le jour où ça casse en prod, c'est ta signature.
- **Laisser tourner sans objectif clair.** Un agent sans critère de fin optimise à l'aveugle et « améliore » des choses que personne n'a demandées.
- **Le méga-prompt fourre-tout.** « Refactore le module, ajoute la feature, corrige les tests et mets à jour la doc » = 4 tâches emmêlées, aucune bien faite. Découpe.`,
        },
        {
          kind: "sort",
          title: "Mini-jeu : bonne pratique ou anti-pattern ?",
          instructions: "Range chaque comportement dans la bonne colonne. Indice : demande-toi si le comportement te laisse le contrôle et un moyen de vérifier.",
          categories: ["Bonne pratique ✅", "Anti-pattern ❌"],
          items: [
            { label: "« Lis d'abord ces 3 fichiers et explique-moi le flux, ne code rien »", category: "Bonne pratique ✅" },
            { label: "Exiger un plan et le valider avant la première modification", category: "Bonne pratique ✅" },
            { label: "Définir « fini » comme : pytest vert + ruff propre + cas maintenance couvert", category: "Bonne pratique ✅" },
            { label: "Commiter avant de lancer un gros refactoring", category: "Bonne pratique ✅" },
            { label: "/clear avant de passer du bug de facturation au script d'analyse d'uptime", category: "Bonne pratique ✅" },
            { label: "Accepter tous les diffs d'un coup pour « gagner du temps »", category: "Anti-pattern ❌" },
            { label: "« Refactore tout, ajoute la feature, corrige les tests et la doc » en un seul prompt", category: "Anti-pattern ❌" },
            { label: "Laisser l'agent tourner 20 minutes sans critère de fin défini", category: "Anti-pattern ❌" },
            { label: "Enchaîner 5 tâches sans rapport dans la même session, sans /clear", category: "Anti-pattern ❌" },
            { label: "Sauter les tests parce que « le diff avait l'air propre »", category: "Anti-pattern ❌" },
          ],
        },
      ],
    },
    {
      slug: "skills-commands-hooks-agents",
      title: "Skills, slash commands, hooks et sous-agents",
      summary: "L'outillage avancé : du savoir-faire réutilisable, des raccourcis d'équipe, des scripts automatiques et du travail en parallèle.",
      minutes: 9,
      blocks: [
        {
          kind: "flipcards",
          title: "L'atelier du builder (clique pour retourner)",
          cards: [
            {
              front: "📚 Skills",
              back: "Des dossiers de savoir-faire (un SKILL.md + ressources) que Claude charge quand c'est pertinent. Ex. : un skill « rapport hebdo ops Electra » qui contient le format exact du rapport, les seuils d'uptime et les requêtes types. Écris le savoir-faire une fois, il s'applique à chaque fois.",
            },
            {
              front: "⚡ Slash commands",
              back: "Des commandes personnalisées : un fichier Markdown = une commande. Ex. : /revue-ticket qui prend un ID Linear et déroule votre check-list de revue. Partagées via le repo → toute l'équipe a les mêmes réflexes.",
            },
            {
              front: "🪝 Hooks",
              back: "Des scripts qui se déclenchent automatiquement sur des événements. Ex. : lancer ruff après chaque édition de fichier — l'agent est corrigé instantanément, sans que tu le demandes. La qualité devient mécanique, pas volontaire.",
            },
            {
              front: "🤖 Sous-agents",
              back: "Claude Code peut lancer des agents parallèles : l'un explore les logs Datadog de l'incident pendant qu'un autre écrit le correctif. Chacun a son propre contexte — le tien reste propre.",
            },
            {
              front: "🔌 MCP dans Claude Code",
              back: "Les connecteurs du Module 4 se branchent aussi ici : Linear, Notion, n8n… L'agent CODE et AGIT : il corrige le bug, met à jour le ticket Linear, et documente dans Notion. La boucle complète, sans quitter le terminal.",
            },
          ],
        },
        {
          kind: "demo",
          title: "Scénario combiné : l'incident de A à Z",
          md: `Ticket Linear : « Le calcul de kWh facturés diverge sur les sessions interrompues ».

1. Tu lances \`/fix-ticket ELE-482\` — ta slash command d'équipe qui récupère le ticket via le **MCP Linear** et cadre la session.
2. Un **sous-agent** explore les logs et les fichiers de facturation pendant que l'agent principal lit les tests existants.
3. Le **skill** « conventions facturation Electra » se charge : règles d'arrondi des kWh, cas des sessions interrompues.
4. Diff proposé → tu relis → tests verts (le **hook** a linté chaque édition au passage).
5. L'agent met à jour le ticket Linear avec le résumé du correctif et attend ta validation pour commiter.

Chaque brique est simple. Ensemble, c'est une chaîne de production.`,
        },
        {
          kind: "exercise",
          title: "🛠️ Exercice Builder : ta première slash command + un MCP",
          md: `Deux missions. **(1)** Crée une slash command d'équipe utile à ton contexte réel — par exemple \`/cr-incident\` qui génère un compte-rendu d'incident au format ops Electra (impact sessions/kWh, chronologie, cause racine, actions). **(2)** Branche un serveur MCP dans Claude Code (Linear ou Notion sont les plus simples) et fais-lui lire une vraie donnée. Fais-toi guider par Claude Code lui-même.`,
          prompt: `Dans ce projet, aide-moi à faire deux choses :
1. Créer une slash command personnalisée /cr-incident : elle doit prendre en argument une courte description d'incident et générer un compte-rendu structuré au format Electra ops (sections : Impact sur les sessions de charge et kWh non délivrés, Chronologie, Cause racine, Actions correctives, Leçons). Crée le fichier de commande au bon endroit et explique-moi sa structure ligne par ligne.
2. M'expliquer pas à pas comment brancher le serveur MCP Linear à Claude Code, puis vérifier la connexion en listant mes tickets ouverts.
Vas-y étape par étape et attends ma validation entre les deux missions.`,
          checklist: [
            "Ma slash command existe, je l'ai exécutée et le format de sortie est le bon",
            "J'ai compris où vit le fichier de commande et comment le partager à l'équipe via le repo",
            "Un serveur MCP est branché dans Claude Code et j'ai lu une vraie donnée à travers lui",
            "J'ai identifié un skill ou un hook qui serait utile à mon équipe (même sans l'implémenter)",
          ],
        },
      ],
    },
  ],
  checkpoint: {
    title: "Checkpoint — Code Commandant",
    md: `Le badge se gagne sur le terrain : **une vraie tâche complétée avec le workflow Explore → Plan → Code → Verify**, plan archivé à l'appui (copie du plan validé dans tes notes, Notion ou le ticket Linear). Petite tâche acceptée — un script d'analyse de sessions suffit — du moment que les 4 phases sont distinctes et que tu as relu chaque diff. Puis valide le quiz.`,
    checklist: [
      "J'ai complété une vraie tâche avec les 4 phases Explore → Plan → Code → Verify distinctes",
      "J'ai archivé le plan validé (Notion, Linear ou notes d'équipe)",
      "Mon projet a un CLAUDE.md avec commandes, conventions et interdits",
      "J'ai relu chaque diff avant de l'accepter et les tests passaient à la fin",
    ],
    quiz: [
      {
        q: "Première instruction d'une session bien menée sur un projet inconnu ?",
        options: [
          { label: "« Lis ces fichiers et explique-moi le fonctionnement — ne code rien encore »", correct: true },
          { label: "« Code-moi la feature, on verra bien »" },
          { label: "« Supprime ce qui te semble inutile »" },
        ],
        explanation: "Explore d'abord : l'agent construit sa carte du terrain avant de toucher quoi que ce soit.",
      },
      {
        q: "À quoi sert le CLAUDE.md à la racine du projet ?",
        options: [
          { label: "Contexte permanent lu à chaque session : stack, commandes, conventions, interdits", correct: true },
          { label: "C'est le journal des conversations passées" },
          { label: "C'est un fichier décoratif exigé par npm" },
        ],
        explanation: "Écrit une fois, lu à chaque session — le meilleur ratio effort/impact de tout le module.",
      },
      {
        q: "Claude Code propose un gros diff. Le réflexe Code Commandant ?",
        options: [
          { label: "Le relire avant d'accepter — c'est lui qui tape, c'est moi qui signe", correct: true },
          { label: "Accepter : les tests diront bien si ça casse" },
          { label: "Accepter si le diff est long, refuser s'il est court" },
        ],
        explanation: "Accepter sans lire est l'anti-pattern n°1. La relecture des diffs fait partie de Verify.",
      },
      {
        q: "Tu enchaînes sur une tâche sans aucun rapport avec la précédente. Tu fais quoi ?",
        options: [
          { label: "/clear pour repartir sur un contexte propre", correct: true },
          { label: "Rien, plus de contexte = toujours mieux" },
          { label: "Fermer le terminal et changer d'ordinateur" },
        ],
        explanation: "Un contexte pollué par l'ancienne tâche produit des réponses confuses. Nouvelle mission, contexte neuf.",
      },
      {
        q: "Un hook, c'est…",
        options: [
          { label: "Un script déclenché automatiquement sur un événement (ex. lint après chaque édition)", correct: true },
          { label: "Un raccourci clavier" },
          { label: "Un sous-agent qui explore les logs" },
        ],
        explanation: "Le hook rend la vérification mécanique : elle a lieu même quand personne n'y pense.",
      },
    ],
  },
};
