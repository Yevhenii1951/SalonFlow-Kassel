import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { getLocalBusinessSchema, navItems } from "../src/lib/normalize";

const root = join(__dirname, "..");

function readJson(dir: string): Record<string, unknown>[] {
  const folder = join(root, "src", "content", dir);
  if (!existsSync(folder)) return [];
  return readdirSync(folder)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(folder, f), "utf-8")));
}

describe("content integrity", () => {
  const services = readJson("services");
  const gallery = readJson("gallery");
  const prices = readJson("prices");
  const team = readJson("team");
  const faqs = readJson("faqs");
  const settings = readJson("settings");

  it("nav items resolve to existing source pages", () => {
    const pagePaths = [
      "/",
      "/leistungen/",
      "/preise/",
      "/galerie/",
      "/team/",
      "/kontakt/",
      "/faq/",
      "/impressum/",
      "/datenschutz/",
      "/termin/",
    ];
    for (const item of navItems) {
      expect(pagePaths).toContain(item.href);
    }
  });

  it("every service has required SEO and booking fields", () => {
    expect(services.length).toBeGreaterThan(0);
    for (const s of services as Array<Record<string, unknown>>) {
      expect(typeof s.slug).toBe("string");
      expect((s.slug as string).length).toBeGreaterThan(0);
      expect(typeof s.title).toBe("string");
      expect(typeof s.summary).toBe("string");
      expect(typeof s.price).toBe("string");
      expect(typeof s.duration).toBe("string");
      expect(typeof s.seoTitle).toBe("string");
      expect(typeof s.seoDescription).toBe("string");
    }
  });

  it("service slugs are unique", () => {
    const slugs = services.map((s) => (s as { slug: string }).slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("gallery relatedServiceSlug references an existing service", () => {
    const slugs = new Set(services.map((s) => (s as { slug: string }).slug));
    for (const g of gallery) {
      const related = (g as { relatedServiceSlug?: string }).relatedServiceSlug;
      if (related) {
        expect(slugs.has(related), `missing service ${related}`).toBe(true);
      }
    }
  });

  it("gallery items have image and alt", () => {
    expect(gallery.length).toBeGreaterThan(0);
    for (const g of gallery as Array<Record<string, unknown>>) {
      expect(typeof g.image).toBe("string");
      expect(typeof g.alt).toBe("string");
    }
  });

  it("price groups have items with label and price", () => {
    expect(prices.length).toBeGreaterThan(0);
    for (const p of prices as Array<Record<string, unknown>>) {
      const items = p.items as Array<Record<string, unknown>>;
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
      for (const item of items) {
        expect(typeof item.label).toBe("string");
        expect(typeof item.price).toBe("string");
      }
    }
  });

  it("team members have name, role and focus", () => {
    expect(team.length).toBeGreaterThan(0);
    for (const m of team as Array<Record<string, unknown>>) {
      expect(typeof m.name).toBe("string");
      expect(typeof m.role).toBe("string");
      expect(typeof m.focus).toBe("string");
    }
  });

  it("faqs have question and answer", () => {
    expect(faqs.length).toBeGreaterThan(0);
    for (const f of faqs as Array<Record<string, unknown>>) {
      expect(typeof f.question).toBe("string");
      expect(typeof f.answer).toBe("string");
    }
  });

  it("settings define a valid LocalBusiness schema", () => {
    expect(settings.length).toBe(1);
    const salon = settings[0] as Record<string, unknown>;
    const schema = getLocalBusinessSchema(
      salon as never,
      "https://salonflow-kassel.example",
    );
    expect(schema["@type"]).toBe("HairSalon");
    expect((schema.address as Record<string, string>).addressCountry).toBe("DE");
  });
});
