-- ============================================================================
-- OPERATION ALBERT — schéma du portail de validation (escape game hackathon)
-- ----------------------------------------------------------------------------
-- Principe de sécurité :
--   * Les réponses sont stockées HASHÉES (sha256) dans stages.answer_hash.
--   * anon/authenticated n'ont AUCUN accès à la table `stages` (donc jamais au
--     hash). Ils lisent uniquement la vue `stages_public` (sans le hash).
--   * La validation passe par la fonction `submit_answer` (SECURITY DEFINER),
--     exécutable seulement par `service_role` → appelée depuis une Server Action.
--   * Le navigateur ne reçoit jamais la réponse ni ne peut brute-forcer via l'API.
-- À exécuter dans Supabase → SQL Editor (ou `supabase db push`).
-- ============================================================================

create extension if not exists pgcrypto;

-- --- Normalisation des réponses (insensible casse / espaces multiples) --------
create or replace function public.normalize_answer(p text)
returns text
language sql
immutable
as $$
  select lower(btrim(regexp_replace(coalesce(p, ''), '\s+', ' ', 'g')));
$$;

-- --- Tables ------------------------------------------------------------------
create table if not exists public.stages (
  id            uuid primary key default gen_random_uuid(),
  stage_order   int  not null unique,
  slug          text not null unique,
  type          text not null default 'password'
                  check (type in ('quiz', 'cipher', 'password', 'final')),
  title         text not null,
  narrative     text not null default '',
  prompt        text not null default '',
  hint          text not null default '',
  points        int  not null default 100,
  answer_hash   text,                      -- sha256(normalize_answer(reponse))
  created_at    timestamptz not null default now()
);

create table if not exists public.teams (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null,
  name_norm            text not null unique,
  current_stage_order  int  not null default 1,
  score                int  not null default 0,
  started_at           timestamptz not null default now(),
  finished_at          timestamptz,
  updated_at           timestamptz not null default now()
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

-- --- Vue publique : contenu des étapes SANS la réponse -----------------------
create or replace view public.stages_public as
  select id, stage_order, slug, type, title, narrative, prompt, hint, points
  from public.stages;

-- ============================================================================
-- RLS + privilèges
-- ============================================================================
alter table public.stages   enable row level security;
alter table public.teams    enable row level security;
alter table public.attempts enable row level security;

-- Aucun accès direct de anon/authenticated aux tables sensibles.
revoke all on public.stages   from anon, authenticated;
revoke all on public.attempts from anon, authenticated;

-- Leaderboard : lecture publique de teams.
drop policy if exists teams_select_public on public.teams;
create policy teams_select_public on public.teams
  for select to anon, authenticated using (true);
grant select on public.teams to anon, authenticated;

-- Contenu des étapes : lecture publique via la vue uniquement.
grant select on public.stages_public to anon, authenticated;

-- ============================================================================
-- RPC — création/rejoint d'équipe (SECURITY DEFINER, réservé service_role)
-- ============================================================================
create or replace function public.join_team(p_name text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_team public.teams;
begin
  if btrim(coalesce(p_name, '')) = '' then
    return jsonb_build_object('error', 'empty_name');
  end if;

  insert into public.teams (name, name_norm)
  values (btrim(p_name), normalize_answer(p_name))
  on conflict (name_norm) do update set updated_at = now()
  returning * into v_team;

  return jsonb_build_object(
    'id', v_team.id,
    'name', v_team.name,
    'current_stage_order', v_team.current_stage_order,
    'score', v_team.score,
    'finished', v_team.finished_at is not null
  );
end;
$$;

-- ============================================================================
-- RPC — validation d'une réponse (SECURITY DEFINER, réservé service_role)
-- ============================================================================
create or replace function public.submit_answer(
  p_team_id uuid,
  p_slug    text,
  p_answer  text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_team      public.teams;
  v_stage     public.stages;
  v_correct   boolean;
  v_max_order int;
  v_awarded   int := 0;
  v_finished  boolean := false;
begin
  select * into v_team from public.teams where id = p_team_id;
  if not found then
    return jsonb_build_object('error', 'team_not_found');
  end if;

  select * into v_stage from public.stages where slug = p_slug;
  if not found then
    return jsonb_build_object('error', 'stage_not_found');
  end if;

  v_correct := v_stage.answer_hash is not null
    and v_stage.answer_hash =
        encode(digest(normalize_answer(p_answer), 'sha256'), 'hex');

  insert into public.attempts (team_id, stage_id, submitted, is_correct)
  values (v_team.id, v_stage.id, p_answer, v_correct);

  -- On n'avance QUE si la réponse est juste ET correspond à l'étape courante.
  if v_correct and v_stage.stage_order = v_team.current_stage_order then
    select max(stage_order) into v_max_order from public.stages;
    v_awarded := v_stage.points;
    v_finished := v_stage.stage_order >= v_max_order;

    update public.teams
    set current_stage_order = current_stage_order + 1,
        score = score + v_awarded,
        finished_at = case when v_finished then now() else finished_at end,
        updated_at = now()
    where id = v_team.id;
  end if;

  return jsonb_build_object(
    'correct', v_correct,
    'points_awarded', v_awarded,
    'finished', v_finished
  );
end;
$$;

-- Seul service_role peut exécuter les RPC (pas anon → pas de brute force API).
revoke all on function public.join_team(text) from public, anon, authenticated;
revoke all on function public.submit_answer(uuid, text, text) from public, anon, authenticated;
grant execute on function public.join_team(text) to service_role;
grant execute on function public.submit_answer(uuid, text, text) to service_role;
