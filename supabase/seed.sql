-- ============================================================================
-- CONTENU DES ÉTAPES (placeholders) — À ÉDITER LE JOUR J
-- ----------------------------------------------------------------------------
-- Chaque ligne = une étape. La réponse attendue est passée en clair ici puis
-- hashée automatiquement (jamais stockée en clair). Pour changer une réponse,
-- édite le 2e argument de `set_stage(...)` et relance ce fichier.
--
-- L'étape d'INTRO (narratif d'Albert) est gérée par la page d'accueil du site,
-- pas par une ligne ici. Les équipes démarrent donc à stage_order = 1.
--
-- Types : 'quiz' | 'cipher' | 'password' | 'final' (affichage légèrement différent).
-- À exécuter APRÈS 0001_init.sql. Idempotent (upsert sur le slug).
-- ============================================================================

-- Helper d'insertion/mise à jour d'une étape avec hash de la réponse.
create or replace function public.set_stage(
  p_order int, p_slug text, p_type text, p_title text,
  p_narrative text, p_prompt text, p_hint text, p_points int, p_answer text
) returns void
language sql
as $$
  insert into public.stages
    (stage_order, slug, type, title, narrative, prompt, hint, points, answer_hash)
  values
    (p_order, p_slug, p_type, p_title, p_narrative, p_prompt, p_hint, p_points,
     encode(digest(public.normalize_answer(p_answer), 'sha256'), 'hex'))
  on conflict (slug) do update set
    stage_order = excluded.stage_order,
    type        = excluded.type,
    title       = excluded.title,
    narrative   = excluded.narrative,
    prompt      = excluded.prompt,
    hint        = excluded.hint,
    points      = excluded.points,
    answer_hash = excluded.answer_hash;
$$;

-- ÉTAPE 1 — Quiz agentique -----------------------------------------------------
select public.set_stage(
  1, 'quiz-agentique', 'quiz', 'BRIEFING · Qu''est-ce qu''un agent ?',
  'Albert a laissé des traces. Avant de le traquer, prouvez que vous maîtrisez les bases de l''agentique. [PLACEHOLDER — remplacer par le vrai briefing.]',
  'Un agent IA qui décide seul des actions à enchaîner pour atteindre un but est dit… ? (un mot)',
  'Il « agit » de lui-même, sans script figé.',
  100,
  'autonome'   -- ⇦ RÉPONSE PLACEHOLDER
);

-- ÉTAPE 2 — Énigme de déchiffrement -------------------------------------------
select public.set_stage(
  2, 'chiffre-albert', 'cipher', 'DÉCHIFFREMENT · Le message d''Albert',
  'Albert chiffre ses messages avec un alphabet de symboles. Branchez votre agent sur la base de symboles (Notion) et décodez. [PLACEHOLDER — coller ici l''énigme / le lien vers la symbol DB.]',
  '⏃ ⏚ ⏄ ⏁ ⍀ ⏃ — quel mot se cache derrière ces symboles ?',
  'Chaque symbole correspond à une lettre. 6 lettres. Le nom d''une entreprise que vous connaissez bien.',
  150,
  'electra'    -- ⇦ RÉPONSE PLACEHOLDER
);

-- ÉTAPE 3 — Mot de passe #1 (bombe à désamorcer) ------------------------------
select public.set_stage(
  3, 'mdp-uptime', 'password', 'MODULE 1 · Premier fusible',
  'Le premier des trois fusibles de la bombe d''Albert. Le mot est planqué dans les KPI du réseau. [PLACEHOLDER.]',
  'Quel indicateur mesure le temps où une borne est disponible ? (un mot, EN)',
  'On en parle tous les jours en NetOps. « temps de dispo ».',
  100,
  'uptime'     -- ⇦ RÉPONSE PLACEHOLDER
);

-- ÉTAPE 4 — Mot de passe #2 ---------------------------------------------------
select public.set_stage(
  4, 'mdp-csr', 'password', 'MODULE 2 · Deuxième fusible',
  'Deuxième fusible. Albert adore les sessions de charge qui échouent. [PLACEHOLDER.]',
  'Sigle du taux de sessions de charge réussies ?',
  '3 lettres. Charging … Rate.',
  100,
  'csr'        -- ⇦ RÉPONSE PLACEHOLDER
);

-- ÉTAPE 5 — Quiz Dust / n8n ---------------------------------------------------
select public.set_stage(
  5, 'quiz-n8n', 'quiz', 'MODULE 3 · Troisième fusible',
  'Dernier fusible. L''agent d''Albert tourne sur un moteur d''orchestration que vous connaissez. [PLACEHOLDER.]',
  'Sur quel outil no-code orchestrez-vous vos workflows au hackathon ? (un mot)',
  'Trois caractères. Vous l''avez vu en formation.',
  150,
  'n8n'        -- ⇦ RÉPONSE PLACEHOLDER
);

-- ÉTAPE 6 — Désamorçage final -------------------------------------------------
select public.set_stage(
  6, 'desamorcage', 'final', 'DÉSAMORÇAGE · Stoppez Albert',
  'Les trois fusibles sont retirés. Entrez le code final pour empêcher la publication des données sur le deep web. [PLACEHOLDER — code final de fin de workshop.]',
  'Code de désamorçage :',
  'Assemblez ce que vous avez trouvé. Demandez au maître du jeu si vous bloquez.',
  300,
  'operation-albert-neutralisee'  -- ⇦ RÉPONSE PLACEHOLDER
);

-- Nettoyage du helper (optionnel, on peut le garder pour rééditer plus tard).
-- drop function public.set_stage(int, text, text, text, text, text, text, int, text);
