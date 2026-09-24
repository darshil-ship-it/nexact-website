# NexAct Global

Next.js App Router site with a content-driven public experience, server-side lead forms, and an authenticated Supabase lead dashboard.

## Run locally

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
```

Copy `.env.example` to `.env.local` and fill only the integrations you use. Never commit real keys. The local file is ignored by Git.

## SEO and analytics

Set `NEXT_PUBLIC_SITE_URL` to the final public **origin** (for example, `https://www.example.com`, with no path). Until it is configured, pages remain `noindex`, `robots.txt` blocks crawling, and the sitemap is empty. In a production build with an origin, public routes receive absolute canonicals, Open Graph/Twitter metadata, and sitemap entries. Admin, API, and unfinished legal pages are excluded from indexing. The existing `src/app/icon.svg` supplies the favicon.

`src/content/site.ts` is the source for Organization structured data. It currently emits the supplied organization name and description, plus the URL only when configured. Add verified social URLs there if available; do not add unverified business details.

Optional variables:

- `NEXT_PUBLIC_GA_ID`: GA4 measurement ID (`G-...`).
- `NEXT_PUBLIC_GTM_ID`: Tag Manager container ID (`GTM-...`). When set, GTM is loaded and direct GA4 loading is skipped. Configure your GA4 tag inside GTM if you use both IDs.
- `GOOGLE_SITE_VERIFICATION`: Search Console HTML meta verification token.

Scripts load only in production. `src/lib/analytics.ts` provides typed events for CTA clicks, successful form submissions, and content views. GTM receives custom events through `dataLayer`; direct GA4 receives them through `gtag`. Client-side route changes send a page view. Do not configure a second history-change page-view trigger in GTM unless you remove the built-in route-change event.

## Other environment variables

Supabase lead storage and admin sign-in use `SUPABASE_URL`, a server-only `SUPABASE_SECRET_KEY` (or legacy `SUPABASE_SERVICE_ROLE_KEY`), `SUPABASE_PUBLISHABLE_KEY` (or legacy `SUPABASE_ANON_KEY`), and `ADMIN_EMAILS`. `LEAD_RATE_LIMIT_SECRET` supports rate limiting. Turnstile uses `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`. See `.env.example` for the complete list.

## Content

Editable copy and media configuration live in `src/content`. Add external image and video URLs in `src/content/media.ts`; the image host allowlist is derived from those URLs at build time. Supply descriptive `alt` text for meaningful images, or an empty string for decorative backgrounds. Public route files are in `src/app`, reusable sections and controls in `src/components`, and server/client helpers in `src/lib`.
