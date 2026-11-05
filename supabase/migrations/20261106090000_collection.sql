-- Pilot, step 1: collecting articles from the outlets' RSS feeds.
-- We keep the headline, the lead (ingress) and the link, never full text.
-- Only the server (secret key / service_role) may read or write.
-- Written so it can be run more than once without errors.

-- What we remember about each feed between runs: the last answer, caching
-- headers and failures in a row. The feed list itself is in src/content/feeds.ts.
create table if not exists public.feed_status (
  url text primary key,
  source text not null,
  checked_at timestamptz,
  status text not null default 'new'
    check (status in ('new', 'ok', 'not_modified', 'blocked_robots', 'reserved_tdm', 'http_error', 'parse_error', 'fetch_error')),
  http_status integer,
  etag text,
  last_modified text,
  items integer not null default 0,
  failures integer not null default 0,
  error text
);

alter table public.feed_status enable row level security;
revoke all on table public.feed_status from anon, authenticated;
grant select, insert, update, delete on table public.feed_status to service_role;
comment on table public.feed_status is 'Status per RSS feed: last answer, robots.txt and TDM reservations, failures. Server access only.';

-- One row per article: headline, lead and link. The fingerprint is the same
-- when the same text (for example from TT) appears in several outlets.
create table if not exists public.articles (
  id bigint generated always as identity primary key,
  url text not null unique,
  source text not null,
  feed_url text not null,
  title text not null,
  lead text,
  published_at timestamptz,
  fetched_at timestamptz not null default now(),
  fingerprint text not null,
  feed_kind text not null default 'news' check (feed_kind in ('news', 'opinion')),
  language text not null default 'sv',
  constraint articles_title_length check (char_length(title) <= 500),
  constraint articles_lead_length check (lead is null or char_length(lead) <= 600)
);

create index if not exists articles_published_at_idx on public.articles (published_at desc);
create index if not exists articles_fetched_at_idx on public.articles (fetched_at desc);
create index if not exists articles_fingerprint_idx on public.articles (fingerprint);
create index if not exists articles_source_idx on public.articles (source);

alter table public.articles enable row level security;
revoke all on table public.articles from anon, authenticated;
grant select, insert, update, delete on table public.articles to service_role;
comment on table public.articles is 'Collected articles: headline, lead and link only. Server access only.';

-- A log of every job run (collect now; sort, heat and analysis later).
create table if not exists public.job_runs (
  id bigint generated always as identity primary key,
  job text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  ok boolean,
  stats jsonb not null default '{}'::jsonb,
  error text
);

create index if not exists job_runs_job_started_idx on public.job_runs (job, started_at desc);

alter table public.job_runs enable row level security;
revoke all on table public.job_runs from anon, authenticated;
grant select, insert, update on table public.job_runs to service_role;
comment on table public.job_runs is 'One row per job run with counts and errors. Server access only.';
