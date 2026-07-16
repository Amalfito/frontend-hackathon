import type { AcademyModule } from "@/lib/academy/types";

/* ============================================================================
 * MODULE 4 — Connecteurs, plugins et MCP : brancher Claude à l'environnement
 * Electra. Claude est le véhicule, MCP est la prise CCS, chaque serveur MCP
 * est une borne qui délivre un service.
 * ========================================================================== */

export const m4Mcp: AcademyModule = {
  slug: "mcp",
  code: "M4",
  title: "Connecteurs, plugins et MCP",
  tagline: "Brancher Claude à Slack, Notion, Linear, Omni et tout l'outillage Electra — sans écrire une ligne de code.",
  icon: "🔧",
  badge: "MCP Mécano",
  audience: "Tous",
  lessons: [
    {
      slug: "usb-c-de-lia",
      title: "MCP, le « USB-C de l'IA »",
      summary: "Un standard ouvert pour brancher n'importe quel outil à n'importe quel modèle. Serveur, client, outils, ressources : les 4 pièces du puzzle.",
      minutes: 7,
      blocks: [
        {
          kind: "concept",
          title: "Avant / après MCP",
          md: `Le **Model Context Protocol (MCP)** est un standard ouvert créé par Anthropic fin 2024 — désormais géré par une fondation au sein de la Linux Foundation. Il définit **comment un modèle d'IA découvre et appelle des outils externes**.

- **Avant** : chaque connexion IA ↔ outil était une intégration sur mesure. Brancher 10 outils à 3 assistants = 30 développements spécifiques. Ingérable.
- **Après** : tout outil qui « parle MCP » se branche à tout client qui « parle MCP ». Une prise universelle — d'où le surnom de **USB-C de l'IA**.

Chez Electra, la métaphore parfaite existe déjà : c'est le **CCS**. Peu importe la marque du véhicule, peu importe l'opérateur de la borne — si les deux respectent le standard de prise, la charge démarre. Ici : **Claude est le véhicule, MCP est le standard de prise, chaque serveur MCP est une borne** qui délivre un service (Slack, Notion, Linear…).`,
        },
        {
          kind: "flipcards",
          title: "Les 4 pièces du puzzle (clique pour retourner)",
          cards: [
            {
              front: "🔌 Serveur MCP",
              back: "Le programme qui EXPOSE des capacités. Ex. : le serveur MCP de Notion expose « chercher une page », « créer une page », « lire une base ». C'est la borne : elle délivre le service.",
            },
            {
              front: "🚗 Client MCP",
              back: "L'application côté modèle qui se branche aux serveurs : claude.ai, Claude Desktop, Claude Code. C'est le véhicule : il consomme le service via la prise standard.",
            },
            {
              front: "🛠️ Outils (tools)",
              back: "Des ACTIONS que le modèle peut appeler : « envoyer un message Slack », « créer un ticket Linear », « chercher dans Drive ». Chaque outil a un nom, des paramètres, une description.",
            },
            {
              front: "📦 Ressources",
              back: "Des DONNÉES que le serveur met à disposition en lecture : une page Notion, un fichier, un dashboard. Outils = agir, ressources = consulter. Les deux se combinent.",
            },
          ],
        },
        {
          kind: "tip",
          title: "Pourquoi ça te concerne, même sans être dev",
          md: `Sans connecteurs, Claude ne connaît **que** ce que tu colles dans le chat. Avec MCP, il va chercher lui-même : le thread Slack sur la panne du hub de Lyon, la page Notion du process d'ouverture de station, tes tickets Linear. Le contexte arrive tout seul — et c'est là que Claude passe de « bon stagiaire » à « collègue branché au réseau ».`,
        },
        {
          kind: "quiz",
          title: "Vérifie que la prise est bien enclenchée",
          questions: [
            {
              q: "Dans la métaphore Electra, le serveur MCP de Notion, c'est…",
              options: [
                { label: "La borne : il délivre un service (chercher, créer des pages) via un standard", correct: true },
                { label: "Le véhicule : il consomme le service" },
                { label: "Le kWh : l'unité de mesure" },
                { label: "Le câble USB-C rangé dans le coffre" },
              ],
              explanation: "Le serveur EXPOSE des capacités, comme la borne délivre de l'énergie. Le client (claude.ai, Claude Code) est le véhicule qui s'y branche.",
            },
            {
              q: "Quelle est la différence entre un outil et une ressource MCP ?",
              options: [
                { label: "Outil = une action à exécuter, ressource = une donnée à consulter", correct: true },
                { label: "Outil = payant, ressource = gratuit" },
                { label: "Aucune, ce sont deux noms pour la même chose" },
                { label: "Outil = local, ressource = cloud" },
              ],
              explanation: "« Créer un ticket Linear » est un outil (action). « La page Notion du process foncier » est une ressource (donnée).",
            },
            {
              q: "Pourquoi dit-on que MCP est le « USB-C de l'IA » ?",
              options: [
                { label: "Un standard unique remplace N intégrations sur mesure : tout serveur compatible se branche à tout client compatible", correct: true },
                { label: "Parce qu'il ne fonctionne qu'en filaire" },
                { label: "Parce qu'Anthropic vend des câbles" },
                { label: "Parce qu'il charge les batteries plus vite" },
              ],
              explanation: "Exactement comme le CCS côté recharge : le standard élimine la question « est-ce que ma prise est compatible ? ».",
            },
          ],
        },
      ],
    },
    {
      slug: "connecteurs-electra",
      title: "Les connecteurs déjà branchés chez Electra",
      summary: "Le parc de bornes déjà installé : Slack, Notion, Linear, Omni, Sitetracker et compagnie — avec des cas d'usage concrets pour chacun.",
      minutes: 9,
      blocks: [
        {
          kind: "concept",
          title: "Tu n'as (presque) rien à installer",
          md: `Bonne nouvelle : chez Electra, un parc entier de connecteurs est **déjà branché** dans claude.ai. Ton travail n'est pas de les installer, c'est de savoir **lesquels appeler pour quel besoin**. Passe les cartes ci-dessous en revue : chaque connecteur vient avec des cas d'usage réels, prêts à voler.`,
        },
        {
          kind: "flipcards",
          title: "Groupe 1 — Communiquer et documenter",
          cards: [
            {
              front: "💬 Slack",
              back: "« Résume le canal #ops-incidents des dernières 24h. » « Retrouve la décision prise sur le hub de Bordeaux le mois dernier. » « Rédige un brouillon de message pour annoncer la maintenance de samedi. »",
            },
            {
              front: "📓 Notion",
              back: "« Vérifie que ce brouillon respecte notre process d'ouverture de station. » « Cherche la doc du parcours roaming et résume les prérequis. » « Crée la page de rétro du sprint avec ce contenu. »",
            },
            {
              front: "📧 Gmail + 📅 Calendar + 📁 Drive",
              back: "« Prépare un brief pour ma réunion de 14h : participants, derniers échanges, docs liés. » « Retrouve le mail du gestionnaire de réseau sur le raccordement d'Annecy. » « Liste les docs Drive modifiés cette semaine sur le dossier foncier. »",
            },
            {
              front: "🏢 Atlassian (Confluence/Jira)",
              back: "« Résume la page Confluence sur la procédure de mise en service d'une borne. » « Quels tickets Jira infra sont bloqués depuis plus de 10 jours ? »",
            },
          ],
        },
        {
          kind: "flipcards",
          title: "Groupe 2 — Produire, suivre, réparer",
          cards: [
            {
              front: "📐 Linear",
              back: "« Liste mes tickets en cours et propose une priorisation argumentée. » « Crée un ticket à partir de ce thread Slack sur le bug de facturation. » « Résume l'avancement du cycle en cours pour le standup. »",
            },
            {
              front: "🐶 Datadog + 🐛 Bugsnag",
              back: "« Explique ce pic d'erreurs de 9h12 sur l'API sessions et rédige le message d'incident. » « Quelles sont les 5 erreurs Bugsnag les plus fréquentes sur l'app cette semaine ? »",
            },
            {
              front: "🎧 HubSpot + Intercom",
              back: "« Analyse les 50 derniers tickets Intercom, sors les 5 irritants récurrents. » « Résume l'historique HubSpot de ce partenaire foncier avant mon call. » « Quels tickets mentionnent des échecs de session sur le hub de Nantes ? »",
            },
            {
              front: "🏗️ Sitetracker (Salesforce)",
              back: "« Où en sont les jalons du déploiement de la station de Grenoble ? » « Liste les sites en attente de permis depuis plus de 90 jours. » « Croise les dates de mise en service prévues avec les raccordements Enedis. »",
            },
          ],
        },
        {
          kind: "flipcards",
          title: "Groupe 3 — Design, finance, data et l'artillerie interne",
          cards: [
            {
              front: "🎨 Figma + Miro + Canva + Excalidraw",
              back: "« Décris les écrans de ce fichier Figma pour rédiger les specs. » « Transforme ce brainstorm Miro en plan d'action. » « Génère un diagramme Excalidraw du parcours de charge. »",
            },
            {
              front: "💶 Pigment + Payflows + Omni Analytics",
              back: "« Interroge Omni : évolution du volume de kWh délivrés par hub sur 3 mois. » « Quel est le statut de cette demande d'achat Payflows ? » Finance et BI en langage naturel, sans exporter un seul CSV.",
            },
            {
              front: "⚡ electra-pe-core / electra-pe-inside",
              back: "Nos MCP internes maison : accès aux données produit et internes d'Electra (stations, sessions, référentiels). C'est le branchement direct sur notre propre réseau — à utiliser dès que la question porte sur NOS données.",
            },
            {
              front: "🧰 Et le reste du garage",
              back: "Docusign (contrats), Zapier et n8n (automatisations), Customer.io (campagnes CRM), Adjust (attribution app), GitGuardian (secrets), Context7 (docs techniques à jour), Pappers (données légales des sociétés foncières), Lemlist + FullEnrich (prospection B2B).",
            },
          ],
        },
        {
          kind: "tip",
          title: "Claude demande confirmation avant d'écrire : c'est normal et sain",
          md: `Lire un canal Slack ne modifie rien. **Créer** un ticket Linear, **envoyer** un message, **écrire** dans Notion : là, Claude te montre ce qu'il s'apprête à faire et attend ton feu vert. Ce n'est pas de la lenteur, c'est ta ceinture de sécurité. Relis toujours avant de valider.`,
        },
        {
          kind: "exercise",
          title: "🛠️ Ta première tâche à 2 connecteurs",
          md: `Réalise **une vraie tâche de ton quotidien** qui combine **deux connecteurs** : un pour lire, un pour écrire. L'exemple classique : lire un thread Slack et créer le ticket Linear correspondant. Adapte le prompt à un cas réel de ta semaine (un vrai thread, un vrai besoin). Observe le moment où Claude demande confirmation avant d'écrire.`,
          prompt: `Lis le thread Slack du canal #ops-incidents sur [décris l'incident, ex. les échecs de session répétés sur la borne 3 du hub de Bordeaux-Lac]. Ensuite :
1. Résume le problème en 3 lignes : symptôme, impact (sessions/kWh perdus), hypothèses évoquées.
2. Prépare un ticket Linear dans l'équipe [ton équipe] : titre actionnable, description structurée (contexte, étapes de repro si connues, impact), priorité proposée avec justification.
3. Montre-moi le ticket AVANT de le créer — je valide ou j'ajuste.`,
          checklist: [
            "J'ai fait lire un vrai contenu à Claude via un premier connecteur (Slack, Gmail, Notion…)",
            "Claude a produit un livrable dans un second connecteur (Linear, Notion…)",
            "Claude m'a demandé confirmation avant l'écriture, et j'ai relu avant de valider",
            "Le résultat est directement utilisable (je n'ai pas eu à tout refaire)",
          ],
        },
      ],
    },
    {
      slug: "ajouter-un-connecteur",
      title: "Ajouter un connecteur soi-même",
      summary: "Répertoire, connecteur custom, MCP local : les trois façons de brancher une nouvelle borne — et la règle de sécurité Electra qui va avec.",
      minutes: 6,
      blocks: [
        {
          kind: "demo",
          title: "Le chemin dans claude.ai, pas à pas",
          md: `1. Ouvre **claude.ai** → **Réglages** → **Connecteurs**.
2. Deux options : choisir un connecteur du **répertoire** (catalogue de serveurs vérifiés : Notion, Linear, Slack…) ou cliquer **« Add custom connector »** et coller l'**URL d'un serveur MCP distant**.
3. Le service t'envoie vers son écran **OAuth** : tu te connectes avec ton compte Electra et tu autorises l'accès.
4. Tu peux ensuite **activer des outils précis** plutôt que tout le serveur — un connecteur Slack en lecture seule, c'est souvent tout ce dont tu as besoin.

À la première utilisation dans une conversation, Claude te redemandera parfois d'autoriser l'outil : c'est le fonctionnement normal.`,
        },
        {
          kind: "concept",
          title: "Trois types de branchement",
          md: `- **Répertoire** : le catalogue intégré de claude.ai. Serveurs officiels, OAuth géré, zéro friction. Ton premier réflexe.
- **Connecteur custom** : tu fournis l'URL d'un serveur MCP **distant** (hébergé quelque part). C'est ainsi qu'on branche nos MCP internes \`electra-pe-core\` et \`electra-pe-inside\`.
- **MCP local** : réservé à **Claude Desktop** (et Claude Code) — le serveur tourne sur TA machine, déclaré dans un fichier de **config JSON**. Utile pour des outils qui touchent tes fichiers locaux ; c'est le territoire des builders.`,
        },
        {
          kind: "warning",
          title: "Règle Electra : on ne branche pas n'importe quelle borne",
          md: `Un serveur MCP a potentiellement accès à **tes données et tes autorisations**. Un serveur malveillant trouvé sur internet peut exfiltrer ce qu'il lit ou détourner les instructions de Claude.

**La règle est simple : tout serveur MCP hors répertoire officiel passe par une validation IT/sécurité AVANT branchement.** Tu as trouvé un serveur MCP génial pour Sitetracker sur un forum ? Super — tu le proposes à l'équipe sécu, tu ne le branches pas. Le pourquoi et le comment complets t'attendent au **Module 11**.`,
        },
        {
          kind: "quiz",
          title: "Le permis de brancher",
          questions: [
            {
              q: "Tu veux brancher notre MCP interne electra-pe-inside dans claude.ai. Quel chemin ?",
              options: [
                { label: "Réglages → Connecteurs → « Add custom connector » → URL du serveur → OAuth", correct: true },
                { label: "L'installer depuis l'App Store" },
                { label: "Coller l'URL directement dans une conversation" },
                { label: "Impossible, les MCP internes n'existent pas dans claude.ai" },
              ],
              explanation: "Un MCP interne est un serveur distant hors répertoire : c'est le cas d'usage exact du connecteur custom.",
            },
            {
              q: "Un collègue partage l'URL d'un serveur MCP « météo pour prévision de charge » trouvé sur GitHub. Tu fais quoi ?",
              options: [
                { label: "Je le soumets à la validation IT/sécu avant tout branchement", correct: true },
                { label: "Je le branche : s'il est sur GitHub, c'est fiable" },
                { label: "Je le branche mais seulement le week-end" },
                { label: "Je le branche sur le compte d'un collègue pour tester" },
              ],
              explanation: "Serveur hors répertoire = validation obligatoire. Un MCP voit tes données ; on n'y branche pas un inconnu.",
            },
            {
              q: "La différence entre un connecteur du répertoire et un MCP local ?",
              options: [
                { label: "Répertoire = serveur distant vérifié dans claude.ai ; local = serveur qui tourne sur ta machine, déclaré en config JSON dans Claude Desktop", correct: true },
                { label: "Le local est plus rapide donc toujours meilleur" },
                { label: "Le répertoire est payant, le local gratuit" },
                { label: "Aucune : « local » et « répertoire » sont synonymes" },
              ],
              explanation: "Deux mondes : le répertoire vit dans claude.ai (zéro install), le MCP local vit sur ton poste via Claude Desktop.",
            },
          ],
        },
      ],
    },
    {
      slug: "sous-le-capot",
      title: "Sous le capot : anatomie d'un appel d'outil",
      summary: "Choisir → appeler → lire → synthétiser : la boucle que Claude déroule à chaque connecteur. La comprendre, c'est savoir débugger.",
      minutes: 7,
      blocks: [
        {
          kind: "concept",
          title: "Les 4 temps du moteur",
          md: `Quand tu demandes « prépare mon brief de réunion », Claude ne « sait » pas magiquement : il déroule une boucle en 4 temps.

1. **Choisir** : parmi tous les outils branchés, lesquels sont pertinents ? (calendrier d'abord, puis mails, puis Drive)
2. **Appeler** : il invoque chaque outil avec des **paramètres précis** (une requête de recherche, une plage de dates).
3. **Lire** : il analyse les résultats bruts renvoyés par le serveur.
4. **Synthétiser** : il assemble le tout en réponse — ou décide qu'il lui faut un appel de plus.

Chaque résultat peut déclencher un nouvel appel : c'est la boucle d'agent du Module 0, version branchée.`,
        },
        {
          kind: "code",
          title: "Trace d'exécution annotée (pseudo-trace lisible)",
          lang: "text",
          code: `TOI > "Prépare le brief de ma réunion de 14h"

[1. CHOISIR]  outils pertinents : google_calendar, gmail, drive
[2. APPELER]  google_calendar.list_events(date="aujourd'hui", heure="14:00")
[3. LIRE]     → "Comité déploiement — Hub Annecy" · 4 participants
              → l'agent découvre le SUJET : il peut affiner la suite

[2. APPELER]  gmail.search(query="Hub Annecy", periode="14 derniers jours")
[3. LIRE]     → 6 mails · dont 1 alerte : "retard raccordement Enedis"
[2. APPELER]  drive.search(query="Annecy comité déploiement")
[3. LIRE]     → "Business case Annecy v3.xlsx" · "CR visite foncier.pdf"

[4. SYNTHÉTISER]
   Brief : ordre du jour probable, point chaud (retard Enedis),
   2 docs à relire, 3 questions à poser en séance.

>> Note : à l'étape [3], si la recherche Gmail avait renvoyé 0 résultat,
>> l'agent aurait retenté avec d'autres mots-clés ("Annecy", "raccordement")
>> — ou t'aurait dit qu'il n'a rien trouvé. C'est LÀ que tu peux l'aider.`,
        },
        {
          kind: "tip",
          title: "Comprendre la trace = savoir débugger",
          md: `Quand « il n'a pas trouvé », ce n'est presque jamais mystique. Trois suspects, dans l'ordre :

1. **Les mots-clés** : l'outil a cherché « Hub Annecy » mais le thread s'appelle « Station 74 ». → Reformule, donne les termes exacts.
2. **La période** : la recherche portait sur 14 jours, la décision date de mars. → Précise la plage de dates.
3. **Les droits** : Claude ne voit que ce que TON compte voit. Canal privé, dossier non partagé = invisible. → Vérifie tes accès.

Demande-lui « montre-moi quels outils tu as appelés et avec quels paramètres » : la trace est ta jauge de diagnostic.`,
        },
        {
          kind: "quiz",
          title: "Quiz de debugging : la panne est où ?",
          questions: [
            {
              q: "« Résume les échanges Slack sur la panne de Bordeaux » → Claude répond qu'il ne trouve rien. Le thread existe, dans un canal privé où tu n'es pas membre. Le problème ?",
              options: [
                { label: "Les droits : Claude ne voit que ce que ton compte voit — canal privé non joint = invisible", correct: true },
                { label: "Le modèle est trop petit" },
                { label: "Slack est en panne" },
                { label: "Il faut crier plus fort dans le prompt" },
              ],
              explanation: "Les connecteurs héritent de TES autorisations. Pas d'accès au canal = pas de résultat, quelle que soit la formulation.",
            },
            {
              q: "« Retrouve la décision sur les tarifs roaming » → rien. Le doc existe, il s'appelle « Pricing partenaires eMSP Q2 ». Ton meilleur coup ?",
              options: [
                { label: "Reformuler avec les termes exacts du doc : « pricing », « eMSP », « partenaires »", correct: true },
                { label: "Débrancher et rebrancher le connecteur" },
                { label: "Attendre demain, ça ira mieux" },
                { label: "Conclure que MCP ne marche pas" },
              ],
              explanation: "L'outil de recherche cherche ce qu'on lui donne. Vocabulaire du prompt ≠ vocabulaire du doc = zéro résultat. Aligne les termes.",
            },
            {
              q: "« Analyse les tickets Intercom sur les échecs de paiement » → Claude ne remonte que 3 tickets récents alors qu'il y en a eu 40 sur le trimestre. L'hypothèse la plus probable ?",
              options: [
                { label: "La période : la recherche a porté sur une fenêtre courte par défaut → préciser « sur les 3 derniers mois »", correct: true },
                { label: "Les 37 autres tickets ont été supprimés" },
                { label: "Claude a la flemme" },
                { label: "Intercom bride volontairement l'IA" },
              ],
              explanation: "Sans plage de dates explicite, beaucoup d'outils cherchent « récent ». Précise toujours la période quand le volume compte.",
            },
            {
              q: "Réflexe universel quand un appel d'outil déçoit ?",
              options: [
                { label: "Demander à Claude quels outils il a appelés et avec quels paramètres, puis corriger mots-clés / période / droits", correct: true },
                { label: "Réessayer le même prompt 5 fois à l'identique" },
                { label: "Ouvrir un ticket IT immédiatement" },
                { label: "Revenir au copier-coller manuel pour toujours" },
              ],
              explanation: "La trace te dit OÙ ça a coincé. Même prompt = même résultat : c'est le paramétrage de l'appel qu'il faut ajuster.",
            },
          ],
        },
      ],
    },
  ],
  checkpoint: {
    title: "Checkpoint — MCP Mécano",
    md: `Tu sais ce qu'est un serveur MCP, quels connecteurs sont branchés chez Electra, comment en ajouter un proprement et comment débugger un appel d'outil. Reste à le prouver : coche le livrable ci-dessous, puis passe le **QCM noté d'équipe** — il compte pour le score de ton équipe au hackathon.`,
    checklist: [
      "J'ai réalisé une vraie tâche combinant 2 connecteurs (lecture + écriture) — exercice 4.2",
      "J'ai vérifié dans Réglages → Connecteurs quels serveurs sont actifs sur mon compte",
      "Je sais citer les 3 suspects quand « il n'a pas trouvé » : mots-clés, période, droits",
      "Je connais la règle Electra : serveur MCP hors répertoire = validation IT/sécu d'abord",
    ],
    dbQuizLessonSlug: "gerer-ses-mcp",
  },
};
