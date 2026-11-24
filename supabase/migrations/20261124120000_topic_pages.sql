-- Pilot, step 3: topic pages written by the analysis job.
-- A page starts as a draft. Jonathan publishes it from /admin/utkast during
-- the pilot (CLAUDE.md, principle 5). Only published pages are shown to
-- readers, through the server. Server access only.
-- Written so it can be run more than once without errors.

create table if not exists public.topic_pages (
  id bigint generated always as identity primary key,
  -- One page per candidate topic.
  cluster_id bigint not null unique references public.topic_clusters (id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  -- draft: waiting for Jonathan. published: shown to readers. withdrawn: taken down.
  -- failed: the job could not write it. retry: Jonathan asked for a new draft.
  status text not null default 'draft' check (status in ('draft', 'published', 'withdrawn', 'failed', 'retry')),
  -- The whole page in the same shape as src/lib/topics/types.ts (Topic).
  data jsonb,
  -- What the checks found, in Swedish. A page with problems cannot be published.
  problems jsonb not null default '[]'::jsonb,
  cost_sek numeric(10, 4) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists topic_pages_status_idx on public.topic_pages (status, published_at desc);

alter table public.topic_pages enable row level security;
revoke all on table public.topic_pages from anon, authenticated;
grant select, insert, update, delete on table public.topic_pages to service_role;
comment on table public.topic_pages is 'Topic pages from the analysis job: drafts and published pages. Server access only.';
