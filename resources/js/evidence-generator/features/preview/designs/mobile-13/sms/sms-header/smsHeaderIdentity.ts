import { resolveContactHeaderIdentity } from '../../../../../../lib/contactHeaderIdentity.ts';

export function resolveSmsHeaderInitial(value: string): string {
    const displayName = value.trim();

    return Array.from(displayName)[0]?.toLocaleUpperCase('es-PE') ?? '';
}

export function getSmsHeaderDisplayValue(nombre: string, telefono: string): string {
    if (!nombre.trim()) {
        return '+51 999 333 444';
    }

    return resolveContactHeaderIdentity({ nombre, telefono }, { formatPhone: formatMobile13SmsPhone }).title;
}

export function formatMobile13SmsPhone(value: string): string {
    const trimmed = value.trim();

    if (!trimmed) {
        return '-';
    }

    return /^\d{9}$/.test(trimmed) ? trimmed.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3') : trimmed;
}
