-- Super admin: roles, account suspension, editable site settings and an audit log.
--
-- Access model:
--   * profiles.role / profiles.suspended_at are changed only by the server
--     (service-role key) after it has verified the caller is a super admin.
--     A trigger rejects changes to these columns from signed-in users, so the
--     existing "own profile: update" policy can't be used to self-promote.
--   * site_settings is one JSON row everyone may read (the landing page and
--     workspace render from it). Writes are service-role only.
--   * admin_audit_log is service-role only (no policies).
--   * Super admins listed in SUPER_ADMIN_EMAILS (server env) don't need a role row.

-- ---------------------------------------------------------------------------
-- Roles & suspension
-- ---------------------------------------------------------------------------

alter table public.profiles
  add column role         text not null default 'user' check (role in ('user', 'super_admin')),
  add column suspended_at timestamptz;

create or replace function public.protect_profile_admin_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- Requests from browsers/users carry the anon or authenticated role. The
  -- service role and direct SQL (no JWT) are allowed through.
  if coalesce(auth.jwt() ->> 'role', '') in ('anon', 'authenticated')
     and (new.role is distinct from old.role or new.suspended_at is distinct from old.suspended_at) then
    raise exception 'role and suspended_at can only be changed by an administrator'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger protect_admin_fields
  before update on public.profiles
  for each row execute function public.protect_profile_admin_fields();

-- ---------------------------------------------------------------------------
-- Site settings (single row)
-- ---------------------------------------------------------------------------

create table public.site_settings (
  id         smallint primary key default 1 check (id = 1),
  -- Validated by the app (src/lib/site/schema.ts); unknown/invalid keys fall back to defaults.
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

insert into public.site_settings (id) values (1);

create trigger set_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

create policy "site settings: public read" on public.site_settings
  for select to anon, authenticated using (true);

-- ---------------------------------------------------------------------------
-- Admin audit log
-- ---------------------------------------------------------------------------

create table public.admin_audit_log (
  id         uuid primary key default gen_random_uuid(),
  actor_id   uuid references auth.users (id) on delete set null,
  action     text not null check (char_length(action) <= 80),
  target     text check (char_length(target) <= 200),
  details    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index on public.admin_audit_log (created_at desc);

alter table public.admin_audit_log enable row level security;  -- no policies: service role only
