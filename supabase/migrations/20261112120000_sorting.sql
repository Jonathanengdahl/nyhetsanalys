-- Pilot, step 2: sorting articles into topics and measuring heat.
-- Haiku reads headline and lead, decides whether an article is in our field
-- (politics, economy, society, foreign affairs) and which topic it belongs to.
-- Heat is counted by the server, never by the AI. Server access only.
-- Written so it can be run more than once without errors.

create table if not exists public.topic_clusters (
  id bigint generated always as identity primary key,
  label text not null check (char_length(label) between 3 and 140),
  category text not null check (category in ('politik', 'ekonomi', 'samhalle', 'utrikes')),
  -- watching: below the threshold. hot: above it, a candidate for Jonathan.
  -- approved / rejected: Jonathan's decision (the buttons come in the next step).
  status text not null default 'watching' check (status in ('watching', 'hot', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  first_article_at timestamptz,
  last_article_at timestamptz,
  hot_since timestamptz,
  -- The latest headlines, so the sorting can recognise the topic without reading every article.
  examples text[] not null default '{}',
  -- Counted by the server: sources, outlets, media houses, national outlets, articles last 6 hours.
  heat jsonb not null default '{}'::jsonb,
  score integer not null default 0
);

create index if not exists topic_clusters_last_article_idx on public.topic_clusters (last_article_at desc);
create index if not exists topic_clusters_status_score_idx on public.topic_clusters (status, score desc);

alter table public.topic_clusters enable row level security;
revoke all on table public.topic_clusters from anon, authenticated;
grant select, insert, update, delete on table public.topic_clusters to service_role;
comment on table public.topic_clusters is 'Topics found by the sorting, with heat and status. Server access only.';

-- The sorting's verdict on each article.
alter table public.articles add column if not exists sorted_at timestamptz;
alter table public.articles add column if not exists in_scope boolean;
alter table public.articles add column if not exists cluster_id bigint references public.topic_clusters (id) on delete set null;

create index if not exists articles_unsorted_idx on public.articles (fetched_at desc) where sorted_at is null;
create index if not exists articles_cluster_idx on public.articles (cluster_id, fetched_at desc);

-- Kronor spent on the given AI jobs since a moment. The chat has its own budget
-- and the background jobs (sorting, later analysis) have theirs.
create or replace function public.ai_cost_sek_for_jobs(p_since timestamptz, p_jobs text[])
returns numeric
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(sum(cost_sek), 0) from public.ai_usage where created_at >= p_since and job = any (p_jobs);
$$;

revoke all on function public.ai_cost_sek_for_jobs(timestamptz, text[]) from public, anon, authenticated;
grant execute on function public.ai_cost_sek_for_jobs(timestamptz, text[]) to service_role;
