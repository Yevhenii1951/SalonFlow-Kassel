import { describe, it, expect } from "vitest";
import {
  calculateEstimate,
  formatDuration,
  type PriceRules,
} from "../src/lib/price-calculator";

const rules: PriceRules = {
  lengths: [
    { id: "kurz", label: "Kurz", note: "bis zur Schulter" },
    { id: "schulterlang", label: "Schulterlang", note: "über die Schulter" },
  ],
  services: [
    {
      id: "damenhaarschnitt",
      name: "Damenhaarschnitt",
      hint: "Waschen, Schnitt und Styling",
      price: { kurz: 48, schulterlang: 58 },
      minutes: { kurz: 45, schulterlang: 60 },
    },
    {
      id: "ansatzfarbe",
      name: "Ansatzfarbe",
      hint: "ohne Verblondierung",
      price: { kurz: 52, schulterlang: 62 },
      minutes: { kurz: 75, schulterlang: 90 },
    },
  ],
  extras: [
    { id: "ansatz", name: "Ansatz auffrischen", price: 12, minutes: 10 },
    { id: "wellen", name: "Wellen oder Glätten", price: 15, minutes: 15 },
  ],
};

describe("calculateEstimate", () => {
  it("returns null for an unknown service id", () => {
    expect(calculateEstimate(rules, { serviceId: "nope", lengthId: "kurz", extraIds: [] })).toBeNull();
  });

  it("returns null for an unknown length id", () => {
    expect(calculateEstimate(rules, { serviceId: "damenhaarschnitt", lengthId: "sehrlang", extraIds: [] })).toBeNull();
  });

  it("returns null when the service has no price for the chosen length", () => {
    const partial: PriceRules = {
      ...rules,
      services: [{ ...rules.services[0], price: { kurz: 48 } }],
    };
    expect(calculateEstimate(partial, { serviceId: "damenhaarschnitt", lengthId: "schulterlang", extraIds: [] })).toBeNull();
  });

  it("prices a base estimate without extras", () => {
    const estimate = calculateEstimate(rules, {
      serviceId: "damenhaarschnitt",
      lengthId: "kurz",
      extraIds: [],
    });
    expect(estimate).not.toBeNull();
    expect(estimate?.total).toBe(48);
    expect(estimate?.basePrice).toBe(48);
    expect(estimate?.extrasTotal).toBe(0);
    expect(estimate?.totalMinutes).toBe(45);
  });

  it("adds selected extras to price and duration", () => {
    const estimate = calculateEstimate(rules, {
      serviceId: "ansatzfarbe",
      lengthId: "schulterlang",
      extraIds: ["ansatz", "wellen"],
    });
    expect(estimate?.basePrice).toBe(62);
    expect(estimate?.extrasTotal).toBe(27);
    expect(estimate?.total).toBe(89);
    expect(estimate?.totalMinutes).toBe(115);
    expect(estimate?.extras.map((extra) => extra.name)).toEqual([
      "Ansatz auffrischen",
      "Wellen oder Glätten",
    ]);
  });

  it("ignores unknown extra ids", () => {
    const estimate = calculateEstimate(rules, {
      serviceId: "damenhaarschnitt",
      lengthId: "kurz",
      extraIds: ["gibtsnicht"],
    });
    expect(estimate?.extrasTotal).toBe(0);
    expect(estimate?.total).toBe(48);
  });

  it("counts a duplicated extra only once", () => {
    const estimate = calculateEstimate(rules, {
      serviceId: "damenhaarschnitt",
      lengthId: "kurz",
      extraIds: ["wellen", "wellen"],
    });
    expect(estimate?.extrasTotal).toBe(15);
  });

  it("resolves the label the visitor sees, not just the id", () => {
    const estimate = calculateEstimate(rules, {
      serviceId: "damenhaarschnitt",
      lengthId: "schulterlang",
      extraIds: [],
    });
    expect(estimate?.serviceName).toBe("Damenhaarschnitt");
    expect(estimate?.lengthLabel).toBe("Schulterlang");
  });

  it("never returns a negative total even with zero or negative price data", () => {
    const broken: PriceRules = {
      ...rules,
      services: [{ ...rules.services[0], price: { kurz: 0, schulterlang: 0 } }],
      extras: [{ id: "ansatz", name: "Ansatz auffrischen", price: -5, minutes: 0 }],
    };
    const estimate = calculateEstimate(broken, {
      serviceId: "damenhaarschnitt",
      lengthId: "kurz",
      extraIds: ["ansatz"],
    });
    expect(estimate?.total).toBe(0);
  });
});

describe("formatDuration", () => {
  it("renders minutes only below an hour", () => {
    expect(formatDuration(45)).toBe("45 Min.");
  });

  it("renders hours without minutes when exact", () => {
    expect(formatDuration(60)).toBe("1 Std.");
  });

  it("renders hours and remaining minutes", () => {
    expect(formatDuration(115)).toBe("1 Std. 55 Min.");
  });

  it("renders a dash for zero", () => {
    expect(formatDuration(0)).toBe("–");
  });
});
