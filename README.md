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
- CMS-ready data layer in `src/data/salon.ts`

## Commands

```bash
npm install
npm run dev
npm run build
```

## Pages

- `/`
- `/leistungen/`
- `/leistungen/balayage-kassel/`
- `/preise/`
- `/galerie/`
- `/team/`
- `/kontakt/`
- `/faq/`
- `/impressum/`
- `/datenschutz/`

## Notes

This is not a real salon website and does not copy a real brand, copy, or media
assets. Legal pages are placeholders and must be replaced with client-specific
content before any real launch in Germany.

## CMS And Booking

Content is now stored in Astro Content Collections under src/content/ and validated by src/content.config.ts.

A Decap CMS scaffold is available at /admin/index.html with config in public/admin/index.htmlconfig.yml.

Booking CTAs point to /termin/, which reads provider settings from src/content/settings/salon.json and can be overridden with .env values. See docs/cms-and-booking.md.
