# Electra · Portail Hackathon IA

Portail du hackathon IA d'Electra, en deux mondes :

- **Apprendre** (`/learn`) — partie ludique et élégante (DA bleu canard) : modules de
  documentation (agents, prompting, MCP, collaboration, design) + QCM à feedback immédiat.
- **Défis** (`/play`) — partie « dark / cyber » notée : escape game autour d'**Albert**,
  l'agent IA dont le code a fuité. Réponses validées côté serveur, classement live.

Le tout est piloté par un **maître du jeu** (`/admin`) : minuteur type bombe
(armer / pause / STOP / désamorcer), verrou des soumissions et message diffusé.

## Stack

- **Next.js 16** (App Router, TypeScript, Server Actions) + **React 19**
- **Tailwind CSS v4** + **shadcn/ui**
- **Supabase** (Postgres) — équipes, étapes, quizzes, contrôle du jeu, validation via RPC
- Déploiement : **Vercel** (front) + **Supabase** (DB)

## Sécurité (à comprendre avant d'éditer le contenu)

- Les réponses des défis sont **hashées** (`stages.answer_hash`), jamais en clair.
  Les bonnes options des QCM (`is_correct`) ne sont **jamais** exposées à `anon`.
- Le navigateur lit uniquement des **vues publiques** (`*_public`), sans les réponses.
- Toute écriture passe par des RPC Postgres `SECURITY DEFINER` réservées au
  `service_role` (appelées depuis des Server Actions) → pas de triche via DevTools/API.
- L'admin s'authentifie via un vrai portail (mot de passe **bcrypt**), pas une clé d'URL.

---

## 1. Base de données Supabase

1. Crée un projet sur [supabase.com](https://supabase.com).
2. Dans **SQL Editor**, exécute **`supabase/schema.sql`** (fichier unique,
   idempotent : tables + RLS + RPC + contenu de démarrage).
3. Dans **Project Settings → API**, récupère `Project URL`, la clé `anon` et la clé `service_role`.
4. **Change le mot de passe admin** (seed = `admin` / `electra-2026`) :
   ```sql
   select public.set_admin('admin', 'TON-MOT-DE-PASSE', 'Maître du jeu');
   ```

## 2. Variables d'environnement

Copie `.env.example` en `.env.local` :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...        # SECRET — serveur uniquement, jamais côté client
```

> `ADMIN_KEY` n'est plus utilisé (remplacé par le portail `/admin/login`).

## 3. Lancer en local

```bash
npm install
npm run dev        # http://localhost:3000
```

---

## Déploiement Vercel (auto sur push)

1. Le code est sur GitHub → sur [vercel.com](https://vercel.com) : **Add New → Project**,
   importe le repo `Amalfito/frontend-hackathon`.
2. Framework détecté automatiquement (Next.js), **Root Directory = `.`** (racine).
3. **Settings → Environment Variables** : ajoute les 3 clés ci-dessus
   (Production + Preview).
4. **Deploy**. Ensuite, **chaque push sur `main` redéploie automatiquement**.

> Les migrations Supabase ne sont pas jouées par Vercel : exécute `schema.sql`
> une fois dans le SQL Editor (étape 1).

Un `Dockerfile` (sortie `standalone`) et un `render.yaml` restent fournis pour un
déploiement alternatif (VPS / Render).

---

## Éditer le contenu (jour J)

Tout se pilote via des helpers idempotents dans `supabase/schema.sql` — édite puis relance :

| Helper | Sert à |
| --- | --- |
| `set_stage(ordre, slug, type, titre, narratif, question, indice, points, RÉPONSE)` | une étape notée (réponse hashée auto) |
| `set_lesson(cat, slug, ordre, titre, résumé, contenu_md, icône, minutes)` | un module d'apprentissage |
| `set_quiz(slug, lesson_slug, titre, desc, ordre)` | un QCM |
| `set_question(quiz_slug, qkey, ordre, question, type, points, explication, options_jsonb)` | une question de QCM |
| `set_admin(username, password, nom)` | un compte maître du jeu |

- `stage.type` ∈ `quiz \| cipher \| password \| final`.
- `question.type` ∈ `single \| multiple` ; `options_jsonb` = `[{"label":"…","correct":true}, …]`.
- Réponses insensibles à la casse / espaces multiples.
- Les 6 étapes livrées sont des **placeholders** — branche tes vraies réponses.

## Pages

| Route            | Rôle                                                          |
| ---------------- | ------------------------------------------------------------- |
| `/`              | Intro + saisie du nom d'équipe                                |
| `/learn`         | Modules d'apprentissage (docs + QCM ludiques)                 |
| `/learn/[slug]`  | Un module + son QCM                                           |
| `/play`          | Défis notés : étape courante, validation, indice, chrono      |
| `/leaderboard`   | Classement live (rafraîchi toutes les 5 s)                    |
| `/admin/login`   | Portail maître du jeu (bcrypt)                                |
| `/admin`         | Contrôle du jeu (bombe + verrou) + supervision équipes        |

## Architecture

App **fullstack Next.js** : pas de backend séparé. La logique serveur (validation,
contrôle du jeu, notation) tourne dans les Server Actions. Seule dépendance externe :
**Supabase** (DB). On héberge donc tout sur **un seul** service (Vercel), Supabase restant la base.
