import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createWhatsappAvatarTheme as createMobileWhatsappAvatarTheme } from './mobile-1/whatsapp/avatarTheme.ts';
import { createWhatsappAvatarTheme as createDesktopWhatsappAvatarTheme } from './whatsapp-desktop/avatarTheme.ts';

const designsDir = dirname(fileURLToPath(import.meta.url));

test('WhatsApp avatar dark mode keeps light user colors and only changes timer badge colors', () => {
    for (const createWhatsappAvatarTheme of [createDesktopWhatsappAvatarTheme, createMobileWhatsappAvatarTheme]) {
        const lightTheme = createWhatsappAvatarTheme('51987654321', 'light');
        const darkTheme = createWhatsappAvatarTheme('51987654321', 'dark');

        assert.equal(darkTheme.bg, lightTheme.bg);
        assert.equal(darkTheme.icon, lightTheme.icon);
        assert.equal(darkTheme.border, lightTheme.border);

        assert.notEqual(darkTheme.badgeBg, lightTheme.badgeBg);
        assert.notEqual(darkTheme.badgeIcon, lightTheme.badgeIcon);
        assert.notEqual(darkTheme.badgeRing, lightTheme.badgeRing);
    }
});

test('WhatsApp avatar seeds use client identity and generated conversation identifiers', () => {
    const seededSources = [
        resolve(designsDir, 'whatsapp-desktop', 'WhatsappConversation.tsx'),
        resolve(designsDir, 'whatsapp-desktop', 'WhatsappRightAside.tsx'),
        resolve(designsDir, 'whatsapp-desktop', 'whatsapp-header', 'WhatsappDesktopHeaderUser.tsx'),
        resolve(designsDir, 'mobile-1', 'whatsapp', 'WhatsappConversation.tsx'),
        resolve(designsDir, 'mobile-1', 'whatsapp', 'whatsapp-header', 'WhatsappMobileHeaderUser.tsx'),
    ];

    for (const sourcePath of seededSources) {
        const source = readFileSync(sourcePath, 'utf8');

        assert.match(source, /dniCliente/);
        assert.match(source, /seedCode/);
        assert.match(source, /conversationId/);
    }
});
