-- Enforce read-only client access for leaderboard table.
-- Run in Supabase SQL Editor.

alter table public.snake enable row level security;

drop policy if exists "public_insert_snake" on public.snake;
drop policy if exists "public_update_snake" on public.snake;
drop policy if exists "public_delete_snake" on public.snake;

drop policy if exists "public_read_snake" on public.snake;
create policy "public_read_snake"
on public.snake
for select
to anon, authenticated
using (true);
