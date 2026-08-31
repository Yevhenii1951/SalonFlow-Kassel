import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const imageUrl = z.url();

const settings = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/settings" }),
  schema: z.object({
    name: z.string(),
    city: z.string(),
    tagline: z.string(),
    phone: z.string(),
    email: z.email(),
    booking: z.object({
      provider: z.string(),
      url: z.url(),
      embedUrl: z.url().optional(),
      mode: z.enum(["link", "embed"]).default("link"),
    }),
    address: z.object({
      street: z.string(),
      postalCode: z.string(),
      city: z.string(),
    }),
    hours: z.array(
      z.object({
        day: z.string(),
        time: z.string(),
      }),
    ),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/services" }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    slug: z.string(),
    summary: z.string(),
    longDescription: z.string(),
    price: z.string(),
    duration: z.string(),
    category: z.string(),
    featured: z.boolean().default(false),
    heroImage: imageUrl.optional(),
    galleryImages: z.array(imageUrl).default([]),
    bookingCtaLabel: z.string().default("Termin buchen"),
    seoTitle: z.string(),
    seoDescription: z.string(),
  }),
});

const prices = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/prices" }),
  schema: z.object({
    order: z.number(),
    name: z.string(),
    items: z.array(
      z.object({
        label: z.string(),
        price: z.string(),
        note: z.string().optional(),
      }),
    ),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/team" }),
  schema: z.object({
    order: z.number(),
    name: z.string(),
    role: z.string(),
    focus: z.string(),
    bio: z.string(),
    photo: imageUrl.optional(),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/gallery" }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    category: z.string(),
    image: imageUrl,
    alt: z.string(),
    relatedServiceSlug: z.string().optional(),
  }),
});

const faqs = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/faqs" }),
  schema: z.object({
    order: z.number(),
    question: z.string(),
    answer: z.string(),
    category: z.string(),
  }),
});

export const collections = {
  settings,
  services,
  prices,
  team,
  gallery,
  faqs,
};
