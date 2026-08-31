import { describe, it, expect } from "vitest";
import {
  normalizeBooking,
  getLocalBusinessSchema,
  byOrder,
  sortByOrder,
} from "../src/lib/normalize";

const baseBooking = {
  provider: "StudioBookr",
  url: "https://example.com/termin-buchen",
  mode: "link" as const,
};

describe("normalizeBooking", () => {
  it("uses salon booking values when no env overrides are present", () => {
    const result = normalizeBooking(baseBooking);
    expect(result).toEqual({ ...baseBooking, embedUrl: "" });
  });

  it("overrides provider, url, and embedUrl from env when provided", () => {
    const result = normalizeBooking(baseBooking, {
      provider: "Treatwell",
      url: "https://treatwell.example/book",
      embedUrl: "https://treatwell.example/embed",
    });
    expect(result.provider).toBe("Treatwell");
    expect(result.url).toBe("https://treatwell.example/book");
    expect(result.embedUrl).toBe("https://treatwell.example/embed");
  });

  it("defaults embedUrl to empty string when not provided anywhere", () => {
    const result = normalizeBooking(baseBooking, { provider: "Shore" });
    expect(result.embedUrl).toBe("");
    expect(result.provider).toBe("Shore");
  });

  it("preserves the booking mode from the config regardless of env", () => {
    const embed = normalizeBooking({ ...baseBooking, mode: "embed", embedUrl: "https://x.example/e" });
    expect(embed.mode).toBe("embed");
    const link = normalizeBooking({ ...baseBooking, mode: "link", embedUrl: "https://x.example/e" }, { url: "https://x.example/other" });
    expect(link.mode).toBe("link");
    expect(link.url).toBe("https://x.example/other");
  });

  it("uses salon booking url when env url is empty string", () => {
    const result = normalizeBooking(baseBooking, { url: "" });
    expect(result.url).toBe("https://example.com/termin-buchen");
  });
});

describe("getLocalBusinessSchema", () => {
  const salon = {
    name: "SalonFlow Kassel",
    phone: "+49 561 000000",
    email: "termin@salonflow-kassel.example",
    address: {
      street: "Friedrich-Ebert-Strasse 48",
      postalCode: "34117",
      city: "Kassel",
    },
  };

  it("builds a HairSalon LocalBusiness JSON-LD object", () => {
    const schema = getLocalBusinessSchema(salon, "https://salonflow-kassel.example");
    expect(schema["@type"]).toBe("HairSalon");
    expect(schema.name).toBe("SalonFlow Kassel");
    expect(schema.telephone).toBe("+49 561 000000");
    expect(schema.email).toBe("termin@salonflow-kassel.example");
  });

  it("includes full postal address with country DE", () => {
    const schema = getLocalBusinessSchema(salon, "https://salonflow-kassel.example");
    const address = schema.address as Record<string, string>;
    expect(address).toMatchObject({
      "@type": "PostalAddress",
      streetAddress: "Friedrich-Ebert-Strasse 48",
      postalCode: "34117",
      addressLocality: "Kassel",
      addressCountry: "DE",
    });
  });

  it("uses the provided site url and EUR price range", () => {
    const schema = getLocalBusinessSchema(salon, "https://example.netlify.app");
    expect(schema.url).toBe("https://example.netlify.app");
    expect(schema.priceRange).toBe("EUR");
  });
});

describe("sorting helpers", () => {
  it("sorts items by order ascending", () => {
    const items = [
      { order: 3, data: {} },
      { order: 1, data: {} },
      { order: 2, data: {} },
    ];
    const sorted = [...items].sort(byOrder);
    expect(sorted.map((i) => i.order)).toEqual([1, 2, 3]);
  });

  it("sortByOrder does not mutate the original array", () => {
    const items = [{ order: 2 }, { order: 1 }];
    const sorted = sortByOrder(items);
    expect(sorted.map((i) => i.order)).toEqual([1, 2]);
    expect(items.map((i) => i.order)).toEqual([2, 1]);
  });
});
