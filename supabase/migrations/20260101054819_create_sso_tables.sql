/* =====================================================
   USER PROFILES
   Stores per-user external SSO configuration
===================================================== */

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  -- KuJiaLe specific
  kjl_app_uid text not null,

  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.user_profiles is
'Per-user external SSO configuration (e.g. KuJiaLe app_uid)';


/* =====================================================
   USER TOKENS
   Stores per-user SSO access tokens (1:1)
===================================================== */

create table if not exists public.user_tokens (
  id uuid primary key references auth.users(id) on delete cascade,

  open_api_token text not null,
  token_expires_at timestamptz,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.user_tokens is
'Per-user SSO access tokens generated via Edge Functions';


/* =====================================================
   ENABLE ROW LEVEL SECURITY
===================================================== */

alter table public.user_profiles enable row level security;
alter table public.user_tokens enable row level security;


/* =====================================================
   RLS POLICIES
===================================================== */

-- Users can read their own profile
create policy "Users can read own profile"
on public.user_profiles
for select
using (auth.uid() = id);

-- Users can read their own token (optional)
create policy "Users can read own token"
on public.user_tokens
for select
using (auth.uid() = id);

-- Prevent client-side inserts/updates/deletes
create policy "Block client writes on user_profiles"
on public.user_profiles
for all
using (false);

create policy "Block client writes on user_tokens"
on public.user_tokens
for all
using (false);


/* =====================================================
   AUTO UPDATE updated_at
===================================================== */

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_user_profiles_updated_at
before update on public.user_profiles
for each row
execute procedure public.set_updated_at();

create trigger set_user_tokens_updated_at
before update on public.user_tokens
for each row
execute procedure public.set_updated_at();
