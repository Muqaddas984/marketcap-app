-- Marketcap database schema
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

create table if not exists public.holdings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  ticker text not null,
  name text not null,
  shares numeric not null check (shares > 0),
  buy_price numeric not null check (buy_price >= 0),
  invest_date date not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, ticker)
);

create table if not exists public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  ticker text not null,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, ticker)
);

create table if not exists public.portfolio_history (
  user_id uuid not null references auth.users (id) on delete cascade,
  snap_date date not null default current_date,
  total numeric not null,
  primary key (user_id, snap_date)
);

-- Row Level Security: each user can only see and modify their own rows.
alter table public.holdings enable row level security;
alter table public.watchlist enable row level security;

create policy "Users manage own holdings"
  on public.holdings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own watchlist"
  on public.watchlist for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.portfolio_history enable row level security;

create policy "Users manage own history"
  on public.portfolio_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
