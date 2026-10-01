export function formatMobile14MessageTime(value: string): string {
    const trimmedValue = value.trim();
    if (trimmedValue === '') return '';

    const formatTwelveHourTime = (hours24: number, minutes: number): string => {
        const hours12 = hours24 % 12 || 12;
        const period = hours24 < 12 ? 'a.m.' : 'p.m.';

        return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
    };

    const twelveHourMatch = /^(\d{1,2}):(\d{2})\s*([ap])\.?\s*m\.?$/i.exec(trimmedValue);
    if (twelveHourMatch) {
        const hours = Number(twelveHourMatch[1]);
        const minutes = Number(twelveHourMatch[2]);
        if (hours < 1 || hours > 12 || minutes > 59) return trimmedValue;

        const period = twelveHourMatch[3]?.toLowerCase();
        const hours24 = period === 'p' ? (hours % 12) + 12 : hours % 12;
        return formatTwelveHourTime(hours24, minutes);
    }

    const twentyFourHourMatch = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(trimmedValue);
    if (!twentyFourHourMatch) return trimmedValue;

    const hours = Number(twentyFourHourMatch[1]);
    const minutes = Number(twentyFourHourMatch[2]);
    if (hours > 23 || minutes > 59) return trimmedValue;

    return formatTwelveHourTime(hours, minutes);
}
