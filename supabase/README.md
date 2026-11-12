# Supabase setup

1. Create a Supabase project.
2. Run [`migrations/001_init.sql`](migrations/001_init.sql) in the SQL editor.
   If you already applied an older `001_init` with categories, also run [`migrations/002_age_play_format.sql`](migrations/002_age_play_format.sql).
3. Create a **public** Storage bucket named `game-videos`.
4. Confirm the storage policies from the migration are present.
5. Copy the project URL and anon key into `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Without those env values, the app runs on local mock data.
