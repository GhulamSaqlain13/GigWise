-- GigWise initial schema
-- Source: Fiverr_AI_Tech_Stack_Reference.md §4 (tables) and §5 (security rules).
--
-- Access model:
--   * Every user-owned row is protected by RLS: user_id = auth.uid().
--   * Child tables (versions, audits, images, metrics, evidence, tasks) check
--     ownership through their parent row.
--   * AI outputs, jobs, billing and usage are READ-ONLY for users. They are written
--     server-side with the service-role key (Next.js route handlers / background jobs),
--     so a browser can never forge an audit, a credit balance or a subscription.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Profiles & skills
-- ---------------------------------------------------------------------------

create table public.profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  display_name     text check (char_length(display_name) <= 80),
  -- Which of the three journeys the user picked during onboarding.
  primary_journey  text check (primary_journey in ('optimize', 'create', 'discover')),
  onboarding_stage text not null default 'started'
                   check (onboarding_stage in ('started', 'journey_selected', 'first_result', 'completed')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Create a profile row automatically when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.user_skills (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  skill            text not null check (char_length(skill) between 1 and 80),
  level            text check (level in ('beginner', 'intermediate', 'advanced', 'expert')),
  years_experience numeric(4, 1) check (years_experience >= 0 and years_experience <= 60),
  created_at       timestamptz not null default now(),
  unique (user_id, skill)
);

-- Marketplace kept as a column so Upwork etc. can be added later (Plan §18.1).
create table public.seller_profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  marketplace text not null default 'fiverr' check (marketplace in ('fiverr')),
  username    text not null check (char_length(username) between 1 and 100),
  profile_url text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, marketplace, username)
);

-- ---------------------------------------------------------------------------
-- Gigs & versions
-- ---------------------------------------------------------------------------

create table public.gigs (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users (id) on delete cascade,
  seller_profile_id  uuid references public.seller_profiles (id) on delete set null,
  -- URL is an identifier only; it grants no data access (Tech Ref §7).
  source_url         text,
  service_name       text not null check (char_length(service_name) between 1 and 200),
  -- How the gig entered the system: one of the three original journeys.
  origin             text not null check (origin in ('optimize', 'create', 'discover')),
  status             text not null default 'draft'
                     check (status in ('draft', 'published', 'archived')),
  current_version_id uuid,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table public.gig_versions (
  id             uuid primary key default gen_random_uuid(),
  gig_id         uuid not null references public.gigs (id) on delete cascade,
  version_number integer not null check (version_number > 0),
  source         text not null check (source in ('user', 'import', 'ai')),
  change_note    text,
  title          text,
  description    text,
  category       text,
  subcategory    text,
  tags           jsonb not null default '[]'::jsonb check (jsonb_typeof(tags) = 'array'),
  packages       jsonb not null default '[]'::jsonb check (jsonb_typeof(packages) = 'array'),
  faqs           jsonb not null default '[]'::jsonb check (jsonb_typeof(faqs) = 'array'),
  requirements   jsonb not null default '[]'::jsonb check (jsonb_typeof(requirements) = 'array'),
  created_at     timestamptz not null default now(),
  unique (gig_id, version_number),
  unique (gig_id, id)  -- target for composite FKs below
);

-- current_version_id must point to a version of the SAME gig.
alter table public.gigs
  add constraint gigs_current_version_fk
  foreign key (id, current_version_id)
  references public.gig_versions (gig_id, id)
  on delete set null (current_version_id)
  deferrable initially deferred;

create table public.gig_audits (
  id              uuid primary key default gen_random_uuid(),
  gig_id          uuid not null references public.gigs (id) on delete cascade,
  version_id      uuid not null,
  -- Internal quality assessment, NOT an official Fiverr ranking score.
  quality_score   numeric(5, 2) check (quality_score between 0 and 100),
  score_breakdown jsonb not null default '{}'::jsonb,
  findings        jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  model_version   text,
  ruleset_version text,
  created_at      timestamptz not null default now(),
  foreign key (gig_id, version_id) references public.gig_versions (gig_id, id) on delete cascade
);

create table public.gig_images (
  id           uuid primary key default gen_random_uuid(),
  gig_id       uuid not null references public.gigs (id) on delete cascade,
  -- Path inside the private 'gig-images' bucket: <user_id>/<gig_id>/<file>
  storage_path text not null unique,
  position     smallint check (position between 1 and 3),
  width        integer check (width > 0),
  height       integer check (height > 0),
  audit        jsonb,
  created_at   timestamptz not null default now()
);

-- Seller-entered metrics. CTR / conversion are computed, never stored.
create table public.gig_metrics (
  id           uuid primary key default gen_random_uuid(),
  gig_id       uuid not null references public.gigs (id) on delete cascade,
  period_start date not null,
  period_end   date not null,
  impressions  integer check (impressions >= 0),
  clicks       integer check (clicks >= 0),
  orders       integer check (orders >= 0),
  inquiries    integer check (inquiries >= 0),
  revenue      numeric(12, 2) check (revenue >= 0),
  source       text not null default 'manual' check (source in ('manual', 'screenshot', 'export')),
  created_at   timestamptz not null default now(),
  check (period_end >= period_start)
);

-- Before/after comparison of two versions (Plan §3.4 Experiment Tracker).
create table public.experiments (
  id                uuid primary key default gen_random_uuid(),
  gig_id            uuid not null references public.gigs (id) on delete cascade,
  before_version_id uuid not null,
  after_version_id  uuid not null,
  hypothesis        text,
  changed_fields    text[] not null default '{}',
  started_on        date not null default current_date,
  ended_on          date,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  foreign key (gig_id, before_version_id) references public.gig_versions (gig_id, id) on delete cascade,
  foreign key (gig_id, after_version_id)  references public.gig_versions (gig_id, id) on delete cascade,
  check (before_version_id <> after_version_id),
  check (ended_on is null or ended_on >= started_on)
);

-- ---------------------------------------------------------------------------
-- Opportunities & evidence
-- ---------------------------------------------------------------------------

create table public.service_opportunities (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users (id) on delete cascade,
  service_title     text not null,
  buyer_problem     text,
  skill_match       numeric(5, 2) check (skill_match between 0 and 100),
  -- Heuristic Opportunity Fit Score. NULL means "unknown", never zero.
  -- Not a probability of orders.
  opportunity_score numeric(5, 2) check (opportunity_score between 0 and 100),
  score_breakdown   jsonb not null default '{}'::jsonb,
  confidence        text not null check (confidence in ('high', 'medium', 'low')),
  rationale         jsonb not null default '{}'::jsonb,
  -- Set when the user turns this idea into a gig (Journey C → B handoff).
  gig_id            uuid references public.gigs (id) on delete set null,
  created_at        timestamptz not null default now()
);

-- Evidence kept separate from AI conclusions (Tech Ref §4).
create table public.research_evidence (
  id             uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.service_opportunities (id) on delete cascade,
  source_type    text not null check (source_type in ('user_supplied', 'public_listing', 'licensed_api', 'assumption')),
  source_url     text,
  observed_at    timestamptz not null,
  metrics        jsonb not null default '{}'::jsonb,
  limitations    text,
  created_at     timestamptz not null default now()
);

create table public.competitor_analyses (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references auth.users (id) on delete cascade,
  gig_id                   uuid references public.gigs (id) on delete cascade,
  supplied_competitor_data jsonb not null default '[]'::jsonb,
  findings                 jsonb not null default '[]'::jsonb,
  created_at               timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Manage tools
-- ---------------------------------------------------------------------------

create table public.buyer_messages (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade,
  original_text   text not null check (char_length(original_text) <= 10000),
  generated_draft text,
  safety_flags    text[] not null default '{}',
  language        text,
  created_at      timestamptz not null default now()
);

create table public.portfolio_projects (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  title      text not null,
  -- Demo projects must always be labeled as demos (UI guide §10).
  is_demo    boolean not null default true,
  brief      jsonb not null default '{}'::jsonb,
  artifacts  jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.growth_roadmaps (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  gig_id     uuid references public.gigs (id) on delete cascade,
  summary    text,
  created_at timestamptz not null default now()
);

create table public.roadmap_tasks (
  id             uuid primary key default gen_random_uuid(),
  roadmap_id     uuid not null references public.growth_roadmaps (id) on delete cascade,
  priority       smallint not null default 2 check (priority between 1 and 3),
  effort         text check (effort in ('low', 'medium', 'high')),
  action         text not null,
  reason         text,
  status         text not null default 'todo' check (status in ('todo', 'in_progress', 'done', 'skipped')),
  next_review_on date,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Jobs, billing, usage (server-written)
-- ---------------------------------------------------------------------------

create table public.ai_jobs (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade,
  job_type        text not null check (job_type in (
                    'gig_audit', 'gig_generate', 'opportunity_discover', 'thumbnail_audit',
                    'competitor_gap', 'buyer_reply', 'roadmap', 'portfolio_plan')),
  status          text not null default 'queued'
                  check (status in ('queued', 'running', 'completed', 'failed', 'cancelled')),
  -- Client-supplied key so retries don't create duplicate jobs or charges.
  idempotency_key text,
  input_ref       jsonb,
  output_ref      jsonb,
  error           text,
  attempts        smallint not null default 0,
  input_tokens    integer,
  output_tokens   integer,
  cost_usd        numeric(10, 5),
  created_at      timestamptz not null default now(),
  started_at      timestamptz,
  completed_at    timestamptz,
  updated_at      timestamptz not null default now(),
  unique (user_id, idempotency_key)
);

create table public.subscriptions (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references auth.users (id) on delete cascade,
  provider                 text not null,
  external_subscription_id text not null,
  plan                     text not null check (plan in ('free', 'starter', 'pro')),
  status                   text not null check (status in ('trialing', 'active', 'past_due', 'cancelled', 'expired')),
  current_period_end       timestamptz,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  unique (provider, external_subscription_id)
);

-- Processed webhook IDs, so retried payment events are applied once (Tech Ref §5.6).
create table public.billing_events (
  provider          text not null,
  external_event_id text not null,
  event_type        text not null,
  processed_at      timestamptz not null default now(),
  primary key (provider, external_event_id)
);

create table public.usage_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  feature    text not null,
  units      integer not null check (units > 0),
  job_id     uuid references public.ai_jobs (id) on delete set null,
  created_at timestamptz not null default now(),
  -- A job is metered at most once per feature, even if the worker retries.
  unique (job_id, feature)
);

-- ---------------------------------------------------------------------------
-- Indexes (user_id / gig_id / FK lookups)
-- ---------------------------------------------------------------------------

create index on public.user_skills (user_id);
create index on public.seller_profiles (user_id);
create index on public.gigs (user_id, updated_at desc);
create index on public.gigs (seller_profile_id);
create index on public.gig_versions (gig_id, version_number desc);
create index on public.gig_audits (gig_id, created_at desc);
create index on public.gig_audits (version_id);
create index on public.gig_images (gig_id);
create index on public.gig_metrics (gig_id, period_start);
create index on public.experiments (gig_id);
create index on public.service_opportunities (user_id, created_at desc);
create index on public.service_opportunities (gig_id);
create index on public.research_evidence (opportunity_id);
create index on public.competitor_analyses (user_id);
create index on public.competitor_analyses (gig_id);
create index on public.buyer_messages (user_id, created_at desc);
create index on public.portfolio_projects (user_id);
create index on public.growth_roadmaps (user_id);
create index on public.growth_roadmaps (gig_id);
create index on public.roadmap_tasks (roadmap_id, sort_order);
create index on public.ai_jobs (user_id, created_at desc);
create index on public.ai_jobs (status) where status in ('queued', 'running');
create index on public.subscriptions (user_id);
create index on public.usage_events (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

create trigger set_updated_at before update on public.profiles           for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.seller_profiles    for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.gigs               for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.experiments        for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.portfolio_projects for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.roadmap_tasks      for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.ai_jobs            for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.subscriptions      for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Ownership helpers for child-table RLS
-- security definer avoids re-running parent RLS per row; each checks auth.uid().
-- ---------------------------------------------------------------------------

create or replace function public.owns_gig(p_gig_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.gigs
    where id = p_gig_id and user_id = (select auth.uid())
  );
$$;

create or replace function public.owns_opportunity(p_opportunity_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.service_opportunities
    where id = p_opportunity_id and user_id = (select auth.uid())
  );
$$;

create or replace function public.owns_roadmap(p_roadmap_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.growth_roadmaps
    where id = p_roadmap_id and user_id = (select auth.uid())
  );
$$;

create or replace function public.owns_seller_profile(p_seller_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.seller_profiles
    where id = p_seller_profile_id and user_id = (select auth.uid())
  );
$$;

revoke execute on function public.owns_gig(uuid), public.owns_opportunity(uuid),
  public.owns_roadmap(uuid), public.owns_seller_profile(uuid) from public, anon;
grant execute on function public.owns_gig(uuid), public.owns_opportunity(uuid),
  public.owns_roadmap(uuid), public.owns_seller_profile(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles              enable row level security;
alter table public.user_skills           enable row level security;
alter table public.seller_profiles       enable row level security;
alter table public.gigs                  enable row level security;
alter table public.gig_versions          enable row level security;
alter table public.gig_audits            enable row level security;
alter table public.gig_images            enable row level security;
alter table public.gig_metrics           enable row level security;
alter table public.experiments           enable row level security;
alter table public.service_opportunities enable row level security;
alter table public.research_evidence     enable row level security;
alter table public.competitor_analyses   enable row level security;
alter table public.buyer_messages        enable row level security;
alter table public.portfolio_projects    enable row level security;
alter table public.growth_roadmaps       enable row level security;
alter table public.roadmap_tasks         enable row level security;
alter table public.ai_jobs               enable row level security;
alter table public.subscriptions         enable row level security;
alter table public.billing_events        enable row level security;  -- no policies: service role only
alter table public.usage_events          enable row level security;

-- profiles: read/update own row (insert happens via signup trigger).
create policy "own profile: select" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "own profile: update" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Tables the user fully manages: direct user_id ownership.
create policy "own rows" on public.user_skills
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "own rows" on public.seller_profiles
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "own rows" on public.buyer_messages
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "own rows" on public.portfolio_projects
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "own rows" on public.growth_roadmaps
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()) and (gig_id is null or public.owns_gig(gig_id)));
create policy "own rows" on public.competitor_analyses
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()) and (gig_id is null or public.owns_gig(gig_id)));

-- gigs: may only link to the user's own seller profile.
create policy "own rows" on public.gigs
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and (seller_profile_id is null or public.owns_seller_profile(seller_profile_id))
  );

-- Child tables the user manages through the parent gig / roadmap.
create policy "via own gig" on public.gig_versions
  for all to authenticated using (public.owns_gig(gig_id)) with check (public.owns_gig(gig_id));
create policy "via own gig" on public.gig_images
  for all to authenticated using (public.owns_gig(gig_id)) with check (public.owns_gig(gig_id));
create policy "via own gig" on public.gig_metrics
  for all to authenticated using (public.owns_gig(gig_id)) with check (public.owns_gig(gig_id));
create policy "via own gig" on public.experiments
  for all to authenticated using (public.owns_gig(gig_id)) with check (public.owns_gig(gig_id));
create policy "via own roadmap" on public.roadmap_tasks
  for all to authenticated using (public.owns_roadmap(roadmap_id)) with check (public.owns_roadmap(roadmap_id));

-- AI outputs: users read and delete; only the server writes.
create policy "via own gig: select" on public.gig_audits
  for select to authenticated using (public.owns_gig(gig_id));
create policy "via own gig: delete" on public.gig_audits
  for delete to authenticated using (public.owns_gig(gig_id));

create policy "own rows: select" on public.service_opportunities
  for select to authenticated using (user_id = (select auth.uid()));
create policy "own rows: delete" on public.service_opportunities
  for delete to authenticated using (user_id = (select auth.uid()));

create policy "via own opportunity: select" on public.research_evidence
  for select to authenticated using (public.owns_opportunity(opportunity_id));

-- Jobs, billing, usage: read-only for the owner.
create policy "own rows: select" on public.ai_jobs
  for select to authenticated using (user_id = (select auth.uid()));
create policy "own rows: select" on public.subscriptions
  for select to authenticated using (user_id = (select auth.uid()));
create policy "own rows: select" on public.usage_events
  for select to authenticated using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Storage: private bucket for gig images. Path: <user_id>/<gig_id>/<file>
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gig-images', 'gig-images', false, 5242880, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

create policy "gig-images: own folder select" on storage.objects
  for select to authenticated
  using (bucket_id = 'gig-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "gig-images: own folder insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'gig-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and public.owns_gig(((storage.foldername(name))[2])::uuid)
  );
create policy "gig-images: own folder delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'gig-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
