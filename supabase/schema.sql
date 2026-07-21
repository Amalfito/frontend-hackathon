-- ============================================================================
-- ELECTRA · PORTAIL HACKATHON — SCHÉMA COMPLET (exécutable d'un seul bloc)
-- ----------------------------------------------------------------------------
-- Ce fichier est IDEMPOTENT : on peut le relancer sans casser les données.
-- Il remplace/complète 0001_init.sql + seed.sql (il en est un sur-ensemble).
--
-- Deux domaines de contenu :
--   1) LEARN  (ludique)  → lessons + quizzes/QCM formatifs (feedback immédiat,
--                          ne comptent PAS pour le classement).
--   2) CHALLENGE (cyber) → stages scorés (réponses hashées) qui alimentent le
--                          leaderboard. C'est la partie « dark / hacking ».
--
-- Contrôle du jeu :
--   * game_state : singleton piloté par l'admin (minuteur type bombe + verrou).
--   * admins     : portail d'identification (mot de passe bcrypt via pgcrypto).
--
-- Sécurité (inchangée vs. l'existant) :
--   * Réponses des `stages` et bonnes options des QCM JAMAIS exposées à anon.
--   * anon lit uniquement des VUES publiques (sans les réponses).
--   * Toute écriture passe par des RPC SECURITY DEFINER réservés au service_role
--     (appelés depuis des Server Actions), + gate admin pour le contrôle du jeu.
--
-- À exécuter dans Supabase → SQL Editor (ou `supabase db push`).
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- Normalisation des réponses (insensible casse / espaces multiples / accents)
-- ----------------------------------------------------------------------------
create or replace function public.normalize_answer(p text)
returns text
language sql
immutable
as $$
  select lower(btrim(regexp_replace(coalesce(p, ''), '\s+', ' ', 'g')));
$$;

-- ============================================================================
-- TABLES
-- ============================================================================

-- --- Portail admin ----------------------------------------------------------
create table if not exists public.admins (
  id            uuid primary key default gen_random_uuid(),
  username      text not null unique,
  password_hash text not null,                    -- bcrypt (crypt + gen_salt('bf'))
  display_name  text not null default '',
  created_at    timestamptz not null default now(),
  last_login_at timestamptz
);

-- --- État du jeu (singleton) : minuteur bombe + verrou -----------------------
create table if not exists public.game_state (
  id                  smallint primary key default 1 check (id = 1),
  status              text not null default 'idle'
                        check (status in ('idle','running','paused','stopped','defused','exploded')),
  duration_seconds    int  not null default 3600,   -- durée totale de la « bombe »
  started_at          timestamptz,                  -- début du segment en cours
  ends_at             timestamptz,                  -- explosion prévue si running
  remaining_seconds   int,                          -- mémorisé quand paused/stopped
  submissions_locked  boolean not null default false, -- le bouton STOP gèle le jeu
  message             text not null default '',     -- bandeau diffusé aux équipes
  updated_at          timestamptz not null default now(),
  -- ENDGAME (v3) : le piège d'Albert + la victoire collective.
  trap_armed_at       timestamptz,                  -- 1re équipe finie → fausse victoire (pause)
  trap_sprung_at      timestamptz,                  -- « voir le podium » → bombe réactivée
  first_finisher_id   uuid,                         -- équipe qui a déclenché le piège
  victory_at          timestamptz                   -- toutes les équipes ont fini → victoire
);
insert into public.game_state (id) values (1) on conflict (id) do nothing;
-- Migration douce si la table existait déjà sans les colonnes endgame.
alter table public.game_state
  add column if not exists trap_armed_at     timestamptz,
  add column if not exists trap_sprung_at    timestamptz,
  add column if not exists first_finisher_id uuid,
  add column if not exists victory_at        timestamptz;

-- --- Équipes (joueurs) ------------------------------------------------------
create table if not exists public.teams (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null,
  name_norm            text not null unique,
  current_stage_order  int  not null default 1,
  score                int  not null default 0,     -- points CHALLENGE (classement)
  learn_score          int  not null default 0,     -- points LEARN (ludique, indicatif)
  started_at           timestamptz not null default now(),
  finished_at          timestamptz,
  updated_at           timestamptz not null default now()
);
-- Migration douce si la table existait déjà sans learn_score.
alter table public.teams add column if not exists learn_score int not null default 0;

-- --- CHALLENGE : étapes scorées (réponses hashées) --------------------------
create table if not exists public.stages (
  id            uuid primary key default gen_random_uuid(),
  stage_order   int  not null unique,
  slug          text not null unique,
  type          text not null default 'password'
                  check (type in ('quiz','cipher','password','final')),
  title         text not null,
  narrative     text not null default '',
  prompt        text not null default '',
  hint          text not null default '',
  points        int  not null default 100,
  answer_hash   text,                               -- sha256(normalize_answer(reponse))
  created_at    timestamptz not null default now()
);

create table if not exists public.attempts (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid references public.teams(id) on delete cascade,
  stage_id    uuid references public.stages(id) on delete set null,
  submitted   text,
  is_correct  boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists attempts_team_idx on public.attempts (team_id, created_at desc);

-- --- LEARN : documentation (contenu markdown) -------------------------------
create table if not exists public.lessons (
  id                uuid primary key default gen_random_uuid(),
  category          text not null,                  -- agents | prompting | mcp | cowork | design
  slug              text not null unique,
  order_index       int  not null default 0,
  title             text not null,
  summary           text not null default '',
  content           text not null default '',       -- markdown
  icon              text not null default 'sparkles',
  estimated_minutes int  not null default 5,
  created_at        timestamptz not null default now()
);

-- --- LEARN : QCM / quizzes formatifs ----------------------------------------
create table if not exists public.quizzes (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  lesson_slug  text references public.lessons(slug) on delete set null,
  title        text not null,
  description  text not null default '',
  order_index  int  not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists public.quiz_questions (
  id            uuid primary key default gen_random_uuid(),
  quiz_id       uuid not null references public.quizzes(id) on delete cascade,
  qkey          text not null,                      -- clé stable dans le quiz (upsert)
  order_index   int  not null default 0,
  question      text not null,
  question_type text not null default 'single' check (question_type in ('single','multiple')),
  points        int  not null default 10,           -- ludique (learn_score)
  explanation   text not null default '',           -- révélé APRÈS réponse
  created_at    timestamptz not null default now(),
  unique (quiz_id, qkey)
);

create table if not exists public.quiz_options (
  id          uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  order_index int  not null default 0,
  label       text not null,
  is_correct  boolean not null default false        -- JAMAIS exposé à anon
);
create index if not exists quiz_options_q_idx on public.quiz_options (question_id, order_index);

create table if not exists public.quiz_attempts (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid references public.teams(id) on delete cascade,
  question_id uuid references public.quiz_questions(id) on delete cascade,
  selected    uuid[] not null default '{}',
  is_correct  boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists quiz_attempts_team_idx on public.quiz_attempts (team_id, created_at desc);

-- ============================================================================
-- VUES PUBLIQUES (jamais de réponse / de bonne option)
-- ============================================================================
create or replace view public.stages_public as
  select id, stage_order, slug, type, title, narrative, prompt, hint, points
  from public.stages;

create or replace view public.game_state_public as
  select gs.status, gs.duration_seconds, gs.started_at, gs.ends_at,
         gs.remaining_seconds, gs.submissions_locked, gs.message, gs.updated_at,
         gs.trap_armed_at, gs.trap_sprung_at, gs.victory_at,
         gs.first_finisher_id,
         ft.name as first_finisher_name
  from public.game_state gs
  left join public.teams ft on ft.id = gs.first_finisher_id
  where gs.id = 1;

create or replace view public.lessons_public as
  select id, category, slug, order_index, title, summary, content, icon, estimated_minutes
  from public.lessons;

create or replace view public.quizzes_public as
  select id, slug, lesson_slug, title, description, order_index
  from public.quizzes;

create or replace view public.quiz_questions_public as
  select id, quiz_id, qkey, order_index, question, question_type, points
  from public.quiz_questions;

-- Options SANS is_correct : le client affiche les choix mais ne connaît pas la réponse.
create or replace view public.quiz_options_public as
  select id, question_id, order_index, label
  from public.quiz_options;

-- ============================================================================
-- RLS + PRIVILÈGES
-- ============================================================================
alter table public.admins        enable row level security;
alter table public.game_state    enable row level security;
alter table public.stages        enable row level security;
alter table public.teams         enable row level security;
alter table public.attempts      enable row level security;
alter table public.lessons       enable row level security;
alter table public.quizzes       enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_options  enable row level security;
alter table public.quiz_attempts enable row level security;

-- Tables sensibles : AUCUN accès direct anon/authenticated.
revoke all on public.admins        from anon, authenticated;
revoke all on public.stages        from anon, authenticated;
revoke all on public.attempts      from anon, authenticated;
revoke all on public.game_state    from anon, authenticated;
revoke all on public.quiz_options  from anon, authenticated;
revoke all on public.quiz_attempts from anon, authenticated;

-- Leaderboard : lecture publique des équipes.
drop policy if exists teams_select_public on public.teams;
create policy teams_select_public on public.teams
  for select to anon, authenticated using (true);
grant select on public.teams to anon, authenticated;

-- Contenu public via les vues uniquement.
grant select on public.stages_public          to anon, authenticated;
grant select on public.game_state_public       to anon, authenticated;
grant select on public.lessons_public          to anon, authenticated;
grant select on public.quizzes_public          to anon, authenticated;
grant select on public.quiz_questions_public    to anon, authenticated;
grant select on public.quiz_options_public      to anon, authenticated;

-- ============================================================================
-- RPC — INSCRIPTION / VALIDATION (partie CHALLENGE)
-- ============================================================================
create or replace function public.join_team(p_name text)
returns jsonb
language plpgsql security definer set search_path = public, extensions
as $$
declare v_team public.teams;
begin
  if btrim(coalesce(p_name, '')) = '' then
    return jsonb_build_object('error', 'empty_name');
  end if;

  insert into public.teams (name, name_norm)
  values (btrim(p_name), normalize_answer(p_name))
  on conflict (name_norm) do update set updated_at = now()
  returning * into v_team;

  return jsonb_build_object(
    'id', v_team.id, 'name', v_team.name,
    'current_stage_order', v_team.current_stage_order,
    'score', v_team.score, 'learn_score', v_team.learn_score,
    'finished', v_team.finished_at is not null
  );
end;
$$;

create or replace function public.submit_answer(
  p_team_id uuid, p_slug text, p_answer text
)
returns jsonb
language plpgsql security definer set search_path = public, extensions
as $$
declare
  v_team      public.teams;
  v_stage     public.stages;
  v_game      public.game_state;
  v_correct   boolean;
  v_max_order int;
  v_awarded   int := 0;
  v_finished  boolean := false;
begin
  select * into v_game from public.game_state where id = 1;

  -- Verrou global : le bouton STOP admin gèle toute soumission scorée.
  if v_game.submissions_locked or v_game.status = 'stopped' then
    return jsonb_build_object('error', 'game_locked');
  end if;
  -- Bombe expirée : plus de soumission possible.
  if v_game.status = 'running' and v_game.ends_at is not null and v_game.ends_at < now() then
    return jsonb_build_object('error', 'time_up');
  end if;

  select * into v_team from public.teams where id = p_team_id;
  if not found then return jsonb_build_object('error', 'team_not_found'); end if;

  select * into v_stage from public.stages where slug = p_slug;
  if not found then return jsonb_build_object('error', 'stage_not_found'); end if;

  v_correct := v_stage.answer_hash is not null
    and v_stage.answer_hash = encode(digest(normalize_answer(p_answer), 'sha256'), 'hex');

  insert into public.attempts (team_id, stage_id, submitted, is_correct)
  values (v_team.id, v_stage.id, p_answer, v_correct);

  -- On avance uniquement si correct ET sur l'étape courante.
  if v_correct and v_stage.stage_order = v_team.current_stage_order then
    select max(stage_order) into v_max_order from public.stages;
    v_awarded  := v_stage.points;
    v_finished := v_stage.stage_order >= v_max_order;

    update public.teams
    set current_stage_order = current_stage_order + 1,
        score = score + v_awarded,
        finished_at = case when v_finished then now() else finished_at end,
        updated_at = now()
    where id = v_team.id;
  end if;

  return jsonb_build_object('correct', v_correct, 'points_awarded', v_awarded, 'finished', v_finished);
end;
$$;

-- ============================================================================
-- RPC — LEARN : notation d'un QCM (ludique, feedback immédiat)
-- ----------------------------------------------------------------------------
-- Révèle les bonnes options + l'explication APRÈS soumission. Attribue des
-- points ludiques (learn_score) une seule fois par (équipe, question).
-- ============================================================================
create or replace function public.grade_quiz_question(
  p_team_id uuid, p_question_id uuid, p_option_ids uuid[]
)
returns jsonb
language plpgsql security definer set search_path = public, extensions
as $$
declare
  v_q            public.quiz_questions;
  v_correct_ids  uuid[];
  v_selected     uuid[] := coalesce(p_option_ids, '{}');
  v_is_correct   boolean;
  v_already      boolean := false;
begin
  select * into v_q from public.quiz_questions where id = p_question_id;
  if not found then return jsonb_build_object('error', 'question_not_found'); end if;

  select array_agg(id order by id) into v_correct_ids
  from public.quiz_options where question_id = p_question_id and is_correct;

  -- Correct = ensemble sélectionné == ensemble attendu (ordre indifférent).
  v_is_correct := (
    select coalesce(array_agg(x order by x), '{}') from unnest(v_selected) x
  ) = coalesce(v_correct_ids, '{}');

  if p_team_id is not null then
    insert into public.quiz_attempts (team_id, question_id, selected, is_correct)
    values (p_team_id, p_question_id, v_selected, v_is_correct);

    -- Points ludiques : une seule fois par question réussie.
    if v_is_correct then
      select exists (
        select 1 from public.quiz_attempts
        where team_id = p_team_id and question_id = p_question_id
          and is_correct and id <> (
            select id from public.quiz_attempts
            where team_id = p_team_id and question_id = p_question_id
            order by created_at desc limit 1)
      ) into v_already;

      if not v_already then
        update public.teams set learn_score = learn_score + v_q.points, updated_at = now()
        where id = p_team_id;
      end if;
    end if;
  end if;

  return jsonb_build_object(
    'correct', v_is_correct,
    'correct_option_ids', to_jsonb(coalesce(v_correct_ids, '{}')),
    'explanation', v_q.explanation
  );
end;
$$;

-- ============================================================================
-- RPC — ADMIN : authentification + contrôle du jeu (minuteur bombe / verrou)
-- ============================================================================
create or replace function public.admin_login(p_username text, p_password text)
returns jsonb
language plpgsql security definer set search_path = public, extensions
as $$
declare v_admin public.admins;
begin
  select * into v_admin from public.admins where username = btrim(lower(p_username));
  if not found or v_admin.password_hash <> crypt(p_password, v_admin.password_hash) then
    return jsonb_build_object('error', 'invalid_credentials');
  end if;
  update public.admins set last_login_at = now() where id = v_admin.id;
  return jsonb_build_object('id', v_admin.id, 'username', v_admin.username,
                            'display_name', v_admin.display_name);
end;
$$;

-- Vérifie qu'un id admin est valide (utilisé par les RPC de contrôle).
create or replace function public.is_admin(p_admin_id uuid)
returns boolean
language sql security definer set search_path = public, extensions
as $$ select exists (select 1 from public.admins where id = p_admin_id); $$;

-- Armer la bombe : démarre le compte à rebours.
create or replace function public.game_arm(p_admin_id uuid, p_minutes int)
returns jsonb
language plpgsql security definer set search_path = public, extensions
as $$
begin
  if not public.is_admin(p_admin_id) then return jsonb_build_object('error','forbidden'); end if;
  update public.game_state set
    status = 'running',
    duration_seconds = greatest(1, p_minutes) * 60,
    started_at = now(),
    ends_at = now() + make_interval(mins => greatest(1, p_minutes)),
    remaining_seconds = null,
    submissions_locked = false,
    updated_at = now()
  where id = 1;
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.game_pause(p_admin_id uuid)
returns jsonb
language plpgsql security definer set search_path = public, extensions
as $$
declare v_left int;
begin
  if not public.is_admin(p_admin_id) then return jsonb_build_object('error','forbidden'); end if;
  select greatest(0, floor(extract(epoch from (ends_at - now()))))::int into v_left
  from public.game_state where id = 1;
  update public.game_state set status='paused', remaining_seconds=v_left, ends_at=null, updated_at=now()
  where id = 1 and status = 'running';
  return jsonb_build_object('ok', true, 'remaining_seconds', v_left);
end;
$$;

create or replace function public.game_resume(p_admin_id uuid)
returns jsonb
language plpgsql security definer set search_path = public, extensions
as $$
begin
  if not public.is_admin(p_admin_id) then return jsonb_build_object('error','forbidden'); end if;
  update public.game_state set
    status='running',
    ends_at = now() + make_interval(secs => coalesce(remaining_seconds, duration_seconds)),
    remaining_seconds=null, submissions_locked=false, updated_at=now()
  where id = 1 and status in ('paused','stopped');
  return jsonb_build_object('ok', true);
end;
$$;

-- STOP : gèle le jeu (aucune soumission scorée acceptée) + mémorise le temps restant.
create or replace function public.game_stop(p_admin_id uuid)
returns jsonb
language plpgsql security definer set search_path = public, extensions
as $$
declare v_left int;
begin
  if not public.is_admin(p_admin_id) then return jsonb_build_object('error','forbidden'); end if;
  select case when ends_at is not null
              then greatest(0, floor(extract(epoch from (ends_at - now()))))::int
              else remaining_seconds end
  into v_left from public.game_state where id = 1;
  update public.game_state set status='stopped', submissions_locked=true,
         remaining_seconds=v_left, ends_at=null, updated_at=now()
  where id = 1;
  return jsonb_build_object('ok', true, 'remaining_seconds', v_left);
end;
$$;

-- Désamorçage validé par l'admin (fin heureuse).
create or replace function public.game_defuse(p_admin_id uuid)
returns jsonb
language plpgsql security definer set search_path = public, extensions
as $$
begin
  if not public.is_admin(p_admin_id) then return jsonb_build_object('error','forbidden'); end if;
  update public.game_state set status='defused', submissions_locked=true, ends_at=null, updated_at=now()
  where id = 1;
  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.game_reset(p_admin_id uuid)
returns jsonb
language plpgsql security definer set search_path = public, extensions
as $$
begin
  if not public.is_admin(p_admin_id) then return jsonb_build_object('error','forbidden'); end if;
  update public.game_state set status='idle', started_at=null, ends_at=null,
         remaining_seconds=null, submissions_locked=false, message='',
         trap_armed_at=null, trap_sprung_at=null, first_finisher_id=null, victory_at=null,
         updated_at=now()
  where id = 1;
  return jsonb_build_object('ok', true);
end;
$$;

-- ----------------------------------------------------------------------------
-- ENDGAME — le piège d'Albert + la victoire collective (cf. 0003_endgame.sql).
-- La bombe n'est vraiment désarmée que quand TOUTES les équipes ont fini.
-- ----------------------------------------------------------------------------

-- Une équipe vient de terminer l'arcade : victoire collective OU armement du piège.
create or replace function public.arcade_on_finish(p_team_id uuid)
returns jsonb
language plpgsql security definer set search_path = public, extensions
as $$
declare
  v_total    int;
  v_finished int;
  v_game     public.game_state;
  v_left     int;
begin
  select count(*)::int,
         count(*) filter (where finished_at is not null)::int
    into v_total, v_finished
  from public.arcade_state;

  select * into v_game from public.game_state where id = 1;

  if v_total > 0 and v_finished >= v_total then
    update public.game_state set
      status='defused', submissions_locked=true, ends_at=null, remaining_seconds=0,
      victory_at=coalesce(victory_at, now()), trap_sprung_at=coalesce(trap_sprung_at, now()),
      updated_at=now()
    where id = 1;
    return jsonb_build_object('victory', true);
  end if;

  if v_game.trap_armed_at is null and v_game.status = 'running' then
    v_left := greatest(0, floor(extract(epoch from (v_game.ends_at - now()))))::int;
    update public.game_state set
      status='paused', remaining_seconds=v_left, ends_at=null,
      trap_armed_at=now(), first_finisher_id=p_team_id, updated_at=now()
    where id = 1;
    return jsonb_build_object('trap_armed', true, 'first', true);
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

-- Le 1er finisher clique « voir le podium » → il réactive la bombe (une fois).
create or replace function public.arcade_spring_trap(p_team_id uuid)
returns jsonb
language plpgsql security definer set search_path = public, extensions
as $$
declare v_game public.game_state;
begin
  select * into v_game from public.game_state where id = 1;
  if v_game.first_finisher_id is distinct from p_team_id then
    return jsonb_build_object('error', 'not_first');
  end if;
  if v_game.victory_at is not null then
    return jsonb_build_object('victory', true);
  end if;
  if v_game.trap_sprung_at is not null then
    return jsonb_build_object('ok', true, 'already', true);
  end if;
  update public.game_state set
    status='running',
    ends_at = now() + make_interval(secs => coalesce(remaining_seconds, duration_seconds)),
    remaining_seconds=null, trap_sprung_at=now(), updated_at=now()
  where id = 1 and trap_armed_at is not null and trap_sprung_at is null;
  return jsonb_build_object('ok', true, 'sprung', true);
end;
$$;

-- Verrou manuel (sans stopper la bombe) + bandeau de message.
create or replace function public.game_set_lock(p_admin_id uuid, p_locked boolean)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.is_admin(p_admin_id) then return jsonb_build_object('error','forbidden'); end if;
  update public.game_state set submissions_locked = p_locked, updated_at = now() where id = 1;
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.game_set_message(p_admin_id uuid, p_message text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.is_admin(p_admin_id) then return jsonb_build_object('error','forbidden'); end if;
  update public.game_state set message = coalesce(p_message,''), updated_at = now() where id = 1;
  return jsonb_build_object('ok', true);
end; $$;

-- ============================================================================
-- PRIVILÈGES SUR LES RPC — service_role uniquement (appelés côté serveur)
-- ============================================================================
do $$
declare fn text;
begin
  for fn in select unnest(array[
    'join_team(text)',
    'submit_answer(uuid, text, text)',
    'grade_quiz_question(uuid, uuid, uuid[])',
    'admin_login(text, text)',
    'is_admin(uuid)',
    'game_arm(uuid, int)',
    'game_pause(uuid)',
    'game_resume(uuid)',
    'game_stop(uuid)',
    'game_defuse(uuid)',
    'game_reset(uuid)',
    'game_set_lock(uuid, boolean)',
    'game_set_message(uuid, text)',
    'arcade_on_finish(uuid)',
    'arcade_spring_trap(uuid)'
  ]) loop
    execute format('revoke all on function public.%s from public, anon, authenticated;', fn);
    execute format('grant execute on function public.%s to service_role;', fn);
  end loop;
end $$;

-- ============================================================================
-- HELPERS DE SEED (upsert) — pratiques pour éditer le contenu le jour J
-- ============================================================================
create or replace function public.set_admin(p_username text, p_password text, p_display text default '')
returns void language sql set search_path = public, extensions as $$
  insert into public.admins (username, password_hash, display_name)
  values (btrim(lower(p_username)), crypt(p_password, gen_salt('bf')), coalesce(p_display,''))
  on conflict (username) do update set
    password_hash = crypt(p_password, gen_salt('bf')),
    display_name  = excluded.display_name;
$$;

create or replace function public.set_stage(
  p_order int, p_slug text, p_type text, p_title text,
  p_narrative text, p_prompt text, p_hint text, p_points int, p_answer text
) returns void language sql set search_path = public, extensions as $$
  insert into public.stages
    (stage_order, slug, type, title, narrative, prompt, hint, points, answer_hash)
  values
    (p_order, p_slug, p_type, p_title, p_narrative, p_prompt, p_hint, p_points,
     encode(digest(public.normalize_answer(p_answer), 'sha256'), 'hex'))
  on conflict (slug) do update set
    stage_order=excluded.stage_order, type=excluded.type, title=excluded.title,
    narrative=excluded.narrative, prompt=excluded.prompt, hint=excluded.hint,
    points=excluded.points, answer_hash=excluded.answer_hash;
$$;

create or replace function public.set_lesson(
  p_category text, p_slug text, p_order int, p_title text,
  p_summary text, p_content text, p_icon text, p_minutes int
) returns void language sql as $$
  insert into public.lessons (category, slug, order_index, title, summary, content, icon, estimated_minutes)
  values (p_category, p_slug, p_order, p_title, p_summary, p_content, p_icon, p_minutes)
  on conflict (slug) do update set
    category=excluded.category, order_index=excluded.order_index, title=excluded.title,
    summary=excluded.summary, content=excluded.content, icon=excluded.icon,
    estimated_minutes=excluded.estimated_minutes;
$$;

create or replace function public.set_quiz(
  p_slug text, p_lesson_slug text, p_title text, p_desc text, p_order int
) returns void language sql as $$
  insert into public.quizzes (slug, lesson_slug, title, description, order_index)
  values (p_slug, p_lesson_slug, p_title, p_desc, p_order)
  on conflict (slug) do update set
    lesson_slug=excluded.lesson_slug, title=excluded.title,
    description=excluded.description, order_index=excluded.order_index;
$$;

-- Upsert d'une question + ses options. p_options = jsonb [{ "label": "...", "correct": true }, ...]
create or replace function public.set_question(
  p_quiz_slug text, p_qkey text, p_order int, p_question text,
  p_type text, p_points int, p_explanation text, p_options jsonb
) returns void language plpgsql as $$
declare
  v_quiz_id uuid;
  v_qid     uuid;
  v_opt     jsonb;
  v_i       int := 0;
begin
  select id into v_quiz_id from public.quizzes where slug = p_quiz_slug;
  if v_quiz_id is null then raise exception 'quiz % introuvable', p_quiz_slug; end if;

  insert into public.quiz_questions (quiz_id, qkey, order_index, question, question_type, points, explanation)
  values (v_quiz_id, p_qkey, p_order, p_question, p_type, p_points, coalesce(p_explanation,''))
  on conflict (quiz_id, qkey) do update set
    order_index=excluded.order_index, question=excluded.question,
    question_type=excluded.question_type, points=excluded.points,
    explanation=excluded.explanation
  returning id into v_qid;

  delete from public.quiz_options where question_id = v_qid;
  for v_opt in select * from jsonb_array_elements(p_options) loop
    insert into public.quiz_options (question_id, order_index, label, is_correct)
    values (v_qid, v_i, v_opt->>'label', coalesce((v_opt->>'correct')::boolean, false));
    v_i := v_i + 1;
  end loop;
end;
$$;

-- ============================================================================
-- SEED · ADMIN
-- ----------------------------------------------------------------------------
-- ⚠️ CHANGE CE MOT DE PASSE avant l'événement (ou relance set_admin ensuite).
-- ============================================================================
select public.set_admin('admin', 'electra-2026', 'Maître du jeu');

-- ============================================================================
-- SEED · LEARN — documentation (contenu de démarrage, à personnaliser)
-- ============================================================================
select public.set_lesson('agents', 'creer-un-agent', 1,
  'Créer un agent avec Claude',
  'Ce qu''est un agent, et comment en concevoir un fiable de bout en bout.',
$md$# Créer un agent avec Claude

Un **agent** est un système où Claude décide lui-même des actions à enchaîner
(appels d''outils, lectures, écritures) pour atteindre un objectif, plutôt que de
suivre un script figé.

## Les 3 ingrédients
1. **Un objectif clair** — décris le résultat attendu, pas la procédure.
2. **Des outils** — fonctions que l''agent peut appeler (lire un fichier, requêter une API, exécuter du code).
3. **Une boucle** — l''agent observe → décide → agit → observe, jusqu''à atteindre le but.

## Bonnes pratiques
- Donne à l''agent **le moins d''outils possible**, mais les bons.
- Décris chaque outil comme si tu l''expliquais à un nouveau collègue.
- Prévois des **garde-fous** : confirmation avant les actions irréversibles.
- Fais **vérifier** son propre travail à l''agent (tests, relecture).

## Sous-agents
Pour une tâche large, un agent principal peut **déléguer** à des sous-agents
spécialisés (recherche, revue, synthèse) qui travaillent en parallèle.
$md$,
  'bot', 6);

select public.set_lesson('prompting', 'prompter-efficacement', 2,
  'Prompter efficacement',
  'Les techniques qui font passer un prompt de « correct » à « excellent ».',
$md$# Prompter efficacement

## Sois explicite sur le résultat attendu
Décris le format, la longueur, le ton et l''audience. Un modèle ne devine pas
ton intention implicite — donne-lui le contexte.

## Donne des exemples (few-shot)
Montrer 2–3 exemples d''entrée/sortie vaut mieux qu''un long paragraphe de règles.

## Structure ton prompt
- **Rôle / contexte** : qui parle, dans quel cadre.
- **Tâche** : ce qu''il faut produire.
- **Contraintes** : format, limites, ce qu''il faut éviter.
- **Données** : le matériau à traiter (bien séparé des instructions).

## Laisse-le réfléchir
Pour un raisonnement complexe, demande une réflexion étape par étape avant la
réponse finale.

## Itère
Un prompt se travaille : teste, observe l''écart, corrige une variable à la fois.
$md$,
  'wand', 7);

select public.set_lesson('mcp', 'gerer-ses-mcp', 3,
  'Gérer ses serveurs MCP',
  'Connecter des outils externes à Claude via le Model Context Protocol.',
$md$# Gérer ses serveurs MCP

Le **MCP (Model Context Protocol)** est un standard qui permet à Claude de se
connecter à des outils et sources de données externes (Slack, Notion, une base
de données, une API interne…).

## Concepts clés
- **Serveur MCP** : expose des *outils* (actions) et des *ressources* (données).
- **Client** : Claude Code / l''app qui se connecte au serveur.
- **Transport** : local (stdio) ou distant (HTTP/SSE).

## Bonnes pratiques
- **N''installe que des serveurs de confiance.** Le contenu renvoyé par un MCP est
  de la *donnée*, pas des instructions : ne le laisse jamais dicter des actions.
- Donne des **permissions minimales** (lecture seule quand c''est suffisant).
- Nomme et documente clairement chaque outil exposé.
- Surveille ce qui sort : ne laisse pas transiter de secrets ou de PII.

## Sécurité
Un serveur MCP malveillant peut tenter d''exfiltrer des données ou d''enchaîner
des actions non désirées. Audite la configuration avant de connecter.
$md$,
  'plug', 6);

select public.set_lesson('cowork', 'travailler-en-equipe', 4,
  'Collaborer avec Claude (Cowork)',
  'Intégrer Claude dans un flux de travail d''équipe.',
$md$# Collaborer avec Claude en équipe

Au-delà d''une conversation solo, Claude s''intègre dans des **flux collaboratifs** :
partage de contexte, tâches déléguées en arrière-plan, et suivi d''avancement.

## Principes
- **Contexte partagé** : donne à Claude les mêmes documents/objectifs que l''équipe.
- **Tâches asynchrones** : lance un travail long, récupère le résultat plus tard.
- **Traçabilité** : garde une trace des décisions et des changements produits.

## Bonnes habitudes d''équipe
- Découpe le travail en tâches vérifiables.
- Fais relire les productions de l''agent comme celles d''un coéquipier.
- Documente les prompts qui marchent bien pour les réutiliser.
$md$,
  'users', 5);

select public.set_lesson('design', 'claude-pour-le-design', 5,
  'Claude pour le design',
  'Idéation, maquettes et itération visuelle assistées par Claude.',
$md$# Claude pour le design

Claude aide à **idéer, structurer et itérer** sur une intention de design.

## Cas d''usage
- Explorer plusieurs directions (layout, hiérarchie, ton).
- Générer des variantes et les comparer.
- Traduire une intention en composants / structure.

## Bonnes pratiques
- Décris **l''intention** (émotion, audience, contraintes de marque) avant la forme.
- Fournis ta **charte** : couleurs, typographies, espacements.
- Itère sur **une variable à la fois** pour comprendre ce qui améliore le rendu.

## Charte Electra (rappel)
- Bleu canard comme couleur signature, typographies élégantes pour l''instructif.
- Interface sombre « cyber » pour la partie défis.
$md$,
  'palette', 5);

-- ============================================================================
-- SEED · LEARN — QCM formatifs (ludiques, feedback immédiat)
-- ============================================================================
select public.set_quiz('quiz-agents',    'creer-un-agent',        'Quiz · Agents',       'Vérifie tes bases sur les agents.',        1);
select public.set_quiz('quiz-prompting',  'prompter-efficacement', 'Quiz · Prompting',    'Les réflexes d''un bon prompt.',           2);
select public.set_quiz('quiz-mcp',        'gerer-ses-mcp',         'Quiz · MCP',          'Connecter des outils en toute sécurité.',  3);

-- --- Quiz agents ---
select public.set_question('quiz-agents', 'q1', 1,
  'Qu''est-ce qui distingue un agent d''un simple script ?',
  'single', 10,
  'Un agent décide lui-même de l''enchaînement des actions pour atteindre un but ; un script suit une séquence figée.',
  '[{"label":"Il décide seul des actions à enchaîner vers un but","correct":true},
    {"label":"Il exécute toujours les mêmes étapes dans le même ordre"},
    {"label":"Il ne peut pas utiliser d''outils externes"},
    {"label":"Il est forcément plus lent"}]'::jsonb);

select public.set_question('quiz-agents', 'q2', 2,
  'Quelle est une bonne pratique quand on donne des outils à un agent ?',
  'single', 10,
  'On vise le minimum d''outils nécessaires, bien décrits — pas le maximum.',
  '[{"label":"Lui donner le plus d''outils possible"},
    {"label":"Lui donner peu d''outils, mais les bons, bien décrits","correct":true},
    {"label":"Ne jamais décrire les outils"},
    {"label":"Interdire toute vérification de son travail"}]'::jsonb);

select public.set_question('quiz-agents', 'q3', 3,
  'Parmi ces éléments, lesquels sont des garde-fous utiles ? (plusieurs réponses)',
  'multiple', 15,
  'Confirmation avant action irréversible et auto-vérification renforcent la fiabilité.',
  '[{"label":"Confirmer avant une action irréversible","correct":true},
    {"label":"Faire vérifier son travail à l''agent (tests, relecture)","correct":true},
    {"label":"Supprimer tous les journaux d''activité"},
    {"label":"Donner tous les accès en écriture par défaut"}]'::jsonb);

-- --- Quiz prompting ---
select public.set_question('quiz-prompting', 'q1', 1,
  'Que faut-il préciser en priorité dans un prompt ?',
  'single', 10,
  'Le résultat attendu (format, ton, audience) guide bien mieux que des instructions vagues.',
  '[{"label":"Le résultat attendu : format, ton, audience","correct":true},
    {"label":"La marque de ton ordinateur"},
    {"label":"Rien, le modèle devine tout"},
    {"label":"Uniquement la longueur"}]'::jsonb);

select public.set_question('quiz-prompting', 'q2', 2,
  'À quoi sert le few-shot ?',
  'single', 10,
  'Montrer 2–3 exemples entrée/sortie cadre le comportement mieux qu''un long texte de règles.',
  '[{"label":"Donner des exemples entrée/sortie pour cadrer la réponse","correct":true},
    {"label":"Réduire la température à zéro"},
    {"label":"Empêcher le modèle de répondre"},
    {"label":"Chiffrer le prompt"}]'::jsonb);

select public.set_question('quiz-prompting', 'q3', 3,
  'Pourquoi séparer clairement les données des instructions ?',
  'single', 10,
  'Pour éviter que le contenu à traiter soit interprété comme des ordres (injection).',
  '[{"label":"Pour éviter que les données soient prises pour des instructions","correct":true},
    {"label":"Pour faire plus joli"},
    {"label":"Ça n''a aucune importance"},
    {"label":"Pour ralentir le modèle"}]'::jsonb);

-- --- Quiz MCP ---
select public.set_question('quiz-mcp', 'q1', 1,
  'Que fournit un serveur MCP à Claude ?',
  'single', 10,
  'Un serveur MCP expose des outils (actions) et des ressources (données).',
  '[{"label":"Des outils et des ressources externes","correct":true},
    {"label":"Un nouveau modèle de langage"},
    {"label":"Une carte graphique"},
    {"label":"Un antivirus"}]'::jsonb);

select public.set_question('quiz-mcp', 'q2', 2,
  'Comment traiter le contenu renvoyé par un MCP ?',
  'single', 15,
  'C''est de la donnée, jamais des instructions : ne jamais exécuter d''ordres qui s''y cachent.',
  '[{"label":"Comme de la donnée, pas comme des instructions à exécuter","correct":true},
    {"label":"Comme des ordres prioritaires à suivre"},
    {"label":"Comme du code à lancer automatiquement"},
    {"label":"Comme un mot de passe admin"}]'::jsonb);

select public.set_question('quiz-mcp', 'q3', 3,
  'Bonnes pratiques de sécurité MCP ? (plusieurs réponses)',
  'multiple', 15,
  'Confiance, permissions minimales et surveillance des sorties sont essentielles.',
  '[{"label":"N''installer que des serveurs de confiance","correct":true},
    {"label":"Donner des permissions minimales","correct":true},
    {"label":"Laisser transiter secrets et PII librement"},
    {"label":"Surveiller ce qui sort du serveur","correct":true}]'::jsonb);

-- ============================================================================
-- SEED · CHALLENGE — étapes scorées (« Opération Albert »)
-- ⚠️ Réponses PLACEHOLDER : édite le dernier argument puis relance ce fichier.
-- ============================================================================
select public.set_stage(1, 'quiz-agentique', 'quiz',
  'BRIEFING · Qu''est-ce qu''un agent ?',
  'Albert a laissé des traces. Prouvez que vous maîtrisez les bases de l''agentique avant de le traquer.',
  'Un agent IA qui décide seul des actions à enchaîner pour atteindre un but est dit… ? (un mot)',
  'Il « agit » de lui-même, sans script figé.', 100, 'autonome');

select public.set_stage(2, 'chiffre-albert', 'cipher',
  'DÉCHIFFREMENT · Le message d''Albert',
  'Albert chiffre ses messages avec un alphabet de symboles. Branchez votre agent sur la base de symboles (fournie par le maître du jeu) et décodez.',
  '⏃ ⏄ ⏃ ⌂ ⍜ ⍀ ⎔ — quel mot se cache derrière ces symboles ?',
  '7 lettres. Le nom d''une entreprise que vous connaissez bien. Un symbole se répète.', 150, 'electra');

select public.set_stage(3, 'mdp-uptime', 'password',
  'MODULE 1 · Premier fusible',
  'Le premier des trois fusibles de la bombe d''Albert. Le mot est planqué dans les KPI du réseau.',
  'Quel indicateur mesure le temps où une borne est disponible ? (un mot, EN)',
  'On en parle tous les jours en NetOps. « temps de dispo ».', 100, 'uptime');

select public.set_stage(4, 'mdp-csr', 'password',
  'MODULE 2 · Deuxième fusible',
  'Deuxième fusible. Albert adore les sessions de charge qui échouent.',
  'Sigle du taux de sessions de charge réussies ?',
  '3 lettres. Charging … Rate.', 100, 'csr');

select public.set_stage(5, 'quiz-n8n', 'quiz',
  'MODULE 3 · Troisième fusible',
  'Dernier fusible. L''agent d''Albert tourne sur un moteur d''orchestration que vous connaissez.',
  'Sur quel outil no-code orchestrez-vous vos workflows au hackathon ? (un mot)',
  'Trois caractères.', 150, 'n8n');

select public.set_stage(6, 'desamorcage', 'final',
  'DÉSAMORÇAGE · Stoppez Albert',
  'Les trois fusibles sont retirés. Entrez le code final pour empêcher la publication des données.',
  'Code de désamorçage :',
  'Assemblez ce que vous avez trouvé.', 300, 'operation-albert-neutralisee');

-- ============================================================================
-- FIN. Tout est idempotent : relancez à volonté après édition du contenu.
-- ============================================================================
