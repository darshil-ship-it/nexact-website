# NexAct lead backend

The three public forms submit to `POST /api/leads`. The browser never receives the Supabase service role key. The route validates fields, checks a rate limit, verifies Cloudflare Turnstile when configured, and inserts a flat record into `public.leads`. A success response is returned only after the database confirms the insert.

## Set up Supabase

1. Run [`db/20260923_leads.sql`](../db/20260923_leads.sql) in the Supabase SQL editor. It creates `public.leads`, a status constraint, indexes, an `updated_at` trigger, and rate-limit buckets with an atomic RPC. Row-level security is enabled; no browser role is granted access.
2. If the Phase 9 `public.lead_submissions` table exists, the migration copies valid rows into `public.leads` using their original IDs. It leaves the old table untouched. Check the copied row count before deciding whether to archive the old table.
3. Add the production environment variables below to the hosting platform. Redeploy after changing `NEXT_PUBLIC_TURNSTILE_SITE_KEY` because it is embedded in the client build.
4. Submit one test lead and verify it appears in `public.leads` with `status = 'new'`. No notification email or calendar booking is sent by this backend.

## Environment variables

| Variable | Required in production | Where used |
| --- | --- | --- |
| `SUPABASE_URL` | Yes | Server-side Supabase REST and rate-limit RPC. HTTPS is required outside local development. |
| `SUPABASE_SECRET_KEY` | Yes for new projects | Recommended `sb_secret_` key from Supabase Settings > API Keys. Server-side inserts and rate-limit RPC. Never expose it to the browser. |
| `SUPABASE_SERVICE_ROLE_KEY` | Legacy alternative | Existing service-role JWTs continue to work. Set this only if you are not using `SUPABASE_SECRET_KEY`. |
| `LEAD_RATE_LIMIT_SECRET` | Yes | HMAC key for IP and email rate-limit identifiers. Use a random value of at least 32 characters. |
| `TURNSTILE_SECRET_KEY` | Optional, paired | Server-side Cloudflare challenge verification. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional, paired | Renders the Cloudflare challenge in the forms. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical site metadata; unrelated to lead persistence. |

With no Supabase variables, `npm run dev` writes real submissions to `.local/leads.jsonl` (gitignored) and uses an in-memory limiter. Production returns an error instead of pretending to save. A partial Supabase configuration also fails closed. The local limiter resets when the development server restarts; production uses the database RPC so limits apply across instances. Set `SUPABASE_URL` plus one server-side key, not both key variables. New secret keys are sent in the `apikey` header; the legacy JWT fallback also uses a Bearer header.

## Record mapping

The public forms supply `name`, `email`, optional contact details, an interest and a message. Contact `subject`, meeting `interested_in`, and quote `service_solution` map to `interest`. Contact `message`, meeting `requirement`, and quote `project_description` map to `message`. Quote budget maps to `budget`. `lead_type` identifies the originating form. Source and UTM fields are stored in separate columns. The browser cannot set `status`, `notes`, `next_follow_up`, timestamps, or IDs; the database creates those values, and the update trigger maintains `updated_at`.

Valid statuses: `new`, `contacted`, `qualified`, `meeting_booked`, `proposal_sent`, `negotiation`, `won`, `lost`.

## Rate limiting and operations

The endpoint allows up to 10 validated attempts per IP and 3 per email in each 15-minute fixed window. Identifiers are HMAC-hashed before reaching Supabase; raw IPs are not stored in the rate-limit table. The IP source is the Cloudflare or trusted proxy header, with email limits still applied if no IP header is available. Deploy behind a trusted proxy that controls these headers. Exceeded limits return HTTP 429 with `Retry-After`. RPC failures return HTTP 503; they do not bypass the limit.

Schedule this cleanup query periodically, or run it manually:

```sql
delete from public.lead_rate_limit_buckets
where window_start < now() - interval '2 days';
```

Do not expose `public.leads` through an anonymous Supabase policy. Status and notes are for authorized back-office use only. Set a retention and deletion policy for personal data before public launch.
