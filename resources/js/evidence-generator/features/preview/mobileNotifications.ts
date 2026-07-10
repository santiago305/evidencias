import type { MobileDesignKey, SavedData } from '../../types';

export type MobileNotificationChannel = 'whatsapp' | 'sms' | 'call';

export type MobileNotificationInput = {
    capturedAt?: string | null;
    userKey?: string | null;
    designKey: string;
    channel: MobileNotificationChannel;
    evidenceKey?: string | null;
};

export const mobileNotificationIconIds = [
    'gmail',
    'linkedin',
    'facebook',
    'whatsapp',
    'weather',
    'chatgpt',
    'threads',
    'interbank',
    'bcp',
    'youtube-music',
    'youtube',
    'temu',
    'snaptube',
    'cinemark',
    'tiktok',
    'yape',
    'warning',
    'notification-dot',
] as const;

export type MobileNotificationIconId = (typeof mobileNotificationIconIds)[number];

const WINDOW_MINUTES = 3;
const TIMELINE_PATTERN: number[][] = [
    [0, 1, 2],
    [0, 1],
    [0, 1, 3],
    [0, 3],
    [0, 2, 3],
    [2, 3],
    [1, 2, 3],
    [1, 2],
];

function hashString(value: string): number {
    let hash = 2166136261;

    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
}

function seededRandom(seed: number): () => number {
    let state = seed || 1;

    return () => {
        state += 0x6d2b79f5;
        let temp = state;
        temp = Math.imul(temp ^ (temp >>> 15), temp | 1);
        temp ^= temp + Math.imul(temp ^ (temp >>> 7), temp | 61);

        return ((temp ^ (temp >>> 14)) >>> 0) / 4294967296;
    };
}

function parseLocalTimestamp(value?: string | null): number | null {
    const timestamp = value?.trim();

    if (!timestamp) {
        return null;
    }

    const parsed = new Date(timestamp).getTime();

    return Number.isNaN(parsed) ? null : parsed;
}

function shuffleIconIds(seed: string): MobileNotificationIconId[] {
    const random = seededRandom(hashString(seed));
    const icons = [...mobileNotificationIconIds];

    for (let index = icons.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(random() * (index + 1));
        [icons[index], icons[swapIndex]] = [icons[swapIndex], icons[index]];
    }

    return icons;
}

function buildFallbackNotificationIds(input: MobileNotificationInput): MobileNotificationIconId[] {
    const random = seededRandom(hashString([input.userKey, input.designKey, input.channel, input.evidenceKey].filter(Boolean).join('|')));
    const shuffled = shuffleIconIds([input.userKey, input.designKey, input.channel, input.evidenceKey, 'fallback'].filter(Boolean).join('|'));
    const count = 1 + Math.floor(random() * 4);

    return shuffled.slice(0, count);
}

export function buildMobileNotificationIds(input: MobileNotificationInput): MobileNotificationIconId[] {
    const timestamp = parseLocalTimestamp(input.capturedAt);

    if (timestamp === null) {
        return buildFallbackNotificationIds(input);
    }

    const blockIndex = Math.floor(timestamp / (WINDOW_MINUTES * 60 * 1000));
    const dayIndex = Math.floor(timestamp / (24 * 60 * 60 * 1000));
    const baseSeed = [input.userKey, input.designKey, input.channel, dayIndex].filter(Boolean).join('|');
    const baseIcons = shuffleIconIds(baseSeed).slice(0, 4);
    const pattern = TIMELINE_PATTERN[((blockIndex % TIMELINE_PATTERN.length) + TIMELINE_PATTERN.length) % TIMELINE_PATTERN.length];

    return pattern.map((index) => baseIcons[index]);
}

export function buildMobilePreviewNotificationIds(
    data: SavedData,
    designKey: MobileDesignKey,
    channel: MobileNotificationChannel,
): MobileNotificationIconId[] {
    return buildMobileNotificationIds({
        capturedAt: data.fechaHoraRegistro || data.fechaHora,
        userKey: data.dni,
        designKey,
        channel,
        evidenceKey: data.seedCode,
    });
}
