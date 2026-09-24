# NexAct Global production content handoff

The site is technically built and tested. This is the source-backed list of information still needed before replacing placeholders or enabling public indexing. Do not add guessed clients, people, metrics, locations, awards, or impact claims.

## First batch to supply

1. **Canonical public origin** — the final `https://` domain, including whether `www` is used. This becomes `NEXT_PUBLIC_SITE_URL`. It is currently unset, so robots blocks indexing, sitemap is empty, and canonical URLs are omitted.
2. **Approved Privacy and Terms text** — both routes currently display foundation copy. Provide final copy approved for publication. Do not put legal text into the site from a guess.
3. **Company basics** — public contact email and official LinkedIn/Instagram URLs if they should appear. `src/content/site.ts` currently leaves them empty; the mobile menu shows disabled social labels.
4. **Service and solution approval** — confirm, remove, reorder, or edit the four draft services and three draft solutions in `src/content/services.ts` and `src/content/solutions.ts`. Their current descriptions explicitly say they are drafts.
5. **Homepage publication choice** — provide verified content for the sections below, or identify which sections should be disabled for launch. Section visibility and order are controlled in `src/content/home.ts` by `homeSections`.

## Verified content needed by section

| Area | Supply or approve |
| --- | --- |
| We Work With | Actual customer categories and short descriptions. |
| Selected Client Results | For each case: permission to name the client, client name, category, project title, challenge/work summary, approved outcome, supporting source, and media. Do not add metrics without evidence. |
| Personal Branding Results | Approved profile, before/after assets, description, and any documented result. |
| Life at NexAct / Company Showcase | Approved team, workplace, event, or process photos/videos and factual captions. |
| Our Journey | Confirmed dates, milestones, descriptions, and optional media. The About timeline is also empty. |
| Solutions / Products / Projects Showcase | Actual featured item names, descriptions, destination URLs, and media. |
| Achievements & Trust | Verified metric value, label, source, and permission to publish; or awards/certifications with proof. |
| Global Reach | Confirmed served countries/regions. Specify whether any office locations may be claimed. |
| Beyond Business | Documented initiatives, dates, scope, media, and approved impact copy; otherwise leave empty or disable. |
| About | Approved purpose, vision, mission, team names/roles/portraits, culture captions, history, reach, achievements, and impact material. |

Editable text is centralized in `src/content/home.ts`, `src/content/about.ts`, `src/content/services.ts`, `src/content/solutions.ts`, and `src/content/pages.ts`. Supply descriptive alt text for meaningful images. A decorative background may use empty alt text.

## Media handoff

All external URLs belong in `src/content/media.ts`. The supplied homepage hero video is present and plays; its poster URL is still empty. No stock images should be substituted. The remaining media slots are grouped below. A slot is needed only if its section is published.

- **Homepage:** `PROJECT_01/02/03_IMAGE_URL`, `PERSONAL_BRANDING_01_BEFORE/AFTER_URL`, `LIFE_AT_NEXACT_01/02/03/04_URL`, `COMPANY_SHOWCASE_01/02/03_URL`, `JOURNEY_01/02_MEDIA_URL`, `SOLUTION_01_MEDIA_URL`, `PRODUCT_01_MEDIA_URL`, `PROJECT_SHOWCASE_01_MEDIA_URL`, `GLOBAL_MAP_MEDIA_URL`, `IMPACT_IMAGE_01_URL`, and the hero poster.
- **Services:** `DIGITAL_EXPERIENCES_MEDIA_URL`, `PRODUCT_ENGINEERING_MEDIA_URL`, `AI_AUTOMATION_MEDIA_URL`, `BUSINESS_SYSTEMS_MEDIA_URL`.
- **Solutions:** `CONNECTED_EXPERIENCE_MEDIA_URL`, `CLEARER_OPERATIONS_MEDIA_URL`, `PRACTICAL_INTELLIGENCE_MEDIA_URL`.
- **Coming Soon:** optional `GROWTH_PARTNER_BACKGROUND_URL`, `AI_CONSULTANCY_BACKGROUND_URL`.
- **About:** `ABOUT_HERO_VIDEO_URL`, `ABOUT_COMPANY_IMAGE_URL`, `ABOUT_PURPOSE_IMAGE_URL`, `ABOUT_JOURNEY_IMAGE_URL`, `ABOUT_CULTURE_IMAGE_01/02/03_URL`, `ABOUT_GLOBAL_MAP_IMAGE_URL`, `ABOUT_IMPACT_IMAGE_URL`.

The media file also contains a few aliases for the same project, branding, life, map, and impact assets. One approved asset can be reused where appropriate. Empty URLs already render clean labelled placeholders.

## Production configuration to verify separately

Deployment must receive `NEXT_PUBLIC_SITE_URL`, `SUPABASE_URL`, a server-side Supabase key (`SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY`), a public auth key (`SUPABASE_PUBLISHABLE_KEY` or `SUPABASE_ANON_KEY`), `ADMIN_EMAILS`, and `LEAD_RATE_LIMIT_SECRET`. Optional GA4/GTM, Search Console, and Cloudflare Turnstile variables are listed in `.env.example`. Local environment values do not automatically transfer to a production host. Do not paste secret values into this handoff document.

Before publishing, exercise one authorized test submission against the production database and confirm it appears in the protected admin dashboard. The final pre-deployment test used an isolated proxy for form success/error UI states and did not create a real lead.
