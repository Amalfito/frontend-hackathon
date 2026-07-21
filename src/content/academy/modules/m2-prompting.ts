import type { AcademyModule } from "@/lib/academy/types";

/* ============================================================================
 * MODULE 2 — Prompter comme un pro.
 * Le module cœur : R.O.C.C.F., les 8 techniques, les données, la capitalisation.
 * ========================================================================== */

export const m2Prompting: AcademyModule = {
  slug: "prompting",
  code: "M2",
  title: "Prompter comme un pro",
  tagline: "La différence entre une réponse médiocre et une réponse bluffante, c'est rarement le modèle. C'est le prompt.",
  icon: "🪄",
  badge: "Prompt Jedi",
  audience: "Tous",
  lessons: [
    {
      slug: "methode-roccf",
      title: "La méthode R.O.C.C.F.",
      summary: "Rôle, Objectif, Contexte, Critères, Feedback-exemples : la grille qui transforme n'importe quelle demande floue en prompt qui charge à pleine puissance.",
      minutes: 9,
      blocks: [
        {
          kind: "concept",
          title: "Cinq lettres, zéro magie",
          md: `Un bon prompt n'est pas une incantation : c'est un **brief complet**, comme celui que tu donnerais à un nouveau collègue brillant mais qui ne connaît rien à Electra. La grille R.O.C.C.F. :

1. **Rôle** : qui est Claude pour cette tâche ? « Tu es responsable support client chez Electra… » — le rôle active le bon registre, le bon vocabulaire, les bons réflexes.
2. **Objectif** : le livrable, précisément. Un email ? Un tableau ? Une analyse en 5 points ? Dis-le.
3. **Contexte** : ce que Claude ne peut PAS deviner — les faits, les chiffres, l'historique, l'enjeu. C'est presque toujours la partie la plus négligée.
4. **Critères** : les contraintes de forme et de fond. Longueur, ton, structure, ce qu'il faut éviter.
5. **Feedback-exemples** : montre un exemple du résultat attendu (ou du ton). C'est le **few-shot**, l'arme secrète : un exemple vaut mille adjectifs.

Tu n'as pas toujours besoin des 5. Mais quand une réponse te déçoit, relis ton prompt : il manque presque toujours une de ces lettres.`,
        },
        {
          kind: "beforeAfter",
          title: "Le même besoin, deux mondes",
          bad: "fais un mail pour la panne",
          good: `Tu es responsable support client chez Electra (recharge ultra-rapide pour véhicules électriques).

Objectif : rédige l'email d'excuse aux clients impactés par la panne de la station Lyon-Confluence, hier entre 18h et 21h.

Contexte : 34 sessions de charge interrompues ou impossibles, cause identifiée (défaut d'alimentation du transformateur), résolution complète à 21h05. Geste commercial validé : 10 € de crédit recharge, ajoutés automatiquement au compte de chaque client impacté.

Critères :
- ton empathique mais factuel, sans jargon technique
- 120 mots maximum
- structure : excuse sincère → explication courte → geste commercial → réassurance
- ne promets jamais que ça ne se reproduira pas

Exemple du ton attendu : « Nous savons qu'une borne indisponible au mauvais moment, c'est bien plus qu'un désagrément. »`,
          explanation: "Même modèle, même coût, même bouton Envoyer. La version ❌ oblige Claude à inventer les faits, le ton et le format. La version ✅ contient les 5 lettres : le premier jet est utilisable tel quel.",
        },
        {
          kind: "exercise",
          title: "🛠️ Répare ces 3 prompts cassés",
          md: `Voici 3 prompts réellement entendus dans les couloirs (à peine caricaturés) :

1. **Marketing** : « écris un post LinkedIn sur notre nouvelle station »
2. **Ops** : « analyse ces données de sessions » (avec un CSV collé brut)
3. **Déploiement** : « fais un compte-rendu de ma visite »

Choisis-en **au moins 2** et réécris-les en version R.O.C.C.F. complète, en inventant un contexte Electra réaliste (ville, chiffres, enjeu). Puis teste tes versions dans Claude et compare avec les originaux. Le prompt ci-dessous te sert de coach.`,
          prompt: "Je m'entraîne à la méthode R.O.C.C.F. (Rôle, Objectif, Contexte, Critères, Feedback-exemples). Voici ma réécriture d'un mauvais prompt : [colle ta version]. Évalue-la lettre par lettre : pour chacune, dis si elle est présente, suffisante ou manquante, et propose UNE amélioration concrète. Sois exigeant.",
          checklist: [
            "J'ai réécrit au moins 2 des 3 prompts avec les 5 lettres",
            "Chaque réécriture contient du contexte Electra concret (lieu, chiffres, enjeu)",
            "Chaque réécriture contient au moins un exemple ou une contrainte de ton",
            "J'ai testé une version avant/après dans Claude et constaté l'écart",
          ],
        },
        {
          kind: "tip",
          title: "Le contexte, c'est 80 % du résultat",
          md: `Quand tu hésites sur quoi améliorer en premier : **le C de Contexte**. Claude ne sait pas que la station est en zone premium, que le client est un grand compte, que le comité est demain matin, que « CSR » veut dire Charging Success Rate chez vous. Chaque fait que tu omets, il le remplace par une hypothèse moyenne — et la moyenne, c'est fade.`,
        },
      ],
    },
    {
      slug: "8-techniques",
      title: "Les 8 techniques qui changent tout",
      summary: "Chain of thought, few-shot, balises XML, JSON contraint… les gestes des pros, en cartes à retourner + un défi Prompt Golf.",
      minutes: 9,
      blocks: [
        {
          kind: "flipcards",
          title: "Les 8 techniques (recto : le nom, verso : le geste)",
          cards: [
            {
              front: "🧮 Chain of thought",
              back: "Demander de raisonner étape par étape AVANT de conclure. « Avant de recommander un site pour le hub, raisonne étape par étape : trafic, foncier, grid connection, concurrence. Puis conclus. » Les réponses gagnent en rigueur sur tout ce qui est analytique.",
            },
            {
              front: "🎯 Few-shot (exemples)",
              back: "Donner 1 à 3 exemples du résultat attendu. Tu veux des titres de campagne Customer.io dans TON style ? Colle 2 titres qui ont bien marché, Claude calque le pattern. Un exemple vaut mille adjectifs.",
            },
            {
              front: "🏷️ Balises XML",
              back: "Séparer les ingrédients du prompt avec des balises : <contexte>, <données>, <consignes>. Indispensable quand tu colles un long thread Slack ou un export brut : Claude ne confond plus tes instructions avec le contenu à traiter.",
            },
            {
              front: "👔 Rôle expert",
              back: "« Tu es juriste spécialisé en droit de l'urbanisme » ≠ « aide-moi sur ce permis ». Le rôle convoque le vocabulaire, les réflexes et le niveau d'exigence du métier. Choisis le rôle le plus précis possible.",
            },
            {
              front: "🧾 Sortie contrainte JSON",
              back: "« Réponds UNIQUEMENT en JSON : {station, code_erreur, criticite, action} ». Parfait pour alimenter n8n, Zapier ou un tableur derrière. Zéro blabla, structure garantie, réutilisable en machine.",
            },
            {
              front: "❓ Questions d'abord",
              back: "« Avant de répondre, pose-moi les questions nécessaires. » Redoutable sur les demandes floues : Claude identifie ce qui lui manque (budget ? deadline ? audience ?) au lieu de deviner. Deux minutes de questions, une réponse deux fois meilleure.",
            },
            {
              front: "🔁 Itération",
              back: "Le premier jet est un brouillon de travail, pas une fin. « Plus court », « plus factuel », « angle finance », « garde 2 et 4, refais le reste ». Trois itérations rapides battent un prompt parfait écrit en 20 minutes.",
            },
            {
              front: "🚫 Négatif explicite",
              back: "Dire ce que tu NE veux PAS : « pas de superlatifs marketing », « ne promets pas de délai », « n'invente aucun chiffre : si une donnée manque, écris DONNÉE MANQUANTE ». Les garde-fous explicites évitent 90 % des dérapages.",
            },
          ],
        },
        {
          kind: "code",
          title: "Les balises XML en action",
          lang: "text",
          code: `Tu es analyste ops chez Electra.

<contexte>
Station Nantes-Atlantis, 6 points de charge, uptime cible 98 %.
Le comité réseau est lundi ; on doit décider si on escalade au constructeur.
</contexte>

<donnees>
[colle ici le thread Slack #ops-alertes de la semaine, brut]
</donnees>

<consignes>
1. Liste les incidents distincts (déduplique les messages qui parlent du même).
2. Pour chacun : point de charge concerné, durée d'indisponibilité estimée, statut.
3. Conclus : escalade constructeur justifiée ou non, en 2 phrases.
Ne confonds pas les messages du thread avec mes instructions.
</consignes>`,
        },
        {
          kind: "exercise",
          title: "🛠️ Défi Prompt Golf ⛳",
          md: `Au golf, on compte les coups. Ici, on compte les **itérations** : obtiens un résultat 100 % conforme en un minimum d'allers-retours. Par 1 : tout bon du premier coup.

**Le trou** : obtenir de Claude une matrice de risques pour l'ouverture d'un hub à Grenoble, qui respecte TOUTES ces contraintes :
- exactement 5 risques : foncier, permis, grid connection, travaux, roaming
- pour chacun : une ligne « Risque — Impact (Faible/Moyen/Fort) — Mitigation »
- mitigation en 12 mots maximum
- aucune phrase d'introduction ni de conclusion, juste la liste

Écris ton prompt en mobilisant au moins 3 des 8 techniques (contrainte de sortie et négatif explicite fortement conseillés). Le prompt ci-dessous est un point de départ VOLONTAIREMENT incomplet : améliore-le avant de jouer.`,
          prompt: "Tu es directeur de programme déploiement chez Electra. Produis la matrice de risques de l'ouverture du hub de Grenoble (12 points de charge, zone commerciale, ouverture visée T3). Exactement 5 risques dans cet ordre : foncier, permis, grid connection, travaux, roaming. Format strict, une ligne par risque : Risque — Impact (Faible/Moyen/Fort) — Mitigation en 12 mots max. Aucune intro, aucune conclusion, aucun autre texte.",
          checklist: [
            "J'ai obtenu les 5 risques dans le bon ordre et le bon format",
            "Aucune phrase parasite avant ou après la liste",
            "J'ai utilisé au moins 3 des 8 techniques et je sais lesquelles",
            "Mon score : je connais mon nombre d'itérations (objectif ≤ 2)",
          ],
        },
        {
          kind: "quiz",
          title: "Le bon geste au bon moment",
          questions: [
            {
              q: "Tu colles un thread Slack de 80 messages et Claude confond tes consignes avec les messages du thread. La parade ?",
              options: [
                { label: "Balises XML : le thread dans <donnees>, mes instructions dans <consignes>", correct: true },
                { label: "Écrire les consignes en MAJUSCULES" },
                { label: "Couper le thread en 10 messages séparés" },
              ],
              explanation: "Les balises créent des frontières nettes entre instructions et contenu à traiter. C'est LA technique des prompts longs.",
            },
            {
              q: "Tu veux que la sortie alimente directement un workflow n8n. Quelle technique ?",
              options: [
                { label: "Sortie contrainte JSON avec le schéma exact des champs", correct: true },
                { label: "Demander « réponds de façon structurée s'il te plaît »" },
                { label: "Chain of thought" },
              ],
              explanation: "Une machine derrière = structure garantie devant. On donne le schéma JSON exact et on interdit tout texte hors JSON.",
            },
            {
              q: "Ta demande est floue et tu le sais (« aide-moi sur la stratégie tarifaire »). Le meilleur premier coup ?",
              options: [
                { label: "« Avant de répondre, pose-moi les questions nécessaires »", correct: true },
                { label: "Laisser Claude deviner, on verra bien" },
                { label: "Ajouter « sois très intelligent » au prompt" },
              ],
              explanation: "Sur un sujet flou, les questions d'abord font émerger ce que TU n'avais pas encore clarifié. Gain de temps des deux côtés.",
            },
          ],
        },
      ],
    },
    {
      slug: "prompter-avec-donnees",
      title: "Prompter avec des données",
      summary: "CSV de sessions, exports HubSpot, threads Slack : les 3 règles pour que Claude analyse juste — et t'avoue ce que les données ne disent pas.",
      minutes: 8,
      blocks: [
        {
          kind: "concept",
          title: "Les 3 règles de l'analyse fiable",
          md: `Claude adore les données : colle un tableau, uploade un CSV de sessions de charge, un export HubSpot, un thread Slack — il analyse. Mais la qualité de l'analyse dépend de TOI, via 3 règles :

1. **Décris les colonnes.** \`kwh\` c'est l'énergie délivrée ou facturée ? \`statut=KO\` c'est une session échouée ou annulée par le client ? Ce que tu ne définis pas, Claude le devine — parfois mal.
2. **Précise la question business.** « Analyse ce fichier » produit une purée de statistiques. « Quelles stations sous-performent et pourquoi, pour prioriser les interventions du mois ? » produit une réponse actionnable.
3. **Demande les limites.** Exige que Claude signale ce que les données ne permettent PAS de conclure : période trop courte, colonnes manquantes, biais d'échantillon. C'est ton garde-fou anti-conclusions hâtives.`,
        },
        {
          kind: "warning",
          title: "Le chiffre plausible n'est pas un chiffre juste",
          md: `Sur un gros fichier, vérifie toujours **un calcul au hasard** avant de réutiliser l'analyse : une moyenne, un total, un comptage — refais-le dans ton tableur. Si le calcul témoin est bon, la confiance monte. S'il est faux, tu viens d'éviter de présenter un chiffre erroné au comité. Et pour les analyses récurrentes sur les vraies données : la source de vérité reste Omni Analytics, pas un CSV recollé à la main.`,
        },
        {
          kind: "exercise",
          title: "🛠️ Les 3 stations sous-performantes",
          md: `Télécharge le fichier d'entraînement \`sessions_charge.csv\` depuis la page **Playground** de la plateforme (30 jours de sessions fictives sur 10 stations : identifiant station, ville, date, énergie délivrée en kWh, durée en minutes, statut de session, code erreur éventuel).

Uploade-le dans Claude avec le prompt ci-dessous — remarque comme il applique les 3 règles. Puis vérifie UN chiffre témoin dans ton tableur.`,
          prompt: "Tu es analyste réseau chez Electra. Voici un CSV de sessions de charge sur 30 jours. Colonnes : station_id (identifiant station), ville, date, kwh (énergie délivrée), duree_min (durée de session en minutes), statut (OK = session réussie, KO = session échouée), code_erreur (rempli seulement si KO). Question business : identifie les 3 stations les plus sous-performantes pour prioriser les interventions de maintenance du mois prochain. Méthode : définis d'abord tes critères de sous-performance (taux d'échec, kWh moyen, tendance), justifie-les, puis classe. Pour chaque station retenue : les chiffres clés et 2 hypothèses de cause. Termine par une section « Limites » : ce que ces données ne permettent PAS de conclure.",
          checklist: [
            "J'ai uploadé le CSV du Playground et lancé le prompt",
            "Claude a explicité ses critères de sous-performance avant de classer",
            "J'ai vérifié un chiffre témoin (taux d'échec ou kWh moyen d'une station) dans mon tableur",
            "La section « Limites » liste au moins 2 vraies limites des données",
            "Je saurais refaire pareil avec un export HubSpot ou Intercom de mon métier",
          ],
        },
        {
          kind: "tip",
          title: "Le suivi qui fait pro",
          md: `Après l'analyse, enchaîne avec : « **Quelle colonne supplémentaire te permettrait de trancher entre tes hypothèses ?** » Claude te dira par exemple : le modèle de borne, la météo, l'heure de la session. Tu viens de transformer une analyse en plan de collecte de données — c'est exactement ce que ferait un bon data analyst.`,
        },
      ],
    },
    {
      slug: "capitaliser-ses-prompts",
      title: "Capitaliser ses prompts",
      summary: "Un bon prompt écrit deux fois est un bon prompt mal géré : variables, template, et la Bibliothèque de prompts de la plateforme.",
      minutes: 6,
      blocks: [
        {
          kind: "concept",
          title: "Du prompt jetable au prompt-outil",
          md: `Tu as passé 10 minutes à affiner un prompt qui marche ? Ne le laisse pas mourir dans l'historique. Un bon prompt se **capitalise** :

1. **Généralise avec des variables** : remplace les valeurs spécifiques par des \`{accolades}\` — {station}, {ville}, {periode}, {audience}. Le prompt devient un template : tu remplis les trous, tu lances.
2. **Documente en une ligne** : quand l'utiliser, ce qu'il produit.
3. **Partage-le** : la **Bibliothèque de prompts** de la plateforme (page /learn/prompts) recense les templates par métier. Un prompt qui fait gagner 20 minutes à 30 personnes chaque semaine, c'est 10 heures rendues au réseau — chaque semaine.

Le réflexe : si tu écris le même genre de prompt une **troisième fois**, c'est un template qui s'ignore.`,
        },
        {
          kind: "code",
          title: "Anatomie d'un prompt capitalisé (pôle déploiement)",
          lang: "text",
          code: `TEMPLATE : CR de visite foncière
QUAND : après chaque visite de site candidat
PRODUIT : un CR structuré prêt pour Notion

---
Tu es assistant du pôle déploiement Electra.
Rédige le compte-rendu de ma visite du site {adresse_site} à {ville},
le {date}, pour un projet de {nb_points_charge} points de charge.

Mes notes brutes : {notes_vocales_ou_texte}

Structure imposée :
1. Synthèse (3 lignes, avis GO / NO-GO / À CREUSER)
2. Foncier (propriétaire, bail envisagé, points d'attention)
3. Technique (surface, accès, distance au poste source, grid connection)
4. Environnement commercial (trafic, commerces, concurrence à moins de 5 km)
5. Prochaines étapes (qui fait quoi, pour quand)

Si une info manque dans mes notes, écris [À COMPLÉTER] — n'invente rien.`,
        },
        {
          kind: "exercise",
          title: "🛠️ Ton premier prompt réutilisable",
          md: `Pense à une tâche que tu fais **au moins une fois par semaine** avec du texte : réponse type Intercom, brief de campagne, synthèse de daily, note de cadrage Linear, relance foncière…

1. Écris le prompt en R.O.C.C.F., puis remplace tout ce qui varie par des {variables}.
2. Ajoute la ligne QUAND et la ligne PRODUIT.
3. Teste-le avec 2 jeux de valeurs différents : s'il tient les deux, il est prêt.
4. Garde-le au chaud : c'est TON livrable pour le checkpoint, et un candidat pour la Bibliothèque (/learn/prompts).

Le prompt ci-dessous fait de Claude ton relecteur de template.`,
          prompt: "Voici un prompt template avec des {variables} que je compte réutiliser chaque semaine chez Electra : [colle ton template]. Audite-le : 1) les variables couvrent-elles bien tout ce qui change d'une fois à l'autre ? 2) y a-t-il des instructions ambiguës qu'un collègue interpréterait autrement que moi ? 3) que manque-t-il pour qu'il fonctionne sans aucune explication orale ? Propose la version corrigée.",
          checklist: [
            "Mon template correspond à une vraie tâche hebdomadaire de mon métier",
            "Il contient au moins 2 {variables} bien nommées",
            "Il a sa ligne QUAND et sa ligne PRODUIT",
            "Il a survécu au test avec 2 jeux de valeurs différents",
          ],
        },
        {
          kind: "tip",
          title: "Où le stocker ?",
          md: `Par ordre de préférence : la **Bibliothèque de prompts** de la plateforme (visible par tous, page /learn/prompts), la base de connaissances de ton **Projet** Claude (il l'a toujours sous la main), une page **Notion** d'équipe. Le pire endroit : ton historique de chat, où il sera introuvable dans 3 semaines.`,
        },
      ],
    },
    {
      slug: "master-prompt",
      title: "Le Master Prompt",
      summary: "Le réglage global qui parle pour toi dans TOUTES tes conversations : ce que c'est, comment le garder efficace, et les pièges qui le rendent contre-productif.",
      minutes: 7,
      blocks: [
        {
          kind: "concept",
          title: "Un brief permanent, ajouté en silence",
          md: `Tu peux définir, une fois pour toutes, des **instructions personnelles** que Claude applique à **100 % de tes conversations** — sans que tu aies à les répéter. C'est le **Master Prompt** (aussi appelé instructions personnelles / preferences).

Il est **ajouté silencieusement en tête de chacun de tes échanges**. Il sert à personnaliser Claude sur ce qui ne change jamais, quel que soit le sujet :

1. **Le rôle attendu** — « Tu t'adresses à un chef de projet Network Ops chez Electra. »
2. **Le format de sortie** — « Réponses en puces courtes, va droit au but, pas d'introduction. »
3. **Le style d'interaction** — « Pose-moi une question si ma demande est ambiguë avant de te lancer. »
4. **Les préférences techniques** — « Quand tu donnes du code, c'est du TypeScript ; unités en kW et kWh. »

À ne pas confondre avec un **Projet** (qui cible UN périmètre précis) : le Master Prompt, lui, s'applique **partout**.`,
        },
        {
          kind: "concept",
          title: "3 bonnes pratiques",
          md: `1. **Garde-le court.** C'est un cadre, pas un mode d'emploi. Quelques lignes suffisent ; un pavé dilue tout et grignote ton contexte à chaque conversation.
2. **Structure et hiérarchise** — le plus important d'abord. Claude accorde plus de poids à ce qui est en tête.
3. **Reste général.** Ces instructions concernent TOUTES tes conversations : elles doivent rester valables pour n'importe quelle demande. Exemple de piège : imposer « sois toujours analytique et rigoureux » peut **brider** Claude dans tes futurs brainstorms créatifs.

Et un 4ᵉ réflexe qui vaut de l'or : **itère.** Reviens-y régulièrement pour l'affiner à partir des comportements que tu as réellement observés chez Claude — retire ce qui ne sert pas, précise ce qui a raté.`,
        },
        {
          kind: "beforeAfter",
          title: "Trop, c'est comme pas assez",
          bad: `Tu es un assistant expert en tout. Sois toujours extrêmement analytique, exhaustif et rigoureux. Donne systématiquement des réponses longues et détaillées avec beaucoup d'exemples. Utilise toujours un ton très formel. Commence chaque réponse par un résumé, puis un plan, puis le développement, puis une conclusion, puis des recommandations, puis les limites... [30 lignes de règles ultra-spécifiques]`,
          good: `Contexte : je travaille en Network Operations chez Electra (recharge VE).
- Réponses concises, en puces, sans intro ni conclusion inutile.
- Si ma demande est ambiguë, pose-moi une question avant de te lancer.
- Ne donne jamais de chiffre non sourcé : si une donnée manque, dis-le.`,
          explanation: "Le ❌ est long, ultra-spécifique et impose « toujours analytique » — il va plomber tes sessions de brainstorm et saturer ton contexte. Le ✅ est court, général, hiérarchisé : il aide partout sans jamais gêner.",
        },
        {
          kind: "prompt",
          title: "Un master prompt de départ (à copier puis affiner)",
          prompt: `Contexte : je travaille chez Electra (réseau de recharge ultra-rapide pour véhicules électriques), pôle Network Operations. Langue : français.

Préférences (par ordre d'importance) :
1. Va droit au but : réponses en puces courtes, pas d'introduction ni de conclusion de politesse.
2. Si ma demande est ambiguë ou s'il te manque une info clé, pose-moi UNE question avant de répondre.
3. N'invente jamais un chiffre : si une donnée manque, écris « donnée manquante » plutôt que d'estimer.
4. Quand tu donnes du code, c'est du TypeScript ; unités d'énergie en kW / kWh.

Reste général : ces règles valent pour toutes mes demandes, y compris créatives.`,
          note: "Colle-le dans tes instructions personnelles Claude, vis avec pendant une semaine, puis retire/ajuste ce qui n'a pas servi. Un master prompt se cultive, il ne se fige pas.",
        },
        {
          kind: "warning",
          title: "Deux pièges à garder en tête",
          md: `1. **Projets contradictoires.** Si tu crées des **Projets** Claude, évite d'y mettre des instructions qui **contredisent** ton master prompt (ex. : master prompt « réponses courtes » vs projet « réponses très détaillées »). Claude ne saurait plus où donner de la tête — les consignes se neutralisent.
2. **Les longues conversations dérivent.** Plus une conversation dure, plus il y a de risque que Claude **oublie** peu à peu ces instructions (elles s'éloignent dans le contexte). Réflexe : sur un long échange, re-rappelle le point important au moment voulu (« rappel : réponds en puces »), ou repars sur une conversation fraîche.`,
        },
        {
          kind: "exercise",
          title: "🛠️ Écris (et teste) ton master prompt",
          md: `1. Liste **3 comportements** que tu veux voir dans 100 % de tes conversations Claude (format ? ton ? langue ? réflexe anti-hallucination ?).
2. Rédige-les en **4-6 lignes maximum**, le plus important d'abord, en restant **génériques**.
3. Mets-les dans tes instructions personnelles, puis fais le **test du grand écart** : une demande analytique (analyse d'un CSV de sessions) ET une demande créative (10 noms de campagne). Ton master prompt aide-t-il les deux sans en gêner aucune ?
4. Ajuste : si une règle a bridé le brainstorm, généralise-la ou retire-la.

Le prompt ci-dessous fait de Claude ton relecteur de master prompt.`,
          prompt: "Voici mon master prompt (instructions personnelles appliquées à TOUTES mes conversations Claude) : [colle-le]. Audite-le selon 4 critères : 1) est-il assez COURT ? 2) est-il HIÉRARCHISÉ (le plus important d'abord) ? 3) est-il assez GÉNÉRAL pour ne pas brider mes demandes créatives (repère toute règle du type « toujours analytique/exhaustif/formel ») ? 4) contient-il une contradiction interne ou une instruction ambiguë ? Pour chaque critère, dis si c'est bon ou à corriger, et propose une version resserrée.",
          checklist: [
            "Mon master prompt tient en 6 lignes maximum",
            "La règle la plus importante est en premier",
            "Aucune règle du type « toujours analytique/exhaustif » qui briderait un brainstorm",
            "J'ai fait le test du grand écart (demande analytique + demande créative)",
            "Je sais qu'il ne doit pas contredire les instructions de mes Projets Claude",
          ],
        },
        {
          kind: "quiz",
          title: "Master Prompt — le réflexe global",
          questions: [
            {
              q: "Qu'est-ce que le Master Prompt (instructions personnelles) ?",
              options: [
                { label: "Des instructions ajoutées silencieusement à TOUTES tes conversations avec Claude", correct: true },
                { label: "Le premier message d'une seule conversation" },
                { label: "Les instructions d'un Projet Claude précis" },
                { label: "Un mot de passe d'accès à Claude" },
              ],
              explanation: "Il personnalise Claude globalement (rôle, format, style, préférences techniques) sur 100 % de tes échanges — contrairement à un Projet, qui ne vaut que pour son périmètre.",
            },
            {
              q: "Quelles sont de bonnes pratiques pour un master prompt ? (plusieurs réponses)",
              multi: true,
              options: [
                { label: "Le garder court", correct: true },
                { label: "Hiérarchiser : le plus important d'abord", correct: true },
                { label: "Rester général (il vaut pour toutes tes conversations)", correct: true },
                { label: "Y détailler un maximum de règles ultra-spécifiques" },
                { label: "L'itérer à partir des comportements observés", correct: true },
              ],
              explanation: "Court, hiérarchisé, général et itératif. Trop spécifique (ou « toujours analytique ») bride tes autres usages, notamment créatifs.",
            },
            {
              q: "Pourquoi éviter des instructions de Projet qui contredisent ton master prompt ?",
              options: [
                { label: "Parce que les consignes se neutralisent et Claude ne sait plus quoi suivre", correct: true },
                { label: "Parce que les Projets sont payants" },
                { label: "Parce que le master prompt efface les Projets" },
              ],
              explanation: "Master prompt et Projet s'additionnent : s'ils se contredisent (court vs très détaillé), Claude reçoit des ordres incompatibles.",
            },
            {
              q: "Sur une très longue conversation, quel risque avec le master prompt ?",
              options: [
                { label: "Claude peut progressivement l'oublier (il s'éloigne dans le contexte)", correct: true },
                { label: "Il devient définitif et impossible à changer" },
                { label: "Il se duplique à chaque message" },
              ],
              explanation: "Plus l'échange dure, plus les instructions initiales s'éloignent. Réflexe : rappeler le point clé au moment voulu, ou repartir sur une conversation fraîche.",
            },
          ],
        },
      ],
    },
  ],
  checkpoint: {
    title: "Checkpoint — Prompt Jedi",
    md: `Deux épreuves pour le badge :

1. **Le livrable** : soumets **1 prompt réutilisable de ton métier** (celui de la leçon 2.4) — avec ses {variables}, sa ligne QUAND et sa ligne PRODUIT. C'est lui qui prouve que tu prompts pour durer, pas juste pour dépanner.
2. **Le QCM noté d'équipe** ci-dessous : il alimente le score de ton équipe au hackathon. Révise la grille R.O.C.C.F. et les 8 techniques avant de te lancer — pas de brouillon.`,
    checklist: [
      "Mon prompt réutilisable est finalisé et testé avec 2 jeux de valeurs",
      "Je l'ai soumis (Bibliothèque /learn/prompts ou canal de mon équipe)",
      "Je sais réciter les 5 lettres de R.O.C.C.F. sans antisèche",
      "J'ai passé le QCM noté d'équipe",
    ],
    dbQuizLessonSlug: "prompter-efficacement",
  },
};
