import type { AcademyModule } from "@/lib/academy/types";

/* ============================================================================
 * MODULE 1 — Claude : prise en main complète.
 * Interface, artéfacts, projets, styles, recherche web : le socle de tout.
 * ========================================================================== */

export const m1PriseEnMain: AcademyModule = {
  slug: "prise-en-main",
  code: "M1",
  title: "Claude : prise en main complète",
  tagline: "Interface, artéfacts, projets, styles : tout ce qu'il faut pour être opérationnel dès aujourd'hui.",
  icon: "🔌",
  badge: "Branché",
  audience: "Tous",
  lessons: [
    {
      slug: "tour-du-proprietaire",
      title: "Le tour du propriétaire",
      summary: "claude.ai sur web, desktop et mobile : la zone de chat, les modèles, les pièces jointes — et la révélation que Claude VOIT tes captures d'écran.",
      minutes: 7,
      blocks: [
        {
          kind: "concept",
          title: "Trois portes d'entrée, un même Claude",
          md: `Claude est disponible partout où tu travailles :
- **Web** : claude.ai dans ton navigateur — l'usage quotidien au bureau.
- **Desktop** : l'app Mac/Windows, avec un raccourci clavier global pour l'invoquer sans changer de fenêtre. C'est aussi elle qui héberge le mode **Cowork** (Claude travaille directement dans tes fichiers — Module 6).
- **Mobile** : l'app iOS/Android. En visite de station, tu photographies l'écran d'une borne en défaut et tu demandes un diagnostic — depuis le parking.

Ton compte synchronise tout : une conversation commencée sur mobile se poursuit sur desktop.`,
        },
        {
          kind: "flipcards",
          title: "Les 4 zones de l'interface (clique pour retourner)",
          cards: [
            {
              front: "💬 La zone de chat",
              back: "Là où tout se passe. Shift+Entrée pour un saut de ligne sans envoyer. Tu peux éditer un message déjà envoyé pour relancer la génération à partir de là — pratique pour corriger un prompt sans repartir de zéro.",
            },
            {
              front: "🎛️ Le sélecteur de modèle",
              back: "En haut de la conversation. Le modèle par défaut couvre 95 % des usages Electra. Pour un contrat de raccordement de 80 pages ou un raisonnement complexe, bascule sur le modèle le plus capable (revois M0 pour l'arbitrage).",
            },
            {
              front: "📎 Les pièces jointes",
              back: "PDF, images, tableurs, exports CSV… Claude LIT les captures d'écran : un screenshot d'un dashboard Omni, d'un board Linear ou de l'écran d'une borne est une donnée exploitable, pas juste une image.",
            },
            {
              front: "🌐 La recherche web + modes",
              back: "Claude peut chercher sur le web en direct quand l'info est récente ou volatile (leçon 1.5). Et à côté du chat classique, le mode Cowork lui permet d'agir dans tes fichiers — on y revient au Module 6.",
            },
          ],
        },
        {
          kind: "tip",
          title: "Le déclic n°1 : Claude voit",
          md: `La fonctionnalité la plus sous-utilisée chez Electra : **les images**. Écran d'erreur d'une borne, plan d'implantation d'un hub, screenshot d'un graphe Datadog, photo d'un panneau de chantier, export Pigment en capture… Si tes yeux peuvent le lire, Claude aussi. Arrête de recopier à la main ce qui est déjà à l'écran.`,
        },
        {
          kind: "exercise",
          title: "🛠️ Fais-lui ouvrir les yeux",
          md: `Prends une capture d'écran de ton travail du moment : écran d'une borne, dashboard Omni, board Linear, thread Slack, plan de station… n'importe quoi de visuel. Uploade-la dans Claude avec le prompt ci-dessous. Objectif : réaliser que Claude **voit** — et mesurer ce que ça change pour ton quotidien.`,
          prompt: "Voici une capture d'écran liée à mon travail chez Electra (recharge ultra-rapide pour véhicules électriques). Décris précisément ce que tu vois, puis liste toutes les informations exploitables que tu en extrais : chiffres, statuts, anomalies, noms, dates. Termine par 2 questions que tu me poserais pour aller plus loin.",
          checklist: [
            "J'ai uploadé une vraie capture d'écran de mon travail",
            "Claude a correctement décrit ce qu'elle contient",
            "Il a extrait au moins 3 informations exploitables",
            "J'ai répondu à une de ses questions pour prolonger l'analyse",
          ],
        },
      ],
    },
    {
      slug: "artefacts",
      title: "Les Artéfacts : ton atelier de production",
      summary: "Documents, tableaux, code, pages web interactives : Claude crée dans un panneau dédié, et tu itères dessus sans tout regénérer.",
      minutes: 8,
      blocks: [
        {
          kind: "concept",
          title: "Un panneau à part pour le contenu qui compte",
          md: `Quand tu demandes à Claude un contenu **autonome et substantiel** — un document, un tableau, du code, une page web interactive, un diagramme, une présentation — il le crée dans un **artéfact** : un panneau dédié à côté de la conversation.

Pourquoi c'est puissant :
- **On itère dessus** : « passe le tableau en vue par région », « raccourcis la section 2 » — Claude modifie l'artéfact au lieu de tout réécrire dans le chat.
- **C'est propre** : le contenu est séparé de la discussion, prêt à copier ou télécharger.
- **C'est publiable** : un artéfact peut être partagé par lien — une page interactive de calcul de coût par session, par exemple, utilisable par toute l'équipe.`,
        },
        {
          kind: "exercise",
          title: "🛠️ Ton premier artéfact : le one-pager de station",
          md: `Lance le prompt ci-dessous (choisis une vraie ville candidate si tu en as une en tête). Puis fais **2 itérations** sans jamais redemander de zéro :
1. « Ajoute une section Accès et à proximité avec 3 points. »
2. « Passe le style en fond sombre, garde-le sobre. »

Observe : Claude modifie l'artéfact existant, la conversation reste lisible.`,
          prompt: "Crée un one-pager HTML de présentation d'une nouvelle station Electra à Annecy. Trois sections : Emplacement (zone commerciale, accès depuis l'A41), Puissance (8 points de charge, jusqu'à 300 kW, alimentation garantie d'origine renouvelable), Services (paiement CB sans app, auvent, commerces à proximité). Style sobre et moderne, couleurs Electra (noir, blanc, touche de vert électrique). Pas de framework externe.",
          checklist: [
            "L'artéfact s'est ouvert dans le panneau dédié",
            "J'ai fait mes 2 itérations en langage naturel",
            "Claude a modifié l'artéfact SANS tout regénérer dans le chat",
            "J'ai prévisualisé le rendu HTML final",
          ],
        },
        {
          kind: "warning",
          title: "Le piège : redemander de zéro",
          md: `Le réflexe débutant : la v1 ne convient pas, alors on ouvre un nouveau chat et on reformule tout. **Erreur.** Tu perds le contexte accumulé et tu repars de plus loin.

Le réflexe pro : **itérer sur l'artéfact existant**. « Garde tout, mais… », « Uniquement la section Services : … », « Reviens à la version précédente et change juste le titre ». C'est plus rapide, plus précis, et Claude comprend mieux ce que tu veux puisqu'il voit ce qui ne t'a pas plu.`,
        },
        {
          kind: "tip",
          title: "Les verbes de l'itération",
          md: `Garde ces formulations sous la main :
- « **Passe** le tableau en vue par région »
- « **Raccourcis** la section 2 de moitié »
- « **Remplace** le jargon par des mots simples, cible : élus locaux »
- « **Ajoute** une colonne coût au kWh »
- « **Ne touche à rien d'autre** que le titre »

La dernière est précieuse : elle évite les modifications collatérales non demandées.`,
        },
      ],
    },
    {
      slug: "projets",
      title: "Les Projets : Claude devient un collègue",
      summary: "Instructions permanentes + base de connaissances + conversations regroupées : LA fonctionnalité qui change tout.",
      minutes: 9,
      blocks: [
        {
          kind: "concept",
          title: "Trois briques, un collègue",
          md: `Un **Projet** dans claude.ai, c'est un espace de travail persistant avec :
1. **Des instructions personnalisées** : un brief permanent que Claude relit à chaque conversation du projet. Ton rôle, ton équipe, tes conventions, ton format préféré — écrit une fois, appliqué toujours.
2. **Une base de connaissances** : des fichiers uploadés une fois pour toutes — process internes, templates, glossaire Electra, exemples de livrables. Claude s'y réfère automatiquement.
3. **Un historique regroupé** : toutes les conversations liées au sujet, au même endroit.

Sans projet, tu réexpliques ton contexte à chaque chat. Avec un projet, Claude **connaît déjà ton métier** quand tu dis bonjour. C'est la différence entre un stagiaire qui arrive chaque matin amnésique et un collègue qui a lu le wiki.`,
        },
        {
          kind: "demo",
          title: "Démo : le projet « Déploiement Station »",
          md: `Voici comment le pôle déploiement monte son projet en 10 minutes :

1. **Créer le projet** « Déploiement Station » depuis la barre latérale de claude.ai.
2. **Uploader la base de connaissances** :
- \`template-CR-visite-fonciere.md\` — le template officiel de compte-rendu de visite
- \`checklist-permis-IRVE.md\` — les étapes permis + délais moyens par type de dossier
- \`glossaire-deploiement.md\` — foncier, grid connection, DP, AOT, les acronymes maison
3. **Écrire les instructions** : « Tu es l'assistant du pôle déploiement Electra (stations de recharge ultra-rapide). Tu connais le cycle : prospection foncière → signature bail → permis → raccordement (grid connection) → travaux → ouverture. Réponses en français, concises, orientées action. Pour tout CR de visite, utilise le template fourni. Signale explicitement quand une info te manque au lieu d'inventer. »
4. **Tester** : « Rédige le CR de ma visite du site de Chambéry, voici mes notes vocales transcrites… » → Claude sort un CR **au bon format, avec le bon vocabulaire**, du premier coup.

Chaque nouvelle conversation du projet démarre avec tout ce bagage. Zéro réexplication.`,
        },
        {
          kind: "exercise",
          title: "🛠️ Crée LE projet de ton métier",
          md: `C'est l'exercice le plus rentable de tout le module — et il compte pour le checkpoint.

1. Crée un projet nommé d'après ton pôle : « Ops Supervision », « Énergie », « Finance », « CRM Campagnes », « Support N2 »…
2. Uploade **au moins 1 fichier** utile : un template de livrable, un process Notion exporté, un glossaire, un exemple de rapport réussi.
3. Rédige les instructions avec l'aide de Claude lui-même : colle le prompt ci-dessous dans un chat classique, puis copie le résultat dans les instructions du projet.
4. Teste avec une vraie tâche de ta semaine.`,
          prompt: "Aide-moi à rédiger les instructions personnalisées d'un projet Claude pour mon métier chez Electra (opérateur français de recharge ultra-rapide pour véhicules électriques). Mon pôle : [déploiement / ops-supervision / énergie / finance / marketing-CRM / support / produit-tech / data]. Mes tâches récurrentes : [liste 3-4 tâches]. Mes outils : [Slack, Notion, Linear, HubSpot, Omni…]. Pose-moi d'abord 3 questions pour préciser, puis propose des instructions en moins de 150 mots : rôle de Claude, ton, format de réponse attendu, et ce qu'il doit faire quand une information lui manque.",
          checklist: [
            "Mon projet métier existe dans claude.ai",
            "Il contient au moins 1 fichier de connaissances",
            "Les instructions décrivent mon rôle, mes conventions et le comportement attendu",
            "J'ai testé sur une vraie tâche et la réponse utilise mon contexte",
          ],
        },
        {
          kind: "tip",
          title: "Un projet par périmètre, pas un projet fourre-tout",
          md: `« Mon projet Electra » avec 40 fichiers de 6 pôles différents, c'est un tiroir en vrac : Claude s'y perd autant que toi. Vise **un projet = un périmètre cohérent** : « Permis et foncier », « Reporting finance mensuel », « Campagnes Customer.io ». Tu peux en créer autant que tu veux — et le Module 3 t'apprendra à les architecturer proprement.`,
        },
      ],
    },
    {
      slug: "styles-preferences-memoire",
      title: "Styles, préférences et mémoire",
      summary: "Régler Claude une fois pour toutes : tes préférences globales, des styles réutilisables, et la mémoire optionnelle.",
      minutes: 6,
      blocks: [
        {
          kind: "concept",
          title: "Trois niveaux de réglage",
          md: `- **Les préférences utilisateur** (dans les paramètres de ton compte) : elles s'appliquent à TOUTES tes conversations. Langue, ton général, format préféré. Ex. : « Réponds en français. Va droit au but. Bullet points par défaut pour les listes. »
- **Les Styles** : des profils d'écriture réutilisables que tu actives à la demande dans une conversation. Tu peux les créer à partir d'exemples de tes propres textes — Claude en déduit le style.
- **La mémoire** (optionnelle, activable dans les paramètres) : Claude peut retenir des éléments d'une conversation à l'autre. Pratique, mais garde la main : tu peux consulter et effacer ce qu'il retient.`,
        },
        {
          kind: "flipcards",
          title: "Deux styles à créer chez Electra",
          cards: [
            {
              front: "🤝 « Electra externe »",
              back: "Pour clients, élus, partenaires fonciers : chaleureux, accessible, zéro jargon (on dit « borne de recharge rapide », pas « point de charge DC 300 kW »), phrases courtes, toujours une formule d'ouverture au dialogue.",
            },
            {
              front: "⚡ « Electra interne »",
              back: "Pour Slack, Notion, les CR : bullet points, direct, chiffres d'abord, acronymes maison OK (CSR, uptime, grid connection), pas de politesses inutiles, une ligne TL;DR en tête.",
            },
            {
              front: "🧠 La mémoire, quand l'activer ?",
              back: "Utile si tu veux que Claude retienne tes projets en cours et tes préférences implicites au fil des semaines. Moins utile si tu travailles déjà en Projets bien briefés. Dans le doute : commence sans, active plus tard.",
            },
          ],
        },
        {
          kind: "exercise",
          title: "🛠️ Règle ta cabine de pilotage",
          md: `1. Ouvre les **paramètres** de claude.ai → renseigne tes préférences (langue, ton, format).
2. Crée le style **« Electra interne »** : dans le menu des styles, choisis la création à partir d'exemples et colle **2 vrais messages internes** que tu as écrits (un message Slack structuré, un extrait de CR — anonymise les infos sensibles).
3. Teste avec le prompt ci-dessous, une fois SANS le style, une fois AVEC. Compare.`,
          prompt: "Rédige un message Slack pour annoncer à l'équipe ops que la station de Vienne repasse en supervision normale après 3 jours d'incident sur 2 points de charge : cause identifiée (module de puissance défectueux, remplacé), uptime revenu à 100 %, monitoring renforcé pendant 7 jours.",
          checklist: [
            "Mes préférences globales sont renseignées",
            "Mon style « Electra interne » est créé à partir de 2 vrais exemples anonymisés",
            "J'ai comparé la même demande avec et sans le style",
            "La version avec style ressemble vraiment à ce que j'aurais écrit",
          ],
        },
      ],
    },
    {
      slug: "recherche-web-fichiers",
      title: "Recherche web et analyse de fichiers",
      summary: "Quand déclencher la recherche web, et comment faire travailler Claude sur des documents volumineux et croisés.",
      minutes: 7,
      blocks: [
        {
          kind: "concept",
          title: "Deux superpouvoirs, deux usages",
          md: `**La recherche web** : Claude a une date de connaissance — le monde d'après, il ne le connaît pas. Avec la recherche web activée, il va chercher en direct et **cite ses sources**. Cas Electra typiques :
- veille concurrentielle (nouveaux hubs annoncés, tarifs)
- réglementation IRVE et évolutions des aides
- actualité d'un partenaire ou d'une foncière avant un rendez-vous

**L'analyse de fichiers** : uploade un contrat de bail de 60 pages, trois exports CSV, un PDF de règlement d'urbanisme — et fais-les **croiser**. « Compare les conditions de résiliation de ces 2 baux », « Ce plan d'implantation respecte-t-il les règles du PLU en pièce jointe ? »`,
        },
        {
          kind: "tip",
          title: "Le réflexe : daté ou volatil → recherche web",
          md: `Avant de faire confiance à une réponse, pose-toi UNE question : **cette info peut-elle avoir changé après la date de connaissance du modèle, ou change-t-elle souvent ?** Prix de l'électricité, textes réglementaires, tarifs concurrents, actualité d'une entreprise : recherche web obligatoire. Concepts stables (comment marche la charge DC, définition du roaming) : la connaissance interne suffit.`,
        },
        {
          kind: "exercise",
          title: "🛠️ Ta première veille réglementaire sourcée",
          md: `Active la recherche web et lance le prompt ci-dessous. Puis fais l'exercice critique : **clique sur au moins 2 sources** pour vérifier que la synthèse leur est fidèle. C'est le réflexe de vérification du M0 en conditions réelles.`,
          prompt: "Cherche les dernières évolutions réglementaires sur la recharge DC (courant continu) en France : obligations pour les opérateurs d'infrastructures de recharge, évolutions des aides et schémas type AFIR/LOM, nouveautés sur le paiement à l'acte. Fais une synthèse sourcée en 5 points maximum, avec la date de chaque information, en distinguant ce qui est en vigueur de ce qui est en projet.",
          checklist: [
            "La recherche web s'est déclenchée (sources visibles dans la réponse)",
            "La synthèse tient en 5 points datés",
            "J'ai ouvert au moins 2 sources pour vérifier la fidélité",
            "Je sais distinguer ce qui est en vigueur de ce qui est en projet",
          ],
        },
        {
          kind: "quiz",
          title: "Web ou pas web ?",
          questions: [
            {
              q: "« Quel est le tarif actuel au kWh de notre principal concurrent sur autoroute ? »",
              options: [
                { label: "Recherche web : info volatile qui change plusieurs fois par an", correct: true },
                { label: "Connaissance interne du modèle, il sait tout" },
                { label: "Inutile de vérifier, Claude donnera le bon chiffre" },
              ],
              explanation: "Les tarifs bougent constamment. Sans recherche web, Claude risque de citer un tarif périmé — avec aplomb.",
            },
            {
              q: "« Explique-moi la différence entre charge AC et charge DC pour préparer l'onboarding d'un nouveau. »",
              options: [
                { label: "Connaissance interne : concept stable, pas besoin du web", correct: true },
                { label: "Recherche web obligatoire" },
                { label: "Claude ne peut pas répondre à ça" },
              ],
              explanation: "La physique de la recharge ne change pas tous les mois. La connaissance du modèle suffit — garde la recherche web pour le volatil.",
            },
            {
              q: "Tu as 3 baux commerciaux en PDF et tu veux comparer les clauses de sortie. Le bon geste ?",
              options: [
                { label: "Uploader les 3 PDF dans la même conversation et demander un comparatif structuré", correct: true },
                { label: "Recopier les clauses à la main dans le chat" },
                { label: "Trois conversations séparées, une par bail" },
              ],
              explanation: "Claude croise plusieurs documents dans une même conversation : c'est exactement son point fort. Un seul chat, un comparatif.",
            },
          ],
        },
      ],
    },
  ],
  checkpoint: {
    title: "Checkpoint — Branché",
    md: `Deux livrables concrets valident ce module :
1. **Ton projet métier** existe dans claude.ai, avec instructions + au moins 1 fichier de connaissances (exercice 1.3).
2. **Un artéfact produit dedans** : ouvre une conversation dans ton projet et fais produire un vrai livrable de ta semaine (CR, tableau de suivi, brouillon d'email, one-pager…).

Coche honnêtement, puis passe le quiz : **80 % requis** pour le badge.`,
    checklist: [
      "Mon projet métier est créé (instructions + ≥1 fichier)",
      "J'ai produit un artéfact dans une conversation de ce projet",
      "J'ai créé au moins un style ou renseigné mes préférences",
      "J'ai fait une recherche web sourcée et vérifié 2 sources",
    ],
    quiz: [
      {
        q: "Quelle est LA différence entre un chat classique et une conversation dans un Projet ?",
        options: [
          { label: "Le projet injecte automatiquement instructions permanentes + base de connaissances", correct: true },
          { label: "Le projet utilise un modèle plus intelligent" },
          { label: "Aucune, c'est juste du rangement visuel" },
        ],
        explanation: "Instructions + fichiers relus à chaque conversation : c'est ça qui transforme Claude en collègue qui connaît ton contexte.",
      },
      {
        q: "La v1 de ton artéfact ne convient pas. Le bon réflexe ?",
        options: [
          { label: "Itérer dessus : « garde tout, mais change X »", correct: true },
          { label: "Ouvrir un nouveau chat et tout reformuler" },
          { label: "Abandonner et le faire à la main" },
        ],
        explanation: "L'itération conserve le contexte et converge plus vite. Redemander de zéro, c'est le piège classique de la leçon 1.2.",
      },
      {
        q: "Tu photographies l'écran d'erreur d'une borne en visite terrain. Que peut en faire Claude ?",
        options: [
          { label: "Lire l'image, extraire le code erreur et les infos affichées, proposer des pistes", correct: true },
          { label: "Rien, il ne traite que du texte" },
          { label: "Juste dire que c'est une photo de borne" },
        ],
        explanation: "Claude est multimodal : une capture d'écran est une donnée exploitable. Réflexe mobile en visite de station.",
      },
      {
        q: "« Où en sont les aides publiques pour l'installation de bornes en France ce trimestre ? » — quel réflexe ?",
        options: [
          { label: "Activer la recherche web : info datée et volatile, et vérifier les sources", correct: true },
          { label: "Faire confiance à la réponse directe du modèle" },
          { label: "C'est impossible à savoir" },
        ],
        explanation: "Postérieur à la date de connaissance ou volatil → recherche web + vérification des sources. Le réflexe de la leçon 1.5.",
      },
      {
        q: "Où écrire « réponds toujours en français, bullet points par défaut » pour que ça s'applique partout ?",
        options: [
          { label: "Dans les préférences utilisateur globales", correct: true },
          { label: "Au début de chaque conversation, à la main" },
          { label: "Dans un artéfact" },
        ],
        explanation: "Les préférences globales s'appliquent à toutes les conversations. Écrit une fois, appliqué toujours — le Module 3 approfondit cette hiérarchie.",
      },
    ],
  },
};
