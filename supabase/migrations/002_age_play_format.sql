-- Migrate existing installs from category/instructions → age_group/play_format/bilingual rules.
-- Safe to skip on greenfield projects that already applied the updated 001_init.sql.

alter table public.games
  add column if not exists age_group text,
  add column if not exists play_format text,
  add column if not exists instructions_en text not null default '',
  add column if not exists instructions_kn text not null default '';

-- Backfill age_group from legacy category when present
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'games'
      and column_name = 'category'
  ) then
    update public.games
    set age_group = case
      when category = 'Kids' then 'Kids'
      when category in ('Party', 'Active', 'Quiet', 'Indoor', 'Outdoor', 'Card & Board') then 'All ages'
      else coalesce(nullif(age_group, ''), 'All ages')
    end
    where age_group is null or age_group = '';
  else
    update public.games
    set age_group = 'All ages'
    where age_group is null or age_group = '';
  end if;
end $$;

update public.games
set play_format = coalesce(nullif(play_format, ''), 'Group')
where play_format is null or play_format = '';

-- Copy legacy instructions into English rules
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'games'
      and column_name = 'instructions'
  ) then
    update public.games
    set instructions_en = instructions
    where coalesce(instructions_en, '') = ''
      and coalesce(instructions, '') <> '';
  end if;
end $$;

alter table public.games
  alter column age_group set not null,
  alter column play_format set not null;

alter table public.games drop constraint if exists games_age_group_check;
alter table public.games
  add constraint games_age_group_check
  check (age_group in ('All ages', 'Kids', 'Under 15', 'Adults', 'Seniors'));

alter table public.games drop constraint if exists games_play_format_check;
alter table public.games
  add constraint games_play_format_check
  check (play_format in ('Individual', 'Group'));

-- Video is optional now
alter table public.games drop constraint if exists games_has_video;

alter table public.games drop constraint if exists games_video_type_check;
alter table public.games
  alter column video_type drop not null;

alter table public.games
  add constraint games_video_type_check
  check (
    video_type is null
    or video_type in ('youtube', 'instagram', 'direct', 'upload')
  );

-- Drop legacy columns
alter table public.games drop column if exists category;
alter table public.games drop column if exists instructions;

drop index if exists games_category_idx;
create index if not exists games_age_group_idx on public.games (age_group);
create index if not exists games_play_format_idx on public.games (play_format);

create or replace view public.games_with_likes
with (security_invoker = true)
as
select
  g.*,
  coalesce(l.like_count, 0)::int as like_count
from public.games g
left join (
  select game_id, count(*)::int as like_count
  from public.game_likes
  group by game_id
) l on l.game_id = g.id;

grant select on public.games_with_likes to anon, authenticated;

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
