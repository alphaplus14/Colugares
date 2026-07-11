import type { BudgetTier, PlacePrice } from "@/types/place.types";

/** Formatea precio oficial o estimado según tier de presupuesto */
export function formatPlacePrice(
  priceReal: PlacePrice | undefined,
  budgetTier: BudgetTier,
): string {
  if (priceReal) {
    const formatted = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: priceReal.currency ?? "COP",
      maximumFractionDigits: 0,
    }).format(priceReal.amount);
    return `${formatted}/${priceReal.unit}`;
  }

  const tierLabels: Record<BudgetTier, string> = {
    bajo: "~$50.000 (estimado)",
    medio: "~$150.000 (estimado)",
    alto: "~$400.000 (estimado)",
  };

  return tierLabels[budgetTier];
}
