# CMS And Booking Integration

This project uses a practical CMS-ready architecture for a local German salon website.

## Content Source

Editable content lives in Astro Content Collections:

- src/content/settings/salon.json
- src/content/services/*.json
- src/content/prices/*.json
- src/content/team/*.json
- src/content/gallery/*.json
- src/content/faqs/*.json

Schemas are defined in src/content.config.ts.

Pages read content through src/lib/cms.ts.

This keeps the website close to a real CMS project while still being easy to inspect in Git.

## Decap CMS Admin

The admin panel is available at `/admin/index.html` (Netlify serves it as a static file).

Files:

- `public/admin/index.html` — includes Decap CMS + Netlify Identity widget
- `public/admin/config.yml` — configured for git-gateway backend (Netlify Identity)

For production editing, editors authenticate via Netlify Identity. The CMS commits changes directly to the GitHub repository's main branch.

## Booking Integration

All booking CTAs point to the internal route /termin/.

That page reads the provider config from CMS/env and sends users to the external booking provider.

Default CMS config:

- file: src/content/settings/salon.json
- field: booking.provider
- field: booking.url
- field: booking.mode
- optional field: booking.embedUrl

Environment override:

PUBLIC_BOOKING_PROVIDER=StudioBookr
PUBLIC_BOOKING_URL=https://example.com/termin-buchen
PUBLIC_BOOKING_EMBED_URL=

Use link mode first for real clients. Embed mode should only be used after checking cookies, tracking, mobile behavior, and provider terms.
