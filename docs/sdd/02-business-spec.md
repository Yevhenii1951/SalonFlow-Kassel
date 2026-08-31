# Business Spec

## Project

SalonFlow Kassel - fictional modern website for a hair salon in Kassel.

## Users

- Primary: local customers looking for haircut, balayage, color, or styling in Kassel.
- Secondary: users comparing prices, gallery quality, and appointment availability.
- Owner/admin: salon owner who wants editable services, prices, team, gallery, and FAQ.

## User Flows

```text
Visitor opens homepage -> sees salon/service/city -> clicks Termin buchen.
Visitor opens Balayage page -> sees examples and price guidance -> books consultation.
Visitor opens prices -> understands price level -> books or calls.
Visitor opens contact -> sees address, opening hours, phone, booking link.
```

## Pages

- Home.
- Leistungen.
- Leistung detail: Balayage Kassel.
- Preise.
- Galerie.
- Team.
- Kontakt.
- FAQ.
- Impressum placeholder.
- Datenschutz placeholder.

## Acceptance Criteria

- Main booking CTA is visible on desktop and mobile.
- Services, prices, team, gallery, FAQ are modeled as editable content.
- Local SEO metadata exists for key pages.
- Contact details are visible even if external map is not loaded.
- No real external booking implementation is built in phase 1.

## Non-Goals

- No custom appointment scheduling.
- No payment.
- No ecommerce.
- No real legal text generation.
- No copying real salon assets.
