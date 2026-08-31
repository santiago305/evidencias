import { peruDayNames, timeOfDayConfig } from '../../config/whatsapp/greetings.ts';

type DateParts = {
    year: number;
    month: number;
    day: number;
};

const peruMonthNames = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
];

export function getPeruDateParts(date: Date): DateParts {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Lima',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(date);

    const lookup = Object.fromEntries(parts.map((p) => [p.type, p.value]));
    return {
        year: Number(lookup.year),
        month: Number(lookup.month),
        day: Number(lookup.day),
    };
}

export function parsePeruDateOnly(fechaHora: string): DateParts | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/.exec(fechaHora.trim());
    if (!match) return null;
    const [, y, m, d] = match;
    return { year: Number(y), month: Number(m), day: Number(d) };
}

export function parseDateKey(dateKey: string): DateParts | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey.trim());
    if (!match) return null;
    const [, y, m, d] = match;
    return { year: Number(y), month: Number(m), day: Number(d) };
}

export function formatDateKey({ year, month, day }: DateParts) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function formatDateKeyFromDate(date: Date) {
    return formatDateKey({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
    });
}

export function getDateKeyFromLocalDateTime(fechaHora: string) {
    const dateParts = parsePeruDateOnly(fechaHora);
    return dateParts ? formatDateKey(dateParts) : null;
}

export function formatDateDMY({ year, month, day }: DateParts) {
    return `${day}/${month}/${year}`;
}

export function formatDateLongMobile({ year, month, day }: DateParts) {
    const monthName = peruMonthNames[month - 1] ?? '';
    return `${day} de ${monthName} de ${year}`;
}

function getDayChipTextFromParts(input: DateParts | null, reference: DateParts) {
    if (!input) return 'Hoy';

    const todayUtc = Date.UTC(reference.year, reference.month - 1, reference.day);
    const inputUtc = Date.UTC(input.year, input.month - 1, input.day);
    const diffDays = Math.floor((todayUtc - inputUtc) / 86_400_000);

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';

    if (diffDays >= 2 && diffDays <= 6) {
        const dayIndex = new Date(inputUtc).getUTCDay();
        return peruDayNames[dayIndex] ?? 'Hoy';
    }

    return formatDateDMY(input);
}

function getMobileDayChipTextFromParts(input: DateParts | null, reference: DateParts) {
    if (!input) return 'Hoy';

    const todayUtc = Date.UTC(reference.year, reference.month - 1, reference.day);
    const inputUtc = Date.UTC(input.year, input.month - 1, input.day);
    const diffDays = Math.floor((todayUtc - inputUtc) / 86_400_000);

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';

    if (diffDays >= 2 && diffDays <= 6) {
        const dayIndex = new Date(inputUtc).getUTCDay();
        return peruDayNames[dayIndex] ?? 'Hoy';
    }

    return formatDateLongMobile(input);
}

export function getDayChipText(fechaHora: string) {
    return getDayChipTextFromParts(parsePeruDateOnly(fechaHora), getPeruDateParts(new Date()));
}

export function getDayChipTextForDate(dateKey: string, referenceFechaHora?: string | null, currentDate = new Date()) {
    const reference = referenceFechaHora ? (parsePeruDateOnly(referenceFechaHora) ?? getPeruDateParts(currentDate)) : getPeruDateParts(currentDate);

    return getDayChipTextFromParts(parseDateKey(dateKey), reference);
}

export function getMobileDayChipText(fechaHora: string) {
    return getMobileDayChipTextFromParts(parsePeruDateOnly(fechaHora), getPeruDateParts(new Date()));
}

export function getMobileDayChipTextForDate(dateKey: string, referenceFechaHora?: string | null, currentDate = new Date()) {
    const reference = referenceFechaHora ? (parsePeruDateOnly(referenceFechaHora) ?? getPeruDateParts(currentDate)) : getPeruDateParts(currentDate);

    return getMobileDayChipTextFromParts(parseDateKey(dateKey), reference);
}

export function parseLocalDateTime(fechaHora: string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/.exec(fechaHora.trim());
    if (!match) return null;
    const [, y, m, d, h, min] = match;
    return new Date(Number(y), Number(m) - 1, Number(d), Number(h), Number(min));
}

export function formatTimeShort(date: Date) {
    const hours24 = date.getHours();
    const hours12 = hours24 % 12 || 12;
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = hours24 >= 12 ? 'p.m.' : 'a.m.';
    return `${hours12}:${minutes} ${period}`;
}

export function formatWhatsappTimeValue(value: string) {
    const trimmedValue = value.trim();
    if (trimmedValue === '') return '';
    if (/\b[ap]\.\s*m\./i.test(trimmedValue)) return trimmedValue;

    const match = /^(\d{1,2}):(\d{2})$/.exec(trimmedValue);
    if (!match) return trimmedValue;

    const [, rawHours, rawMinutes] = match;
    const hours = Number(rawHours);
    const minutes = Number(rawMinutes);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return trimmedValue;
    }

    return formatTimeShort(new Date(2000, 0, 1, hours, minutes));
}

export function getTimeOfDayParts(date: Date) {
    const hour = date.getHours();

    if (hour >= timeOfDayConfig.morning.startHourInclusive && hour < timeOfDayConfig.morning.endHourExclusive) {
        const greetingIndex = (hour - timeOfDayConfig.morning.startHourInclusive) % timeOfDayConfig.morning.saludos.length;

        return {
            saludo: timeOfDayConfig.morning.saludos[greetingIndex],
            tramo: timeOfDayConfig.morning.tramo,
            slot: 'mañana' as const,
        };
    }

    if (hour >= timeOfDayConfig.afternoon.startHourInclusive && hour < timeOfDayConfig.afternoon.endHourExclusive) {
        return {
            saludo: timeOfDayConfig.afternoon.saludo,
            tramo: timeOfDayConfig.afternoon.tramo,
            slot: 'tarde' as const,
        };
    }

    return {
        saludo: timeOfDayConfig.night.saludo,
        tramo: timeOfDayConfig.night.tramo,
        slot: 'noche' as const,
    };
}