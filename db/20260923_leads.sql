-- Phase 10: run in the Supabase SQL editor before deploying the new adapter.
-- Keeps the Phase 9 lead_submissions table intact and copies its rows when present.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  phone text,
  company text,
  country text,
  interest text not null,
  message text not null,
  budget text,
  timeline text,
  preferred_contact text,
  lead_type text not null check (lead_type in ('contact', 'book-meeting', 'get-quote')),
  page_source text not null default '',
  section_source text not null default '',
  cta_source text not null default '',
  referrer text not null default '',
  utm_source text not null default '',
  utm_medium text not null default '',
  utm_campaign text not null default '',
  utm_content text not null default '',
  utm_term text not null default '',
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'meeting_booked', 'proposal_sent', 'negotiation', 'won', 'lost')),
  notes text,
  next_follow_up timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_created_at_idx on public.leads (status, created_at desc);
create index if not exists leads_next_follow_up_idx on public.leads (next_follow_up) where next_follow_up is not null;
create index if not exists leads_email_idx on public.leads (lower(email));

create or replace function public.touch_lead_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
drop trigger if exists leads_touch_updated_at on public.leads;
create trigger leads_touch_updated_at before update on public.leads
for each row execute function public.touch_lead_updated_at();

alter table public.leads enable row level security;
revoke all on public.leads from anon, authenticated;
grant select, insert, update, delete on public.leads to service_role;

-- Fixed-window counters are updated atomically by the RPC below.
create table if not exists public.lead_rate_limit_buckets (
  actor_hash text not null,
  window_start timestamptz not null,
  request_count integer not null check (request_count >= 0),
  primary key (actor_hash, window_start)
);
create index if not exists lead_rate_limit_buckets_window_idx on public.lead_rate_limit_buckets (window_start);
alter table public.lead_rate_limit_buckets enable row level security;
revoke all on public.lead_rate_limit_buckets from anon, authenticated;
grant select, insert, update, delete on public.lead_rate_limit_buckets to service_role;

create or replace function public.consume_lead_rate_limit(
  p_actor_hash text,
  p_window_seconds integer,
  p_max_requests integer
) returns boolean
language plpgsql
set search_path = public
as $$
declare
  v_window_start timestamptz;
  v_count integer;
begin
  if length(p_actor_hash) <> 64 or p_window_seconds < 60 or p_max_requests < 1 then
    raise exception 'Invalid rate limit parameters';
  end if;
  v_window_start := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  insert into public.lead_rate_limit_buckets (actor_hash, window_start, request_count)
  values (p_actor_hash, v_window_start, 1)
  on conflict (actor_hash, window_start)
  do update set request_count = public.lead_rate_limit_buckets.request_count + 1
  returning request_count into v_count;
  return v_count <= p_max_requests;
end;
$$;
revoke all on function public.consume_lead_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_lead_rate_limit(text, integer, integer) to service_role;

-- Safe to rerun. Existing IDs are retained; the old table is not deleted.
do $$
begin
  if to_regclass('public.lead_submissions') is not null then
    insert into public.leads (
      id, name, email, phone, company, country, interest, message, budget, timeline,
      preferred_contact, lead_type, page_source, section_source, cta_source, referrer,
      utm_source, utm_medium, utm_campaign, utm_content, utm_term, created_at, updated_at
    )
    select
      id,
      fields->>'name', fields->>'email', nullif(fields->>'phone', ''),
      nullif(fields->>'company', ''), nullif(fields->>'country', ''),
      coalesce(nullif(fields->>'subject', ''), nullif(fields->>'interested_in', ''), nullif(fields->>'service_solution', '')),
      coalesce(nullif(fields->>'message', ''), nullif(fields->>'requirement', ''), nullif(fields->>'project_description', '')),
      nullif(fields->>'budget_range', ''), nullif(fields->>'timeline', ''), nullif(fields->>'preferred_contact', ''),
      form_type,
      coalesce(attribution->>'page_source', ''), coalesce(attribution->>'section_source', ''),
      coalesce(attribution->>'cta_source', ''), coalesce(attribution->>'referrer', ''),
      coalesce(attribution->>'utm_source', ''), coalesce(attribution->>'utm_medium', ''),
      coalesce(attribution->>'utm_campaign', ''), coalesce(attribution->>'utm_content', ''),
      coalesce(attribution->>'utm_term', ''), created_at, created_at
    from public.lead_submissions
    where nullif(fields->>'name', '') is not null
      and nullif(fields->>'email', '') is not null
      and coalesce(nullif(fields->>'subject', ''), nullif(fields->>'interested_in', ''), nullif(fields->>'service_solution', '')) is not null
      and coalesce(nullif(fields->>'message', ''), nullif(fields->>'requirement', ''), nullif(fields->>'project_description', '')) is not null
    on conflict (id) do nothing;
  end if;
end;
$$;

-- Schedule periodically or run manually when needed:
-- delete from public.lead_rate_limit_buckets where window_start < now() - interval '2 days';
