-- ============================================================================
-- ENDGAME — le piège d'Albert + la victoire collective.
-- ----------------------------------------------------------------------------
-- Règle du jeu (v3) :
--   * Le compte à rebours global (public.game_state, la « bombe ») n'est
--     VRAIMENT désarmé que lorsque TOUTES les équipes de l'arcade ont fini.
--   * La 1re équipe qui termine déclenche une FAUSSE victoire : la bombe se met
--     en pause (faux espoir). Albert la félicite.
--   * Quand cette équipe clique « voir le podium », elle RÉACTIVE la bombe
--     (arcade_spring_trap) : Albert révèle le piège, le chrono repart.
--   * Quand la dernière équipe finit (arcade_on_finish), la bombe passe en
--     'defused' + victory_at : animation de victoire à la place du chrono.
--
-- Idempotent : à rejouer sans risque. À exécuter après 0002_arcade.sql.
-- ============================================================================

-- --- Nouvelles colonnes d'état ---------------------------------------------
alter table public.game_state
  add column if not exists trap_armed_at    timestamptz,
  add column if not exists trap_sprung_at   timestamptz,
  add column if not exists first_finisher_id uuid references public.teams(id) on delete set null,
  add column if not exists victory_at       timestamptz;

-- --- Vue publique enrichie (le client lit le nom du 1er finisher) -----------
create or replace view public.game_state_public as
  select gs.status, gs.duration_seconds, gs.started_at, gs.ends_at,
         gs.remaining_seconds, gs.submissions_locked, gs.message, gs.updated_at,
         gs.trap_armed_at, gs.trap_sprung_at, gs.victory_at,
         gs.first_finisher_id,
         ft.name as first_finisher_name
  from public.game_state gs
  left join public.teams ft on ft.id = gs.first_finisher_id
  where gs.id = 1;

grant select on public.game_state_public to anon, authenticated;

-- ----------------------------------------------------------------------------
-- RPC — une équipe VIENT de terminer les 20 verrous de l'arcade.
--   * si toutes les équipes ont fini  → VICTOIRE (désamorçage définitif)
--   * sinon, si c'est la 1re à finir   → on ARME le piège (bombe en pause)
-- ----------------------------------------------------------------------------
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

  -- Toutes les équipes présentes ont terminé → victoire collective.
  if v_total > 0 and v_finished >= v_total then
    update public.game_state set
      status             = 'defused',
      submissions_locked = true,
      ends_at            = null,
      remaining_seconds  = 0,
      victory_at         = coalesce(victory_at, now()),
      trap_sprung_at     = coalesce(trap_sprung_at, now()),
      updated_at         = now()
    where id = 1;
    return jsonb_build_object('victory', true);
  end if;

  -- 1re équipe à finir alors que la bombe tourne → fausse victoire (pause).
  if v_game.trap_armed_at is null and v_game.status = 'running' then
    v_left := greatest(0, floor(extract(epoch from (v_game.ends_at - now()))))::int;
    update public.game_state set
      status            = 'paused',
      remaining_seconds = v_left,
      ends_at           = null,
      trap_armed_at     = now(),
      first_finisher_id = p_team_id,
      updated_at        = now()
    where id = 1;
    return jsonb_build_object('trap_armed', true, 'first', true);
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

-- ----------------------------------------------------------------------------
-- RPC — le 1er finisher clique « voir le podium » → il RÉACTIVE la bombe.
--   Seul le 1er finisher peut déclencher, une seule fois.
-- ----------------------------------------------------------------------------
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
    status            = 'running',
    ends_at           = now() + make_interval(secs => coalesce(remaining_seconds, duration_seconds)),
    remaining_seconds = null,
    trap_sprung_at    = now(),
    updated_at        = now()
  where id = 1 and trap_armed_at is not null and trap_sprung_at is null;

  return jsonb_build_object('ok', true, 'sprung', true);
end;
$$;

-- --- game_reset doit aussi effacer l'état endgame ---------------------------
create or replace function public.game_reset(p_admin_id uuid)
returns jsonb
language plpgsql security definer set search_path = public, extensions
as $$
begin
  if not public.is_admin(p_admin_id) then return jsonb_build_object('error','forbidden'); end if;
  update public.game_state set
    status='idle', started_at=null, ends_at=null, remaining_seconds=null,
    submissions_locked=false, message='',
    trap_armed_at=null, trap_sprung_at=null, first_finisher_id=null, victory_at=null,
    updated_at=now()
  where id = 1;
  return jsonb_build_object('ok', true);
end;
$$;

-- --- Privilèges : appelés côté serveur (service_role) uniquement ------------
do $$
declare fn text;
begin
  for fn in select unnest(array[
    'arcade_on_finish(uuid)',
    'arcade_spring_trap(uuid)'
  ]) loop
    execute format('revoke all on function public.%s from public, anon, authenticated;', fn);
    execute format('grant execute on function public.%s to service_role;', fn);
  end loop;
end $$;
