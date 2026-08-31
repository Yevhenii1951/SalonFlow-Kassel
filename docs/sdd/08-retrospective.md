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
