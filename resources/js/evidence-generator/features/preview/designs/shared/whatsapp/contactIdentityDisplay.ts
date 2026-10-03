import type { WhatsappData } from './whatsappTypes';
import { resolveContactHeaderIdentity, resolveContactPhoneDisplay } from '../../../../../lib/contactHeaderIdentity.ts';

export type ContactIdentityDisplay = {
    headerTitle: string;
    headerDisplaysPhone: boolean;
    profileTitle: string;
    profileSubtitle: string;
    showAddContactAction: boolean;
};

export function formatTelefonoPE(phone?: string): string {
    if (!phone) {
        return '-';
    }

    const clean = phone.replace(/\D/g, '');
    const nine = clean.startsWith('51') && clean.length === 11 ? clean.slice(2) : clean;

    if (nine.length !== 9) {
        return nine;
    }

    return `${nine.slice(0, 3)} ${nine.slice(3, 6)} ${nine.slice(6, 9)}`;
}

export function resolveWhatsappHeaderIdentity(data: WhatsappData) {
    const phone = data.telefono?.trim() ?? '';

    return {
        title: resolveContactPhoneDisplay(data, { formatPhone: (value) => `+51 ${formatTelefonoPE(value)}` }),
        hasName: false,
        displaysPhone: phone !== '',
    };
}

export function buildContactIdentityDisplay(data: WhatsappData): ContactIdentityDisplay {
    const headerIdentity = resolveWhatsappHeaderIdentity(data);
    const profileIdentity = resolveContactHeaderIdentity(data, {
        formatPhone: (phone) => `+51 ${formatTelefonoPE(phone)}`,
    });
    const phoneLabel = data.telefono?.trim() ? `+51 ${formatTelefonoPE(data.telefono)}` : '-';

    return {
        headerTitle: headerIdentity.title,
        headerDisplaysPhone: headerIdentity.displaysPhone,
        profileTitle: profileIdentity.title,
        profileSubtitle: profileIdentity.hasName ? phoneLabel : '',
        showAddContactAction: profileIdentity.displaysPhone,
    };
}
