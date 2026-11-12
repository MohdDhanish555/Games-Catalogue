-- Denormalized like_count on games, maintained by trigger.
-- Realtime clients subscribe to games UPDATE (reliable for like + unlike).
-- Apply in the Supabase SQL editor after 004.

drop view if exists public.games_with_likes;

alter table public.games
  add column if not exists like_count integer not null default 0;

update public.games g
set like_count = coalesce(
  (
    select count(*)::int
    from public.game_likes gl
    where gl.game_id = g.id
  ),
  0
);

create or replace view public.games_with_likes
with (security_invoker = true)
as
select *
from public.games;

grant select on public.games_with_likes to anon, authenticated;

create or replace function public.sync_game_like_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_game_id uuid;
begin
  if tg_op = 'DELETE' then
    target_game_id := old.game_id;
  else
    target_game_id := new.game_id;
  end if;

  update public.games
  set like_count = (
    select count(*)::int
    from public.game_likes
    where game_id = target_game_id
  )
  where id = target_game_id;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists game_likes_sync_count on public.game_likes;
create trigger game_likes_sync_count
after insert or delete on public.game_likes
for each row
execute function public.sync_game_like_count();

-- Publish games so like_count updates stream over Realtime.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'games'
  ) then
    alter publication supabase_realtime add table public.games;
  end if;
end $$;
