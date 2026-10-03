export function formatMobile13SmsPhone(value: string): string {
    const trimmed = value.trim();

    if (!trimmed) {
        return '-';
    }

    return /^\d{9}$/.test(trimmed) ? trimmed.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3') : trimmed;
}
