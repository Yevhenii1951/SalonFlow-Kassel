# SalonFlow Kassel

Realistic portfolio project for a fictional German hair salon in Kassel.

The project demonstrates a lightweight SDD workflow for local business websites:
clear booking CTA, service pages, price overview, gallery, contact page, legal
placeholders, local SEO metadata, and CMS-ready structured content.

## Stack

- Astro
- TypeScript
- Tailwind CSS
- Static output
- CMS-ready data layer in Astro Content Collections under `src/content/`

## Commands

```bash
npm install
npm run dev
npm test          # Vitest unit + content-integrity tests
npm run build     # test -> astro check -> astro build
npm run preview
```

## Deployment (Netlify)

The repo is deploy-ready for Netlify (see `netlify.toml` and `docs/netlify-deploy.md`).
`npm run build` is the build command; the publish directory is `dist`.

## Legal Note

This is not a real salon website and does not copy a real brand, copy, or media
assets. Legal pages (Impressum/Datenschutz) are placeholders and must be replaced
with client-specific content before any real launch in Germany.

## CMS And Booking

Content is stored in Astro Content Collections under `src/content/` and validated by `src/content.config.ts`.

A Decap CMS admin is available at `/admin/` (git-gateway backend authenticated via Netlify Identity),
with config in `public/admin/config.yml`.

Booking CTAs point to `/termin/`, which reads provider settings from `src/content/settings/salon.json`
and can be overridden with `.env` values. See `docs/cms-and-booking.md` and `docs/netlify-deploy.md`.
