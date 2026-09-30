export interface LengthOption {
  id: string;
  label: string;
  note: string;
}

export interface ServiceRule {
  id: string;
  name: string;
  hint: string;
  price: Record<string, number>;
  minutes: Record<string, number>;
}

export interface ExtraRule {
  id: string;
  name: string;
  price: number;
  minutes: number;
}

export interface PriceRules {
  lengths: LengthOption[];
  services: ServiceRule[];
  extras: ExtraRule[];
}

export interface Selection {
  serviceId: string;
  lengthId: string;
  extraIds: string[];
}

export interface Estimate {
  serviceName: string;
  lengthLabel: string;
  basePrice: number;
  extrasTotal: number;
  total: number;
  totalMinutes: number;
  extras: ExtraRule[];
}

function nonNegative(value: number | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return 0;
  }
  return value;
}

export function calculateEstimate(rules: PriceRules, selection: Selection): Estimate | null {
  const service = rules.services.find((item) => item.id === selection.serviceId);
  if (!service) {
    return null;
  }

  const length = rules.lengths.find((item) => item.id === selection.lengthId);
  if (!length) {
    return null;
  }

  const rawPrice = service.price[length.id];
  const rawMinutes = service.minutes[length.id];
  if (typeof rawPrice !== "number" || !Number.isFinite(rawPrice)) {
    return null;
  }
  if (typeof rawMinutes !== "number" || !Number.isFinite(rawMinutes)) {
    return null;
  }

  const basePrice = nonNegative(rawPrice);
  const baseMinutes = nonNegative(rawMinutes);

  const chosenIds = new Set(selection.extraIds);
  const extras = rules.extras.filter((extra) => chosenIds.has(extra.id));
  const extrasTotal = extras.reduce((sum, extra) => sum + nonNegative(extra.price), 0);
  const extraMinutes = extras.reduce((sum, extra) => sum + nonNegative(extra.minutes), 0);

  return {
    serviceName: service.name,
    lengthLabel: length.label,
    basePrice,
    extrasTotal,
    total: Math.max(0, basePrice + extrasTotal),
    totalMinutes: Math.max(0, baseMinutes + extraMinutes),
    extras,
  };
}

export function formatDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return "–";
  }
  const rounded = Math.round(minutes);
  const hours = Math.floor(rounded / 60);
  const rest = rounded % 60;
  if (hours === 0) {
    return `${rest} Min.`;
  }
  if (rest === 0) {
    return `${hours} Std.`;
  }
  return `${hours} Std. ${rest} Min.`;
}
