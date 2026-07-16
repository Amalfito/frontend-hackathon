-- ============================================================================
-- ARCADE ALBERT (escape game v2) — progression, resets punitifs, sabotage.
-- Les réponses vivent dans le code serveur (src/content/arcade/questions.ts) :
-- ici uniquement l'état par équipe. À exécuter après 0001_init.sql.
-- ============================================================================

create table if not exists public.arcade_state (
  team_id      uuid primary key references public.teams(id) on delete cascade,
  q            int  not null default 0,   -- slot courant, 0-based (20 = terminé)
  variant      int  not null default 0,   -- 0/1 : jeu de questions (bascule au reset)
  restarts     int  not null default 0,   -- nb de resets punitifs subis
  score        int  not null default 0,
  sabotage_used boolean not null default false,
  sabotaged_by text not null default '',  -- nom du saboteur, notifié une fois puis vidé
  finished_at  timestamptz,
  updated_at   timestamptz not null default now()
);

alter table public.arcade_state enable row level security;
revoke all on public.arcade_state from anon, authenticated;
-- Accès uniquement via service_role (server actions) : aucune policy publique.

-- Classement arcade lisible publiquement (sans détails internes).
create or replace view public.arcade_leaderboard as
  select t.name, a.q, a.score, a.restarts, a.finished_at
  from public.arcade_state a
  join public.teams t on t.id = a.team_id
  order by a.score desc, a.finished_at asc nulls last;

grant select on public.arcade_leaderboard to anon, authenticated;
