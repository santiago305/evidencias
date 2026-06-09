import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createWhatsappAvatarTheme as createMobileWhatsappAvatarTheme } from './mobile-1/whatsapp/avatarTheme.ts';
import { createWhatsappAvatarTheme as createDesktopWhatsappAvatarTheme } from './whatsapp-desktop/avatarTheme.ts';

const designsDir = dirname(fileURLToPath(import.meta.url));

const EXPECTED_DARK_AVATAR_THEMES = new Set([
    '#142740|#649fd6',
    '#35221e|#f39676',
    '#062d2e|#9cd3cf',
    '#35182b|#ee73a2',
    '#362c20|#fed37a',
    '#072c3c|#55bceb',
    '#321622|#f299a3',
    '#37261c|#dda888',
    '#123629|#56b260',
    '#242446|#978ec4',
]);

test('WhatsApp avatar dark mode uses its own palette and keeps timer badge dark colors', () => {
    for (const createWhatsappAvatarTheme of [createDesktopWhatsappAvatarTheme, createMobileWhatsappAvatarTheme]) {
        const lightTheme = createWhatsappAvatarTheme('51987654321', 'light');
        const darkTheme = createWhatsappAvatarTheme('51987654321', 'dark');
        const darkThemePairs = new Set<string>();

        assert.equal(darkTheme.border, 'transparent');

        assert.notEqual(darkTheme.badgeBg, lightTheme.badgeBg);
        assert.notEqual(darkTheme.badgeIcon, lightTheme.badgeIcon);
        assert.notEqual(darkTheme.badgeRing, lightTheme.badgeRing);

        for (let index = 0; darkThemePairs.size < EXPECTED_DARK_AVATAR_THEMES.size && index < 1000; index += 1) {
            const theme = createWhatsappAvatarTheme(`seed-${index}`, 'dark');

            darkThemePairs.add(`${theme.bg}|${theme.icon}`);
        }

        assert.deepEqual(darkThemePairs, EXPECTED_DARK_AVATAR_THEMES);
    }
});

test('WhatsApp avatar seeds use client identity and keep desktop/mobile color logic isolated', () => {
    const seedSources = [
        resolve(designsDir, 'whatsapp-desktop', 'whatsappAppearance.ts'),
        resolve(designsDir, 'mobile-1', 'whatsapp', 'whatsappAppearance.ts'),
    ];

    for (const sourcePath of seedSources) {
        const source = readFileSync(sourcePath, 'utf8');

        assert.match(source, /dniCliente/);
        assert.match(source, /seedCode/);
        assert.match(source, /conversationId/);
    }

    const desktopConversation = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'WhatsappConversation.tsx'), 'utf8');
    const mobileConversation = readFileSync(resolve(designsDir, 'mobile-1', 'whatsapp', 'WhatsappConversation.tsx'), 'utf8');

    assert.match(desktopConversation, /buildWhatsappClientQuoteTheme/);
    assert.match(mobileConversation, /buildMobileClientQuoteTheme/);
    assert.match(mobileConversation, /buildMobileAdvisorQuoteColors/);
});
