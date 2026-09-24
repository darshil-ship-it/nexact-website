-- Phase 9 legacy schema. New installations should apply 20260923_leads.sql instead.
-- If this table already exists, 20260923_leads.sql copies its rows without deleting it.
-- The browser never receives the service role key. No public read/write policies are created.
create table if not exists public.lead_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  form_type text not null check (form_type in ('contact', 'book-meeting', 'get-quote')),
  fields jsonb not null,
  attribution jsonb not null
);

alter table public.lead_submissions enable row level security;
create index if not exists lead_submissions_created_at_idx on public.lead_submissions (created_at desc);
