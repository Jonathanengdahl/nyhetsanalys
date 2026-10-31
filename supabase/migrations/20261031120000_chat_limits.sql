-- AI chat in the beta: cost log and daily question quota.
-- Only the server (secret key / service_role) may read or write.
-- Written so it can be run more than once (for example first in the SQL
-- editor and later with `supabase db push`) without errors.

-- Every AI call with its token use and cost. No questions or answers are stored.
create table if not exists public.ai_usage (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  job text not null,
  scope text,
  model text not null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  cache_read_tokens integer not null default 0,
  cache_write_tokens integer not null default 0,
  cost_sek numeric(12, 6) not null default 0
);

create index if not exists ai_usage_created_at_idx on public.ai_usage (created_at);

alter table public.ai_usage enable row level security;
revoke all on table public.ai_usage from anon, authenticated;
grant select, insert on table public.ai_usage to service_role;
comment on table public.ai_usage is 'Token use and cost per AI call. Server access only.';

-- Questions per visitor and day. The visitor is a daily keyed hash of the IP
-- address, never the address itself. Rows older than two days are removed.
create table if not exists public.chat_quota (
  day date not null,
  visitor text not null,
  questions integer not null default 0,
  primary key (day, visitor)
);

alter table public.chat_quota enable row level security;
revoke all on table public.chat_quota from anon, authenticated;
grant select, insert, update, delete on table public.chat_quota to service_role;
comment on table public.chat_quota is 'Chat questions per visitor (daily pseudonym) and day. Server access only.';

-- Uses one question from today's quota. Returns the number left, or -1 when
-- the quota is used up. The insert and the check happen in one statement, so
-- two questions at the same moment cannot both slip through.
create or replace function public.chat_take_quota(p_day date, p_visitor text, p_limit integer)
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
declare
  used integer;
begin
  delete from public.chat_quota where day < p_day - 2;

  insert into public.chat_quota as q (day, visitor, questions)
  values (p_day, p_visitor, 1)
  on conflict (day, visitor) do update
    set questions = q.questions + 1
    where q.questions < p_limit
  returning q.questions into used;

  if used is null then
    return -1;
  end if;
  return p_limit - used;
end;
$$;

-- Kronor spent on AI since a given moment (the start of the Swedish day).
create or replace function public.ai_cost_sek_since(p_since timestamptz)
returns numeric
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(sum(cost_sek), 0) from public.ai_usage where created_at >= p_since;
$$;

revoke all on function public.chat_take_quota(date, text, integer) from public, anon, authenticated;
revoke all on function public.ai_cost_sek_since(timestamptz) from public, anon, authenticated;
grant execute on function public.chat_take_quota(date, text, integer) to service_role;
grant execute on function public.ai_cost_sek_since(timestamptz) to service_role;
