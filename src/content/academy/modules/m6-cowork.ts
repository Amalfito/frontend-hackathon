import type { AcademyModule } from "@/lib/academy/types";

/* ============================================================================
 * MODULE 6 — Claude Cowork : déléguer du vrai travail. L'architecture
 * agentique de Claude Code, sans terminal : Claude lit, modifie et crée des
 * fichiers dans les dossiers que TU choisis, de bout en bout.
 * ========================================================================== */

export const m6Cowork: AcademyModule = {
  slug: "cowork",
  code: "M6",
  title: "Claude Cowork : déléguer du vrai travail",
  tagline: "Fini le copier-coller : Claude travaille directement dans tes dossiers et livre des tâches complètes de bout en bout.",
  icon: "🤝",
  badge: "Cowork Captain",
  audience: "Tous",
  lessons: [
    {
      slug: "chat-vs-cowork",
      title: "Chat vs Cowork : deux régimes différents",
      summary: "En Chat, Claude répond. En Cowork, il agit dans tes fichiers et déroule des tâches multi-étapes de bout en bout.",
      minutes: 7,
      blocks: [
        {
          kind: "concept",
          title: "La différence en une phrase",
          md: `En **Chat**, Claude te répond — mais ne touche jamais tes fichiers : c'est toi qui copies-colles, ouvres, enregistres, recommences. En **Cowork**, Claude **lit, modifie et crée des fichiers** dans les dossiers que **TU** choisis, et exécute des **tâches multi-étapes de bout en bout** : tu définis l'**objectif**, il trouve le **chemin**.

Sous le capot, c'est l'**architecture agentique de Claude Code** (Module 5) — la même boucle plan → action → observation — mais **sans terminal**. Disponible sur **desktop**, et en **bêta web/mobile** : les sessions tournent alors sur les serveurs d'Anthropic et **continuent laptop fermé**. Concrètement : tu lances la session au bureau, tu pars en visite de site, tu supervises depuis le terrain sur ton téléphone.

Le passage Chat → Cowork, c'est le passage de la borne AC 7 kW à la charge rapide DC : même énergie, mais un tout autre débit de travail livré.`,
        },
        {
          kind: "demo",
          title: "Scénario réel : les 40 comptes-rendus de visites",
          md: `Objectif donné à Cowork : « Trie ce dossier de 40 comptes-rendus de visites de sites, extrais les points bloquants dans un tableur, prépare une synthèse d'une page pour le comité déploiement. »

1. **Plan affiché** : inventorier les fichiers → lire chaque CR → extraire les blocages → produire le tableur → rédiger la synthèse. Tu valides.
2. **Inventaire** : 40 fichiers, formats mélangés (Word, PDF, notes brutes). Aucun souci : il lit tout.
3. **Extraction** : pour chaque CR, il repère site, date, blocages (foncier non signé, permis en attente, raccordement retardé, opposition locale…).
4. **Livrable 1** : \`blocages_sites.xlsx\` — une ligne par site, colonnes blocage / gravité / prochaine action.
5. **Livrable 2** : \`synthese_comite.md\` — une page : 6 sites critiques, 3 motifs récurrents, décisions à prendre.

Durée : le temps d'un café. À la main : une journée. Et pendant qu'il travaille, tu vois son avancement et tu peux le rediriger.`,
        },
        {
          kind: "quiz",
          title: "Chat ou Cowork ? Tranche.",
          questions: [
            {
              q: "« Reformule ce mail au gestionnaire de réseau pour qu'il soit plus diplomate. »",
              options: [
                { label: "Chat : une entrée, une sortie, pas de fichiers à manipuler", correct: true },
                { label: "Cowork : tout doit passer par Cowork maintenant" },
              ],
              explanation: "Un texte à améliorer = Chat. Cowork prend le relais quand il y a des fichiers et plusieurs étapes.",
            },
            {
              q: "« Renomme et classe les 200 photos de visites de sites du dossier Q2 selon le format station_date_type. »",
              options: [
                { label: "Cowork : opération multi-fichiers dans un dossier", correct: true },
                { label: "Chat : je copie-colle les 200 photos une par une" },
              ],
              explanation: "Manipuler des fichiers en masse est littéralement impossible en Chat — et trivial en Cowork.",
            },
            {
              q: "« Consolide ces 12 exports Pigment mensuels en un fichier de suivi annuel avec un onglet de synthèse. »",
              options: [
                { label: "Cowork : lecture de 12 fichiers + production d'un livrable", correct: true },
                { label: "Chat : je colle les 12 fichiers dans la conversation" },
              ],
              explanation: "Multi-fichiers + livrable fichier = Cowork. En Chat, tu ferais l'ouvrier entre chaque étape.",
            },
            {
              q: "Tu lances une session Cowork web depuis le bureau puis fermes ton laptop pour aller sur le hub de Lille. Que devient la session ?",
              options: [
                { label: "Elle continue sur les serveurs d'Anthropic — je peux la superviser depuis mon mobile", correct: true },
                { label: "Elle s'arrête net : pas de laptop, pas de session" },
                { label: "Elle repart de zéro à la réouverture" },
              ],
              explanation: "C'est l'intérêt de la bêta web/mobile : la session tourne côté serveur. Lance au bureau, supervise du terrain.",
            },
          ],
        },
      ],
    },
    {
      slug: "cadrer-une-session",
      title: "Bien cadrer une session Cowork",
      summary: "Les 5 règles d'une session qui livre : dossier dédié, instructions, objectif clair, supervision, relecture. Plus les tâches planifiées.",
      minutes: 8,
      blocks: [
        {
          kind: "concept",
          title: "Les 5 règles du Captain",
          md: `1. **Un dossier de travail dédié** — jamais tout le disque. Crée \`~/cowork/comite-deploiement/\` avec les fichiers utiles. Un périmètre net = un agent efficace et un risque maîtrisé.
2. **Un fichier d'instructions** dans le dossier (le pattern CLAUDE.md du Module 5) : contexte, format des livrables, vocabulaire (station vs borne), interdits. Lu à chaque session.
3. **Décris l'objectif et le livrable, pas les étapes.** « Un tableur des blocages + une synthèse d'une page pour le comité » — et laisse-le trouver le chemin. Si tu dictes chaque étape, tu perds l'intérêt d'un agent.
4. **Suis le plan affiché et redirige.** Cowork montre son plan et son avancement : c'est ton tableau de supervision. Une dérive ? Interviens tout de suite, pas à la fin.
5. **Relis avant de valider tout ce qui supprime ou envoie.** Réorganisation destructive, envoi de mail, suppression : ton feu vert explicite, toujours.`,
        },
        {
          kind: "tip",
          title: "Tâches planifiées et projets persistants",
          md: `- **Tâches planifiées** : Cowork sait se lancer tout seul en récurrent. Ex. : « chaque lundi 8h : synthèse des incidents de la semaine + brouillon de post Slack pour #ops-weekly ». Tu arrives lundi, la synthèse t'attend — il ne reste qu'à relire et poster.
- **Projets persistants** : un projet Cowork garde son dossier, ses instructions et son historique entre les sessions. Ton suivi des ouvertures de stations vit dans le même projet toute l'année : chaque session repart avec tout le contexte.`,
        },
        {
          kind: "warning",
          title: "Cowork agit POUR DE VRAI",
          md: `Ce n'est plus une conversation : les fichiers sont réellement créés, modifiés, déplacés. Deux conséquences directes :

- **Dossiers autorisés = périmètre de confiance.** N'autorise que ce dont la session a besoin. Le dossier RH partagé n'a rien à faire dans une session de tri de comptes-rendus.
- **Données sensibles** (données clients, contrats, salaires) : cadre spécifique → **Module 11** avant de te lancer.

Le bon réflexe : garde une copie ou une sauvegarde des dossiers critiques avant une session qui réorganise ou supprime.`,
        },
        {
          kind: "exercise",
          title: "🛠️ Ta première vraie session Cowork",
          md: `Monte une session complète sur un **vrai dossier de travail** : choisis une corvée réelle (trier des CR, consolider des exports, nettoyer un dossier Drive téléchargé…). Crée le dossier dédié, écris 5 lignes d'instructions, puis lance l'objectif. Le prompt ci-dessous est un gabarit : remplace les crochets par ton cas réel.`,
          prompt: `Voici ton dossier de travail : [nom du dossier]. Contexte : je travaille chez Electra (recharge rapide pour véhicules électriques), équipe [déploiement / ops / énergie / finance / marketing / support / data].
Objectif : [ex. trier ces comptes-rendus de visites, extraire les points bloquants (foncier, permis, raccordement) dans un tableur, et produire une synthèse d'une page pour le comité déploiement].
Livrables attendus : [ex. blocages.xlsx + synthese.md, en français, une page max pour la synthèse].
Contraintes : ne supprime aucun fichier original ; range tes livrables dans un sous-dossier "livrables" ; montre-moi ton plan avant de commencer et signale-moi tout fichier illisible.`,
          checklist: [
            "J'ai créé un dossier de travail dédié (pas mon disque entier) avec un fichier d'instructions",
            "J'ai décrit l'objectif et le livrable, pas les étapes",
            "J'ai suivi le plan affiché et je suis intervenu au moins une fois pour préciser ou rediriger",
            "J'ai relu les livrables avant de les considérer comme finis",
            "Les fichiers originaux sont intacts",
          ],
        },
      ],
    },
    {
      slug: "recettes-par-metier",
      title: "6 recettes Cowork par métier Electra",
      summary: "Des sessions prêtes à lancer pour le déploiement, les ops, l'énergie, la finance, le marketing et le support. Vole, adapte, lance.",
      minutes: 8,
      blocks: [
        {
          kind: "concept",
          title: "Le principe : une corvée récurrente = une recette",
          md: `Chaque métier a SA corvée à base de fichiers : celle qu'on repousse au vendredi. Les six prompts ci-dessous sont des recettes éprouvées — copie celle de ton métier, adapte les crochets, lance. Et note le pattern commun : **contexte → objectif → livrables → contraintes**. C'est le même squelette que l'exercice 6.2, décliné.`,
        },
        {
          kind: "prompt",
          title: "🏗️ Déploiement — le dossier de site en revue",
          prompt: `Dossier de travail : le dossier du site [nom du site candidat]. Il contient promesse de bail, études de raccordement, échanges avec la mairie et CR de visites. Objectif : produire une fiche de synthèse GO/NO-GO pour le comité : statut foncier, statut permis, statut raccordement (puissance disponible en kVA), risques identifiés, pièces manquantes. Livrable : fiche_site.md d'une page + liste_pieces_manquantes.md. Ne modifie aucun document original.`,
          note: "Variante : lancer la même recette sur 10 dossiers de sites et demander un tableau comparatif pour prioriser le pipeline.",
        },
        {
          kind: "prompt",
          title: "🖥️ Ops / supervision — le post-mortem sans douleur",
          prompt: `Dossier de travail : exports de l'incident du [date] sur le hub de [ville] (logs Datadog en JSON, thread Slack exporté, extraction des sessions échouées en CSV). Objectif : reconstituer la chronologie de l'incident et produire un post-mortem au format ops Electra : impact (sessions perdues, kWh non délivrés, durée d'indisponibilité par borne), chronologie horodatée, cause racine probable, actions correctives proposées. Livrable : postmortem.md. Signale explicitement ce que les données ne permettent PAS de conclure.`,
          note: "La dernière phrase est la meilleure assurance anti-hallucination d'un post-mortem.",
        },
        {
          kind: "prompt",
          title: "⚡ Énergie — les factures passées au peigne fin",
          prompt: `Dossier de travail : les factures d'électricité PDF du trimestre pour les stations [liste ou "toutes"]. Objectif : extraire pour chaque station et chaque mois les kWh consommés, le montant HT, le prix moyen du kWh et la puissance souscrite ; comparer aux kWh délivrés aux clients (fichier sessions_q[X].csv fourni) pour estimer le taux de pertes ; signaler toute anomalie (prix aberrant, saut de conso, pénalité de dépassement). Livrables : analyse_energie.xlsx + anomalies.md. En cas de doute de lecture sur un PDF, liste le fichier plutôt que de deviner.`,
          note: "« Liste plutôt que deviner » : à exiger dès qu'un chiffre finit dans un fichier de gestion.",
        },
        {
          kind: "prompt",
          title: "💶 Finance — la consolidation mensuelle",
          prompt: `Dossier de travail : les exports mensuels [Pigment / Payflows] du semestre. Objectif : consolider en un fichier unique de suivi : revenus par station, coûts d'énergie, marge par kWh délivré ; ajoute un onglet de synthèse avec le top/flop 5 des stations et les variations mois par mois supérieures à 15 % (à investiguer). Livrable : conso_semestre.xlsx + un memo.md d'une demi-page qui raconte ce que les chiffres disent. Ne modifie jamais les exports sources.`,
          note: "Le memo.md est souvent plus lu que le xlsx : demande toujours les deux.",
        },
        {
          kind: "prompt",
          title: "📣 Marketing / CRM — le kit d'ouverture de station",
          prompt: `Dossier de travail : le dossier de la station de [ville] (fiche site, photos, chiffres clés : nombre de bornes, puissance max en kW, tarifs) + le fichier tone_of_voice.md de la marque. Objectif : produire le kit d'annonce d'ouverture : post LinkedIn, post Instagram, brouillon d'email Customer.io pour les clients de la région, et un brief d'une demi-page pour la relation presse locale. Livrables : un fichier par canal dans un sous-dossier "kit_ouverture". Respecte strictement le tone of voice fourni et n'invente aucun chiffre : si une donnée manque, mets [À COMPLÉTER].`,
          note: "Le [À COMPLÉTER] explicite vaut mille fois un chiffre inventé plausible.",
        },
        {
          kind: "prompt",
          title: "🎧 Support / data — la voix du client en une page",
          prompt: `Dossier de travail : l'export des [200] derniers tickets Intercom (CSV) + les verbatims des enquêtes de satisfaction du trimestre. Objectif : identifier les 5 irritants récurrents (avec fréquence et exemples de verbatims anonymisés — remplace tout nom, email ou plaque par [ANONYMISÉ]), croiser avec les stations les plus citées, et proposer 3 actions à fort impact. Livrables : irritants.xlsx + synthese_voc.md d'une page pour l'équipe produit.`,
          note: "L'anonymisation dans la consigne, pas en post-traitement : les verbatims voyagent ensuite dans Notion et Slack.",
        },
        {
          kind: "exercise",
          title: "🛠️ Adapte la recette de ton métier",
          md: `Prends la recette la plus proche de ton quotidien, remplace les crochets par tes vraies données, et **ajoute une contrainte personnelle** que les recettes n'ont pas prévue (un format maison, un interdit, un seuil). C'est l'étape qui transforme une recette générique en outil à toi.`,
          prompt: `Reprends la recette Cowork de mon métier ci-dessus, adaptée à mon cas : [colle ta version adaptée]. Avant de lancer, pose-moi 3 questions pour vérifier que le cadrage est complet (périmètre, livrable, contrainte manquante). Ensuite seulement, propose ton plan.`,
          checklist: [
            "J'ai adapté une recette avec mes vrais fichiers et mon vrai contexte",
            "J'ai ajouté au moins une contrainte spécifique à mon équipe",
            "Les questions de cadrage de Claude m'ont fait préciser au moins un point",
            "Le livrable final est utilisable tel quel par un collègue",
          ],
        },
      ],
    },
    {
      slug: "superviser-sans-micromanager",
      title: "Superviser sans micro-manager",
      summary: "L'art de rediriger un agent en cours de route : intervenir au bon moment, au bon niveau, sans reprendre le volant.",
      minutes: 6,
      blocks: [
        {
          kind: "concept",
          title: "Le juste milieu du Captain",
          md: `Deux façons de rater une session Cowork : **l'abandonner** (tu découvres à la fin 40 fichiers rangés selon une logique absurde) et **la micro-manager** (tu valides chaque micro-décision — autant tout faire toi-même). Le juste milieu tient en trois habitudes :

- **Interviens sur le plan, pas sur les gestes.** « Regroupe par station plutôt que par date » = bon niveau. « Ouvre d'abord le fichier 3 » = micro-management.
- **Corrige à la première dérive**, pas à la dixième. Le premier livrable est dans le mauvais format ? Stoppe et recadre tout de suite : les 39 suivants hériteront de la correction.
- **Redirige sans repartir de zéro.** L'agent garde tout le contexte : « garde l'analyse, mais présente-la par région et ajoute les kWh » suffit. Pas besoin de relancer la session.

C'est la supervision d'un réseau de stations : tu surveilles le tableau de bord et tu interviens sur les alertes — tu ne vas pas resserrer chaque boulon toi-même.`,
        },
        {
          kind: "beforeAfter",
          title: "Rediriger : la mauvaise et la bonne façon",
          bad: "Stop stop stop, c'est n'importe quoi, on recommence tout. Nouvelle session : trie les comptes-rendus de visites et fais un tableau.",
          good: "Stop, ajustement : ton extraction des blocages est bonne, garde-la. Mais classe par région (pas par date), ajoute une colonne « prochaine action » pour chaque site, et la gravité en 3 niveaux au lieu de 5. Reprends à partir des 12 CR déjà traités, ne les relis pas.",
          explanation: "La bonne version dit ce qui est acquis (l'extraction), ce qui change (3 points précis) et ce qu'il ne faut PAS refaire. L'agent repart avec tout son contexte au lieu de tout rejouer — tu gagnes le temps déjà investi.",
        },
        {
          kind: "quiz",
          title: "Captain ou micro-manager ?",
          questions: [
            {
              q: "Au 3e compte-rendu traité sur 40, tu vois que Cowork classe « raccordement Enedis en attente » dans « foncier ». Tu fais quoi ?",
              options: [
                { label: "J'interviens tout de suite : je corrige la règle de classement, il l'applique aux 37 suivants et reprend les 3 premiers", correct: true },
                { label: "J'attends la fin pour tout vérifier d'un coup" },
                { label: "Je reprends le classement à la main" },
                { label: "Je relance une session neuve" },
              ],
              explanation: "Corriger à la première dérive : une règle corrigée tôt profite à tout le reste du lot.",
            },
            {
              q: "Le plan affiché prévoit de « fusionner les doublons » dans ton dossier de contrats Docusign. Ça te semble risqué. Tu…",
              options: [
                { label: "Modifies le plan avant exécution : « signale les doublons dans une liste, ne fusionne ni ne supprime rien »", correct: true },
                { label: "Laisses faire, il doit savoir ce qu'il fait" },
                { label: "Fermes le laptop en catastrophe" },
                { label: "Supprimes les doublons toi-même d'abord" },
              ],
              explanation: "Le plan affiché sert exactement à ça : transformer une action destructive en action réversible AVANT qu'elle ait lieu.",
            },
            {
              q: "Le tableau livré est juste sur le fond mais pas dans ton format maison. La relance la plus efficace ?",
              options: [
                { label: "« Le contenu est bon, garde-le. Reformate selon : [colonnes exactes]. Ne recalcule rien. »", correct: true },
                { label: "« C'est pas ça » (et il devine)" },
                { label: "Tout reformater à la main" },
                { label: "Repartir de zéro dans une nouvelle session" },
              ],
              explanation: "Acquis + changement précis + interdiction de rejouer l'inutile : la formule de redirection parfaite.",
            },
          ],
        },
      ],
    },
  ],
  checkpoint: {
    title: "Checkpoint — Cowork Captain",
    md: `Le badge se gagne en conditions réelles : **une session Cowork complète sur un vrai dossier de travail, avec un livrable utilisable à la clé** (exercice 6.2 ou une recette 6.3 adaptée). Coche le livrable, valide le quiz, et bienvenue au grade de Captain.`,
    checklist: [
      "J'ai mené une session Cowork réelle : dossier dédié, instructions, objectif + livrable (pas les étapes)",
      "Je suis intervenu en cours de route pour rediriger sans tout relancer",
      "J'ai relu et validé le livrable final — et les fichiers originaux sont intacts",
      "Je sais quels dossiers je n'autoriserai jamais sans le cadre du Module 11 (données sensibles)",
    ],
    quiz: [
      {
        q: "La différence fondamentale entre Chat et Cowork ?",
        options: [
          { label: "Cowork lit, modifie et crée des fichiers dans mes dossiers et exécute des tâches multi-étapes de bout en bout", correct: true },
          { label: "Cowork utilise un modèle plus intelligent" },
          { label: "Cowork est plus poli" },
        ],
        explanation: "Même intelligence, autre régime : l'architecture agentique de Claude Code, appliquée à tes dossiers.",
      },
      {
        q: "Le bon périmètre d'une session Cowork ?",
        options: [
          { label: "Un dossier de travail dédié contenant uniquement les fichiers utiles", correct: true },
          { label: "Tout le disque, pour qu'il ait « tout le contexte »" },
          { label: "Le dossier partagé de toute la boîte" },
        ],
        explanation: "Dossiers autorisés = périmètre de confiance. Étroit et net, toujours.",
      },
      {
        q: "Comment formuler une bonne demande Cowork ?",
        options: [
          { label: "Décrire l'objectif et le livrable attendu, et laisser l'agent trouver le chemin", correct: true },
          { label: "Dicter chaque étape une par une" },
          { label: "Rester vague pour ne pas le brider" },
        ],
        explanation: "Objectif + livrable + contraintes. Les étapes, c'est son travail ; le cap, c'est le tien.",
      },
      {
        q: "Cowork s'apprête à supprimer des fichiers « redondants ». Ton réflexe ?",
        options: [
          { label: "Relire la liste et donner un feu vert explicite — ou demander une action réversible (déplacer, lister)", correct: true },
          { label: "Laisser faire, c'est lui l'expert" },
          { label: "Débrancher le wifi" },
        ],
        explanation: "Tout ce qui supprime ou envoie passe par ta validation. Version réversible d'abord quand c'est possible.",
      },
    ],
  },
};
