import { calculateEstimate, formatDuration, type PriceRules } from "../lib/price-calculator";

function readRules(root: HTMLElement): PriceRules | null {
  const source = root.querySelector<HTMLScriptElement>('script[type="application/json"]');
  if (!source?.textContent) {
    return null;
  }
  try {
    return JSON.parse(source.textContent) as PriceRules;
  } catch {
    return null;
  }
}

function setText(element: HTMLElement | null, value: string): void {
  if (element) {
    element.textContent = value;
  }
}

function selectedValue(root: HTMLElement, name: string): string {
  const checked = root.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
  return checked?.value ?? "";
}

function renderEstimate(root: HTMLElement, rules: PriceRules): void {
  const panel = root.querySelector<HTMLElement>("[data-result]");
  if (!panel) {
    return;
  }

  const estimate = calculateEstimate(rules, {
    serviceId: selectedValue(root, "serviceId"),
    lengthId: selectedValue(root, "lengthId"),
    extraIds: [...root.querySelectorAll<HTMLInputElement>('input[name="extraIds"]:checked')].map(
      (input) => input.value,
    ),
  });

  panel.hidden = estimate === null;
  if (!estimate) {
    return;
  }

  setText(root.querySelector("[data-total]"), `${estimate.total} EUR`);
  setText(root.querySelector("[data-duration]"), formatDuration(estimate.totalMinutes));
  setText(
    root.querySelector("[data-base]"),
    `${estimate.serviceName}, ${estimate.lengthLabel}: ${estimate.basePrice} EUR`,
  );

  const extrasList = root.querySelector<HTMLElement>("[data-extras]");
  if (!extrasList) {
    return;
  }
  extrasList.innerHTML = estimate.extras
    .map((extra) => `<li><span>${extra.name}</span><strong>+ ${extra.price} EUR</strong></li>`)
    .join("");
}

export function initPriceCalculator(root: HTMLElement): void {
  const rules = readRules(root);
  if (!rules) {
    return;
  }

  root.addEventListener("change", () => renderEstimate(root, rules));
  renderEstimate(root, rules);
}
