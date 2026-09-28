import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const designDirectory = dirname(fileURLToPath(import.meta.url));

function listSourceFiles(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const entryPath = join(directory, entry.name);

        if (entry.isDirectory()) {
            return listSourceFiles(entryPath);
        }

        return /\.(css|ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.test.ts') ? [entryPath] : [];
    });
}

test('mobile 13 contains its own previews, frame, and system chrome', () => {
    for (const file of [
        'Mobile13PreviewFrame.tsx',
        'Mobile13PreviewHeader.tsx',
        'Mobile13PreviewFooter.tsx',
        'Mobile13BatteryIcon.tsx',
        'Mobile13NotificationIcons.tsx',
        'mobile13.css',
        'whatsapp/PreviewMobile13Whatsapp.tsx',
        'sms/PreviewMobile13Sms.tsx',
        'calls/PreviewMobile13Call.tsx',
        'components/status-bar/Mobile13CellSignalIcon.tsx',
        'components/status-bar/Mobile13WifiIcon.tsx',
        'components/icon/wif.png',
        'components/navigation/Mobile13BackIcon.tsx',
        'components/navigation/Mobile13HomeIcon.tsx',
        'components/navigation/Mobile13RecentsIcon.tsx',
    ]) {
        assert.equal(existsSync(resolve(designDirectory, file)), true, `Missing ${file}`);
    }
});

test('mobile 13 uses Inter across its shared and WhatsApp typography', () => {
    const cssSource = readFileSync(resolve(designDirectory, 'mobile13.css'), 'utf8');
    const colorsSource = readFileSync(resolve(designDirectory, 'mobile13Colors.ts'), 'utf8');
    const whatsappSource = readFileSync(resolve(designDirectory, 'whatsapp/PreviewMobile13Whatsapp.tsx'), 'utf8');

    assert.match(cssSource, /family=Inter:ital,opsz,wght@0,14\.\.32,100\.\.900;1,14\.\.32,100\.\.900/);
    assert.match(cssSource, /font-family: Inter, sans-serif !important/);
    assert.match(colorsSource, /mobile13FontFamily = 'Inter, sans-serif'/);
    assert.doesNotMatch(whatsappSource, /Roboto|Google Sans Flex/);
    assert.match(whatsappSource, /font-family: Inter, sans-serif !important/);
});

test('mobile 13 whatsapp header matches the reference structure', () => {
    const headerSource = readFileSync(resolve(designDirectory, 'whatsapp/whatsapp-header/WhatsappMobileHeaderUser.tsx'), 'utf8');

    assert.match(headerSource, /data-mobile13-whatsapp-header="true"/);
    assert.match(headerSource, /data-mobile13-whatsapp-back="true"/);
    assert.match(headerSource, /en línea/);
    assert.match(headerSource, /data-mobile13-whatsapp-actions="true"/);
    assert.match(headerSource, /data-mobile13-whatsapp-video="true"/);
    assert.match(headerSource, /data-mobile13-whatsapp-call="true"/);
    assert.match(headerSource, /viewBox="0 0 28 40"/);
    assert.match(headerSource, /M21 4L6 20L21 36/);
    assert.match(headerSource, /viewBox="0 0 52 36"/);
    assert.match(headerSource, /M36 13L47 5\.5/);
    assert.match(headerSource, /viewBox="0 0 64 64"/);
    assert.match(headerSource, /M20 15/);
    assert.doesNotMatch(headerSource, /cam\.png|telefono\.png|videoIcon|phoneIcon/);
    assert.match(headerSource, /resolveWhatsappHeaderIdentity\(data\)/);
    assert.doesNotMatch(headerSource, /Aracely MD/);
    assert.doesNotMatch(headerSource, /Math\.random\(\)/);
    assert.doesNotMatch(headerSource, /Mobile13MoreVerticalIcon/);
    assert.doesNotMatch(headerSource, /from ['"].*mobile-(?:[1-9]|1[0-2])(?:\/|['"])/);
});

test('mobile 13 sms header uses the centered contact layout and whatsapp back arrow', () => {
    const headerSource = readFileSync(resolve(designDirectory, 'sms/sms-header/SmsMobileHeader.tsx'), 'utf8');
    const avatarSource = readFileSync(resolve(designDirectory, 'sms/sms-header/SmsHeaderAvatar.tsx'), 'utf8');
    const pillSource = readFileSync(resolve(designDirectory, 'sms/sms-header/SmsHeaderContactPill.tsx'), 'utf8');
    const identitySource = readFileSync(resolve(designDirectory, 'sms/sms-header/smsHeaderIdentity.ts'), 'utf8');

    assert.match(headerSource, /SmsHeaderAvatar/);
    assert.match(headerSource, /SmsHeaderContactPill/);
    assert.match(headerSource, /M21 4L6 20L21 36/);
    assert.match(headerSource, /viewBox="0 0 28 40"/);
    assert.match(headerSource, /relative flex h-\[40px\] w-\[40px\][\s\S]*rounded-full border px-\[9px\] transition/);
    assert.match(headerSource, /border-white\/\[0\.10\] bg-\[#2F3533\] text-\[#F1F4F3\]/);
    assert.match(headerSource, /border-black\/\[0\.10\] bg-\[#F7F6F0\] text-\[#111B21\]/);
    assert.match(headerSource, /bg-\[linear-gradient\(to_bottom,rgba\(255,255,255,0\.11\)/);
    assert.match(headerSource, /bg-\[linear-gradient\(to_top,rgba\(255,255,255,0\.11\)/);
    assert.match(headerSource, /className="relative z-\[1\] me-1 h-\[20px\] w-\[14px\] shrink-0"/);
    assert.doesNotMatch(headerSource, /Llamar|Videollamada|Opciones|showVideoCall/);
    assert.doesNotMatch(headerSource, /<circle cx="24" cy="16"|<ellipse cx="24" cy="35"/);
    assert.match(avatarSource, /WhatsappAvatarImage/);
    assert.match(avatarSource, /resolveValidWhatsappAvatarImageSrc|createWhatsappAvatarTheme/);
    assert.match(identitySource, /Array\.from\(displayName\)\[0\]/);
    assert.match(avatarSource, /data\.img_64/);
    assert.match(pillSource, /formatMobile13SmsPhone/);
    assert.match(pillSource, /chevron|Chevron|path/);
});

test('mobile 13 sms header keeps name and phone resolution rules local to sms', () => {
    const headerSource = readFileSync(resolve(designDirectory, 'sms/sms-header/SmsMobileHeader.tsx'), 'utf8');
    const avatarSource = readFileSync(resolve(designDirectory, 'sms/sms-header/SmsHeaderAvatar.tsx'), 'utf8');
    const pillSource = readFileSync(resolve(designDirectory, 'sms/sms-header/SmsHeaderContactPill.tsx'), 'utf8');
    const identitySource = readFileSync(resolve(designDirectory, 'sms/sms-header/smsHeaderIdentity.ts'), 'utf8');

    assert.match(avatarSource, /const displayName = data\.nombre\.trim\(\)/);
    assert.match(identitySource, /resolveContactHeaderIdentity/);
    assert.match(avatarSource, /img64=\{data\.img_64\}/);
    assert.match(pillSource, /getSmsHeaderDisplayValue\(data\.nombre, data\.telefono\)/);
    assert.match(headerSource, /getMobile13SmsHeaderColors/);
});

test('mobile 13 whatsapp reuses the light header background for the system footer', () => {
    const whatsappSource = readFileSync(resolve(designDirectory, 'whatsapp/PreviewMobile13Whatsapp.tsx'), 'utf8');
    const frameSource = readFileSync(resolve(designDirectory, 'Mobile13PreviewFrame.tsx'), 'utf8');

    assert.match(whatsappSource, /systemFooterBackground=\{themeMode === 'light' \? mobile13WhatsappLightBackground : undefined\}/);
    assert.match(frameSource, /systemFooterBackground\?: string/);
    assert.match(frameSource, /Mobile13PreviewFooter themeMode=\{themeMode\} systemFooterBackground=\{systemFooterBackground\}/);
});

test('mobile 13 dark system footer uses the reference background', () => {
    const footerSource = readFileSync(resolve(designDirectory, 'Mobile13PreviewFooter.tsx'), 'utf8');

    assert.match(footerSource, /isSmsVariant \? 'bg-\[#101417\]' : isDark \? 'bg-\[#101010\]' : 'bg-white'/);
});

test('mobile 13 status bar clock uses a 12-hour value without a period label', () => {
    const headerSource = readFileSync(resolve(designDirectory, 'Mobile13PreviewHeader.tsx'), 'utf8');

    assert.match(headerSource, /const hours12 = now\.getHours\(\) % 12 \|\| 12;/);
    assert.match(headerSource, /const minutes = String\(now\.getMinutes\(\)\)\.padStart\(2, '0'\);/);
    assert.match(headerSource, /setTime\(`\$\{hours12\}:\$\{minutes\}`\)/);
});

test('mobile 13 whatsapp avatar uses theme-specific concentric rings without clipping the temporal indicator', () => {
    const headerSource = readFileSync(resolve(designDirectory, 'whatsapp/whatsapp-header/WhatsappMobileHeaderUser.tsx'), 'utf8');
    const avatarSource =
        headerSource.match(/data-mobile13-whatsapp-avatar="true"[\s\S]*?data-mobile13-whatsapp-temporary-indicator="true"/)?.[0] ?? '';
    const avatarContainerSource =
        headerSource.match(/data-mobile13-whatsapp-avatar="true"[\s\S]*?data-mobile13-whatsapp-avatar-image="true"/)?.[0] ?? '';

    assert.match(headerSource, /data-mobile13-whatsapp-avatar="true"/);
    assert.match(headerSource, /const headerBackground = isDark \? '#0B1014' : '#F4F1EC';/);
    assert.match(headerSource, /const avatarRingColor = isDark \? '#505653' : '#C6C7C5';/);
    assert.match(headerSource, /border-\[1\.5px\]/);
    assert.match(headerSource, /absolute inset-0 box-border rounded-full border-\[1\.5px\]/);
    assert.match(headerSource, /absolute inset-\[4px\] overflow-hidden rounded-full/);
    assert.match(headerSource, /backgroundColor: headerBackground/);
    assert.match(headerSource, /data-mobile13-whatsapp-avatar-image="true"/);
    assert.match(avatarSource, /data-mobile13-whatsapp-avatar-image="true"/);
    assert.match(avatarSource, /data-mobile13-whatsapp-temporary-indicator="true"/);
    assert.doesNotMatch(avatarContainerSource, /overflow-hidden/);
});

test('mobile 13 whatsapp online status can move upward independently', () => {
    const headerSource = readFileSync(resolve(designDirectory, 'whatsapp/whatsapp-header/WhatsappMobileHeaderUser.tsx'), 'utf8');

    assert.match(headerSource, /data-mobile13-whatsapp-online="true"[\s\S]*?-translate-y-\[2px\]/);
});

test('mobile 13 whatsapp places the bubble tail on the last message in a group', () => {
    const conversationSource = readFileSync(resolve(designDirectory, 'whatsapp/WhatsappConversation.tsx'), 'utf8');
    const piecesSource = readFileSync(resolve(designDirectory, 'whatsapp/WhatsappPieces.tsx'), 'utf8');
    const bubbleSource = readFileSync(resolve(designDirectory, 'whatsapp/whatsapp-bubbles/WhatsappMobileTextBubble.tsx'), 'utf8');

    assert.match(conversationSource, /const isLastInGroup = !next \|\| markerAfterCurrent \|\| next\.side !== msg\.side/);
    assert.match(conversationSource, /lastInGroup=\{isLastInGroup\}/);
    assert.match(piecesSource, /lastInGroup/);
    assert.match(bubbleSource, /lastInGroup/);
    assert.match(bubbleSource, /rounded-br-none/);
    assert.match(bubbleSource, /rounded-bl-none/);
    assert.match(bubbleSource, /-bottom-\[/);
    assert.match(bubbleSource, /scale-y-\[-1\]/);
    assert.doesNotMatch(bubbleSource, /firstInGroup/);
});

test('mobile 13 whatsapp renders its contact profile card with shared identity and avatar data', () => {
    const cardPath = resolve(designDirectory, 'whatsapp/Mobile13ContactProfileCard.tsx');
    const cardSource = readFileSync(cardPath, 'utf8');
    const previewSource = readFileSync(resolve(designDirectory, 'whatsapp/PreviewMobile13Whatsapp.tsx'), 'utf8');
    const conversationSource = readFileSync(resolve(designDirectory, 'whatsapp/WhatsappConversation.tsx'), 'utf8');
    const avatarFallbackSource = cardSource.match(/<span aria-hidden="true" className="block h-full w-full rounded-full"[\s\S]*?<\/span>/)?.[0] ?? '';

    assert.equal(existsSync(cardPath), true, 'Missing the mobile 13 WhatsApp contact profile card');
    assert.match(cardSource, /WhatsappAvatarImage/);
    assert.match(cardSource, /img64=\{data\.img_64\}/);
    assert.match(cardSource, /profileTitle/);
    assert.match(cardSource, /profileSubtitle/);
    assert.match(cardSource, /data-mobile13-whatsapp-contact-card="true"/);
    assert.match(cardSource, /data-mobile13-whatsapp-contact-avatar="true"/);
    assert.match(avatarFallbackSource, /backgroundColor: avatarTheme\.bg/);
    assert.match(cardSource, /data-mobile13-whatsapp-contact-title="true"/);
    assert.match(cardSource, /data-mobile13-whatsapp-contact-subtitle="true"/);
    assert.match(cardSource, /data-mobile13-whatsapp-contact-actions="true"/);
    assert.match(cardSource, /data-mobile13-whatsapp-block="true"/);
    assert.match(cardSource, /data-mobile13-whatsapp-add="true"/);
    assert.match(cardSource, /viewBox="0 0 32 32"/);
    assert.match(cardSource, /cx="24\.5" cy="22\.5" r="6" fill="#FAFAFA"/);
    assert.match(cardSource, /M24\.5 19\.5V25\.5M21\.5 22\.5H27\.5/);
    assert.match(cardSource, /const iconForeground = isDark \? '#FAFAFA' : '#111B21';/);
    assert.match(cardSource, /const plusForeground = isDark \? '#3B3B3B' : '#e7e4df';/);
    assert.match(cardSource, /<AddContactIcon isDark=\{isDark\} \/>/);
    assert.match(cardSource, /#242625/);
    assert.match(cardSource, /#3B3B3B/);
    assert.match(cardSource, /aria-label="Bloquear"/);
    assert.match(cardSource, /aria-label="A.adir"/);
    assert.match(cardSource, /aria-hidden="true"/);
    assert.match(previewSource, /profileTitle=\{runtime\.contactIdentityDisplay\.profileTitle\}/);
    assert.match(previewSource, /profileSubtitle=\{runtime\.contactIdentityDisplay\.profileSubtitle\}/);
    assert.match(previewSource, /showAddContactAction=\{runtime\.contactIdentityDisplay\.showAddContactAction\}/);
    assert.match(conversationSource, /visualAdapter\.EncryptedMessage[\s\S]*?<Mobile13ContactProfileCard[\s\S]*?conversationMessages\.map/);
    assert.match(conversationSource, /<Mobile13ContactProfileCard[\s\S]*?data=\{data\}/);
    assert.doesNotMatch(conversationSource, /showAddContactAction\s*&&\s*<Mobile13ContactProfileCard/);
});

test('mobile 13 whatsapp message bubbles do not use a box shadow', () => {
    const bubbleSources = [
        readFileSync(resolve(designDirectory, 'whatsapp/whatsapp-bubbles/WhatsappMobileTextBubble.tsx'), 'utf8'),
        readFileSync(resolve(designDirectory, 'whatsapp/Mobile13EncryptedMessage.tsx'), 'utf8'),
        readFileSync(resolve(designDirectory, 'whatsapp/WhatsappPieces.tsx'), 'utf8'),
    ];

    for (const bubbleSource of bubbleSources) {
        assert.doesNotMatch(bubbleSource, /shadow-\[/);
        assert.doesNotMatch(bubbleSource, /shadow-(?:sm|md|lg|xl|2xl|inner|none)/);
    }
});

test('mobile 13 whatsapp header uses the organic reference icon geometry', () => {
    const headerSource = readFileSync(resolve(designDirectory, 'whatsapp/whatsapp-header/WhatsappMobileHeaderUser.tsx'), 'utf8');

    assert.match(headerSource, /d="M21 4L6 20L21 36"[\s\S]*?strokeWidth="4"[\s\S]*?strokeLinecap="round"[\s\S]*?strokeLinejoin="round"/);
    assert.match(headerSource, /d="M36 13L47 5\.5C48\.3 4\.6 50 5\.5 50 7\.1V28\.9C50 30\.5 48\.3 31\.4 47 30\.5L36 23"/);
    assert.match(headerSource, /d="M20 15 C18\.3 15\.2 16\.9 16\.3 16\.3 18[\s\S]*?L24\.8 15\.8 C23\.6 14\.5 21\.6 14\.2 20 15 Z"/);
    assert.match(headerSource, /strokeWidth="3\.2"/);
});

test('mobile 13 whatsapp composer has the compact reference controls in order', () => {
    const footerSource = readFileSync(resolve(designDirectory, 'whatsapp/whatsapp-footer/WhatsappMobileInputBar.tsx'), 'utf8');

    assert.match(
        footerSource,
        /data-mobile13-whatsapp-composer="true"[\s\S]*?aria-label="Agregar"[\s\S]*?data-mobile13-whatsapp-message-input="true"[\s\S]*?aria-label="Sticker"[\s\S]*?aria-label="Cámara"[\s\S]*?aria-label="Mensaje de voz"/,
    );
    assert.doesNotMatch(footerSource, /aria-label="Emojis"/);
    assert.doesNotMatch(footerSource, /aria-label="Adjuntar"/);
    assert.doesNotMatch(footerSource, /lucide-react|Paperclip/);

    const messageInputSource = footerSource.match(/<div\s+data-mobile13-whatsapp-message-input="true"[\s\S]*?<\/div>/)?.[0];

    assert.ok(messageInputSource, 'Missing the mobile 13 WhatsApp message input container');
    assert.match(messageInputSource, /aria-label="Sticker"/);
    assert.doesNotMatch(messageInputSource, /aria-label="Cámara"|aria-label="Mensaje de voz"/);
});

test('mobile 13 dark whatsapp composer uses the reference footer and input backgrounds', () => {
    const footerSource = readFileSync(resolve(designDirectory, 'whatsapp/whatsapp-footer/WhatsappMobileInputBar.tsx'), 'utf8');

    assert.match(footerSource, /isDark \? 'bg-\[#101010\]' : 'bg-\[#F4F1EC\]'/);
    assert.match(footerSource, /isDark \? 'border-white\/10 bg-\[#282828\] text-\[#E9EDEF\]' : 'border-black\/10 bg-white text-\[#111B21\]'/);
});

test('mobile 13 uses the compact two-arc wifi SVG in its status bar', () => {
    const wifiSource = readFileSync(resolve(designDirectory, 'components/status-bar/Mobile13WifiIcon.tsx'), 'utf8');
    const headerSource = readFileSync(resolve(designDirectory, 'Mobile13PreviewHeader.tsx'), 'utf8');

    assert.match(wifiSource, /viewBox="0 0 24 20"/);
    assert.ok((wifiSource.match(/<path/g) ?? []).length >= 3);
    assert.match(headerSource, /Mobile13WifiIcon className="h-\[18px\] w-\[20px\]"/);
    assert.match(headerSource, /Mobile13BatteryIcon[\s\S]*level=\{batteryLevel\}/);
    assert.doesNotMatch(headerSource, /Mobile13BatteryIcon[\s\S]*level=\{100\}/);
});

test('mobile 13 signal icon viewBox includes all four bars', () => {
    const signalSource = readFileSync(resolve(designDirectory, 'components/status-bar/Mobile13CellSignalIcon.tsx'), 'utf8');

    assert.match(signalSource, /viewBox="0 0 22 18"/);
});

test('mobile 13 percentage text has a local inset shadow filter', () => {
    const batterySource = readFileSync(resolve(designDirectory, 'Mobile13BatteryIcon.tsx'), 'utf8');

    assert.match(batterySource, /batteryTextInsetId/);
    assert.match(batterySource, /<feGaussianBlur/);
    assert.match(batterySource, /<feComposite/);
    assert.match(batterySource, /filter=\{`url\(#\$\{batteryTextInsetId\}\)`\}/);
});

test('mobile 13 battery terminal turns gray below full charge', () => {
    const batterySource = readFileSync(resolve(designDirectory, 'Mobile13BatteryIcon.tsx'), 'utf8');

    assert.match(batterySource, /fill=\{value === 100 \? batteryColor : resolvedEmptyColor\}/);
});

test('mobile 13 battery uses the reference text and empty colors', () => {
    const batterySource = readFileSync(resolve(designDirectory, 'Mobile13BatteryIcon.tsx'), 'utf8');
    const headerSource = readFileSync(resolve(designDirectory, 'Mobile13PreviewHeader.tsx'), 'utf8');

    assert.match(batterySource, /export const EMPTY_COLOR = '#888888';/);
    assert.match(batterySource, /const TEXT_COLOR = '#FEFEFE';/);
    assert.match(batterySource, /const textColor = themeMode === 'dark' \? '#000000' : TEXT_COLOR;/);
    assert.match(batterySource, /fill=\{textColor\}/);
    assert.match(headerSource, /backgroundColor=\{EMPTY_COLOR\}/);
});

test('mobile 13 does not import another mobile design', () => {
    for (const file of listSourceFiles(designDirectory)) {
        const source = readFileSync(file, 'utf8');

        for (const match of source.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
            assert.doesNotMatch(match[1], /mobile-(?:[1-9]|1[0-2])(?:\/|$)/, file);
        }
        assert.doesNotMatch(source, /Mobile8|mobile8|mobile-8|Mobile 8|mobile 8/, file);
    }
});

test('mobile 13 is registered for WhatsApp, SMS, calls, and device rendering', () => {
    const profilesSource = readFileSync(resolve(designDirectory, '..', 'mobilePreviewProfiles.tsx'), 'utf8');
    const typeSource = readFileSync(resolve(process.cwd(), 'resources/js/evidence-generator/types.ts'), 'utf8');
    const whatsappProfilesSource = readFileSync(resolve(designDirectory, '..', 'shared', 'whatsapp', 'whatsappProfiles.ts'), 'utf8');
    const catalogSource = readFileSync(resolve(process.cwd(), 'app/Support/MobileDesignCatalog.php'), 'utf8');
    const migrationsDirectory = resolve(process.cwd(), 'database/migrations');

    assert.match(
        profilesSource,
        /'mobile-13':\s*\{[\s\S]*?renderMobile13Frame[\s\S]*?PreviewMobile13Whatsapp[\s\S]*?PreviewMobile13Sms[\s\S]*?PreviewMobile13Call/,
    );
    assert.match(typeSource, /'mobile-13'/);
    assert.match(whatsappProfilesSource, /'mobile-13':\s*'standard'/);
    assert.match(catalogSource, /'key' => 'mobile-13'/);
    assert.ok(
        readdirSync(migrationsDirectory).some((file) => /^2026_09_21_\d{6}_add_mobile_13_to_mobile_designs_table\.php$/.test(file)),
        'Missing mobile 13 registration migration',
    );
});
