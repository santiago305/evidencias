import type { PreviewThemeMode } from '../../../../../types';
import { createWhatsappAvatarTheme } from './avatarTheme';
import type { WhatsappData } from './whatsappTypes';

function lightenHexColor(hexColor: string, ratio = 0.2): string {
    const normalized = hexColor.replace('#', '');

    if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
        return hexColor;
    }

    const channels = [0, 2, 4].map((start) => Number.parseInt(normalized.slice(start, start + 2), 16));
    const nextChannels = channels.map((channel) => Math.round(channel + (255 - channel) * ratio));

    return `#${nextChannels.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

export function buildWhatsappAvatarSeed(data: WhatsappData | null | undefined): string {
    const seed = [data?.telefono, data?.dniCliente, data?.nombre, data?.seedCode, data?.conversationId, data?.nombreAsesor]
        .map((value) => value?.trim())
        .filter((value) => value && value.length > 0)
        .join('|');

    return seed || 'contact';
}

export function buildMobileClientQuoteTheme(data: WhatsappData): { accentColor: string; authorColor: string } {
    const avatarTheme = createWhatsappAvatarTheme(buildWhatsappAvatarSeed(data));

    return {
        accentColor: avatarTheme.icon,
        authorColor: lightenHexColor(avatarTheme.icon),
    };
}

export function buildMobileAdvisorQuoteColors(quoteSide: 'in' | 'out', themeMode: PreviewThemeMode): { accentColor: string; authorColor: string } {
    if (themeMode === 'dark') {
        return quoteSide === 'out' ? { accentColor: '#22C262', authorColor: '#B9DECC' } : { accentColor: '#A08FF5', authorColor: '#D3DEF2' };
    }

    return quoteSide === 'out' ? { accentColor: '#1AAD5F', authorColor: '#439972' } : { accentColor: '#5E48D9', authorColor: '#1C2D34' };
}
