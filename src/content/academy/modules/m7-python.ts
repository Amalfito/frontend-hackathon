import type { AcademyModule } from "@/lib/academy/types";

/* ============================================================================
 * MODULE 7 — Python express : le minimum vital pour dialoguer avec les builders.
 * Objectif : lire un script, faire tourner un script généré par Claude,
 * demander les bonnes choses à Claude Code. PAS devenir dev.
 * ========================================================================== */

export const m7Python: AcademyModule = {
  slug: "python",
  code: "M7",
  title: "Python express",
  tagline: "Le minimum vital pour lire un script, le faire tourner, et parler le même langage que les builders.",
  icon: "🐍",
  badge: "Pythonista",
  audience: "Power Users & Builders",
  lessons: [
    {
      slug: "pourquoi-python",
      title: "Pourquoi Python chez Electra ?",
      summary: "La langue commune de la data et de l'automatisation — et pourquoi 20 % de Python te donne 80 % d'autonomie.",
      minutes: 5,
      blocks: [
        {
          kind: "concept",
          title: "Tu n'apprends pas à coder. Tu apprends à dialoguer.",
          md: `Soyons clairs sur l'objectif de ce module : tu ne vas **pas devenir développeur**. Tu vas apprendre trois choses, dans cet ordre :

1. **Lire** un script simple sans paniquer (comprendre ce qu'il fait, repérer où il touche à tes données) ;
2. **Faire tourner** un script généré par Claude et interpréter ce qui en sort ;
3. **Demander les bonnes choses** à Claude Code — parce qu'un power user qui sait dire « ajoute une colonne taux d'occupation et trie par kWh décroissant » obtient en 30 secondes ce qu'un autre décrit pendant 10 minutes.

Pourquoi Python et pas autre chose ? Parce que c'est la **langue commune** de tout ce qui touche à la donnée chez Electra :
- les **scripts d'analyse** de sessions de charge (exports CSV, Snowflake, Omni) ;
- les **appels à l'API Anthropic** (Module 8 — tout est en Python) ;
- les **notebooks** d'exploration des équipes data ;
- le **glue code** dans n8n (le node Code parle Python ou JavaScript).

Quand un builder te montre son script, tu dois pouvoir suivre. C'est tout. Et c'est énorme.`,
        },
        {
          kind: "tip",
          title: "Où tester les exemples de ce module",
          md: `Deux options, zéro installation :

- **Directement dans Claude** : colle le code et demande « exécute ce script et montre-moi le résultat » ou « explique-moi ce code ligne à ligne ». Claude sait exécuter du Python via son outil d'analyse.
- **Dans un notebook** si tu en as un sous la main (Jupyter, Colab, Snowflake).

La plateforme fournit les **datasets fictifs** sur la page Playground : télécharge \`sessions_charge.csv\` sur /academy/sessions_charge.csv. Tous les exercices du module s'appuient dessus.`,
        },
        {
          kind: "quiz",
          title: "Cale ton positionnement",
          questions: [
            {
              q: "À la fin de ce module, tu devras être capable de…",
              options: [
                { label: "Lire un script simple, le faire tourner, et briefer Claude Code précisément", correct: true },
                { label: "Écrire une API REST en production" },
                { label: "Réciter la doc Python par cœur" },
                { label: "Remplacer l'équipe data" },
              ],
              explanation: "Lire, exécuter, briefer. C'est le trio qui te rend autonome — Claude écrit le code, toi tu le comprends et tu le pilotes.",
            },
            {
              q: "Un builder t'envoie un script qui analyse les sessions de charge du hub de Vélizy. Ton rôle de power user ?",
              options: [
                { label: "Comprendre ce qu'il fait dans les grandes lignes et vérifier qu'il lit les bonnes données", correct: true },
                { label: "Le réécrire toi-même from scratch pour prouver ta valeur" },
                { label: "Le lancer sans le lire, ça doit marcher" },
                { label: "Refuser d'y toucher : « je ne suis pas dev »" },
              ],
              explanation: "Ni boîte noire, ni réécriture : tu lis, tu comprends l'intention, tu vérifies les entrées/sorties. Le « je ne suis pas dev » n'est plus une excuse après ce module.",
            },
            {
              q: "Pourquoi Python plutôt qu'Excel pour analyser 200 000 sessions de charge ?",
              options: [
                { label: "Reproductible, scriptable, et ça ne rame pas : tu relances le même script chaque semaine", correct: true },
                { label: "Excel est interdit chez Electra" },
                { label: "Python fait de plus jolis graphiques, c'est tout" },
              ],
              explanation: "Excel reste très bien pour explorer. Mais dès que c'est volumineux ou récurrent, un script gagne : même analyse, chaque lundi, zéro clic.",
            },
          ],
        },
      ],
    },
    {
      slug: "variables-types-listes-dicts",
      title: "Variables, types, listes, dictionnaires",
      summary: "Les 4 briques de base — avec des stations, des bornes et des kWh, pas des foo et des bar.",
      minutes: 8,
      blocks: [
        {
          kind: "concept",
          title: "Les 4 briques que tu croiseras partout",
          md: `Tout script Python que tu liras chez Electra est fait de 4 briques :

- **Variable** : une étiquette collée sur une valeur. \`nb_bornes = 8\`
- **Types de base** : texte (\`"Lyon-Confluence"\`), nombre entier (\`8\`), nombre décimal (\`0.97\`), booléen (\`True\` / \`False\`).
- **Liste** : une collection ordonnée, entre crochets. Parfaite pour une série de sessions.
- **Dictionnaire** : des paires clé → valeur, entre accolades. Parfait pour décrire UNE station avec ses attributs.

Retiens l'intuition : **une liste = des lignes, un dictionnaire = une fiche**. Une liste de dictionnaires = un tableau de fiches — c'est LE format que tu verras partout (exports d'API, tickets Intercom, sessions de charge).`,
        },
        {
          kind: "code",
          title: "Une station, des sessions : lis ce script à voix haute",
          lang: "python",
          code: `# Un dictionnaire = la fiche d'une station
station = {"nom": "Lyon-Confluence", "bornes": 8, "uptime": 0.97}

# On lit une valeur par sa clé
print(station["nom"])       # Lyon-Confluence
print(station["bornes"])    # 8

# Une liste = plusieurs valeurs ordonnées
durees_minutes = [22, 31, 18, 45, 27]
print(len(durees_minutes))  # 5 sessions
print(max(durees_minutes))  # 45 (la plus longue)

# Une liste de dictionnaires = un tableau de sessions
sessions = [
    {"station": "Lyon-Confluence", "kwh": 42.5, "duree_min": 31},
    {"station": "Vélizy 2", "kwh": 18.2, "duree_min": 14},
    {"station": "Aire de Beaune", "kwh": 61.0, "duree_min": 38},
]

# On accède à la première session (Python compte à partir de 0 !)
premiere = sessions[0]
print(premiere["kwh"])      # 42.5`,
        },
        {
          kind: "warning",
          title: "Le piège du zéro",
          md: `Python compte **à partir de 0** : \`sessions[0]\` est la première session, \`sessions[1]\` la deuxième. \`sessions[3]\` sur une liste de 3 éléments → erreur \`IndexError\`. Tu verras ce piège dans 90 % des scripts — maintenant tu ne tomberas plus dedans.`,
        },
        {
          kind: "exercise",
          title: "🛠️ Fais générer, puis fais expliquer",
          md: `Le réflexe fondamental du module : **Claude génère, toi tu comprends**. Lance le prompt ci-dessous dans Claude, puis lis sa réponse ligne à ligne. Si UNE ligne reste obscure, demande « explique-moi uniquement la ligne X avec une analogie Electra ».`,
          prompt: "Génère un mini-script Python (15 lignes max) qui : 1) définit une liste de 5 sessions de charge fictives Electra sous forme de dictionnaires avec les clés \"station\", \"kwh\" et \"duree_min\" ; 2) affiche le nombre total de sessions ; 3) affiche le total de kWh délivrés ; 4) affiche la station de la session la plus longue. Ensuite, exécute-le, montre-moi la sortie, puis explique-le ligne à ligne comme à quelqu'un qui découvre Python — en gardant les exemples dans l'univers de la recharge de véhicules électriques.",
          checklist: [
            "Claude a généré ET exécuté le script",
            "Je sais dire ce qu'est chaque variable (liste ? dictionnaire ? nombre ?)",
            "J'ai compris comment on lit une valeur dans un dictionnaire (clé entre crochets)",
            "J'ai posé au moins une question de clarification sur une ligne",
            "Je pourrais expliquer ce script à un collègue en 1 minute",
          ],
        },
      ],
    },
    {
      slug: "conditions-boucles",
      title: "Conditions et boucles",
      summary: "if et for : les deux mots-clés qui transforment une liste de sessions en réponse à une question métier.",
      minutes: 8,
      blocks: [
        {
          kind: "concept",
          title: "if décide, for répète",
          md: `Deux mots-clés couvrent l'essentiel de la logique que tu croiseras :

- \`if\` : **décider**. « Si la session dure plus de 30 minutes, alors… sinon… »
- \`for\` : **répéter**. « Pour chaque session de la liste, fais ceci. »

Combinés, ils répondent à des questions métier : « combien de sessions longues ce mois-ci ? », « quelles stations ont un uptime sous 95 % ? », « y a-t-il des sessions à 0 kWh (borne en défaut ?) ».

Détail crucial pour LIRE du Python : **l'indentation** (le décalage en début de ligne) n'est pas décorative. Tout ce qui est décalé sous le \`for\` est répété ; tout ce qui est décalé sous le \`if\` est conditionnel. L'indentation EST la structure.`,
        },
        {
          kind: "code",
          title: "Compter les sessions longues",
          lang: "python",
          code: `sessions = [
    {"station": "Lyon-Confluence", "kwh": 42.5, "duree_min": 31},
    {"station": "Vélizy 2", "kwh": 18.2, "duree_min": 14},
    {"station": "Aire de Beaune", "kwh": 61.0, "duree_min": 38},
    {"station": "Lyon-Confluence", "kwh": 8.1, "duree_min": 6},
    {"station": "Nice Lingostière", "kwh": 55.3, "duree_min": 42},
]

sessions_longues = 0

for s in sessions:                  # pour CHAQUE session…
    if s["duree_min"] > 30:         # …si elle dépasse 30 min…
        sessions_longues += 1       # …on ajoute 1 au compteur

print("Sessions > 30 min :", sessions_longues)
print("Soit", round(sessions_longues / len(sessions) * 100), "% du total")`,
        },
        {
          kind: "quiz",
          title: "Que va afficher ce script ?",
          questions: [
            {
              q: "Dans le script ci-dessus, que vaut sessions_longues à la fin ?",
              options: [
                { label: "3 — les sessions de 31, 38 et 42 minutes", correct: true },
                { label: "5 — toutes les sessions" },
                { label: "2 — le script ignore la dernière" },
                { label: "0 — le compteur ne bouge jamais" },
              ],
              explanation: "La boucle passe sur les 5 sessions ; le if ne laisse passer que celles strictement supérieures à 30 min : 31, 38 et 42. La session de 14 min et celle de 6 min sont écartées.",
            },
            {
              q: "On remplace la condition par s[\"duree_min\"] >= 31. Le résultat change-t-il ?",
              options: [
                { label: "Non : les mêmes 3 sessions passent (31, 38, 42)", correct: true },
                { label: "Oui : la session de 31 min est maintenant exclue" },
                { label: "Oui : ça plante, >= n'existe pas en Python" },
              ],
              explanation: "> 30 et >= 31 sélectionnent exactement les mêmes durées entières. Lire une condition, c'est se demander « quelles valeurs passent la porte ? ».",
            },
            {
              q: "On dé-indente la ligne sessions_longues += 1 pour l'aligner sur le if. Que se passe-t-il ?",
              options: [
                { label: "Le compteur s'incrémente à CHAQUE session, condition ou pas → résultat 5", correct: true },
                { label: "Rien, l'indentation est cosmétique en Python" },
                { label: "Le script refuse de démarrer, toujours" },
              ],
              explanation: "L'indentation EST la logique : sortie du if, la ligne s'exécute pour chaque tour de boucle. C'est LE truc à vérifier quand un script donne un résultat absurde.",
            },
          ],
        },
        {
          kind: "tip",
          title: "Le réflexe de lecture",
          md: `Devant une boucle inconnue, pose-toi 3 questions dans l'ordre : **1)** sur quoi boucle-t-on (quelle liste) ? **2)** quelle condition filtre (le \`if\`) ? **3)** qu'accumule-t-on (compteur, somme, nouvelle liste) ? Avec ces 3 réponses, tu as compris 95 % des scripts d'analyse.`,
        },
      ],
    },
    {
      slug: "fonctions-imports",
      title: "Fonctions et imports (+ pandas en 10 lignes)",
      summary: "Emballer la logique dans des fonctions réutilisables, et découvrir pandas — l'Excel des builders.",
      minutes: 9,
      blocks: [
        {
          kind: "concept",
          title: "Une fonction = une recette nommée",
          md: `Une **fonction**, c'est un bout de logique emballé avec un nom, des **entrées** (paramètres) et une **sortie** (\`return\`). Pourquoi c'est important pour toi :

- Quand tu lis un script, les noms de fonctions te donnent le **sommaire** : \`taux_occupation(...)\`, \`filtrer_sessions_courtes(...)\` — tu comprends l'intention sans lire le détail.
- Quand tu briefes Claude Code, demander « mets ça dans une fonction réutilisable » rend le code 10 fois plus propre.

Un **import**, c'est aller chercher une boîte à outils écrite par d'autres : \`import pandas\` charge LA bibliothèque d'analyse de données. Personne ne réinvente la lecture de CSV.`,
        },
        {
          kind: "code",
          title: "Une fonction métier : le taux d'occupation",
          lang: "python",
          code: `def taux_occupation(sessions, bornes, heures_ouvertes=24):
    """Part du temps où les bornes sont occupées (0 à 1)."""
    minutes_chargees = 0
    for s in sessions:
        minutes_chargees += s["duree_min"]
    minutes_dispo = bornes * heures_ouvertes * 60
    return minutes_chargees / minutes_dispo

# On l'appelle avec les données de Lyon-Confluence (8 bornes)
sessions_lyon = [
    {"kwh": 42.5, "duree_min": 31},
    {"kwh": 38.0, "duree_min": 27},
    {"kwh": 61.0, "duree_min": 38},
]
taux = taux_occupation(sessions_lyon, bornes=8)
print(f"Taux d'occupation : {taux:.1%}")  # affichage en pourcentage`,
        },
        {
          kind: "code",
          title: "pandas en 10 lignes : lire le CSV, moyenne par station",
          lang: "python",
          code: `import pandas as pd

# Le dataset fictif de la page Playground (/academy/sessions_charge.csv)
df = pd.read_csv("sessions_charge.csv")

print(df.head())        # aperçu des 5 premières lignes
print(len(df))          # nombre total de sessions

# Moyenne de kWh par station, triée décroissante — en UNE ligne
moyennes = df.groupby("station")["kwh"].mean().sort_values(ascending=False)
print(moyennes)`,
        },
        {
          kind: "tip",
          title: "pandas, c'est Excel en script",
          md: `Retiens juste les équivalences : \`read_csv\` = ouvrir le fichier, \`df\` (DataFrame) = la feuille de calcul, \`groupby\` = tableau croisé dynamique, \`sort_values\` = trier. Quand un builder dit « je groupe par station », visualise un TCD — c'est exactement ça.`,
        },
        {
          kind: "exercise",
          title: "🛠️ Ton premier vrai calcul métier",
          md: `Télécharge \`sessions_charge.csv\` depuis la page Playground, puis lance le prompt ci-dessous dans Claude (joins le fichier, ou demande-lui de générer des données équivalentes s'il ne peut pas le lire). Objectif : obtenir un script qui tourne ET que tu comprends.`,
          prompt: "Voici un CSV de sessions de charge Electra (colonnes : station, date, kwh, duree_min). Écris un script Python avec pandas qui : 1) lit le fichier ; 2) calcule le kWh moyen ET la durée moyenne par station ; 3) définit une fonction stations_sous_performantes(df, seuil_kwh) qui retourne les stations dont la moyenne de kWh est sous le seuil ; 4) l'appelle avec un seuil de 30 kWh. Exécute-le, montre la sortie, puis explique la fonction ligne à ligne.",
          checklist: [
            "Le script a tourné et affiché des moyennes par station",
            "Je sais pointer la ligne qui lit le CSV et celle qui fait le groupby",
            "Je peux expliquer ce que sont les paramètres et le return de la fonction",
            "J'ai modifié le seuil (ex. 40 kWh) et relancé pour voir la différence",
          ],
        },
      ],
    },
    {
      slug: "lire-une-erreur",
      title: "Lire une erreur + le réflexe Claude",
      summary: "TypeError, KeyError, IndentationError : apprendre à lire une traceback de bas en haut, puis déléguer le fix.",
      minutes: 9,
      blocks: [
        {
          kind: "concept",
          title: "Une erreur n'est pas un échec, c'est un message",
          md: `Quand un script plante, Python affiche une **traceback** : le chemin qui a mené à l'erreur. Règle d'or absolue : **on la lit DE BAS EN HAUT**.

- **Dernière ligne** : le type d'erreur et son message. C'est 80 % du diagnostic.
- **Juste au-dessus** : la ligne de code exacte qui a planté, avec son numéro.
- **Le reste** : le chemin d'appels pour y arriver (utile seulement si le bas ne suffit pas).

Voyons les 3 erreurs que tu croiseras le plus souvent — provoquées exprès pour que tu les reconnaisses.`,
        },
        {
          kind: "code",
          title: "Erreur n°1 : TypeError — mélanger texte et nombre",
          lang: "python",
          code: `kwh = "42.5"          # piège : c'est du TEXTE (guillemets), pas un nombre
total = kwh + 10

# Traceback (most recent call last):
#   File "analyse.py", line 2, in <module>
#     total = kwh + 10
# TypeError: can only concatenate str (not "int") to str
#
# Lecture de bas en haut : "je ne peux pas additionner du texte et un
# nombre" → ligne 2 → kwh est une chaîne. Fix : total = float(kwh) + 10
# Cas réel : les CSV mal exportés livrent les kWh en texte. Classique.`,
        },
        {
          kind: "code",
          title: "Erreur n°2 : KeyError — la clé n'existe pas",
          lang: "python",
          code: `session = {"station": "Vélizy 2", "kwh": 18.2}
print(session["duree_min"])

# Traceback (most recent call last):
#   File "analyse.py", line 2, in <module>
#     print(session["duree_min"])
# KeyError: 'duree_min'
#
# Lecture : la clé 'duree_min' n'existe pas dans ce dictionnaire.
# Soit une faute de frappe ("duree_minutes" ?), soit la donnée manque
# vraiment (session tronquée dans l'export). Vérifie : print(session.keys())`,
        },
        {
          kind: "code",
          title: "Erreur n°3 : IndentationError — le décalage cassé",
          lang: "python",
          code: `for s in sessions:
print(s["station"])

#   File "analyse.py", line 2
#     print(s["station"])
#     ^
# IndentationError: expected an indented block after 'for' statement on line 1
#
# Lecture : après un for (ou un if, ou un def), Python EXIGE un bloc
# décalé. Arrive tout le temps en copiant-collant du code depuis Slack
# ou Notion : les espaces se perdent en route.`,
        },
        {
          kind: "tip",
          title: "Le réflexe Claude : colle tout, demande « explique et corrige »",
          md: `Tu n'as PAS à débugger seul. Le réflexe pro en 3 gestes :

1. Copie **le code complet** (pas juste la ligne suspecte) ;
2. Copie **la traceback complète** (pas juste la dernière ligne) ;
3. Colle les deux à Claude avec : « **Explique-moi cette erreur simplement, puis corrige le script. Dis-moi ce que tu as changé et pourquoi.** »

Le « dis-moi ce que tu as changé » est crucial : c'est comme ça que tu apprends au lieu de juste consommer le fix. Au troisième KeyError, tu le corrigeras toi-même avant Claude.`,
        },
        {
          kind: "sort",
          title: "Mini-jeu : associe chaque symptôme à son erreur",
          instructions: "Un collègue te lit la dernière ligne de sa traceback. Range chaque symptôme sous le bon type d'erreur — c'est le diagnostic express que tu feras en vrai.",
          categories: ["TypeError", "KeyError", "IndentationError"],
          items: [
            { label: "« can only concatenate str (not \"int\") to str » en sommant des kWh lus d'un CSV", category: "TypeError" },
            { label: "Additionner la durée « 45 » (avec guillemets) et 15 minutes", category: "TypeError" },
            { label: "« unsupported operand type(s) » en divisant l'uptime par un texte", category: "TypeError" },
            { label: "Le script cherche session[\"duree_min\"] mais l'export dit \"duree_minutes\"", category: "KeyError" },
            { label: "Un ticket Intercom sans champ \"priorite\" fait planter la boucle", category: "KeyError" },
            { label: "Code copié depuis Slack : « expected an indented block after 'for' »", category: "IndentationError" },
            { label: "Un mélange d'espaces et de tabulations rend le if illisible pour Python", category: "IndentationError" },
          ],
        },
        {
          kind: "exercise",
          title: "🛠️ Provoque, lis, délègue",
          md: `Le meilleur moyen de dédramatiser les erreurs : en provoquer une exprès et la résoudre avec la méthode. Lance le prompt ci-dessous.`,
          prompt: "Écris un court script Python d'analyse de sessions de charge Electra qui contient UNE erreur volontaire (au choix : TypeError, KeyError ou IndentationError), sans me dire laquelle. Exécute-le et montre-moi la traceback complète. Attends que je te propose mon diagnostic (type d'erreur + ligne + cause) en lisant la traceback de bas en haut. Ensuite seulement, valide ou corrige mon diagnostic, puis répare le script en m'expliquant le fix.",
          checklist: [
            "J'ai lu la traceback de bas en haut avant de répondre",
            "J'ai identifié le TYPE d'erreur à partir de la dernière ligne",
            "J'ai pointé la ligne fautive grâce au numéro de ligne",
            "Mon diagnostic était correct (ou j'ai compris pourquoi il ne l'était pas)",
          ],
        },
      ],
    },
  ],
  checkpoint: {
    title: "Checkpoint — Pythonista",
    md: `Le mini-projet qui valide tout le module : un script **généré AVEC Claude** mais **compris PAR toi** — c'est la règle du jeu, et c'est ce que tu déclareras sur l'honneur dans la checklist.

## Ta mission
À partir du dataset \`sessions_charge.csv\` (page Playground), produis avec Claude un script Python qui :
1. lit le CSV avec pandas ;
2. calcule par station : nombre de sessions, total kWh, durée moyenne ;
3. affiche le **top 5 des stations** par kWh délivrés, proprement formaté ;
4. bonus : signale les stations dont la durée moyenne dépasse 35 min (candidates à l'analyse « pourquoi si long ? »).

## La règle d'or
Chaque ligne du script final doit pouvoir être expliquée par TOI. Si Claude a écrit un truc que tu ne comprends pas, demande-lui de simplifier ou d'expliquer — un script plus simple que tu comprends vaut mieux qu'un script élégant que tu subis.`,
    checklist: [
      "Mon script lit le CSV et tourne sans erreur",
      "Le top 5 des stations par kWh s'affiche correctement",
      "Je peux expliquer chaque ligne du script (le vrai critère du badge)",
      "J'ai rencontré au moins une erreur en route et je l'ai diagnostiquée avant de demander le fix",
      "J'ai fait relire le script final à Claude avec « vois-tu des cas limites qui le feraient planter ? »",
    ],
    quiz: [
      {
        q: "L'objectif réaliste de ton niveau Python après ce module ?",
        options: [
          { label: "Lire un script simple, le faire tourner, briefer Claude Code précisément", correct: true },
          { label: "Écrire du code de production sans aide" },
          { label: "Aucun : Claude fait tout, comprendre est inutile" },
        ],
        explanation: "Comprendre ce que le code fait, c'est ce qui te permet de vérifier, corriger le tir et dialoguer avec les builders.",
      },
      {
        q: "sessions[0] sur une liste de sessions, c'est…",
        options: [
          { label: "La première session — Python compte à partir de 0", correct: true },
          { label: "Une liste vide" },
          { label: "La dernière session" },
        ],
        explanation: "Index 0 = premier élément. Le piège classique numéro un.",
      },
      {
        q: "Une traceback se lit…",
        options: [
          { label: "De bas en haut : type d'erreur d'abord, puis la ligne fautive", correct: true },
          { label: "De haut en bas, comme un roman" },
          { label: "On ne la lit pas, on la colle à Claude sans regarder" },
        ],
        explanation: "La dernière ligne donne le diagnostic, la ligne au-dessus le lieu du crime. On la colle à Claude ENSUITE — après son propre diagnostic express.",
      },
      {
        q: "session[\"duree_min\"] plante avec KeyError. La cause la plus probable ?",
        options: [
          { label: "La clé n'existe pas dans ce dictionnaire (faute de frappe ou donnée manquante)", correct: true },
          { label: "La valeur est trop grande" },
          { label: "Python n'aime pas les accents" },
        ],
        explanation: "KeyError = « cette clé n'existe pas ici ». Réflexe : afficher les clés disponibles avec .keys().",
      },
      {
        q: "df.groupby(\"station\")[\"kwh\"].mean() en pandas, c'est l'équivalent de…",
        options: [
          { label: "Un tableau croisé dynamique : moyenne de kWh par station", correct: true },
          { label: "Un tri alphabétique des stations" },
          { label: "La suppression des doublons" },
        ],
        explanation: "groupby = TCD. Cette équivalence mentale suffit pour suivre 90 % des analyses des builders.",
      },
    ],
  },
};
