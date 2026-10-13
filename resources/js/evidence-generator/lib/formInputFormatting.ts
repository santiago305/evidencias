export type DecimalFormField = 'monto' | 'tasa' | 'cuota' | 'TCEA';

const decimalFields = new Set<DecimalFormField>(['monto', 'tasa', 'cuota', 'TCEA']);
const percentageFields = new Set<DecimalFormField>(['tasa', 'TCEA']);

function cleanDecimalValue(
    value: string,
    allowPercentage: boolean,
    maxIntegerDigits?: number,
): { value: string; hasDecimalSeparator: boolean; hasPercentage: boolean } {
    const hasPercentage = allowPercentage && value.trim().endsWith('%');
    const cleaned = value.replace(/[^0-9.,]/g, '').replace(/,/g, '.');
    const [rawIntegerPart = '', ...decimalParts] = cleaned.split('.');
    const integerPart = maxIntegerDigits === undefined ? rawIntegerPart : rawIntegerPart.slice(0, maxIntegerDigits);
    let hasDecimalSeparator = cleaned.includes('.');
    let decimalPart = decimalParts.join('').slice(0, 2);

    if (rawIntegerPart.length > integerPart.length || (integerPart === '99999' && /[1-9]/u.test(decimalPart))) {
        decimalPart = '';
        hasDecimalSeparator = false;
    }

    return {
        value: `${integerPart}${hasDecimalSeparator ? `.${decimalPart}` : ''}`,
        hasDecimalSeparator,
        hasPercentage,
    };
}

export function sanitizeDecimalInput(value: string, allowPercentage = false, maxIntegerDigits?: number): string {
    const cleaned = cleanDecimalValue(value, allowPercentage, maxIntegerDigits);

    if (!cleaned.value && !cleaned.hasDecimalSeparator) {
        return '';
    }

    return `${cleaned.value}${cleaned.hasPercentage ? '%' : ''}`;
}

export function normalizeTwoDecimalInput(value: string, allowPercentage = false): string {
    const trimmedValue = value.trim();

    if (trimmedValue === '') {
        return '';
    }

    const cleaned = cleanDecimalValue(trimmedValue, allowPercentage);
    const numericValue = Number.parseFloat(cleaned.value);

    if (!Number.isFinite(numericValue)) {
        return value;
    }

    return `${numericValue.toFixed(2)}${cleaned.hasPercentage ? '%' : ''}`;
}

function parseDecimalValue(value: string, allowPercentage: boolean): number | null {
    const hasPercentage = value.includes('%');

    if ((hasPercentage && !allowPercentage) || (hasPercentage && !value.trim().endsWith('%'))) {
        return null;
    }

    const normalized = value
        .trim()
        .replace(/[\s\p{Z}]+/gu, '')
        .replace(/%$/, '')
        .replace(/,/g, '.');

    if (!/^\d+(?:\.\d{1,2})?$/u.test(normalized)) {
        return null;
    }

    const numericValue = Number.parseFloat(normalized);

    return Number.isFinite(numericValue) ? numericValue : null;
}

export function getFormNumericValidationMessage(form: { monto: string; tasa: string; cuota: string; plazo: string; TCEA: string }): string | null {
    for (const field of decimalFields) {
        const value = form[field];

        if (value.trim() === '') {
            continue;
        }

        const numericValue = parseDecimalValue(value, percentageFields.has(field));

        if (numericValue === null) {
            return field === 'monto' || field === 'cuota'
                ? `${field === 'monto' ? 'El monto' : 'La cuota'} debe ser un número con máximo 2 decimales.`
                : `${field === 'tasa' ? 'La tasa' : 'La TCEA'} debe ser un porcentaje con máximo 2 decimales.`;
        }

        if ((field === 'monto' || field === 'cuota') && numericValue > 99999) {
            return `${field === 'monto' ? 'El monto' : 'La cuota'} no puede superar 99999.00.`;
        }
    }

    if (form.plazo.trim() !== '' && !/^\d+$/u.test(form.plazo.trim())) {
        return 'El plazo debe ser un número entero sin decimales.';
    }

    return null;
}
