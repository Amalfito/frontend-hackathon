import type { AcademyModule } from "@/lib/academy/types";

/* ============================================================================
 * MODULE 3 — Organiser son environnement de travail IA.
 * Hiérarchie du contexte, fichiers, conversations : l'architecture qui dure.
 * ========================================================================== */

export const m3Contexte: AcademyModule = {
  slug: "contexte",
  code: "M3",
  title: "Organiser son environnement de travail IA",
  tagline: "Un Claude bien rangé répond mieux qu'un Claude génial mais noyé. Deviens l'architecte de ton contexte.",
  icon: "🗂️",
  badge: "Architecte du contexte",
  audience: "Tous",
  lessons: [
    {
      slug: "hierarchie-contexte",
      title: "La hiérarchie du contexte",
      summary: "Préférences → Projet → Conversation → Message : la pyramide à 4 étages, et la règle d'or « chaque info au bon étage ».",
      minutes: 6,
      blocks: [
        {
          kind: "concept",
          title: "La pyramide à 4 étages",
          md: `Tout ce que Claude sait de toi vit à l'un de ces 4 étages, du plus permanent au plus éphémère :

1. **Préférences globales** (toutes tes conversations, pour toujours) : ta langue, ton format préféré, ton style général. Ex. : « français, direct, bullet points ».
2. **Projet** (toutes les conversations d'un périmètre) : les instructions métier, le glossaire, les templates, les process. Ex. : le brief du pôle énergie + son glossaire.
3. **Conversation** (le temps d'une tâche) : le sujet du jour, les documents de la tâche, les décisions prises au fil du chat.
4. **Message** (l'instant) : la consigne précise, la donnée fraîche, l'ajustement. Ex. : « le CSV du jour », « raccourcis de moitié ».

**La règle d'or : chaque info au bon étage.** Trop haut, tu pollues tout (ton glossaire énergie n'a rien à faire dans les préférences globales qui s'appliquent aussi à tes chats marketing). Trop bas, tu te répètes à l'infini (retaper le brief du pôle à chaque conversation = le symptôme n°1 d'un étage Projet vide).`,
        },
        {
          kind: "tip",
          title: "Le test de l'étage",
          md: `Pour placer une info, pose-toi UNE question : **« Combien de temps cette info reste-t-elle vraie, et pour quelles conversations ? »**
- Vraie partout, tout le temps → Préférences.
- Vraie pour un périmètre métier, des mois → Projet.
- Vraie le temps d'une tâche → Conversation.
- Vraie pour cette réponse-ci → Message.`,
        },
        {
          kind: "quiz",
          title: "À quel étage ?",
          questions: [
            {
              q: "« Je préfère les réponses en bullet points, en français. »",
              options: [
                { label: "Préférences globales", correct: true },
                { label: "Projet" },
                { label: "Conversation" },
                { label: "Message" },
              ],
              explanation: "Vrai partout et tout le temps, quel que soit le sujet : c'est le sommet de la pyramide.",
            },
            {
              q: "Le glossaire du pôle énergie (PPA, spot, ARENH, courbe de charge…).",
              options: [
                { label: "Projet : vrai pour tout le périmètre énergie, pendant des mois", correct: true },
                { label: "Préférences globales : comme ça il est partout" },
                { label: "Message : je le recolle à chaque fois" },
              ],
              explanation: "Périmètre métier + durée longue = étage Projet. Dans les préférences globales, il polluerait tes chats marketing ou support.",
            },
            {
              q: "Le CSV des sessions de charge à analyser aujourd'hui.",
              options: [
                { label: "Conversation (ou message) : c'est la donnée de LA tâche du jour", correct: true },
                { label: "Base de connaissances du projet, pour le garder" },
                { label: "Préférences globales" },
              ],
              explanation: "Donnée fraîche et jetable : elle vit le temps de la tâche. La stocker dans le projet encombrerait la base avec des données périmées dès demain.",
            },
            {
              q: "« Tu es l'assistant du pôle ops Electra : supervision réseau, incidents, uptime, escalades constructeur. »",
              options: [
                { label: "Instructions du projet Ops : c'est le brief permanent du périmètre", correct: true },
                { label: "À retaper au début de chaque conversation" },
                { label: "Dans un message, quand j'y pense" },
              ],
              explanation: "Un brief permanent retapé à chaque chat, c'est l'étage Projet qui te fait signe. Écris-le une fois dans les instructions.",
            },
            {
              q: "« Pour cette réponse uniquement : version 3 lignes, pour un message Slack. »",
              options: [
                { label: "Message : ajustement de l'instant", correct: true },
                { label: "Préférences globales" },
                { label: "Projet" },
              ],
              explanation: "Consigne éphémère, valable pour une seule réponse : la base de la pyramide. La mettre plus haut figerait un cas particulier en règle générale.",
            },
          ],
        },
      ],
    },
    {
      slug: "structurer-fichiers",
      title: "Structurer ses fichiers pour Claude",
      summary: "Noms explicites, formats texte, découpage malin : les fichiers que Claude exploite à 100 % — et le glossaire, meilleur ROI d'Electra.",
      minutes: 7,
      blocks: [
        {
          kind: "concept",
          title: "Claude lit comme un collègue pressé",
          md: `Ta base de connaissances projet est lue par Claude comme par un collègue brillant mais pressé. Quatre pratiques changent tout :

1. **Noms explicites** : \`template-CR-visite-fonciere.md\` dit ce qu'il contient ; \`doc_final_v3(2).docx\` est une énigme. Claude choisit quel fichier consulter d'après son nom — aide-le.
2. **Un fichier README** : un petit fichier d'instructions qui liste ce que contient la base et quand utiliser quoi. C'est la table d'orientation de ton projet.
3. **Texte et markdown d'abord** : un \`.md\` propre se lit parfaitement ; un PDF scanné en biais, beaucoup moins. Quand tu as le choix, exporte en texte.
4. **Découper** : 10 petits fichiers thématiques battent 1 pavé de 200 pages. Claude cible mieux, et toi tu mets à jour un fichier sans toucher aux 9 autres.`,
        },
        {
          kind: "tip",
          title: "Le fichier au meilleur ROI d'Electra : le glossaire",
          md: `Un fichier \`glossaire-electra.md\` de 2 pages — CSR (Charging Success Rate), uptime, grid connection, roaming, foncier, AOT, point de charge vs borne vs station, hub… — améliore **toutes** les réponses de **tous** tes projets métier. Trente minutes d'écriture, des mois de réponses qui parlent ta langue. Si tu ne dois créer qu'un seul fichier après cette leçon : celui-là.`,
        },
        {
          kind: "sort",
          title: "Bonne pratique ou piège ?",
          instructions: "Range chaque pratique dans la bonne colonne. Indice : demande-toi si un collègue pressé qui découvre la base s'y retrouverait.",
          categories: ["Bonne pratique", "Piège"],
          items: [
            { label: "Nommer un fichier template-CR-visite-fonciere.md", category: "Bonne pratique" },
            { label: "Uploader doc_final_v3(2).docx et new_doc_OK_vraiment_final.pdf", category: "Piège" },
            { label: "Ajouter un README qui explique quoi utiliser quand", category: "Bonne pratique" },
            { label: "Un glossaire Electra de 2 pages, tenu à jour", category: "Bonne pratique" },
            { label: "Un PDF scanné de 200 pages comme unique source", category: "Piège" },
            { label: "Découper le process déploiement en 8 fichiers thématiques courts", category: "Bonne pratique" },
            { label: "Garder les 3 versions successives du même process dans la base", category: "Piège" },
            { label: "Exporter la page Notion en markdown plutôt qu'en PDF", category: "Bonne pratique" },
            { label: "Uploader 40 fichiers d'un coup « pour être sûr que tout y est »", category: "Piège" },
            { label: "Stocker le CSV de sessions du jour dans la base de connaissances du projet", category: "Piège" },
          ],
        },
        {
          kind: "exercise",
          title: "🛠️ Rédige le glossaire de ton pôle",
          md: `Passe à l'acte : crée le glossaire de TON métier avec l'aide de Claude, puis uploade-le dans ton projet (créé au M1). C'est un fichier vivant : tu l'enrichiras au fil des semaines.`,
          prompt: "Aide-moi à rédiger le glossaire de mon pôle chez Electra (opérateur de recharge ultra-rapide pour véhicules électriques). Mon pôle : [déploiement / ops / énergie / finance / marketing-CRM / support / produit-tech / data]. Étape 1 : propose 15 à 20 termes que ce pôle utilise quotidiennement (métier, acronymes, outils comme Sitetracker, Omni, HubSpot, Intercom selon le pôle) et demande-moi de valider, corriger ou compléter avec nos définitions maison. Étape 2 : produis le glossaire final en markdown, une ligne par terme : terme, définition en 20 mots max, exemple d'usage si utile. Titre du fichier suggéré : glossaire-[pole].md.",
          checklist: [
            "Mon glossaire contient au moins 12 termes validés ou corrigés par moi",
            "Les définitions maison (pas génériques) sont là — celles qu'un nouveau ne devinerait pas",
            "Le fichier est en markdown avec un nom explicite",
            "Il est uploadé dans la base de connaissances de mon projet métier",
          ],
        },
      ],
    },
    {
      slug: "gerer-conversations",
      title: "Gérer ses conversations et artéfacts",
      summary: "Une conversation = une tâche, renommer ce qui compte, et la technique du résumé-relais pour éviter le court-circuit de contexte.",
      minutes: 7,
      blocks: [
        {
          kind: "concept",
          title: "L'hygiène de conversation",
          md: `Trois habitudes qui séparent les pros des touristes :

1. **Une conversation = une tâche.** Le CR de visite de Chambéry, l'analyse du CSV de sessions et le brouillon de post LinkedIn n'ont rien à faire dans le même chat. Mélanger les sujets, c'est mélanger les contextes — et les réponses s'en ressentent.
2. **Renomme les conversations importantes.** « Négociation bail Chambéry — historique » se retrouve en 2 secondes dans la recherche d'historique ; « Salut Claude » ne se retrouve jamais.
3. **Repars propre quand le sujet change.** Une nouvelle tâche mérite un nouveau chat (dans le bon projet). Le contexte accumulé de l'ancienne tâche n'aide pas : il parasite.`,
        },
        {
          kind: "warning",
          title: "⚡ Le court-circuit de contexte",
          md: `Le symptôme : un thread de 3 heures où tu as exploré 4 pistes, changé d'avis deux fois, collé 3 versions du même tableau… et Claude se met à mélanger la v1 et la v3, à ressortir une piste abandonnée, à confondre les chiffres de Lyon et de Nantes.

Ce n'est pas le modèle qui fatigue : c'est **la fenêtre de contexte saturée d'informations contradictoires**. Comme un tableau blanc couvert de 4 brainstormings superposés — plus personne n'y lit rien.

Le remède n'est PAS de continuer en criant plus fort. C'est le **résumé-relais** : demander un résumé propre, puis repartir dans un chat neuf avec ce résumé comme point de départ. Exercice ci-dessous.`,
        },
        {
          kind: "exercise",
          title: "🛠️ La technique du résumé-relais",
          md: `Prends ta plus longue conversation en cours (ou attends d'en avoir une qui patine — ça viendra). En fin de thread, lance le prompt ci-dessous. Puis ouvre un **chat neuf dans le même projet**, colle le résumé, et constate : Claude repart au quart de tour, sans les scories.`,
          prompt: "Résume cette conversation en 10 points maximum pour que je reparte dans un chat neuf sans perdre le fil. Structure : 1) l'objectif de départ, 2) les décisions prises (avec leur justification en une phrase), 3) les pistes explorées puis ABANDONNÉES (à ne pas rouvrir), 4) l'état actuel du livrable, 5) les prochaines étapes. Ne garde que ce qui est encore vrai : si on a changé d'avis, seule la version finale compte.",
          checklist: [
            "J'ai généré le résumé-relais en fin de conversation longue",
            "Le résumé distingue bien décisions actées et pistes abandonnées",
            "J'ai relancé dans un chat neuf avec ce résumé en premier message",
            "La qualité des réponses a fait un bond (ou au minimum, zéro confusion)",
          ],
        },
        {
          kind: "tip",
          title: "Et les artéfacts ?",
          md: `Même logique : un artéfact abouti ne doit pas vivre uniquement dans un vieux thread. Copie la version finale au bon endroit — Notion pour la doc, la base de connaissances du projet s'il resservira à Claude, Drive pour le partage. Ta conversation est un **atelier**, pas une **archive**.`,
        },
      ],
    },
    {
      slug: "kit-contexte-metier",
      title: "Assemble ton kit contexte",
      summary: "La synthèse pratique du module : glossaire + templates + README + instructions, assemblés en un kit qui fait de ton projet une machine bien huilée.",
      minutes: 8,
      blocks: [
        {
          kind: "concept",
          title: "Le kit contexte : 4 pièces, pas une de plus",
          md: `Tout ce que tu as construit dans ce module s'assemble en un **kit contexte** standard, le même pour tous les pôles Electra :

1. \`README.md\` — la table d'orientation : ce que contient la base, quand utiliser quoi.
2. \`glossaire-[pole].md\` — les termes maison (leçon 3.2).
3. \`template-[livrable].md\` — 1 à 3 templates de tes livrables récurrents (CR, brief, rapport…), idéalement avec un exemple rempli.
4. **Les instructions du projet** — le brief permanent (M1, leçon 1.3), qui référence explicitement les fichiers : « pour tout CR, utilise le template fourni ».

C'est volontairement court. Un kit de 4 pièces tenu à jour bat une base de 40 fichiers à l'abandon. Tu pourras l'étoffer plus tard — quand l'usage le réclamera, pas avant.`,
        },
        {
          kind: "demo",
          title: "Le kit du pôle ops, monté en 20 minutes",
          md: `1. **README.md** : « Cette base sert à la supervision réseau. glossaire-ops.md pour les termes, template-post-mortem.md pour les incidents, template-weekly-reseau.md pour le point hebdo. Sources de vérité des chiffres : Omni et Datadog — ne jamais inventer un uptime. »
2. **glossaire-ops.md** : uptime, CSR, point de charge vs borne, escalade N1/N2/constructeur, MTTR…
3. **template-post-mortem.md** : chronologie, impact (sessions perdues, kWh non délivrés), cause racine, actions — avec un vrai post-mortem anonymisé en exemple.
4. **Instructions** : « Tu es l'assistant du pôle ops Electra. Pour tout incident, utilise template-post-mortem.md. Chiffres toujours sourcés ou marqués [À VÉRIFIER DANS OMNI]. Format court, orienté action. »

Résultat : « Rédige le post-mortem de l'incident de Vienne » sort **bon du premier coup** — bon format, bons termes, chiffres prudents.`,
        },
        {
          kind: "exercise",
          title: "🛠️ Monte ton kit (et fais-le auditer)",
          md: `Assemble les 4 pièces de TON kit dans ton projet métier. Le glossaire existe déjà (leçon 3.2), les instructions aussi (M1) : il te manque le README et au moins un template. Quand tout est en place, fais auditer le kit par Claude lui-même avec le prompt ci-dessous — dans une conversation du projet, pour qu'il voie réellement la base.`,
          prompt: "Tu as accès à la base de connaissances et aux instructions de ce projet. Audite mon kit contexte : 1) liste les fichiers que tu vois et dis en une phrase à quoi chacun te sert ; 2) y a-t-il un fichier que tu ne saurais pas quand utiliser ? 3) quelles infos te manquent encore pour produire mes livrables récurrents sans me poser de questions basiques ? 4) y a-t-il des doublons ou des contradictions entre fichiers ? Réponds en 4 sections courtes, sois franc.",
          checklist: [
            "Mon projet contient README + glossaire + au moins 1 template + instructions",
            "Les instructions référencent explicitement les fichiers de la base",
            "L'audit par Claude ne révèle ni doublon ni fichier orphelin",
            "J'ai corrigé au moins un point remonté par l'audit",
          ],
        },
        {
          kind: "tip",
          title: "La maintenance : 10 minutes par mois",
          md: `Un kit contexte, ça s'entretient comme une station : mets un rappel mensuel de 10 minutes — supprimer le périmé, ajouter les nouveaux termes au glossaire, mettre à jour le template si le process a changé. Un contexte périmé est pire qu'un contexte vide : Claude suit avec assurance des règles qui n'existent plus.`,
        },
      ],
    },
  ],
  checkpoint: {
    title: "Checkpoint — Architecte du contexte",
    md: `L'épreuve finale : **l'audit guidé de ton espace Claude**, en 8 points. Ouvre claude.ai à côté et vérifie, point par point :

1. Mes préférences globales sont renseignées (langue, ton, format) — et ne contiennent RIEN de spécifique à un métier.
2. J'ai au moins un projet par périmètre actif, aucun projet fourre-tout.
3. Les instructions de chaque projet tiennent le rôle de brief permanent (rôle, conventions, comportement en cas d'info manquante).
4. Ma base de connaissances : noms de fichiers explicites, formats texte/markdown, zéro doublon ni version fantôme.
5. Mon glossaire métier existe, est à jour, et vit dans le bon projet.
6. Un README oriente Claude dans la base (quoi utiliser quand).
7. Mes 5 dernières conversations : une tâche chacune, les importantes sont renommées.
8. Je sais exécuter un résumé-relais quand un thread s'enlise — je l'ai fait au moins une fois.

Les 8 points passent ? Coche la checklist et prends ton badge : tu as un environnement de travail IA que 95 % des utilisateurs n'auront jamais.`,
    checklist: [
      "J'ai passé les 8 points de l'audit sur mon espace Claude réel",
      "Mon kit contexte (README + glossaire + template + instructions) est complet dans mon projet métier",
      "J'ai pratiqué le résumé-relais sur une vraie conversation",
      "J'ai corrigé au moins 2 points révélés par l'audit",
    ],
    quiz: [
      {
        q: "Où placer le glossaire du pôle déploiement ?",
        options: [
          { label: "Dans la base de connaissances du projet Déploiement", correct: true },
          { label: "Dans les préférences globales, pour l'avoir partout" },
          { label: "Collé au début de chaque message" },
        ],
        explanation: "Vrai pour un périmètre métier, durablement : étage Projet. Les préférences globales pollueraient tes autres sujets.",
      },
      {
        q: "Ton thread de 3 heures part en vrille : Claude mélange les versions et ressort des pistes abandonnées. Diagnostic et remède ?",
        options: [
          { label: "Court-circuit de contexte → résumé-relais puis chat neuf", correct: true },
          { label: "Le modèle est fatigué → réessayer demain" },
          { label: "Répéter la consigne en majuscules" },
        ],
        explanation: "Fenêtre saturée d'infos contradictoires. On résume proprement (décisions vs pistes abandonnées) et on repart propre.",
      },
      {
        q: "Le meilleur format pour la base de connaissances d'un projet ?",
        options: [
          { label: "Des fichiers markdown courts, aux noms explicites, avec un README", correct: true },
          { label: "Un unique PDF scanné de 200 pages, pour tout centraliser" },
          { label: "40 fichiers nommés doc1, doc2, doc_final_v3(2)" },
        ],
        explanation: "Texte > PDF scanné, découpé > pavé, explicite > énigme. Claude cible mieux, et la maintenance reste possible.",
      },
      {
        q: "« Une conversation = une tâche », pourquoi cette règle ?",
        options: [
          { label: "Chaque tâche garde un contexte propre : pas de parasitage entre sujets", correct: true },
          { label: "Pour faire joli dans l'historique" },
          { label: "Parce que Claude facture à la conversation" },
        ],
        explanation: "Le contexte de la tâche précédente ne « aide » pas la suivante : il la parasite. Nouveau sujet, nouveau chat — dans le bon projet.",
      },
    ],
  },
};
