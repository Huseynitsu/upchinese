# HSK Path

Dark-mode HSK 1–6 practice site: vocabulary, SRS, hanzi stroke order, pinyin, listening, reading, grammar, dictation, writing (HSK 3+), and timed mock exams.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Supabase, accounts and results are stored in the browser. This is enough to try the full product.

## Optional: Supabase

1. Create a project and run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor.
2. Copy `.env.example` to `.env.local`.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Restart the dev server.

Auth uses email and password. Enable Email provider in Supabase Auth.
