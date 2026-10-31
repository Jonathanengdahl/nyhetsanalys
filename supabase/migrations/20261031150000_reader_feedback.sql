-- Reader feedback on topic pages: "Var den här sidan tydlig?" and suggested
-- perspectives with a required source. Only the server (secret key /
-- service_role) may read or write. No names, e-mail or IP addresses.
-- Written so it can be run more than once.

create table if not exists public.topic_feedback (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  topic text not null check (topic ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  helpful boolean not null,
  comment text check (comment is null or char_length(comment) <= 1000)
);

create index if not exists topic_feedback_topic_idx on public.topic_feedback (topic, created_at);

alter table public.topic_feedback enable row level security;
revoke all on table public.topic_feedback from anon, authenticated;
grant select, insert, delete on table public.topic_feedback to service_role;
comment on table public.topic_feedback is 'Was the topic page clear? Optional comment. Server access only.';

-- A person reviews every suggestion and its source. Status: ny, godkänd, avböjd.
create table if not exists public.topic_suggestions (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  topic text not null check (topic ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  perspective text not null check (char_length(perspective) between 15 and 1000),
  source_url text not null check (source_url ~* '^https?://' and char_length(source_url) <= 500),
  status text not null default 'ny' check (status in ('ny', 'godkänd', 'avböjd')),
  reviewed_at timestamptz,
  review_note text
);

create index if not exists topic_suggestions_status_idx on public.topic_suggestions (status, created_at);

alter table public.topic_suggestions enable row level security;
revoke all on table public.topic_suggestions from anon, authenticated;
grant select, insert, update, delete on table public.topic_suggestions to service_role;
comment on table public.topic_suggestions is 'Suggested missing perspectives with a source, reviewed by a person. Server access only.';
