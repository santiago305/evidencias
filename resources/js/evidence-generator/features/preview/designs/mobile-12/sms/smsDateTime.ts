import { formatDateKey, getPeruDateParts, parseDateKey, parsePeruDateOnly } from '../../../../../lib/whatsapp/time.ts';
import type { GeneratedMessage } from '../../../../../types';
import type { SmsData, SmsMessageStatus } from './smsTypes';

function isValidDateKey(dateKey: string | null): dateKey is string {
    return dateKey !== null && parseDateKey(dateKey) !== null;
}

function dateKeyFromDate(date: Date): string {
    return formatDateKey(getPeruDateParts(date));
}

export function isSmsDateKeyToday(dateKey: string, currentDate = new Date()): boolean {
    return dateKey === dateKeyFromDate(currentDate);
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
    const match = /^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i.exec(trimmedTime);

    if (!match) return trimmedTime;

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const meridiem = match[3]?.toUpperCase();

    if (minutes > 59 || (meridiem ? hours < 1 || hours > 12 : hours > 23)) return trimmedTime;

    if (meridiem) {
        hours = (hours % 12) + (meridiem === 'PM' ? 12 : 0);
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
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

    return `${dateLabel} • ${formatSmsTime(time)}`;
}

export function formatSmsMessageDateTime(dateKey: string, time: string, currentDate = new Date()): string {
    const timeLabel = formatSmsTime(time);
    const resolvedDate = parseDateKey(dateKey);
    if (!resolvedDate) return timeLabel;

    const current = getPeruDateParts(currentDate);
    const currentDay = Date.UTC(current.year, current.month - 1, current.day);
    const messageDay = Date.UTC(resolvedDate.year, resolvedDate.month - 1, resolvedDate.day);
    const daysDifference = Math.round((currentDay - messageDay) / 86_400_000);
    const messageDate = new Date(messageDay);
    const weekday = new Intl.DateTimeFormat('es-PE', { weekday: 'long', timeZone: 'UTC' }).format(messageDate);

    if (daysDifference === 0) return timeLabel;
    if (daysDifference === 1) return `Ayer \u2022 ${timeLabel}`;
    if (daysDifference >= 2 && daysDifference <= 6) return `${weekday} \u2022 ${timeLabel}`;

    const fullDate = new Intl.DateTimeFormat('es-PE', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        timeZone: 'UTC',
    }).format(messageDate);

    return `${fullDate} \u2022 ${timeLabel}`;
}

export function buildSmsConversationTimestamp(
    dateKey: string,
    time: string,
    currentDate = new Date(),
): { kind: 'today' | 'yesterday' | 'full-date'; label: string; timeLabel: string } {
    const resolvedDate = parseDateKey(dateKey);
    const timeLabel = formatSmsTime(time);

    if (!resolvedDate) {
        return { kind: 'full-date', label: timeLabel, timeLabel };
    }

    const currentDateParts = getPeruDateParts(currentDate);
    const currentDay = Date.UTC(currentDateParts.year, currentDateParts.month - 1, currentDateParts.day);
    const messageDay = Date.UTC(resolvedDate.year, resolvedDate.month - 1, resolvedDate.day);
    const dayDifference = Math.round((currentDay - messageDay) / 86_400_000);

    if (dayDifference === 0) {
        return { kind: 'today', label: timeLabel, timeLabel };
    }

    if (dayDifference === 1) {
        return { kind: 'yesterday', label: timeLabel, timeLabel };
    }

    return { kind: 'full-date', label: formatSmsFullDate(dateKey, time), timeLabel };
}

export function buildSmsDateSeparatorLabel(dateKey: string, time: string, currentDate = new Date()): { dateLabel: string; timeLabel: string } {
    const resolvedDate = parseDateKey(dateKey);
    const timeLabel = formatSmsTime(time);

    if (!resolvedDate) {
        return { dateLabel: '', timeLabel };
    }

    const current = getPeruDateParts(currentDate);
    const currentDay = Date.UTC(current.year, current.month - 1, current.day);
    const messageDay = Date.UTC(resolvedDate.year, resolvedDate.month - 1, resolvedDate.day);
    const dayDifference = Math.round((currentDay - messageDay) / 86_400_000);

    if (dayDifference === 0) {
        return { dateLabel: '', timeLabel };
    }

    if (dayDifference === 1) {
        return { dateLabel: 'Ayer', timeLabel };
    }

    const fullLabel = formatSmsFullDate(dateKey, time);
    const separatorIndex = fullLabel.lastIndexOf('.');

    return {
        dateLabel: separatorIndex >= 0 ? fullLabel.slice(0, separatorIndex) : fullLabel,
        timeLabel,
    };
}

export function resolveSmsMessageStatus(
    message: Pick<GeneratedMessage, 'side' | 'status'>,
    fallback?: SmsMessageStatus,
): SmsMessageStatus | undefined {
    return message.side === 'out' ? (message.status ?? fallback) : undefined;
}
