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
      embedUrl: z.string().optional(),
      mode: z.enum(["link", "embed"]).default("link"),
    }),
    address: z.object({
      street: z.string(),
      postalCode: z.string(),
      city: z.string(),
    }),
    coordinates: z
      .object({
        lat: z.number(),
        lon: z.number(),
      })
      .optional(),
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

const priceRules = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/pricerules" }),
  schema: z.object({
    order: z.number(),
    lengths: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        note: z.string(),
      }),
    ),
    services: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        hint: z.string(),
        price: z.record(z.string(), z.number()),
        minutes: z.record(z.string(), z.number()),
      }),
    ),
    extras: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        minutes: z.number(),
      }),
    ),
  }),
});

const reviews = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/reviews" }),
  schema: z.object({
    order: z.number(),
    author: z.string(),
    quote: z.string(),
    service: z.string(),
    meta: z.string(),
    rating: z.number().int().min(1).max(5),
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
    quote: z.string().optional(),
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
  priceRules,
  reviews,
  team,
  gallery,
  faqs,
};
