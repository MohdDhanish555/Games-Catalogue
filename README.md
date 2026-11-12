# Family Games Catalogue

A video-first catalogue for sharing family games — browse previews, open details, contribute new games, and like favourites.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Supabase (Postgres, Storage) when configured
- Mock data locally when `.env` is empty

## Develop

```bash
npm install
npm run dev
```

## Supabase

See [`supabase/README.md`](supabase/README.md). Copy `.env.example` to `.env` and add your project credentials.

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run preview` — preview production build
