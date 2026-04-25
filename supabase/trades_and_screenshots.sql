-- Trades table + screenshot bucket setup for Supabase.
-- Run this in Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  symbol text not null,
  asset_type text not null,
  direction text not null check (direction in ('long', 'short')),
  entry_price numeric not null,
  exit_price numeric not null,
  stop_loss numeric,
  take_profit numeric,
  position_size numeric not null,
  dividend_per_unit numeric,
  risk_percent numeric not null,
  strategy text not null,
  setup_tag text not null,
  timeframe text not null,
  session text not null,
  emotion_before text,
  emotion_after text,
  mistakes text,
  notes text,
  pnl numeric not null,
  trade_date date not null,
  screenshots text[] default '{}',
  created_at timestamptz not null default now()
);

alter table public.trades
  add column if not exists dividend_per_unit numeric;

alter table public.trades
  add column if not exists type text check (type in ('Buy', 'Sell')),
  add column if not exists quantity numeric default 1,
  add column if not exists segment text check (segment in ('equity', 'future', 'forex', 'option', 'commodity', 'currency', 'crypto')),
  add column if not exists trade_type text check (trade_type in ('intraday', 'positional', 'investment', 'swing', 'scalping')),
  add column if not exists chart_timeframe text,
  add column if not exists direction_v2 text check (direction_v2 in ('Long', 'Short')),
  add column if not exists entry_condition text check (entry_condition in ('revenge', 'last entry', 'good', 'fomo', 'entry without confirmation', 'early entry', 'accurate entry')),
  add column if not exists exit_condition text check (exit_condition in ('accurate', 'early', 'fear', 'sl hit', 'target hit', 'trailing sl hit')),
  add column if not exists entry_date date,
  add column if not exists entry_note text,
  add column if not exists exit_date date,
  add column if not exists exit_note text,
  add column if not exists brokerage numeric default 0,
  add column if not exists remark text,
  add column if not exists source text default 'manual' check (source in ('manual', 'broker', 'importCSV')),
  add column if not exists broker text,
  add column if not exists image text default '',
  add column if not exists ai_analysis jsonb default '{"summary":"","plusPoints":[],"minusPoints":[]}'::jsonb,
  add column if not exists custom_fields jsonb default '{}'::jsonb;

alter table public.trades enable row level security;

drop policy if exists "trades_select_own" on public.trades;
create policy "trades_select_own"
  on public.trades
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "trades_insert_own" on public.trades;
create policy "trades_insert_own"
  on public.trades
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "trades_update_own" on public.trades;
create policy "trades_update_own"
  on public.trades
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "trades_delete_own" on public.trades;
create policy "trades_delete_own"
  on public.trades
  for delete
  to authenticated
  using (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'trade_screenshots',
  'trade_screenshots',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'trade-screenshots',
  'trade-screenshots',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

drop policy if exists "trade_screenshots_public_read" on storage.objects;
create policy "trade_screenshots_public_read"
  on storage.objects
  for select
  to public
  using (bucket_id in ('trade_screenshots', 'trade-screenshots'));

drop policy if exists "trade_screenshots_auth_upload" on storage.objects;
create policy "trade_screenshots_auth_upload"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id in ('trade_screenshots', 'trade-screenshots'));

drop policy if exists "trade_screenshots_auth_update" on storage.objects;
create policy "trade_screenshots_auth_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id in ('trade_screenshots', 'trade-screenshots'))
  with check (bucket_id in ('trade_screenshots', 'trade-screenshots'));

drop policy if exists "trade_screenshots_auth_delete" on storage.objects;
create policy "trade_screenshots_auth_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id in ('trade_screenshots', 'trade-screenshots'));
