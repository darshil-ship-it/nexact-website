# Protected lead dashboard

`/admin` is a private dashboard backed by Supabase Auth. The site exposes no sign-up route. Unauthenticated visitors are redirected to `/admin/login`; every lead API request independently verifies the Supabase access token and checks the email allowlist. Lead reads and updates use the server-side Supabase database key, never a browser key.

## Setup

1. Apply [`db/20260923_leads.sql`](../db/20260923_leads.sql) to the Supabase project if it has not been applied already.
2. In Supabase Authentication, create or invite the intended admin user. Make sure the email is confirmed and the user can sign in with a password.
3. Set these environment variables in `.env.local` for local development and in the hosting provider for production:

   | Variable | Purpose |
   | --- | --- |
   | `SUPABASE_URL` | Supabase project URL. |
   | `SUPABASE_SECRET_KEY` | Recommended server-side `sb_secret_` key for lead reads and updates. A legacy `SUPABASE_SERVICE_ROLE_KEY` JWT also works. |
   | `SUPABASE_PUBLISHABLE_KEY` | Recommended `sb_publishable_` key used by the server to call Supabase Auth. A legacy `SUPABASE_ANON_KEY` JWT also works. |
   | `ADMIN_EMAILS` | Comma-separated confirmed Auth user emails allowed into the dashboard. Example: `owner@example.com,ops@example.com`. |
   | `LEAD_RATE_LIMIT_SECRET` | At least 32 random characters, used by the sign-in rate limiter. |

4. Restart the site, visit `/admin/login`, and sign in with the invited user's Supabase Auth credentials.

Both database and Auth keys stay on the server. Keep real keys in `.env.local` or the host's secret store; `.env.example` is a placeholder template.

## What the dashboard does

Summary cards count new leads, meeting requests, quote requests, contact requests, and won leads. The list supports status and type filters with pagination. Opening a lead shows its full request, contact details, source and UTM fields. An admin can update only `status`, `notes`, and `next_follow_up`; the database trigger updates `updated_at`.

The permitted statuses are `new`, `contacted`, `qualified`, `meeting_booked`, `proposal_sent`, `negotiation`, `won`, and `lost`. Sign-in attempts have separate 15-minute rate-limit buckets from public lead submissions. Session cookies are HTTP-only and secure on production HTTPS. Admin responses are dynamic and private with no caching.

There is no public sign-up, lead API, or anonymous database policy for `public.leads`. Admin Auth users should be limited to trusted staff and removed from `ADMIN_EMAILS` immediately when access is revoked.
