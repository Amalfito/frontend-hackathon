import type { AcademyModule } from "@/lib/academy/types";

/* ============================================================================
 * MODULE 9 — n8n × Claude : l'usine à automatisations.
 * Les 3 façons de marier n8n et Claude, un atelier guidé, et les
 * garde-fous de prod.
 * ========================================================================== */

export const m9N8n: AcademyModule = {
  slug: "n8n",
  code: "M9",
  title: "n8n × Claude",
  tagline: "L'usine à automatisations : brancher Claude dans tes workflows — et tes workflows dans Claude.",
  icon: "🔀",
  badge: "Flow Master",
  audience: "Power Users & Builders",
  lessons: [
    {
      slug: "n8n-en-5-minutes",
      title: "n8n en 5 minutes",
      summary: "Plateforme d'automatisation visuelle : des nodes connectés, un déclencheur, des actions. Le vocabulaire pour tout comprendre ensuite.",
      minutes: 6,
      blocks: [
        {
          kind: "concept",
          title: "Des boîtes reliées par des fils",
          md: `**n8n** est une plateforme d'**automatisation visuelle** : tu construis des workflows en connectant des boîtes (les **nodes**) sur un canevas, sans écrire d'application complète. Chaque node fait UNE chose : recevoir un événement, transformer des données, appeler un service.

Deux points qui comptent pour Electra :
- **Open-source et self-hostable** : l'instance peut tourner sur NOS serveurs. Les données de sessions, de clients ou de foncier ne transitent pas par un cloud tiers d'automatisation — maîtrise des données, sujet non négociable.
- Des **centaines d'intégrations** natives : Slack, Notion, Gmail, webhooks, bases de données… et bien sûr l'API Anthropic.

L'anatomie d'un workflow est toujours la même : **un déclencheur → des actions**.`,
        },
        {
          kind: "demo",
          title: "Un workflow Electra type, node par node",
          md: `« Quand un ticket Intercom arrive → analyser → router → notifier Slack » se lit ainsi sur le canevas :

1. **Trigger** (déclencheur) : « nouveau ticket Intercom ». C'est l'étincelle — sans trigger, rien ne démarre. Ça peut aussi être un webhook, un email entrant, ou un horaire (« chaque lundi 8 h »).
2. **Node d'analyse** : un node IA appelle Claude pour classifier le ticket (catégorie, urgence — tu reconnais le pattern JSON du Module 8).
3. **Node IF** : route selon l'urgence. Urgence ≥ 4 → branche du haut ; sinon → branche du bas.
4. **Node Slack** : poste l'alerte dans le canal support pour les urgents.
5. **Node Notion** : archive les autres dans la base de suivi.

Chaque node reçoit les données du précédent, les transforme, les passe au suivant. Un workflow = une chaîne de production miniature.

Dernier mot de vocabulaire : les **credentials** — les identifiants (clé API Anthropic, token Slack…) que n8n stocke de façon chiffrée et que les nodes utilisent pour se connecter aux services. On y reviendra en leçon 9.4, c'est un point de sécurité clé.`,
        },
        {
          kind: "quiz",
          title: "Le vocabulaire est-il en place ?",
          questions: [
            {
              q: "Dans n8n, un « trigger », c'est…",
              options: [
                { label: "Le node déclencheur : l'événement qui démarre le workflow (ticket entrant, webhook, horaire)", correct: true },
                { label: "Un bouton d'arrêt d'urgence" },
                { label: "Le rapport final du workflow" },
                { label: "Un type d'erreur" },
              ],
              explanation: "Pas de trigger, pas de workflow : c'est toujours la première boîte du canevas.",
            },
            {
              q: "Un « node », c'est…",
              options: [
                { label: "Une boîte du canevas qui fait UNE opération : recevoir, transformer ou envoyer des données", correct: true },
                { label: "Le serveur qui héberge n8n" },
                { label: "Un utilisateur de l'instance" },
              ],
              explanation: "Un workflow est une chaîne de nodes : chacun reçoit les données du précédent et passe le résultat au suivant.",
            },
            {
              q: "Où vivent la clé API Anthropic et le token Slack utilisés par un workflow ?",
              options: [
                { label: "Dans les credentials n8n, stockés chiffrés dans l'instance", correct: true },
                { label: "En clair dans un node Code, c'est plus simple" },
                { label: "Dans le titre du workflow" },
              ],
              explanation: "Les credentials sont l'équivalent n8n de la variable d'environnement du Module 8 : le secret est stocké une fois, chiffré, et référencé par les nodes.",
            },
            {
              q: "Pourquoi le self-hosting de n8n compte pour Electra ?",
              options: [
                { label: "Les données (sessions, clients, foncier) restent sur notre infrastructure", correct: true },
                { label: "C'est plus joli en violet" },
                { label: "Ça rend les workflows plus rapides à dessiner" },
              ],
              explanation: "Open-source + self-hosting = maîtrise des données. Pour un opérateur qui manipule des données clients et réseau, c'est structurant.",
            },
          ],
        },
      ],
    },
    {
      slug: "trois-facons",
      title: "LA leçon clé : les 3 façons de marier n8n et Claude",
      summary: "Claude DANS n8n, n8n COMME OUTIL de Claude, Claude Code COMME BÂTISSEUR de n8n. Trois modes, trois usages — et un quiz de routage.",
      minutes: 10,
      blocks: [
        {
          kind: "concept",
          title: "Trois mariages possibles — retiens qui pilote qui",
          md: `C'est LA grille de lecture du module. Tout ce que tu feras avec n8n et Claude tombe dans un de ces trois modes :

## Mode 1 — Claude DANS n8n (l'IA comme node)
Un node **AI Agent** ou **LLM** appelle Claude **via l'API Anthropic** à chaque exécution du workflow. Le workflow pilote ; Claude est un maillon de la chaîne.
- Usage : **automatisations autonomes en prod** — classifier chaque ticket Intercom à l'arrivée, résumer chaque courrier mairie scanné, générer la description de chaque nouvelle station.
- Signature : « à chaque fois que X arrive, l'IA fait Y » — sans humain dans la boucle.

## Mode 2 — n8n COMME OUTIL de Claude (n8n = serveur MCP)
Tes workflows deviennent des **outils que Claude peut déclencher** depuis le chat. Deux branchements possibles : au niveau de l'instance (Settings → Instance-level MCP → **Enable MCP access**, puis ajouter l'URL comme connecteur custom dans Claude), OU workflow par workflow via le node **MCP Server Trigger**.
- Usage : tu dis en langage naturel « **lance le workflow de relance foncier pour le site d'Annecy** » — Claude déclenche le bon workflow avec les bons paramètres.
- Signature : « je veux commander mes automatisations depuis le chat » — l'humain (via Claude) pilote ; n8n exécute.

## Mode 3 — Claude Code COMME BÂTISSEUR de n8n
Via un **serveur MCP n8n** (ex. le projet open-source n8n-mcp), Claude Code **crée, valide et déploie** des workflows : tu décris le besoin, il câble le JSON des nodes, vérifie les connexions, pousse sur l'instance.
- Usage : **construire vite et beaucoup** — « monte-moi le workflow de veille des uptimes DACH avec alerte Slack sous 95 % », 15 workflows dans la semaine.
- Signature : « je veux fabriquer des workflows sans les dessiner à la main » — Claude est l'ouvrier ; n8n est le chantier.

Moyen mnémotechnique : Mode 1 = Claude **ouvrier dans** l'usine. Mode 2 = Claude **contremaître qui actionne** l'usine. Mode 3 = Claude **architecte qui construit** l'usine.`,
        },
        {
          kind: "tip",
          title: "Les modes se combinent",
          md: `Ce n'est pas un menu à choix unique : le workflow que Claude Code **construit** (mode 3) peut contenir un node AI Agent (mode 1) ET exposer un MCP Server Trigger pour être déclenché depuis le chat (mode 2). La vraie question à se poser pour chaque besoin : **qui doit appuyer sur le bouton — un événement, un humain, ou personne ?** Docs de référence : docs.n8n.io et docs.claude.com pour les connecteurs.`,
        },
        {
          kind: "quiz",
          title: "Quiz de routage : 6 besoins Electra, quel mode ?",
          questions: [
            {
              q: "« Chaque nouveau ticket Intercom doit être classifié et routé automatiquement, 24 h/24, sans intervention. »",
              options: [
                { label: "Mode 1 — Claude DANS n8n : node AI appelé à chaque exécution", correct: true },
                { label: "Mode 2 — n8n comme outil de Claude" },
                { label: "Mode 3 — Claude Code bâtisseur" },
              ],
              explanation: "Automatisation autonome déclenchée par un événement, sans humain : c'est la définition du mode 1.",
            },
            {
              q: "« Pendant ma revue foncier, je veux dire dans le chat : lance la relance mairie pour le site de Chambéry. »",
              options: [
                { label: "Mode 2 — n8n comme serveur MCP : le workflow devient un outil déclenchable en langage naturel", correct: true },
                { label: "Mode 1 — Claude dans n8n" },
                { label: "Mode 3 — Claude Code bâtisseur" },
              ],
              explanation: "Un humain commande une automatisation existante depuis le chat : MCP Server Trigger ou MCP d'instance, mode 2.",
            },
            {
              q: "« L'équipe NetOps a listé 15 workflows d'alerting à monter avant la fin du mois. Personne n'a le temps de les dessiner. »",
              options: [
                { label: "Mode 3 — Claude Code construit les workflows via un serveur MCP n8n (ex. n8n-mcp)", correct: true },
                { label: "Mode 1 — Claude dans n8n" },
                { label: "Mode 2 — n8n comme outil de Claude" },
              ],
              explanation: "Le besoin porte sur la FABRICATION en volume : tu décris, Claude Code câble le JSON des nodes, valide et déploie. Mode 3.",
            },
            {
              q: "« Chaque courrier mairie scanné doit être résumé et ses champs extraits vers Notion, dès réception. »",
              options: [
                { label: "Mode 1 — un node AI dans le workflow de réception fait l'extraction à chaque exécution", correct: true },
                { label: "Mode 2 — je demanderai à Claude de le faire courrier par courrier" },
                { label: "Mode 3 — Claude Code lit les courriers" },
              ],
              explanation: "« Dès réception, à chaque fois » = flux autonome en prod = mode 1. Le mode 2 remettrait un humain dans une boucle qui n'en a pas besoin.",
            },
            {
              q: "« Je veux pouvoir déclencher depuis Claude le workflow qui génère le rapport d'uptime hebdo, quand un membre du comité le demande. »",
              options: [
                { label: "Mode 2 — le workflow existe, il devient un outil de Claude via MCP", correct: true },
                { label: "Mode 1 — Claude dans n8n" },
                { label: "Mode 3 — reconstruire le workflow à chaque demande" },
              ],
              explanation: "Déclenchement à la demande depuis le chat d'un workflow existant : mode 2. Reconstruire à chaque fois (mode 3) serait absurde.",
            },
            {
              q: "« Mon workflow de suivi des sessions anormales existe mais je veux y ajouter une branche de notification par email — sans passer 2 h dans le canevas. »",
              options: [
                { label: "Mode 3 — Claude Code modifie le workflow via le serveur MCP n8n (après sauvegarde !)", correct: true },
                { label: "Mode 2 — je le déclenche plus fort" },
                { label: "Mode 1 — j'ajoute un node AI qui envoie l'email par magie" },
              ],
              explanation: "Modifier la STRUCTURE d'un workflow = travail de bâtisseur = mode 3. Et la leçon 9.4 t'expliquera pourquoi la sauvegarde préalable n'est pas optionnelle.",
            },
          ],
        },
      ],
    },
    {
      slug: "atelier-premier-workflow-ia",
      title: "Atelier guidé : ton premier workflow IA",
      summary: "Trigger → AI Agent (Claude) → IF → Slack/Notion : le classifieur de tickets du M8, version usine.",
      minutes: 10,
      blocks: [
        {
          kind: "concept",
          title: "Le plan de montage",
          md: `On assemble le workflow vu en leçon 9.1, pour de vrai. Cinq nodes, dans l'ordre :

1. **Webhook trigger** (ou Email trigger) — la porte d'entrée des tickets ;
2. **AI Agent** — Claude classifie via l'API Anthropic ;
3. **IF** — aiguillage sur l'urgence ;
4. **Slack** — alerte pour les urgents ;
5. **Notion** — archivage pour le reste.

Tu retrouves tes acquis : le **prompt de classification JSON strict** vient droit des Modules 2 et 8. Un workflow IA, c'est un bon prompt entouré de plomberie.

Pas d'instance n8n sous la main ? Le **Flow Lab de la page Playground** simule le montage node par node — la maquette validée là-bas compte pour le checkpoint.`,
        },
        {
          kind: "demo",
          title: "Étape 1 — Le déclencheur",
          md: `Ajoute un node **Webhook** : n8n te donne une URL unique. Tout ticket POSTé sur cette URL (depuis Intercom, un formulaire, ou ton test avec curl) démarre le workflow avec le contenu du ticket dans les données.

Variante : un node **Email Trigger (IMAP)** si tes demandes arrivent dans une boîte support@ — le corps de l'email devient la donnée d'entrée.

Réflexe de test : chaque node a un bouton d'exécution individuelle. Envoie un ticket fictif (« La borne 2 de Vélizy refuse ma carte, je suis pressé ! ») et vérifie que le webhook le reçoit AVANT de câbler la suite. On monte un workflow node par node, jamais d'un bloc.`,
        },
        {
          kind: "demo",
          title: "Étape 2 — Le node AI Agent (Claude)",
          md: `Ajoute le node **AI Agent** (ou un node LLM simple : pour une classification sans outils, il suffit largement) :

1. **Credentials** : sélectionne (ou crée) les credentials **Anthropic** de l'instance — la clé API se colle UNE fois dans le coffre de n8n, jamais dans le node ;
2. **Modèle** : un modèle rapide et économique — c'est le réflexe volume du Module 8 ;
3. **Prompt système** : le prompt de classification ci-dessous ;
4. **Entrée utilisateur** : mappe le texte du ticket reçu par le webhook (glisser-déposer du champ dans n8n).

Exécute le node seul avec ton ticket fictif : tu dois voir sortir un JSON propre.`,
        },
        {
          kind: "code",
          title: "Le prompt système du node AI (JSON strict, hérité du M8)",
          lang: "text",
          code: `Tu es le classifieur de tickets support d'Electra, opérateur de
recharge rapide pour véhicules électriques.

On te donne le texte brut d'un ticket client. Réponds UNIQUEMENT
avec un objet JSON valide, sans texte avant ou après, au format :

{
  "categorie": "panne_borne" | "facturation" | "roaming" | "application" | "autre",
  "urgence": 1-5,
  "resume": "une phrase en français",
  "station": "nom de la station si mentionnée, sinon null"
}

Règles :
- urgence 5 = client bloqué sur place ou incident de sécurité
- urgence 4 = borne hors service ou double facturation
- urgence 1-2 = question d'information, suggestion
- en cas de doute sur la catégorie : "autre", jamais d'invention`,
        },
        {
          kind: "demo",
          title: "Étapes 3, 4, 5 — Aiguiller puis notifier",
          md: `1. **Node IF** : condition sur le champ \`urgence\` du JSON produit par l'AI Agent — « urgence supérieure ou égale à 4 » → branche **true**, le reste → branche **false**. (Si le JSON sort en texte, ajoute un petit node de parsing avant — n8n sait faire.)
2. **Branche true → node Slack** : message dans le canal support, du genre « 🚨 Ticket urgent [urgence] — [resume] — station : [station] », en mappant les champs du JSON.
3. **Branche false → node Notion** : une ligne dans la base « Tickets classifiés » avec catégorie, résumé, station, date.

**Le test final** : active le workflow, envoie 3 tickets fictifs — un urgent (« borne HS, client bloqué au Hub de Rungis »), un calme (« comment marche le roaming avec ma carte tierce ? »), un ambigu. Vérifie : l'urgent atterrit dans Slack, les autres dans Notion. Si l'ambigu est mal routé → ajuste les règles d'urgence du prompt, pas le node IF. Le prompt est ton levier de précision.`,
        },
        {
          kind: "exercise",
          title: "🛠️ Monte-le (pour de vrai ou dans le Flow Lab)",
          md: `À toi : monte le workflow complet, sur une instance n8n de test ou dans le **Flow Lab du Playground**. Si tu bloques sur un node, colle une capture ou la config à Claude avec le prompt ci-dessous.`,
          prompt: "Je monte mon premier workflow IA dans n8n : Webhook trigger → node AI Agent (Claude via credentials Anthropic) qui classifie des tickets support Electra en JSON strict (categorie, urgence 1-5, resume, station) → node IF sur urgence >= 4 → Slack (urgents) / Notion (archive). Guide-moi étape par étape : pour chaque node, dis-moi quoi configurer exactement, comment mapper les champs entre nodes, et donne-moi 3 tickets fictifs de test (un urgence 5, un urgence 1, un ambigu). Je te décrirai ce que je vois après chaque étape — attends ma confirmation avant de passer à la suivante.",
          checklist: [
            "Mon trigger reçoit un ticket fictif et je vois les données entrer",
            "Le node AI sort un JSON valide avec les 4 champs (testé seul avant de câbler la suite)",
            "Le node IF route correctement selon l'urgence",
            "Le ticket urgent arrive dans Slack, le calme dans Notion",
            "J'ai testé un ticket ambigu et ajusté le PROMPT (pas le IF) si besoin",
          ],
        },
      ],
    },
    {
      slug: "best-practices-prod",
      title: "Best practices : l'usine sans les incendies",
      summary: "Validation humaine, sauvegardes, rotation des clés, logs, environnement de test — et QUI détient les credentials.",
      minutes: 8,
      blocks: [
        {
          kind: "warning",
          title: "Un workflow IA en prod agit sans te demander",
          md: `C'est sa force et son danger : une fois activé, il tourne à chaque déclenchement, y compris quand le prompt dévie ou que la donnée d'entrée est pourrie. Les 5 garde-fous non négociables :

1. **Validation humaine avant toute action sur l'argent ou les données personnelles.** Rembourser un client, modifier une fiche client, envoyer un courrier officiel à une mairie : le workflow PRÉPARE (brouillon, message Slack « approuver / rejeter »), un humain VALIDE. Jamais d'IA en écriture directe sur ces sujets.
2. **Sauvegarde avant modification par une IA.** Avant de laisser Claude Code (mode 3) toucher un workflow : **exporte le JSON** (copie de sauvegarde versionnée). Un agent qui « améliore » ton workflow peut aussi le casser — la restauration doit prendre 30 secondes.
3. **Rotation des clés API.** Les credentials n8n (Anthropic, Slack, Notion) se renouvellent périodiquement, et immédiatement au moindre doute de fuite. Une clé compromise dans une usine à automatisations, c'est une usine compromise.
4. **Logs et gestion d'erreur sur chaque node critique.** Configure le comportement d'erreur des nodes sensibles (continuer ? alerter ? workflow d'erreur dédié ?) et garde les executions consultables. Le lundi où 200 tickets sont mal routés, tu veux savoir LEQUEL des nodes a dévié, et depuis quand.
5. **Commencer en environnement de test.** Nouvelle automatisation = instance ou workflow de test, données fictives, canal Slack de test. La promotion en prod se mérite : seulement après des exécutions propres sur des cas variés.`,
        },
        {
          kind: "concept",
          title: "Qui détient les clés ? n8n, pas le MCP de Claude",
          md: `Point de confusion classique, réglons-le : les **credentials d'un workflow n8n sont configurés DANS n8n** (le coffre chiffré de l'instance). Quand ton workflow appelle Claude, Slack ou Notion en prod, il utilise SES credentials à lui.

Le serveur MCP côté Claude (mode 3) sert à **explorer et construire** — lister les workflows, câbler des nodes, valider du JSON. Il n'est **pas le runtime** : débrancher Claude ne doit RIEN changer à tes workflows en prod, et donner un accès MCP à quelqu'un ne lui donne pas les secrets des workflows.

Deux trousseaux, deux usages : le badge du **visiteur-architecte** (MCP) n'ouvre pas les armoires de l'**usine** (credentials n8n). Si un jour on te propose un montage où ça se mélange, c'est un signal d'alarme.`,
        },
        {
          kind: "sort",
          title: "Mini-jeu : bonne pratique ou piège ?",
          instructions: "L'équipe passe en revue les habitudes prises sur l'instance n8n d'Electra. Trie chaque habitude : garde-fou solide ou incendie en préparation ?",
          categories: ["Bonne pratique", "Piège"],
          items: [
            { label: "Le workflow de remboursement poste une demande d'approbation Slack ; un humain clique avant tout paiement", category: "Bonne pratique" },
            { label: "Export JSON du workflow AVANT de laisser Claude Code le modifier", category: "Bonne pratique" },
            { label: "Rotation trimestrielle des credentials Anthropic et Slack de l'instance", category: "Bonne pratique" },
            { label: "Chaque node critique a un comportement d'erreur défini + un workflow d'alerte en cas d'échec", category: "Bonne pratique" },
            { label: "Le nouveau classifieur tourne 2 semaines sur un canal Slack de test avant la prod", category: "Bonne pratique" },
            { label: "Le workflow envoie directement les courriers officiels aux mairies, « l'IA rédige très bien »", category: "Piège" },
            { label: "Claude Code modifie les workflows de prod en direct, sans sauvegarde : « il est prudent »", category: "Piège" },
            { label: "La clé API Anthropic traîne en clair dans un node Code « en attendant »", category: "Piège" },
            { label: "Les erreurs de nodes sont ignorées : « si ça plante, le ticket suivant passera »", category: "Piège" },
            { label: "Donner l'URL MCP de l'instance à un prestataire « puisque les credentials sont ailleurs, aucun risque »", category: "Piège" },
          ],
        },
        {
          kind: "tip",
          title: "La checklist de mise en prod, à copier quelque part",
          md: `Avant d'activer un workflow IA sur des données réelles, cinq questions : **1)** Que se passe-t-il si le node IA renvoie n'importe quoi ? **2)** Quelle action irréversible ce workflow peut-il faire, et qui la valide ? **3)** Où est la sauvegarde du JSON ? **4)** Qui est alerté en cas d'échec, et comment ? **5)** A-t-il tourné sur des données fictives d'abord ? Cinq oui = active. Un doute = reste en test.`,
        },
      ],
    },
  ],
  checkpoint: {
    title: "Checkpoint — Flow Master",
    md: `Le livrable : **un workflow IA fonctionnel** — ou sa **maquette complète validée dans le Flow Lab** du Playground si tu n'as pas d'instance n8n sous la main. Les deux comptent : ce qu'on valide, c'est que tu sais penser et assembler la chaîne trigger → IA → routage → action.

## Ta mission
1. Choisis ton flux : le classifieur de tickets de l'atelier 9.3, OU un flux de TON métier (courriers mairie → extraction → Notion ; alerte uptime → résumé → Slack ; demande de raccordement → analyse → routage…).
2. Assemble-le : un trigger, un node IA avec prompt JSON strict, au moins un aiguillage (IF), au moins une action de sortie (Slack, Notion, email).
3. Teste avec 3 cas fictifs minimum, dont un ambigu.
4. Passe-le au crible de la checklist de mise en prod (leçon 9.4) — même pour une maquette : l'exercice mental compte autant que le montage.`,
    checklist: [
      "Mon workflow (ou sa maquette Flow Lab) enchaîne trigger → node IA → IF → action de sortie",
      "Le node IA produit un JSON strict et je sais lequel de mes prompts le garantit",
      "J'ai testé 3 cas fictifs dont un ambigu, et le routage est correct",
      "Les credentials sont dans n8n (et je sais expliquer pourquoi pas dans le MCP de Claude)",
      "J'ai appliqué la checklist de mise en prod : validation humaine, sauvegarde, gestion d'erreur",
    ],
    quiz: [
      {
        q: "« Chaque nouveau ticket est classifié automatiquement, sans humain » : quel mode du mariage n8n × Claude ?",
        options: [
          { label: "Mode 1 — Claude DANS n8n : un node AI appelé à chaque exécution", correct: true },
          { label: "Mode 2 — n8n comme outil de Claude" },
          { label: "Mode 3 — Claude Code bâtisseur" },
        ],
        explanation: "Automatisation autonome en prod = Claude est un maillon du workflow. Mode 1.",
      },
      {
        q: "« Lance le workflow de relance foncier pour le site X » dit dans le chat : quel branchement ?",
        options: [
          { label: "Mode 2 — MCP : Instance-level MCP activé ou node MCP Server Trigger sur le workflow", correct: true },
          { label: "Mode 1 — un node AI Agent dans le workflow" },
          { label: "Aucun : impossible de déclencher n8n depuis Claude" },
        ],
        explanation: "n8n exposé comme serveur MCP fait de tes workflows des outils déclenchables en langage naturel. Mode 2.",
      },
      {
        q: "Construire 15 workflows d'alerting en une semaine : le levier ?",
        options: [
          { label: "Mode 3 — Claude Code câble le JSON des nodes via un serveur MCP n8n (ex. n8n-mcp), valide et déploie", correct: true },
          { label: "Les dessiner un par un à la souris, c'est plus authentique" },
          { label: "Mode 2 — les déclencher avant de les avoir construits" },
        ],
        explanation: "Fabrication en volume = Claude Code bâtisseur. Tu décris, il câble — toi tu relis et tu testes.",
      },
      {
        q: "Le workflow doit rembourser un client quand l'IA détecte une double facturation. Le montage correct ?",
        options: [
          { label: "L'IA prépare, un humain approuve (ex. boutons Slack) avant tout paiement", correct: true },
          { label: "Remboursement direct : l'IA détecte très bien" },
          { label: "On désactive les remboursements, trop risqué" },
        ],
        explanation: "Argent et données personnelles = validation humaine obligatoire. L'IA propose, l'humain dispose.",
      },
      {
        q: "Avant de laisser Claude Code modifier un workflow existant…",
        options: [
          { label: "Export du JSON en copie de sauvegarde — la restauration doit prendre 30 secondes", correct: true },
          { label: "Rien : Claude fait toujours attention" },
          { label: "On supprime les logs pour repartir propre" },
        ],
        explanation: "Un agent qui améliore peut aussi casser. Sauvegarde d'abord, modification ensuite.",
      },
      {
        q: "Les credentials utilisés par un workflow n8n en prod vivent…",
        options: [
          { label: "Dans n8n (coffre chiffré de l'instance) — le MCP de Claude sert à explorer et construire, pas au runtime", correct: true },
          { label: "Dans la configuration MCP de Claude, c'est lui le chef" },
          { label: "En clair dans un node Code, pour aller vite" },
        ],
        explanation: "Deux trousseaux, deux usages : débrancher Claude ne doit rien changer aux workflows en prod.",
      },
    ],
  },
};
