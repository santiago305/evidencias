export function formatMoneyValue(value: string, useThousands: boolean) {
  const cleaned = value.replace(/[^0-9.,-]/g, "").trim();
  if (!cleaned) return null;

  const normalized = cleaned.replace(/,/g, "");
  const numberValue = Number.parseFloat(normalized);
  if (Number.isNaN(numberValue)) return null;

  return numberValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: useThousands,
  });
}
