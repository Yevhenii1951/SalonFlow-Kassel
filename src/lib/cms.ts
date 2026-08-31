import { getCollection, getEntry } from "astro:content";
import { getLocalBusinessSchema as normalizeBusinessSchema, normalizeBooking } from "./normalize";

export const navItems = [
  { label: "Leistungen", href: "/leistungen/" },
  { label: "Preise", href: "/preise/" },
  { label: "Galerie", href: "/galerie/" },
  { label: "Team", href: "/team/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Kontakt", href: "/kontakt/" },
];

const byOrder = <T extends { data: { order: number } }>(a: T, b: T) =>
  a.data.order - b.data.order;

export async function getSalon() {
  const salon = await getEntry("settings", "salon");

  if (!salon) {
    throw new Error("Missing required CMS settings entry: salon");
  }

  return salon.data;
}

export function getBookingIntegration(salon: Awaited<ReturnType<typeof getSalon>>) {
  return normalizeBooking(salon.booking, {
    provider: import.meta.env.PUBLIC_BOOKING_PROVIDER,
    url: import.meta.env.PUBLIC_BOOKING_URL,
    embedUrl: import.meta.env.PUBLIC_BOOKING_EMBED_URL,
  });
}

export async function getServices() {
  const entries = await getCollection("services");
  return entries.sort(byOrder).map((entry) => ({
    id: entry.id,
    ...entry.data,
  }));
}

export async function getPriceGroups() {
  const entries = await getCollection("prices");
  return entries.sort(byOrder).map((entry) => ({
    id: entry.id,
    ...entry.data,
  }));
}

export async function getTeamMembers() {
  const entries = await getCollection("team");
  return entries.sort(byOrder).map((entry) => ({
    id: entry.id,
    ...entry.data,
  }));
}

export async function getGalleryItems() {
  const entries = await getCollection("gallery");
  return entries.sort(byOrder).map((entry) => ({
    id: entry.id,
    ...entry.data,
  }));
}

export async function getFaqs() {
  const entries = await getCollection("faqs");
  return entries.sort(byOrder).map((entry) => ({
    id: entry.id,
    ...entry.data,
  }));
}

export function getLocalBusinessSchema(salon: Awaited<ReturnType<typeof getSalon>>, siteUrl: string) {
  return normalizeBusinessSchema(salon, siteUrl);
}
