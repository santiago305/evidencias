import { formatDateKey, getPeruDateParts, parseDateKey, parsePeruDateOnly } from '../../../../../lib/whatsapp/time.ts';
import type { GeneratedMessage } from '../../../../../types';
import type { SmsData, SmsMessageStatus } from './smsTypes';

function isValidDateKey(dateKey: string | null): dateKey is string {
    return dateKey !== null && parseDateKey(dateKey) !== null;
}

function dateKeyFromDate(date: Date): string {
    return formatDateKey(getPeruDateParts(date));
}

export function resolveSmsDateKey(message: Pick<GeneratedMessage, 'dateKey'>, data: Pick<SmsData, 'fechaHora' | 'fechaHoraRegistro'>): string {
    if (isValidDateKey(message.dateKey ?? null)) return message.dateKey!;

    const formDateKey = data.fechaHora ? parsePeruDateOnly(data.fechaHora) : null;
    if (formDateKey) return formatDateKey(formDateKey);

    const registrationDateKey = data.fechaHoraRegistro ? parsePeruDateOnly(data.fechaHoraRegistro) : null;
    return registrationDateKey ? formatDateKey(registrationDateKey) : dateKeyFromDate(new Date());
}

export function formatSmsTime(time: string): string {
    const trimmedTime = time.trim();
    const match = /^(\d{1,2}):(\d{2})$/.exec(trimmedTime);

    if (!match) return trimmedTime;

    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (hours > 23 || minutes > 59) return trimmedTime;

    return new Intl.DateTimeFormat('es-PE', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC',
    })
        .format(new Date(Date.UTC(2000, 0, 1, hours, minutes)))
        .toLowerCase();
}

export function formatSmsFullDate(dateKey: string, time: string): string {
    const dateParts = parseDateKey(dateKey);
    if (!dateParts) return formatSmsTime(time);

    const date = new Date(Date.UTC(dateParts.year, dateParts.month - 1, dateParts.day));
    const dateLabel = new Intl.DateTimeFormat('es-PE', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        timeZone: 'UTC',
    }).format(date);

    return `${dateLabel} · ${formatSmsTime(time)}`;
}

export function buildSmsMessageTimestamp(
    message: Pick<GeneratedMessage, 'dateKey' | 'time' | 'side' | 'status'>,
    data: Pick<SmsData, 'fechaHora' | 'fechaHoraRegistro'>,
    currentDate = new Date(),
): { kind: 'today'; label: string; showChecks: boolean } | { kind: 'full-date'; label: string; showChecks: false } {
    const dateKey = resolveSmsDateKey(message, data);
    const isToday = dateKey === dateKeyFromDate(currentDate);

    if (isToday) {
        return { kind: 'today', label: formatSmsTime(message.time), showChecks: message.side === 'out' && Boolean(message.status) };
    }

    return { kind: 'full-date', label: formatSmsFullDate(dateKey, message.time), showChecks: false };
}

export function resolveSmsMessageStatus(
    message: Pick<GeneratedMessage, 'side' | 'status'>,
    fallback?: SmsMessageStatus,
): SmsMessageStatus | undefined {
    return message.side === 'out' ? (message.status ?? fallback) : undefined;
}
