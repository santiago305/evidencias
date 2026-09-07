import { formatDateKey, getPeruDateParts, parseDateKey, parsePeruDateOnly } from '../../../../../lib/whatsapp/time.ts';
import type { GeneratedMessage } from '../../../../../types';
import type { SmsConversationType, SmsData, SmsMessageStatus } from './smsTypes';

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
        .toLowerCase()
        .replace(/([ap])\.\s*m\./i, '$1.m.');
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

export function buildSmsConversationHeader(
    data: Pick<SmsData, 'telefono' | 'nombre'>,
    randomValue = Math.random(),
): { kind: 'rcs'; title: string; description: string } | { kind: 'sms'; title: string } {
    if (randomValue < 0.5) {
        return {
            kind: 'rcs',
            title: `Chat RCS con ${data.telefono.trim() || '-'}`,
            description: 'Ahora el chat está encriptado de extremo a extremo.',
        };
    }

    return {
        kind: 'sms',
        title: `Mensajes de texto con ${data.nombre.trim() || '-'} (SMS/MMS)`,
    };
}

export function buildSmsMessageTimestamp(
    message: Pick<GeneratedMessage, 'dateKey' | 'time' | 'side'>,
    data: Pick<SmsData, 'fechaHora' | 'fechaHoraRegistro'>,
    currentDate = new Date(),
    conversationType: SmsConversationType = 'rcs',
): { kind: 'today' | 'full-date'; label: string; showChecks: boolean; showSmsLabel: boolean } {
    const dateKey = resolveSmsDateKey(message, data);
    const formattedLabel = formatSmsMessageDateTime(dateKey, message.time, currentDate);
    const isToday = isSmsDateKeyToday(dateKey, currentDate);
    const showChecks = conversationType === 'rcs' && message.side === 'out';
    const showSmsLabel = conversationType === 'sms' && message.side === 'out';

    if (isToday) {
        return { kind: 'today', label: formattedLabel, showChecks, showSmsLabel };
    }

    return { kind: 'full-date', label: formattedLabel, showChecks, showSmsLabel };
}

export function resolveSmsMessageStatus(
    message: Pick<GeneratedMessage, 'side' | 'status'>,
    fallback?: SmsMessageStatus,
): SmsMessageStatus | undefined {
    return message.side === 'out' ? (message.status ?? fallback) : undefined;
}
