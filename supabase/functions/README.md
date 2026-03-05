# Snake Score Submit Function

This project now includes an Edge Function:

- `snake-submit-score`

It validates score payloads and writes to `public.snake`.

## 1) Prerequisites

- Supabase CLI installed
- Logged in: `supabase login`
- Project ref: `wdllredqnkjplfbtlrip`

## 2) Link local project

```bash
supabase link --project-ref wdllredqnkjplfbtlrip
```

## 3) Set function secrets

Set table override (optional):

```bash
supabase secrets set SNAKE_TABLE=snake
```

## 4) Deploy function

```bash
supabase functions deploy snake-submit-score
```

## 5) Verify

```bash
supabase functions list
```

Then test from `snake.html` by finishing a game and submitting a score.

## 6) Lock direct table writes

Run [`supabase/sql/snake_rls_hardening.sql`](../sql/snake_rls_hardening.sql) in Supabase SQL Editor to allow public `select` but block direct client `insert/update/delete`.

## Notes

- Frontend calls this function via `supabase.functions.invoke(...)`.
- `config.js` controls function name and table name.
