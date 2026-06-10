export type WhatsappAvatarTheme = {
    bg: string;
    icon: string;
    border: string;
    badgeBg: string;
    badgeIcon: string;
    badgeRing: string;
};

type WhatsappAvatarThemeMode = 'light' | 'dark';

type WhatsappAvatarThemeDefinition = WhatsappAvatarTheme & {
    darkBg: string;
    darkIcon: string;
};

const DEFAULT_BADGE_THEME: Pick<WhatsappAvatarTheme, 'badgeBg' | 'badgeIcon' | 'badgeRing'> = {
    badgeBg: '#f7f5f3',
    badgeIcon: '#667781',
    badgeRing: '#ffffff',
};

const DEFAULT_DARK_BADGE_THEME: Pick<WhatsappAvatarTheme, 'badgeBg' | 'badgeIcon' | 'badgeRing'> = {
    badgeBg: '#202c33',
    badgeIcon: '#aebac1',
    badgeRing: '#111b21',
};

const WHATSAPP_AVATAR_THEMES: WhatsappAvatarThemeDefinition[] = [
    // 1. Azul WhatsApp claro
    {
        bg: '#d2e8fe',
        icon: '#0063cb',
        darkBg: '#142740',
        darkIcon: '#649fd6',
        border: '#b8d4f0',
        ...DEFAULT_BADGE_THEME,
    },

    // 2. Coral / naranja suave
    {
        bg: '#fee2d8',
        icon: '#c4532d',
        darkBg: '#35221e',
        darkIcon: '#f39676',
        border: '#edc7ba',
        ...DEFAULT_BADGE_THEME,
    },

    // 3. Verde agua / teal
    {
        bg: '#cbf2ee',
        icon: '#028377',
        darkBg: '#062d2e',
        darkIcon: '#9cd3cf',
        border: '#afe0dc',
        ...DEFAULT_BADGE_THEME,
    },

    // 4. Rosado WhatsApp
    {
        bg: '#fad9e6',
        icon: '#db2867',
        darkBg: '#35182b',
        darkIcon: '#ee73a2',
        border: '#edbdc5',
        ...DEFAULT_BADGE_THEME,
    },

    // 6. Amarillo crema
    {
        bg: '#fff0d3',
        icon: '#9f6928',
        darkBg: '#362c20',
        darkIcon: '#fed37a',
        border: '#ead3a3',
        ...DEFAULT_BADGE_THEME,
    },

    // 7. Celeste WhatsApp
    {
        bg: '#caecfa',
        icon: '#027eb5',
        darkBg: '#072c3c',
        darkIcon: '#55bceb',
        border: '#acd9eb',
        ...DEFAULT_BADGE_THEME,
    },
    // 8. rosa 2
    {
        bg: '#fad8dc',
        icon: '#8c1536',
        darkBg: '#321622',
        darkIcon: '#f299a3',
        border: '#edc7ba',
        ...DEFAULT_BADGE_THEME,
    },

    // 5. Marrón / beige
    {
        bg: '#f4ded1',
        icon: '#855538',
        darkBg: '#37261c',
        darkIcon: '#dda888',
        border: '#dec2b2',
        ...DEFAULT_BADGE_THEME,
    },

    // 9. Verde claro
    {
        bg: '#d9fdd3',
        icon: '#1b8755',
        darkBg: '#123629',
        darkIcon: '#56b260',
        border: '#bcecad',
        ...DEFAULT_BADGE_THEME,
    },
    // 10. Morado suave
    {
        bg: '#e6def0',
        icon: '#4e4f9d',
        darkBg: '#242446',
        darkIcon: '#978ec4',
        border: '#d5cee0',
        ...DEFAULT_BADGE_THEME,
    },
];

function hashString(value: string): number {
    let hash = 2166136261;

    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
}

export function createWhatsappAvatarTheme(seedInput?: string, themeMode: WhatsappAvatarThemeMode = 'light'): WhatsappAvatarTheme {
    const normalizedSeed = (seedInput ?? 'contact').trim().toLowerCase() || 'contact';
    const seed = hashString(normalizedSeed);
    const themeIndex = seed % WHATSAPP_AVATAR_THEMES.length;
    const theme = WHATSAPP_AVATAR_THEMES[themeIndex];
    const isDark = themeMode === 'dark';

    return {
        bg: isDark ? theme.darkBg : theme.bg,
        icon: isDark ? theme.darkIcon : theme.icon,
        border: isDark ? 'transparent' : theme.border,
        ...(isDark ? DEFAULT_DARK_BADGE_THEME : DEFAULT_BADGE_THEME),
    };
}
