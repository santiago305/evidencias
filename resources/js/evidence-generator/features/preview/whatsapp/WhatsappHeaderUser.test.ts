import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('WhatsappHeaderUser keeps mobile and desktop header designs in whatsapp-header', () => {
    const source = readFileSync(new URL('./WhatsappHeaderUser.tsx', import.meta.url), 'utf8');
    const mobileSource = readFileSync(new URL('./whatsapp-header/WhatsappMobileHeaderUser.tsx', import.meta.url), 'utf8');
    const desktopSource = readFileSync(new URL('./whatsapp-header/WhatsappDesktopHeaderUser.tsx', import.meta.url), 'utf8');

    assert.match(source, /from '\.\/whatsapp-header\/WhatsappMobileHeaderUser'/);
    assert.match(source, /from '\.\/whatsapp-header\/WhatsappDesktopHeaderUser'/);
    assert.match(source, /compact \?\s*<WhatsappMobileHeaderUser \{\.\.\.headerProps\} \/>\s*:\s*<WhatsappDesktopHeaderUser \{\.\.\.headerProps\} \/>/);
    assert.doesNotMatch(source, /WhatsappHeaderUserTypes/);

    assert.match(mobileSource, /function WhatsappMobileHeaderUser/);
    assert.match(mobileSource, /px-1 py-2\.5/);
    assert.match(mobileSource, /flex min-w-0 flex-1 items-center gap-2/);
    assert.match(mobileSource, /ArrowLeft/);
    assert.match(mobileSource, /data-avatar-initial="true"/);
    assert.match(mobileSource, /h-\[25px\] w-\[25px\]/);
    assert.match(mobileSource, /height="25" width="25"/);
    assert.doesNotMatch(mobileSource, /WhatsappHeaderUserParts|useWhatsappHeaderUserModel|WhatsappHeaderUserTypes/);

    assert.match(desktopSource, /function WhatsappDesktopHeaderUser/);
    assert.match(desktopSource, /px-3 py-2/);
    assert.match(desktopSource, /flex min-w-0 items-center gap-2/);
    assert.match(desktopSource, /data-icon="search-refreshed"/);
    assert.match(desktopSource, /data-icon="default-contact-refreshed"/);
    assert.match(desktopSource, /h-5 w-5/);
    assert.match(desktopSource, /height="20" width="20"/);
    assert.doesNotMatch(desktopSource, /ArrowLeft|data-avatar-initial="true"|WhatsappHeaderUserParts|useWhatsappHeaderUserModel|WhatsappHeaderUserTypes/);

    assert.match(mobileSource, /const headerTitle = displayTitle \?\? \(data\.nombre\?\.trim\(\) \? data\.nombre : 'Aracely MD'\);/);
    assert.match(desktopSource, /const headerTitle = displayTitle \?\? \(data\.nombre\?\.trim\(\) \? data\.nombre : 'Aracely MD'\);/);
    assert.match(mobileSource, /createWhatsappAvatarTheme\(avatarSeed, themeMode\)/);
    assert.match(desktopSource, /createWhatsappAvatarTheme\(avatarSeed, themeMode\)/);
});
