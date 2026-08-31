# Retrospective

Fill this after the first implementation phase.

## What Worked

- Lightweight SDD was enough for phase 1. The existing intent, business spec, stack decision, and tickets were specific enough to start implementation without another long planning round.
- Astro matched the project shape well: mostly static content, fast build, SEO pages, sitemap, and no unnecessary client-side app state.
- Structured data in `src/data/salon.ts` gives a CMS-ready boundary without adding a CMS too early.

## What Failed

- Two external image URLs were invalid on first verification. Placeholder media should be checked immediately or stored locally for portfolio stability.
- Astro dev mode does not serve the generated sitemap the same way as the built `dist` output. Sitemap verification should check `dist` after `npm run build`.

## Reusable Patterns

- Local business MVP: Home, Leistungen, detail service pages, Preise, Galerie, Team, Kontakt, FAQ, Impressum, Datenschutz.
- Conversion pattern: primary booking CTA in header, repeated booking band, mobile sticky booking CTA, phone CTA on contact.
- Consent-safe map pattern: show address/phone/indexable contact data first, load external map only after consent in a real project.

## Template Updates

- Add an image URL verification step to browser-test template.
- Add sitemap distinction: dev server check for pages, build output check for sitemap.

## Skill Draft Updates

- `astro-cms-site-builder`: add rule to keep phase 1 content in structured data before adding a CMS.
- `local-business-auditor`: add rule to verify CTA visibility on homepage, service detail, and contact page.


## Iteration 2: CMS And Booking

- Moved editable content from src/data/salon.ts into Astro Content Collections under src/content/.
- Added schemas in src/content.config.ts and read helpers in src/lib/cms.ts.
- Added Decap CMS scaffold in public/admin/index.html and public/admin/config.yml for GitHub-backed editing.
- Routed all booking CTAs to /termin/ and kept the external provider URL configurable via CMS/env.
- Kept booking in link mode by default; embed mode exists but should be enabled only after privacy and mobile checks.

## Iteration 3: Netlify, Testing, and Polish

- Added netlify.toml with build command (npm test && astro check && astro build).
- Switched Decap CMS to git-gateway backend for Netlify Identity integration.
- Added Netlify Identity widget to public/admin/index.html.
- Refactored cms.ts: extracted pure logic into src/lib/normalize.ts (normalizeBooking, getLocalBusinessSchema, navItems, byOrder, sortByOrder).
- Made getLocalBusinessSchema accept a dynamic siteUrl param (no more hardcoded example URL).
- Added Vitest with two test suites: normalize.test.ts (13 tests) and content-integrity.test.ts (6 tests).
- Tests gate the build pipeline: npm run build runs tests first.
- Fixed broken/typo links in README.md and docs/cms-and-booking.md (index.htmlconfig.yml).
- Added .netlify/ and coverage/ to .gitignore.

### What worked

- Extracting pure functions before writing tests was the right move: normalizeBooking and getLocalBusinessSchema are fully testable without Astro environment mocking.
- Content-integrity tests (cross-references, required fields, slug uniqueness) complement the schema validation that astro check already does during build.
- The full pipeline (tests → check → build) runs in ~2s, fast enough to gate deploys.

### What failed

- Astro's astro check type-checks test files too (it found the type-cast hack in tests). Either exclude tests from tsconfig for astro or keep tests fully type-clean. I chose the latter.
- Decap CMS with git-gateway requires a Netlify deploy with Identity enabled and an invite sent to the editor. This cannot be automated from CLI without auth tokens.
