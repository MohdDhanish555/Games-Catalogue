-- Family Games Catalogue schema
-- Apply in the Supabase SQL editor (or via CLI), then create the storage bucket.

create extension if not exists "pgcrypto";

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  video_type text check (
    video_type is null
    or video_type in ('youtube', 'instagram', 'direct', 'upload')
  ),
  video_url text,
  storage_path text,
  age_group text not null check (
    age_group in ('All ages', 'Kids', 'Under 15', 'Adults', 'Seniors')
  ),
  play_format text not null check (play_format in ('Individual', 'Group')),
  player_count text not null default '',
  duration text not null default '',
  materials text not null default '',
  instructions_en text not null default '',
  instructions_kn text not null default '',
  visitor_id text,
  like_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.game_likes (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games (id) on delete cascade,
  visitor_id text not null,
  created_at timestamptz not null default now(),
  constraint game_likes_unique_visitor unique (game_id, visitor_id)
);

create index if not exists games_created_at_idx on public.games (created_at desc);
create index if not exists games_age_group_idx on public.games (age_group);
create index if not exists games_play_format_idx on public.games (play_format);
create index if not exists game_likes_game_id_idx on public.game_likes (game_id);
create index if not exists game_likes_visitor_id_idx on public.game_likes (visitor_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists games_set_updated_at on public.games;
create trigger games_set_updated_at
before update on public.games
for each row
execute function public.set_updated_at();

create or replace view public.games_with_likes
with (security_invoker = true)
as
select *
from public.games;

-- Keep like_count in sync (also applied via 005 for existing projects).
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

grant select on public.games_with_likes to anon, authenticated;
grant select, insert on public.games to anon, authenticated;
grant select, insert, delete on public.game_likes to anon, authenticated;

alter table public.games enable row level security;
alter table public.game_likes enable row level security;

drop policy if exists "Public read games" on public.games;
create policy "Public read games"
  on public.games for select
  to anon, authenticated
  using (true);

drop policy if exists "Public insert games" on public.games;
create policy "Public insert games"
  on public.games for insert
  to anon, authenticated
  with check (
    char_length(trim(title)) > 0
    and char_length(trim(age_group)) > 0
    and char_length(trim(play_format)) > 0
    and char_length(trim(materials)) > 0
  );

drop policy if exists "Public update games" on public.games;
create policy "Public update games"
  on public.games for update
  to anon, authenticated
  using (true)
  with check (
    char_length(trim(title)) > 0
    and char_length(trim(age_group)) > 0
    and char_length(trim(play_format)) > 0
    and char_length(trim(materials)) > 0
  );

drop policy if exists "Public read likes" on public.game_likes;
create policy "Public read likes"
  on public.game_likes for select
  to anon, authenticated
  using (true);

drop policy if exists "Public insert likes" on public.game_likes;
create policy "Public insert likes"
  on public.game_likes for insert
  to anon, authenticated
  with check (
    char_length(trim(visitor_id)) > 0
  );

drop policy if exists "Public delete likes" on public.game_likes;
create policy "Public delete likes"
  on public.game_likes for delete
  to anon, authenticated
  using (true);

-- Storage setup (run after creating a public bucket named game-videos):
-- 1. Dashboard → Storage → New bucket → name: game-videos → Public: ON
-- 2. Then apply the policies below.

drop policy if exists "Public read game videos" on storage.objects;
create policy "Public read game videos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'game-videos');

drop policy if exists "Anon upload game videos" on storage.objects;
create policy "Anon upload game videos"
  on storage.objects for insert
  to anon, authenticated
  with check (
    bucket_id = 'game-videos'
    and (storage.extension(name) in ('mp4', 'webm', 'mov'))
  );
