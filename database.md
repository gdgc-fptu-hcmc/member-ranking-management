-- Enable UUID generation
create extension if not exists "pgcrypto";

-- =========================================================
-- 1) users
-- =========================================================
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),

  username text not null unique,
  email text not null unique,
  password text not null,

  roles text[] not null default '{member}',
  club_role text,

  total_gems int not null default 0,
  regular_session_count int not null default 0,
  is_active boolean not null default true,

  join_club_at timestamptz,
  refresh_token text,

  avatar text,
  is_male boolean,
  address text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 2) activities
-- =========================================================
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  type text not null,

  starts_at timestamptz not null,
  ends_at timestamptz,

  location text,
  description text,

  checkin_enabled boolean not null default false,
  requires_evidence boolean not null default false,

  status text not null default 'upcoming',
  gem_amount int not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_activities_type on public.activities(type);
create index if not exists idx_activities_starts_at on public.activities(starts_at);
create index if not exists idx_activities_status_starts_at
  on public.activities(status, starts_at);

-- =========================================================
-- 3) gem_claims
-- =========================================================
create table if not exists public.gem_claims (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.users(id) on delete cascade,

  kind text not null,
  amount int not null,
  reason text not null,

  activity_id uuid
    references public.activities(id) on delete set null,

  evidence_urls text[] not null default '{}'::text[],

  status text not null default 'validating',
  ai jsonb,

  idempotency_key text not null unique,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_gem_claims_user_id on public.gem_claims(user_id);
create index if not exists idx_gem_claims_activity_id on public.gem_claims(activity_id);

-- =========================================================
-- 4) check_ins
-- =========================================================
create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),

  activity_id uuid not null
    references public.activities(id) on delete cascade,

  user_id uuid not null
    references public.users(id) on delete cascade,

  checked_at timestamptz not null default now(),

  status text not null default 'pending', -- pending / attended / absent

  evidence text[] not null default '{}'::text[],

  created_at timestamptz not null default now(),

  constraint uq_checkins_activity_user unique (activity_id, user_id)
);

create index if not exists idx_checkins_activity_id on public.check_ins(activity_id);
create index if not exists idx_checkins_user_id on public.check_ins(user_id);

-- =========================================================
-- 5) gem_logs
-- =========================================================
create table if not exists public.gem_logs (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.users(id) on delete cascade,

  amount int not null,
  reason text not null,

  source_kind text not null,

  activity_id uuid
    references public.activities(id) on delete set null,

  checkin_id uuid
    references public.check_ins(id) on delete set null,

  claim_id uuid
    references public.gem_claims(id) on delete set null,

  evidence text[] not null default '{}'::text[],

  idempotency_key text not null unique,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_gem_logs_user_id on public.gem_logs(user_id);
create index if not exists idx_gem_logs_activity_id on public.gem_logs(activity_id);
create index if not exists idx_gem_logs_claim_id on public.gem_logs(claim_id);
create index if not exists idx_gem_logs_user_created_at
  on public.gem_logs(user_id, created_at);
