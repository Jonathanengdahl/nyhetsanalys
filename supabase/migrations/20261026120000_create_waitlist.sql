-- Beta sign-up and weekly newsletter list.
-- Only the server (secret key / service_role) may read or write.
-- Sensitive tester data (political self-assessment) does NOT belong here;
-- it gets its own table with stricter access in a later step.

create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  wants_beta boolean not null default false,
  wants_newsletter boolean not null default false,
  wants_tester boolean not null default false,
  consent_storage boolean not null,
  consent_at timestamptz not null default now(),
  source text not null default 'web',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint waitlist_email_key unique (email),
  constraint waitlist_email_lowercase check (email = lower(email)),
  constraint waitlist_consent_required check (consent_storage),
  constraint waitlist_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint waitlist_email_length check (char_length(email) <= 254)
);

alter table public.waitlist enable row level security;

-- No policies: anon and authenticated get nothing. Be explicit about grants,
-- since new tables are not exposed to the Data API automatically.
revoke all on table public.waitlist from anon, authenticated;
grant select, insert, update on table public.waitlist to service_role;

comment on table public.waitlist is 'Beta sign-ups and newsletter subscribers. Server access only.';
