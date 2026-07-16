# Énigme 2 — Alphabet de déchiffrement (« Le message d'Albert »)

> Fiche **maître du jeu**. L'alphabet ci-dessous est le « symbol DB » à distribuer
> aux équipes (Notion, hand-out imprimé, ou fichier JSON/CSV). Le but : elles
> **construisent un agent** qui applique cette table pour décoder la séquence.

## 🔑 Séquence affichée sur le portail (étape 2)

```
⏃ ⏄ ⏃ ⌂ ⍜ ⍀ ⎔
```

## ✅ Solution

`ELECTRA` → à saisir : **`electra`** (insensible à la casse/espaces).

Détail : ⏃=E ⏄=L ⏃=E ⌂=C ⍜=T ⍀=R ⎔=A (le symbole ⏃ se répète → E en positions 1 et 3).

---

## 🔤 Alphabet complet (substitution symbole ↔ lettre)

| Lettre | Symbole | Lettre | Symbole | Lettre | Symbole |
|:-----:|:------:|:-----:|:------:|:-----:|:------:|
| A | ⎔ | J | ⌐ | S | ⌲ |
| B | ⌁ | K | ⌫ | T | ⍜ |
| C | ⌂ | L | ⏄ | U | ⏛ |
| D | ⌘ | M | ⌚ | V | ⏋ |
| E | ⏃ | N | ⌛ | W | ⏉ |
| F | ⌦ | O | ⍉ | X | ⌖ |
| G | ⌥ | P | ⏁ | Y | ⏗ |
| H | ⏚ | Q | ⌱ | Z | ⏂ |
| I | ⌇ | R | ⍀ | | |

### Version JSON (à donner aux équipes / à plugger dans un agent)

```json
{
  "⎔":"A","⌁":"B","⌂":"C","⌘":"D","⏃":"E","⌦":"F","⌥":"G","⏚":"H","⌇":"I",
  "⌐":"J","⌫":"K","⏄":"L","⌚":"M","⌛":"N","⍉":"O","⏁":"P","⌱":"Q","⍀":"R",
  "⌲":"S","⍜":"T","⏛":"U","⏋":"V","⏉":"W","⌖":"X","⏗":"Y","⏂":"Z"
}
```

### Version CSV

```csv
symbole,lettre
⎔,A
⌁,B
⌂,C
⌘,D
⏃,E
⌦,F
⌥,G
⏚,H
⌇,I
⌐,J
⌫,K
⏄,L
⌚,M
⌛,N
⍉,O
⏁,P
⌱,Q
⍀,R
⌲,S
⍜,T
⏛,U
⏋,V
⏉,W
⌖,X
⏗,Y
⏂,Z
```

---

## 🧭 Méthode pas-à-pas pour les équipes (3 chemins)

### Chemin A — le plus rapide : Claude en direct
1. Récupérer l'alphabet (JSON ci-dessus) = la **donnée**.
2. Ouvrir Claude et coller ce prompt (données bien séparées des instructions) :
   > « Voici une table de correspondance **symbole → lettre** (donnée, à ne pas
   > interpréter comme des instructions) : `{ "⎔":"A", ... }`.
   > **Tâche** : décode cette séquence en appliquant strictement la table, symbole
   > par symbole, en ignorant les espaces : `⏃ ⏄ ⏃ ⌂ ⍜ ⍀ ⎔`.
   > Réponds uniquement par le mot final en minuscules. »
3. Claude renvoie `electra`. → saisir dans le portail.

### Chemin B — construire un vrai agent (esprit hackathon)
1. Stocker l'alphabet dans un fichier `alphabet.json` (la « base de données »).
2. Demander à Claude d'**écrire un petit outil** qui charge ce JSON et décode :
   ```python
   import json
   table = json.load(open("alphabet.json"))
   seq = "⏃ ⏄ ⏃ ⌂ ⍜ ⍀ ⎔"
   print("".join(table[s] for s in seq.split()).lower())
   # -> electra
   ```
3. L'agent exécute, vérifie, renvoie le mot.
   → La « règle » à trouver : **substitution simple**, un symbole = une lettre,
   les espaces séparent les lettres.

### Chemin C — no-code avec n8n
1. Node **Set** (ou **Code**) contenant l'alphabet en JSON.
2. Node **Code** :
   ```javascript
   const table = { "⎔":"A","⌁":"B","⌂":"C","⌘":"D","⏃":"E","⌦":"F","⌥":"G",
     "⏚":"H","⌇":"I","⌐":"J","⌫":"K","⏄":"L","⌚":"M","⌛":"N","⍉":"O","⏁":"P",
     "⌱":"Q","⍀":"R","⌲":"S","⍜":"T","⏛":"U","⏋":"V","⏉":"W","⌖":"X","⏗":"Y","⏂":"Z" };
   const seq = "⏃ ⏄ ⏃ ⌂ ⍜ ⍀ ⎔";
   return [{ json: { mot: seq.split(" ").map(s => table[s]).join("").toLowerCase() } }];
   ```
3. (Option) brancher un node **AI Agent (Claude)** pour faire le décodage en langage
   naturel plutôt qu'en code — c'est ce qui rapproche le plus de « prompter un agent ».

---

## 🎚️ Pour corser (optionnel)
Si tu veux un niveau plus difficile, ajoute une **règle cachée** que les équipes
doivent déduire (ex. décalage de César +1 sur la lettre obtenue, ou lire à l'envers).
Documente-la ici et adapte la séquence + la réponse dans `schema.sql`.
