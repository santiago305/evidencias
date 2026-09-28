import { getPeruDateParts, parseDateKey } from '../../../../../lib/whatsapp/time.ts';

const weekdays = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const months = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'];

function formatTime(time: string): string {
    const trimmedTime = time.trim();
    const match = /^(\d{1,2}):(\d{2})$/.exec(trimmedTime);

    if (!match) {
        return trimmedTime;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (hours > 23 || minutes > 59) {
        return trimmedTime;
    }

    const period = hours < 12 ? 'a.m.' : 'p.m.';
    const hour12 = hours % 12 || 12;

    return `${hour12}:${match[2]}${period}`;
}

function isValidCalendarDate(year: number, month: number, day: number): boolean {
    const date = new Date(Date.UTC(year, month - 1, day));

    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function formatMobile13SmsTimestamp(dateKey: string, time: string, currentDate = new Date()): string {
    const timeLabel = formatTime(time);
    const dateParts = parseDateKey(dateKey);

    if (!dateParts || !isValidCalendarDate(dateParts.year, dateParts.month, dateParts.day)) {
        return timeLabel;
    }

    const currentDateParts = getPeruDateParts(currentDate);
    const currentDay = Date.UTC(currentDateParts.year, currentDateParts.month - 1, currentDateParts.day);
    const messageDay = Date.UTC(dateParts.year, dateParts.month - 1, dateParts.day);
    const dayDifference = Math.round((currentDay - messageDay) / 86_400_000);

    if (dayDifference === 0) {
        return `hoy, ${timeLabel}`;
    }

    if (dayDifference === 1) {
        return `ayer, ${timeLabel}`;
    }

    if (dayDifference === 2) {
        return `anteayer, ${timeLabel}`;
    }

    const weekday = weekdays[new Date(messageDay).getUTCDay()];
    const month = months[dateParts.month - 1];
    const year = dateParts.year === currentDateParts.year ? '' : ` ${dateParts.year}`;

    return `${weekday}, ${dateParts.day} ${month}${year}, ${timeLabel}`;
}
