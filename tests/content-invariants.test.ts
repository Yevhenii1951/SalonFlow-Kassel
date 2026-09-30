import { describe, it, expect } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const RULES_DIR = join(process.cwd(), "src/content/pricerules");
const REVIEWS_DIR = join(process.cwd(), "src/content/reviews");

type Length = { id: string };
type Rule = {
  lengths: Length[];
  services: { id: string; price: Record<string, number>; minutes: Record<string, number> }[];
  extras: { id: string; price: number; minutes: number }[];
};

async function readJsonDir<T>(dir: string): Promise<T[]> {
  const files = (await readdir(dir)).filter((f) => f.endsWith(".json"));
  return Promise.all(
    files.map(async (f) => JSON.parse(await readFile(join(dir, f), "utf8")) as T),
  );
}

/**
 * Der Redakteur pflegt Laengen, Leistungen und Preise getrennt in Decap CMS.
 * Legt er eine neue Laenge an, muss er sie in JEDER Leistung bepreisen.
 * Sonst liefert calculateEstimate null und der Preisrechner blendet sich
 * kommentarlos aus - genau der Fehler, den diese Tests verhindern sollen.
 */
describe("Inhalt Preisrechner", () => {
  it("hat genau eine Regel-Datei", async () => {
    const files = (await readdir(RULES_DIR)).filter((f) => f.endsWith(".json"));
    expect(files).toHaveLength(1);
  });

  it("preist jede Leistung fuer jede Laenge", async () => {
    const [rules] = await readJsonDir<Rule>(RULES_DIR);

    for (const service of rules.services) {
      for (const length of rules.lengths) {
        expect(service.price, `${service.id}/${length.id} Preis`).toHaveProperty(length.id);
        expect(service.minutes, `${service.id}/${length.id} Dauer`).toHaveProperty(length.id);
        expect(typeof service.price[length.id], `${service.id}/${length.id} Preis ist Zahl`).toBe("number");
        expect(typeof service.minutes[length.id], `${service.id}/${length.id} Dauer ist Zahl`).toBe("number");
      }
    }
  });

  it("hat keine Preise fuer Laengen, die es nicht mehr gibt", async () => {
    const [rules] = await readJsonDir<Rule>(RULES_DIR);
    const known = new Set(rules.lengths.map((l) => l.id));

    for (const service of rules.services) {
      for (const key of [...Object.keys(service.price), ...Object.keys(service.minutes)]) {
        expect(known.has(key), `${service.id}: unbekannte Laenge "${key}"`).toBe(true);
      }
    }
  });

  it("verlangt positive Preise und Dauern", async () => {
    const [rules] = await readJsonDir<Rule>(RULES_DIR);

    for (const service of rules.services) {
      for (const [lengthId, value] of Object.entries(service.price)) {
        expect(value, `Preis ${service.id}/${lengthId}`).toBeGreaterThan(0);
      }
      for (const [lengthId, value] of Object.entries(service.minutes)) {
        expect(value, `Dauer ${service.id}/${lengthId}`).toBeGreaterThan(0);
      }
    }
    for (const extra of rules.extras) {
      expect(extra.price, `Zusatzleistung ${extra.id}`).toBeGreaterThan(0);
      expect(extra.minutes, `Zusatzleistung ${extra.id}`).toBeGreaterThan(0);
    }
  });

  it("haelt Laengen-, Leistungs- und Zusatz-IDs eindeutig", async () => {
    const [rules] = await readJsonDir<Rule>(RULES_DIR);

    const ids = [
      ...rules.lengths.map((l) => l.id),
      ...rules.services.map((s) => s.id),
      ...rules.extras.map((e) => e.id),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Inhalt Bewertungen", () => {
  it("sind zwischen 1 und 5 Sternen", async () => {
    const reviews = await readJsonDir<{ author: string; rating: number }>(REVIEWS_DIR);

    for (const review of reviews) {
      expect(Number.isInteger(review.rating), `${review.author}: ganzzahlig`).toBe(true);
      expect(review.rating, `${review.author}: min 1`).toBeGreaterThanOrEqual(1);
      expect(review.rating, `${review.author}: max 5`).toBeLessThanOrEqual(5);
    }
  });

  it("sind sortierbar, ohne doppelte order-Werte", async () => {
    const reviews = await readJsonDir<{ order: number }>(REVIEWS_DIR);
    const orders = reviews.map((r) => r.order);

    expect(new Set(orders).size).toBe(orders.length);
  });
});
