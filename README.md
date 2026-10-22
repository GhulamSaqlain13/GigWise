# Gigwise

Independent AI workspace that helps Fiverr sellers find a service to sell, build a clear gig, and know what to improve next. Not affiliated with Fiverr.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · shadcn/ui (Base UI) · Supabase (Auth, Postgres + RLS, Storage) · Zod · React Hook Form · TanStack Query · Recharts

## Getting started

```bash
npm install
cp .env.example .env.local   # optional: leave empty for demo mode
npm run dev                  # http://localhost:3000
```

Without Supabase keys the app runs in **demo mode**. There is no login, and tools save data in your browser.

### Connect Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Put the project URL and keys in `.env.local` (see `.env.example`).
3. Apply the schema in `supabase/migrations/`, either with `npx supabase db push` or by pasting it into the SQL editor.
4. In Auth → URL Configuration, add `http://localhost:3000/auth/callback` as a redirect URL.

## Docs

The product, technical and design documents are in [`docs/`](docs/). Working notes for contributors and AI assistants are in [`CLAUDE.md`](CLAUDE.md).
