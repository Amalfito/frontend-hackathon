import type { AcademyModule } from "@/lib/academy/types";

/* ============================================================================
 * MODULE 8 — L'API Anthropic : Claude dans vos produits et scripts.
 * Du premier appel au classifieur de tickets prêt pour la prod.
 * ========================================================================== */

export const m8Api: AcademyModule = {
  slug: "api",
  code: "M8",
  title: "L'API Anthropic",
  tagline: "Claude dans tes scripts et tes produits : du premier appel au classifieur de tickets en prod.",
  icon: "🔑",
  badge: "API Artisan",
  audience: "Builders",
  lessons: [
    {
      slug: "concepts-api",
      title: "Les concepts : ce qui se passe derrière un appel API",
      summary: "Endpoint, clé API, modèles, tokens, system prompt, streaming, vision, tool use, batch : la carte complète en une leçon.",
      minutes: 9,
      blocks: [
        {
          kind: "concept",
          title: "claude.ai vs API : même cerveau, autre porte d'entrée",
          md: `Quand tu utilises claude.ai, tu parles à Claude via une interface. Avec l'**API**, c'est TON code qui parle à Claude : tu envoies une requête HTTP à l'endpoint \`/v1/messages\`, tu reçois une réponse. C'est ce qui permet de mettre Claude **dans** un produit ou un script :

- classifier chaque ticket Intercom à son arrivée, sans humain dans la boucle ;
- extraire les champs d'un courrier mairie scanné, en batch, la nuit ;
- générer les descriptions des nouvelles stations pour le site.

La requête minimale contient : le **modèle** choisi, un **max_tokens** (plafond de longueur de réponse), et une liste de **messages** alternant \`user\` et \`assistant\`. En option mais presque toujours utile : un **system prompt** — le rôle permanent du modèle (« Tu es l'assistant support Electra… »), qui cadre TOUTES les réponses de la conversation.

La source de vérité pour tout ce qui suit : docs.claude.com/en/api/overview.`,
        },
        {
          kind: "warning",
          title: "La clé API est un SECRET. Un vrai.",
          md: `Ta clé API, c'est ta carte bleue : quiconque la possède consomme des tokens **facturés à Electra** et peut lire ce que tes scripts envoient. Règles non négociables :

- **Jamais en clair dans le code.** Jamais. Même « juste pour tester ».
- **Jamais commitée** dans un dépôt Git — même privé, même 5 minutes. Chez Electra, **GitGuardian** scanne les dépôts et lèvera l'alerte, mais une clé exposée est une clé **grillée** : révocation immédiate obligatoire.
- Le bon réflexe : **variable d'environnement** (\`ANTHROPIC_API_KEY\`) ou gestionnaire de secrets. Le SDK la lit tout seul, tu n'as même pas à la manipuler.
- Une clé qui fuite → tu la **révoques** dans la console et tu en génères une neuve. Pas de « ça ira ».`,
        },
        {
          kind: "flipcards",
          title: "Les 9 concepts de l'API (clique pour retourner)",
          cards: [
            {
              front: "🚪 Endpoint /v1/messages",
              back: "LA porte d'entrée de l'API : tu POSTes ta requête (modèle + messages), tu reçois la réponse de Claude. Tout le reste du module tourne autour de cet appel.",
            },
            {
              front: "🔑 Clé API",
              back: "Ton identifiant secret, facturé à l'usage. Variable d'environnement ANTHROPIC_API_KEY, jamais dans le code, jamais dans Git. GitGuardian veille — mais ne compte pas sur lui pour rattraper ta négligence.",
            },
            {
              front: "🧠 Choix du modèle",
              back: "Un arbitrage puissance / vitesse / coût. Modèle capable pour l'analyse complexe d'un contrat de raccordement ; modèle rapide et éco pour classifier 10 000 tickets. Noms à jour : docs.claude.com.",
            },
            {
              front: "📏 max_tokens",
              back: "Le plafond de longueur de la réponse. Trop bas → réponse coupée en plein vol. Pour un JSON de classification : 500-1000 suffisent. Pour un rapport : plusieurs milliers.",
            },
            {
              front: "🎭 System prompt",
              back: "Le rôle permanent, séparé des messages : « Tu es l'assistant support Electra, ton périmètre : bornes, sessions, facturation. » Il cadre toutes les réponses — c'est ton levier de contrôle n°1.",
            },
            {
              front: "🌊 Streaming",
              back: "La réponse arrive token par token au lieu d'un bloc final. Indispensable pour une UX de chat (l'utilisateur voit le texte s'écrire) ; inutile pour un script batch de nuit.",
            },
            {
              front: "👁️ Vision",
              back: "Tu peux envoyer des images et des PDF dans les messages : photo d'un écran de borne en erreur, courrier mairie scanné, plan de station. Claude les lit comme du texte.",
            },
            {
              front: "🔧 Tool use (function calling)",
              back: "Tu décris TES fonctions (ex. get_uptime(station)) et Claude DÉCIDE quand les appeler avec quels arguments. C'est toi qui exécutes ; lui orchestre. La brique de base des agents.",
            },
            {
              front: "📦 Batch API",
              back: "Pour les gros volumes non urgents : tu soumets des milliers de requêtes d'un coup, résultats sous 24 h, coût réduit. Parfait pour reclassifier tout l'historique de tickets.",
            },
          ],
        },
        {
          kind: "concept",
          title: "La facturation : tu paies au token",
          md: `Chaque appel est facturé aux **tokens** : ceux que tu envoies (input) + ceux que Claude produit (output). Conséquences pratiques :

- **Volume élevé + tâche simple → modèle rapide et économique.** Classifier un ticket ne demande pas le modèle le plus puissant ; multiplié par 10 000 tickets par mois, le choix du modèle change la facture d'un facteur 10 ou plus.
- Un system prompt de 3 pages renvoyé à chaque appel coûte à chaque appel : sois concis.
- Les tarifs par modèle : docs.claude.com. Aie toujours l'ordre de grandeur en tête avant de lancer un batch.`,
        },
        {
          kind: "quiz",
          title: "Vérifie le câblage",
          questions: [
            {
              q: "Où doit vivre ta clé API Anthropic ?",
              options: [
                { label: "Dans une variable d'environnement ou un gestionnaire de secrets", correct: true },
                { label: "En haut du script, en commentaire, pour la retrouver facilement" },
                { label: "Dans le README du dépôt, section « setup »" },
                { label: "Dans un message Slack épinglé de l'équipe" },
              ],
              explanation: "Variable d'environnement ou secret manager, point. Les trois autres réponses sont des fuites — et GitGuardian sonnera pour la version commitée.",
            },
            {
              q: "Classifier 10 000 tickets Intercom par nuit : quel arbitrage de modèle ?",
              options: [
                { label: "Un modèle rapide et économique — tâche simple × gros volume, le coût par appel domine", correct: true },
                { label: "Le modèle le plus puissant, le support c'est critique" },
                { label: "Peu importe, tous les modèles coûtent pareil" },
              ],
              explanation: "Facturation au token × 10 000 appels : le modèle éco fait le travail pour une fraction du prix. Garde la puissance pour l'analyse complexe unitaire.",
            },
            {
              q: "Le « tool use », c'est…",
              options: [
                { label: "Claude décide d'appeler TES fonctions avec les bons arguments ; ton code les exécute", correct: true },
                { label: "Claude exécute directement du code sur tes serveurs sans contrôle" },
                { label: "Un plugin payant de claude.ai" },
              ],
              explanation: "Claude orchestre, ton code exécute. Tu gardes la main sur ce que chaque fonction fait réellement — c'est ça qui rend le pattern sûr.",
            },
            {
              q: "Ta réponse JSON arrive systématiquement tronquée au milieu. Premier suspect ?",
              options: [
                { label: "max_tokens trop bas : le plafond coupe la réponse", correct: true },
                { label: "Le modèle est fatigué en fin de journée" },
                { label: "Le JSON est un format trop moderne pour l'API" },
              ],
              explanation: "Réponse coupée net = plafond max_tokens atteint. Augmente-le et surveille le champ stop_reason de la réponse.",
            },
          ],
        },
      ],
    },
    {
      slug: "premier-appel",
      title: "Ton premier appel API",
      summary: "Le script Python complet, ligne à ligne : client, system prompt, message, réponse. Puis tu le fais tourner.",
      minutes: 8,
      blocks: [
        {
          kind: "concept",
          title: "Trois lignes qui comptent",
          md: `Le SDK Python d'Anthropic réduit l'appel API à l'essentiel. Dans le script ci-dessous, repère les 3 moments clés :

1. \`anthropic.Anthropic()\` : crée le client — il lit **tout seul** la variable d'environnement \`ANTHROPIC_API_KEY\`. Zéro clé dans le code : c'est exactement ce qu'on veut.
2. \`system=...\` : le rôle permanent. Ici, l'assistant support Electra avec ses consignes de ton.
3. \`messages=[...]\` : la question de l'utilisateur. La réponse arrive dans \`response.content[0].text\`.

Prérequis une seule fois : \`pip install anthropic\` et exporter ta clé dans l'environnement.`,
        },
        {
          kind: "code",
          title: "premier_appel.py — l'assistant support Electra",
          lang: "python",
          code: `import anthropic

# Le client lit ANTHROPIC_API_KEY depuis l'environnement.
# La clé n'apparaît NULLE PART dans ce fichier — et c'est voulu.
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-haiku-4-5",   # noms à jour : docs.claude.com
    max_tokens=500,
    system=(
        "Tu es l'assistant support Electra, opérateur de recharge "
        "rapide pour véhicules électriques. Tu réponds en français, "
        "avec empathie et concision. Tu ne promets jamais de délai "
        "d'intervention que tu ne peux pas garantir."
    ),
    messages=[
        {
            "role": "user",
            "content": "La borne 3 de la station de Rennes affiche "
                       "une erreur E42, que dire au client ?",
        }
    ],
)

print(response.content[0].text)
print("---")
print("Tokens utilisés :", response.usage.input_tokens,
      "en entrée,", response.usage.output_tokens, "en sortie")`,
        },
        {
          kind: "tip",
          title: "Le system prompt est ton volant",
          md: `Relance le même script en changeant UNIQUEMENT le system prompt : « Tu réponds en 2 phrases max » vs « Tu détailles la procédure pas à pas » vs « Tu réponds en allemand pour la zone DACH ». Même question, réponses radicalement différentes. En prod, 80 % de la qualité se joue dans ce champ — c'est là que tu réinvestis tout le Module 2 sur le prompting.`,
        },
        {
          kind: "exercise",
          title: "🛠️ Fais-le tourner, puis fais-le tien",
          md: `Ouvre Claude Code (ou Claude avec exécution de code) et lance le prompt ci-dessous. Si tu n'as pas de clé API sous la main, demande à Claude de **simuler** la réponse de l'API pour valider la logique — mais l'objectif du badge reste un vrai appel.`,
          prompt: "Voici un script Python qui appelle l'API Anthropic [colle le script premier_appel.py de la leçon]. 1) Explique-moi chaque ligne, en particulier comment la clé API est chargée sans jamais apparaître dans le code. 2) Aide-moi à l'exécuter (vérifie que le paquet anthropic est installé et que ANTHROPIC_API_KEY est définie — sans jamais afficher la valeur de la clé). 3) Ensuite, modifie le system prompt pour mon métier chez Electra [décris ton métier : déploiement, support, énergie, foncier...] et change la question user pour un cas réel de mon quotidien. Montre-moi les deux réponses côte à côte.",
          checklist: [
            "Le script a tourné et affiché une vraie réponse de l'API (ou une simulation assumée)",
            "Je sais expliquer d'où vient la clé API et pourquoi elle n'est pas dans le code",
            "J'ai modifié le system prompt ET la question user pour mon métier",
            "J'ai comparé les réponses avant/après modification du system prompt",
            "J'ai repéré le nombre de tokens consommés dans la sortie",
          ],
        },
      ],
    },
    {
      slug: "sorties-structurees",
      title: "Sorties structurées : le pattern d'or",
      summary: "Exiger du JSON strict et le parser : la technique qui transforme Claude en brique logicielle fiable.",
      minutes: 9,
      blocks: [
        {
          kind: "concept",
          title: "Du texte libre au JSON strict",
          md: `Un humain lit du texte libre. Un **programme** a besoin de champs prévisibles. Le pattern d'or de l'API :

1. Dans le prompt, tu **exiges un format JSON strict** : « Réponds UNIQUEMENT en JSON : {"categorie": ..., "urgence": 1-5, "resume": ...} — aucun texte avant ou après. »
2. Tu **parses** la réponse avec \`json.loads()\`.
3. Ton code exploite les champs : router le ticket, remplir la base, alerter Slack.

C'est CE pattern qui débloque les cas d'usage Electra en production :
- **Classification automatique des tickets Intercom** : catégorie, urgence, résumé → routage vers la bonne équipe ;
- **Extraction de champs depuis les courriers mairie scannés** : commune, objet, date limite de réponse, référence parcelle → directement dans le suivi foncier ;
- **Génération de descriptions de stations** pour le site : nombre de bornes, puissance, services à proximité → JSON prêt pour le CMS.`,
        },
        {
          kind: "code",
          title: "classifieur_tickets.py — un classifieur Intercom complet",
          lang: "python",
          code: `import anthropic
import json

client = anthropic.Anthropic()  # clé lue depuis l'environnement

SYSTEM = """Tu es le classifieur de tickets support d'Electra
(recharge rapide de véhicules électriques).
Réponds UNIQUEMENT avec un objet JSON valide, sans texte
avant ou après, au format exact :
{"categorie": "panne_borne" | "facturation" | "roaming" | "application" | "autre",
 "urgence": 1-5,
 "resume": "une phrase",
 "station": "nom de la station si mentionnée, sinon null"}"""

def classifier_ticket(texte: str) -> dict:
    response = client.messages.create(
        model="claude-haiku-4-5",  # volume élevé -> modèle rapide/éco
        max_tokens=300,
        system=SYSTEM,
        messages=[{"role": "user", "content": texte}],
    )
    brut = response.content[0].text
    try:
        return json.loads(brut)
    except json.JSONDecodeError:
        # Filet de sécurité : on n'insère JAMAIS du JSON invalide en base
        return {"categorie": "autre", "urgence": 3,
                "resume": "PARSE_ERROR", "station": None}

ticket = ("Bonjour, je suis à la station de Nice Lingostière, "
          "la borne 5 s'arrête au bout de 2 minutes et j'ai été "
          "débité de 12 EUR. Je dois repartir dans 20 minutes !")

resultat = classifier_ticket(ticket)
print(resultat["categorie"], "- urgence", resultat["urgence"])
print(resultat["resume"])`,
        },
        {
          kind: "warning",
          title: "Ne fais jamais confiance au JSON les yeux fermés",
          md: `Même avec la consigne « UNIQUEMENT du JSON », un modèle peut occasionnellement dévier : texte parasite, champ manquant, urgence à 7 sur une échelle de 5. Trois réflexes de prod :

- **try/except autour du parsing** (comme dans le script) : un ticket mal classé vaut mieux qu'un pipeline planté à 3 h du matin ;
- **valider les valeurs** : la catégorie est-elle dans la liste autorisée ? L'urgence entre 1 et 5 ?
- pour du critique, regarde le **tool use** côté docs.claude.com : définir la sortie comme un schéma d'outil contraint encore mieux le format que la consigne en prompt.`,
        },
        {
          kind: "quiz",
          title: "Le pattern est-il en place ?",
          questions: [
            {
              q: "Pourquoi exiger « UNIQUEMENT du JSON, sans texte avant ou après » ?",
              options: [
                { label: "Pour que json.loads() parse la réponse directement, sans nettoyage fragile", correct: true },
                { label: "Parce que le JSON coûte moins cher en tokens que le français" },
                { label: "Par élégance, le texte libre marche aussi bien pour un programme" },
              ],
              explanation: "Un « Voici la classification : » avant le JSON casse json.loads(). La consigne stricte élimine ce bruit à la source.",
            },
            {
              q: "Le classifieur reçoit un jour une réponse non parsable. Grâce au try/except, il…",
              options: [
                { label: "Retourne un résultat de secours neutre et le pipeline continue", correct: true },
                { label: "Plante et bloque tous les tickets suivants de la nuit" },
                { label: "Réessaie en boucle infinie jusqu'à l'aube" },
              ],
              explanation: "Le filet de sécurité transforme une exception en cas dégradé traçable (resume=PARSE_ERROR) que tu peux requalifier le lendemain.",
            },
          ],
        },
        {
          kind: "exercise",
          title: "🛠️ Adapte le classifieur à TON métier",
          md: `Le classifieur de tickets n'est qu'un gabarit. Prends le prompt ci-dessous et transforme-le en outil pour TES documents : courriers mairie si tu es au foncier, comptes-rendus de visite si tu es au déploiement, demandes de raccordement si tu es à l'énergie…`,
          prompt: "Voici un classifieur de tickets Electra en Python [colle classifieur_tickets.py]. Adapte-le à mon métier : je traite des [décris tes documents : courriers de mairies, comptes-rendus de visite technique, demandes de raccordement Enedis...]. 1) Propose-moi un schéma JSON avec 4 à 6 champs vraiment utiles pour ce type de document (justifie chaque champ). 2) Réécris le SYSTEM prompt en conséquence. 3) Génère 3 documents fictifs réalistes et exécute le classifieur dessus. 4) Montre-moi les JSON produits et signale toute valeur douteuse.",
          checklist: [
            "J'ai défini un schéma JSON adapté à mes documents (pas celui du gabarit)",
            "Le script adapté a tourné sur au moins 3 textes fictifs",
            "Les JSON produits sont parsables et les champs remplis correctement",
            "J'ai testé un document volontairement ambigu pour voir le comportement",
            "Je sais expliquer le rôle du try/except à un collègue",
          ],
        },
      ],
    },
    {
      slug: "bonnes-pratiques-prod",
      title: "De l'expérimentation à la prod : les bonnes pratiques",
      summary: "Retry, timeouts, maîtrise des coûts, batch, logs : ce qui sépare un script du dimanche d'un pipeline qui tourne chaque nuit.",
      minutes: 8,
      blocks: [
        {
          kind: "concept",
          title: "La prod, c'est quand personne ne regarde",
          md: `Ton classifieur marche sur ton poste ? Bravo. Maintenant imagine-le tourner **chaque nuit à 2 h**, sur les tickets de la veille, sans humain devant l'écran. Cinq sujets font la différence :

1. **Retry avec backoff** : l'API peut renvoyer une erreur transitoire (surcharge \`529\`, limite de débit \`429\`). Le SDK Python **réessaie automatiquement** ces erreurs — mais comprends le mécanisme : on attend un peu, on réessaie, on abandonne proprement après N tentatives. On ne martèle jamais l'API en boucle serrée.
2. **Timeouts** : un appel qui ne répond pas ne doit pas geler ton pipeline. Fixe un délai maximal et traite le dépassement comme une erreur normale.
3. **Coûts sous contrôle** : logue \`response.usage\` (tokens in/out) à chaque appel. 10 000 tickets × un system prompt obèse = une facture surprise. Estime AVANT de lancer : nb d'appels × tokens moyens × tarif du modèle (docs.claude.com).
4. **Batch API pour le non-urgent** : reclassifier 50 000 tickets historiques n'a pas besoin de temps réel. Le batch coûte moins cher et lisse la charge — résultats sous 24 h.
5. **Logs exploitables** : pour chaque document traité, trace l'identifiant, le résultat, les tokens, la durée, et les erreurs. Le jour où le support te demande « pourquoi ce ticket urgent a été classé urgence 2 ? », tu réponds en 30 secondes au lieu de rejouer l'appel à l'aveugle.`,
        },
        {
          kind: "code",
          title: "Les 5 pratiques dans un squelette de pipeline",
          lang: "python",
          code: `import anthropic
import json
import logging
import time

logging.basicConfig(level=logging.INFO, filename="classif_tickets.log")

# max_retries : le SDK gère le backoff sur les erreurs transitoires.
# timeout : au-delà de 30 s, on considère l'appel perdu.
client = anthropic.Anthropic(max_retries=3, timeout=30.0)

def traiter_lot(tickets: list[dict]) -> list[dict]:
    resultats = []
    total_tokens = 0
    for t in tickets:
        debut = time.time()
        try:
            resp = client.messages.create(
                model="claude-haiku-4-5",
                max_tokens=300,
                system=SYSTEM,  # voir leçon 8.3
                messages=[{"role": "user", "content": t["texte"]}],
            )
            resultat = json.loads(resp.content[0].text)
            total_tokens += resp.usage.input_tokens + resp.usage.output_tokens
            logging.info("ticket=%s categorie=%s urgence=%s tokens=%s duree=%.1fs",
                         t["id"], resultat["categorie"], resultat["urgence"],
                         resp.usage.output_tokens, time.time() - debut)
        except Exception as e:
            # Un ticket en échec n'arrête pas le lot : on trace et on continue.
            logging.error("ticket=%s ECHEC %s", t["id"], e)
            resultat = {"categorie": "autre", "urgence": 3,
                        "resume": "ERREUR_TRAITEMENT", "station": None}
        resultats.append({"id": t["id"], **resultat})
    logging.info("lot termine : %s tickets, %s tokens", len(tickets), total_tokens)
    return resultats`,
        },
        {
          kind: "tip",
          title: "L'estimation de coût en 30 secondes",
          md: `Avant tout lancement en volume, fais le calcul de coin de table : **nb d'appels × (tokens du system prompt + tokens moyens du document + tokens de sortie) × tarif du modèle**. Exemple : 10 000 tickets × ~700 tokens par appel → 7 millions de tokens. Compare le résultat entre modèle rapide et modèle puissant sur docs.claude.com : c'est souvent ce calcul qui décide du modèle, pas la qualité. Et si le lot n'est pas urgent : **Batch API**, tarif réduit.`,
        },
        {
          kind: "sort",
          title: "Mini-jeu : prêt pour la prod, ou bombe à retardement ?",
          instructions: "Ton binôme builder te montre ses choix d'implémentation pour le pipeline de classification nocturne. Trie chaque choix : bonne pratique ou bombe à retardement ?",
          categories: ["Bonne pratique", "Bombe à retardement"],
          items: [
            { label: "Le client est créé avec max_retries=3 et timeout=30 s", category: "Bonne pratique" },
            { label: "Chaque appel logue l'id du ticket, les tokens et la durée", category: "Bonne pratique" },
            { label: "Les 50 000 tickets historiques passent par la Batch API, pas en temps réel", category: "Bonne pratique" },
            { label: "Un try/except par ticket : un échec n'arrête pas le lot", category: "Bonne pratique" },
            { label: "Le coût du lot est estimé avant lancement (appels × tokens × tarif)", category: "Bonne pratique" },
            { label: "La clé API est en dur dans le script « le temps de la démo »", category: "Bombe à retardement" },
            { label: "En cas d'erreur 429, le script relance immédiatement en boucle while True", category: "Bombe à retardement" },
            { label: "Le modèle le plus puissant est choisi « par sécurité » pour les 10 000 tickets par nuit", category: "Bombe à retardement" },
            { label: "Aucun log : « si ça plante on verra bien au matin »", category: "Bombe à retardement" },
            { label: "json.loads() sans try/except : « le modèle renvoie toujours du JSON propre »", category: "Bombe à retardement" },
          ],
        },
      ],
    },
  ],
  checkpoint: {
    title: "Checkpoint — API Artisan",
    md: `Le livrable Builder : un **script fonctionnel** qui classifie **10 textes fictifs** de bout en bout. C'est la synthèse des 4 leçons : appel API propre, JSON strict parsé, et les réflexes de prod.

## Ta mission
1. Choisis ton corpus : 10 tickets Intercom fictifs, OU 10 courriers mairie fictifs, OU 10 documents de TON métier (fais-les générer par Claude — variés, dont 1 ou 2 volontairement ambigus).
2. Construis le script avec Claude Code : boucle sur les 10 textes, appel API avec system prompt de classification JSON strict, parsing sécurisé, affichage d'un tableau récapitulatif.
3. Exigences : clé API en variable d'environnement, try/except sur le parsing, comptage des tokens totaux du lot.
4. Lance-le, vérifie les 10 classifications à la main, et note où le modèle a hésité.

Comme au Module 7 : Claude écrit, TOI tu comprends chaque ligne.`,
    checklist: [
      "Mon script classifie les 10 textes et affiche un récapitulatif lisible",
      "La clé API n'apparaît nulle part dans le code ni dans Git",
      "Le parsing JSON est protégé par un try/except avec cas de secours",
      "Le script affiche le total de tokens consommés (et j'en déduis le coût approximatif)",
      "J'ai vérifié les 10 classifications à la main et identifié les cas ambigus",
    ],
    quiz: [
      {
        q: "Quel endpoint reçoit tes appels de conversation à l'API Anthropic ?",
        options: [
          { label: "/v1/messages", correct: true },
          { label: "/v1/chat/completions" },
          { label: "/api/claude/talk" },
        ],
        explanation: "C'est LE point d'entrée : modèle + max_tokens + messages (et system en option) → réponse.",
      },
      {
        q: "La bonne façon de gérer ta clé API ?",
        options: [
          { label: "Variable d'environnement ANTHROPIC_API_KEY ou gestionnaire de secrets ; révocation immédiate si elle fuite", correct: true },
          { label: "En dur dans le script, dans un dépôt privé c'est sans risque" },
          { label: "Partagée dans le canal Slack de l'équipe pour dépanner" },
        ],
        explanation: "Jamais dans le code, jamais commitée. GitGuardian alertera, mais une clé exposée se révoque, elle ne se pardonne pas.",
      },
      {
        q: "Le rôle du system prompt ?",
        options: [
          { label: "Définir le rôle et les consignes permanentes qui cadrent toutes les réponses", correct: true },
          { label: "Accélérer le modèle" },
          { label: "Remplacer max_tokens" },
        ],
        explanation: "C'est le volant du modèle : ton, périmètre, format de sortie. 80 % de la qualité en prod se joue là.",
      },
      {
        q: "Le pattern d'or pour intégrer Claude dans un programme ?",
        options: [
          { label: "Exiger un JSON strict au format défini, puis le parser avec validation et filet de sécurité", correct: true },
          { label: "Laisser Claude répondre librement et chercher les infos avec des regex" },
          { label: "Demander la réponse en tableau markdown" },
        ],
        explanation: "JSON strict + json.loads() + try/except + validation des valeurs : la recette du classifieur de tickets, réutilisable partout.",
      },
      {
        q: "Reclassifier 50 000 tickets historiques, sans urgence. Le bon outil ?",
        options: [
          { label: "La Batch API : moins cher, résultats sous 24 h, charge lissée", correct: true },
          { label: "50 000 appels temps réel un lundi matin" },
          { label: "Copier-coller les tickets dans claude.ai par paquets de 10" },
        ],
        explanation: "Gros volume + pas d'urgence = batch. Le temps réel se réserve aux flux entrants.",
      },
      {
        q: "L'API renvoie une erreur 429 (limite de débit). Le comportement correct ?",
        options: [
          { label: "Attendre puis réessayer avec backoff, un nombre limité de fois — ce que fait le SDK avec max_retries", correct: true },
          { label: "Relancer immédiatement en boucle jusqu'à ce que ça passe" },
          { label: "Supprimer le timeout pour laisser plus de temps à l'API" },
        ],
        explanation: "Backoff + plafond de tentatives : on respecte la limite au lieu de l'aggraver, et on échoue proprement si ça persiste.",
      },
    ],
  },
};
