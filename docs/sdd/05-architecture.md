# Architecture

## App Type

Content-first local business website.

## Planned Structure

```text
src/
  pages/
    index.astro
    leistungen/index.astro
    leistungen/[slug].astro
    preise.astro
    galerie.astro
    team.astro
    kontakt.astro
    faq.astro
    impressum.astro
    datenschutz.astro
  layouts/
    BaseLayout.astro
  components/
    Header.astro
    Footer.astro
    BookingCTA.astro
    MobileBookingBar.astro
    ServiceCard.astro
    PriceList.astro
    GalleryGrid.astro
    TeamCard.astro
    ContactBlock.astro
    LocalBusinessSchema.astro
  components/interactive/
    GalleryFilter.tsx
    ServiceQuiz.tsx
  lib/
    content.ts
    seo.ts
    schema.ts
```

## Data Flow

```text
CMS/mock content -> Astro pages -> static/server-rendered HTML
-> external booking/contact links
```

## Privacy

- Map is optional and consent-safe.
- Contact information is always visible as text.
- Legal pages are placeholders for portfolio use.

## Testing

- Build/lint.
- Browser scenarios for homepage, service page, booking CTA, contact, mobile.

## Implemented CMS/Booking Boundary

Content source is now src/content/ with Astro Content Collections. Pages consume content through src/lib/cms.ts. Booking CTAs go to /termin/, which uses CMS/env provider settings and then sends users to the external booking system.
