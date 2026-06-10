import type { WhatsappData } from './whatsappTypes';

type ContactIdentityDisplay = {
    headerTitle: string;
    profileTitle: string;
    profileSubtitle: string;
    showAddContactAction: boolean;
};

function toTitleCase(value: string): string {
    return value
        .split(' ')
        .filter(Boolean)
        .map((part) => (part ? `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}` : part))
        .join(' ');
}

function maybeRandomCase(value: string): string {
    if (!value) {
        return value;
    }

    return Math.random() < 0.5 ? toTitleCase(value) : value.toLowerCase();
}

function buildAliasFromName(name: string, includeFullName: boolean): string {
    const parts = name
        .trim()
        .split(/\s+/)
        .map((part) => part.trim())
        .filter(Boolean);

    if (parts.length === 0) {
        return '';
    }

    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    const firstNameWithInitial = parts.length > 1 ? `${firstName} ${lastName.charAt(0)}` : firstName;
    const firstNameAndLastName = parts.length > 1 ? `${firstName} ${lastName}` : firstName;

    const baseVariants = [firstName, lastName, firstNameWithInitial, firstNameAndLastName];
    const uniqueVariants = [...new Set(baseVariants.filter(Boolean))];

    if (includeFullName && parts.length > 1) {
        uniqueVariants.push(parts.join(' '));
    }

    const aliasBase = uniqueVariants[Math.floor(Math.random() * Math.max(uniqueVariants.length, 1))] ?? '';

    return maybeRandomCase(aliasBase);
}

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

export function buildContactIdentityDisplay(data: WhatsappData): ContactIdentityDisplay {
    const contactName = data.nombre?.trim() || 'Aracely MD';
    const phoneLabel = `+51 ${formatTelefonoPE(data.telefono)}`;
    const showsPhoneInsteadOfName = Math.random() < 0.5;

    if (!showsPhoneInsteadOfName) {
        return {
            headerTitle: contactName,
            profileTitle: contactName,
            profileSubtitle: phoneLabel,
            showAddContactAction: false,
        };
    }

    const aliasRoll = Math.random();
    let profileSubtitle = '~.';

    if (aliasRoll < 0.1) {
        profileSubtitle = '';
    } else if (aliasRoll < 0.65) {
        profileSubtitle = '~.';
    } else if (aliasRoll < 0.98) {
        const alias = buildAliasFromName(contactName, false);
        profileSubtitle = alias ? `~${alias}` : '~.';
    } else {
        const alias = buildAliasFromName(contactName, true);
        profileSubtitle = alias ? `~${alias}` : '~.';
    }

    return {
        headerTitle: phoneLabel,
        profileTitle: phoneLabel,
        profileSubtitle,
        showAddContactAction: true,
    };
}
