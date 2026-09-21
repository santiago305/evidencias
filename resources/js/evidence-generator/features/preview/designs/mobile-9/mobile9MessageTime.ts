export function formatMobile9MessageTime(value: string): string {
    const trimmedValue = value.trim();
    if (trimmedValue === '') return '';

    const twelveHourMatch = /^(\d{1,2}):(\d{2})\s*([ap])\.?\s*m\.?$/i.exec(trimmedValue);
    if (twelveHourMatch) {
        const hours = Number(twelveHourMatch[1]);
        const minutes = Number(twelveHourMatch[2]);
        if (hours < 1 || hours > 12 || minutes > 59) return trimmedValue;

        const period = twelveHourMatch[3]?.toLowerCase();
        const hours24 = period === 'p' ? (hours % 12) + 12 : hours % 12;
        return `${String(hours24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    const twentyFourHourMatch = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(trimmedValue);
    if (!twentyFourHourMatch) return trimmedValue;

    const hours = Number(twentyFourHourMatch[1]);
    const minutes = Number(twentyFourHourMatch[2]);
    if (hours > 23 || minutes > 59) return trimmedValue;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
