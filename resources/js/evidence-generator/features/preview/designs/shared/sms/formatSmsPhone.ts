export function formatMobile6SmsPhone(value: string): string {
    const trimmed = value.trim();

    if (!trimmed) {
        return '-';
    }

    const compact = trimmed.replace(/\s+/g, '');

    if (!/^\d{9}$/.test(compact)) {
        return trimmed;
    }

    return `${compact.slice(0, 3)} ${compact.slice(3, 6)} ${compact.slice(6, 9)}`;
}
