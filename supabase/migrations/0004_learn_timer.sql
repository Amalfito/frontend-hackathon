-- ============================================================================
-- CHRONO « MODE APPRENTISSAGE » — un minuteur unique, distinct de la bombe.
-- ----------------------------------------------------------------------------
--   * Piloté par l'admin : démarrer (durée en minutes), pause, reprendre, reset.
--   * S'affiche À LA PLACE de la bombe escape game dans la barre d'en-tête,
--     tant que la bombe n'est PAS armée (game_state.status = 'idle').
--   * Dès que l'admin arme la bombe (game_arm), le chrono learn est désactivé
--     (learn_status = 'idle') → il disparaît, la bombe prend le relais.
--
-- Idempotent : à rejouer sans risque. À exécuter après 0003_endgame.sql.
-- ============================================================================

-- --- Colonnes du chrono learn (sur le singleton game_state) -----------------
alter table public.game_state
  add column if not exists learn_status text not null default 'idle'
      check (learn_status in ('idle','running','paused')),
  add column if not exists learn_duration_seconds int not null default 1800,
  add column if not exists learn_started_at        timestamptz,
  add column if not exists learn_ends_at           timestamptz,
  add column if not exists learn_remaining_seconds int;

-- --- Vue publique : on expose aussi l'état du chrono learn ------------------
create or replace view public.game_state_public as
  select gs.status, gs.duration_seconds, gs.started_at, gs.ends_at,
         gs.remaining_seconds, gs.submissions_locked, gs.message, gs.updated_at,
         gs.trap_armed_at, gs.trap_sprung_at, gs.victory_at,
         gs.first_finisher_id, ft.name as first_finisher_name,
         gs.learn_status, gs.learn_duration_seconds, gs.learn_started_at,
         gs.learn_ends_at, gs.learn_remaining_seconds
  from public.game_state gs
  left join public.teams ft on ft.id = gs.first_finisher_id
  where gs.id = 1;

grant select on public.game_state_public to anon, authenticated;

-- ----------------------------------------------------------------------------
-- game_arm : armer la bombe désactive le chrono learn (il disparaît) + repart
-- d'un endgame propre (piège / victoire remis à zéro).
-- ----------------------------------------------------------------------------
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
    -- endgame remis à zéro pour une nouvelle partie
    trap_armed_at = null, trap_sprung_at = null, first_finisher_id = null, victory_at = null,
    -- le chrono learn disparaît au profit de la bombe
    learn_status = 'idle', learn_started_at = null, learn_ends_at = null, learn_remaining_seconds = null,
    updated_at = now()
  where id = 1;
  return jsonb_build_object('ok', true);
end;
$$;

-- ----------------------------------------------------------------------------
-- RPC — contrôle du chrono learn (réservé admin, comme la bombe).
-- ----------------------------------------------------------------------------
create or replace function public.learn_timer_start(p_admin_id uuid, p_minutes int)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.is_admin(p_admin_id) then return jsonb_build_object('error','forbidden'); end if;
  update public.game_state set
    learn_status = 'running',
    learn_duration_seconds = greatest(1, p_minutes) * 60,
    learn_started_at = now(),
    learn_ends_at = now() + make_interval(mins => greatest(1, p_minutes)),
    learn_remaining_seconds = null,
    updated_at = now()
  where id = 1;
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.learn_timer_pause(p_admin_id uuid)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare v_left int;
begin
  if not public.is_admin(p_admin_id) then return jsonb_build_object('error','forbidden'); end if;
  select greatest(0, floor(extract(epoch from (learn_ends_at - now()))))::int into v_left
    from public.game_state where id = 1;
  update public.game_state set learn_status='paused', learn_remaining_seconds=v_left,
         learn_ends_at=null, updated_at=now()
  where id = 1 and learn_status = 'running';
  return jsonb_build_object('ok', true, 'remaining_seconds', v_left);
end; $$;

create or replace function public.learn_timer_resume(p_admin_id uuid)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.is_admin(p_admin_id) then return jsonb_build_object('error','forbidden'); end if;
  update public.game_state set learn_status='running',
         learn_ends_at = now() + make_interval(secs => coalesce(learn_remaining_seconds, learn_duration_seconds)),
         learn_remaining_seconds=null, updated_at=now()
  where id = 1 and learn_status = 'paused';
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.learn_timer_reset(p_admin_id uuid)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.is_admin(p_admin_id) then return jsonb_build_object('error','forbidden'); end if;
  update public.game_state set learn_status='idle', learn_started_at=null,
         learn_ends_at=null, learn_remaining_seconds=null, updated_at=now()
  where id = 1;
  return jsonb_build_object('ok', true);
end; $$;

-- --- Privilèges : appelés côté serveur (service_role) uniquement ------------
do $$
declare fn text;
begin
  for fn in select unnest(array[
    'learn_timer_start(uuid, int)',
    'learn_timer_pause(uuid)',
    'learn_timer_resume(uuid)',
    'learn_timer_reset(uuid)'
  ]) loop
    execute format('revoke all on function public.%s from public, anon, authenticated;', fn);
    execute format('grant execute on function public.%s to service_role;', fn);
  end loop;
end $$;
