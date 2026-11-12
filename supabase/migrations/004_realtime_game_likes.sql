-- Enable Supabase Realtime for like insert/delete sync across open clients.
-- Apply in the Supabase SQL editor after prior migrations.
-- FULL replica identity so DELETE payloads include game_id and visitor_id.

alter table public.game_likes replica identity full;

alter publication supabase_realtime add table public.game_likes;
