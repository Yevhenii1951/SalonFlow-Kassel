export interface BookingConfig {
  provider: string;
  url: string;
  embedUrl?: string;
  mode: "link" | "embed";
}

export interface NormalizedBooking {
  provider: string;
  url: string;
  embedUrl: string;
  mode: "link" | "embed";
}

export interface BookingEnv {
  provider?: string;
  url?: string;
  embedUrl?: string;
}

export function normalizeBooking(booking: BookingConfig, env: BookingEnv = {}): NormalizedBooking {
  return {
    provider: env.provider || booking.provider,
    url: env.url || booking.url,
    embedUrl: env.embedUrl || booking.embedUrl || "",
    mode: booking.mode,
  };
}

export interface SalonBusinessData {
  name: string;
  phone: string;
  email: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
  };
  coordinates?: {
    lat: number;
    lon: number;
  };
}

export function getLocalBusinessSchema(salon: SalonBusinessData, siteUrl: string): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: salon.name,
    telephone: salon.phone,
    email: salon.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: salon.address.street,
      postalCode: salon.address.postalCode,
      addressLocality: salon.address.city,
      addressCountry: "DE",
    },
    url: siteUrl,
    priceRange: "EUR",
  };

  if (salon.coordinates) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: salon.coordinates.lat,
      longitude: salon.coordinates.lon,
    };
  }

  return schema;
}

export function byOrder<T extends { order: number }>(a: T, b: T): number {
  return a.order - b.order;
}

export function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort(byOrder);
}

export interface NavItem {
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  { label: "Leistungen", href: "/leistungen/" },
  { label: "Preise", href: "/preise/" },
  { label: "Galerie", href: "/galerie/" },
  { label: "Team", href: "/team/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Kontakt", href: "/kontakt/" },
];
