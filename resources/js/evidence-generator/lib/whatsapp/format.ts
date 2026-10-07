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

export function formatConversationAmount(value: string): string {
  const amountWithoutWhitespace = value.replace(/[\s\p{Z}]+/gu, '');

  return /^-?\d+$/u.test(amountWithoutWhitespace) ? `${amountWithoutWhitespace}.00` : amountWithoutWhitespace;
}

export function completeAmountDecimals(value: string): string {
  const amountWithoutWhitespace = value.replace(/[\s\p{Z}]+/gu, '');
  const match = amountWithoutWhitespace.match(/^(-?\d+)(?:([.,])(\d*))?$/u);

  if (!match) {
    return value;
  }

  return `${match[1]}${match[2] ?? '.'}${(match[3] ?? '').padEnd(2, '0')}`;
}
