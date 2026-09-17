import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { getSmsColors as getMobile3SmsColors } from '../shared/sms/smsAppearance.ts';
import { getMobile11SmsColors } from './sms/smsAppearance.ts';

const designDirectory = dirname(fileURLToPath(import.meta.url));

test('mobile 10 has local previews for every supported channel', () => {
    for (const file of [
        'Mobile11PreviewFrame.tsx',
        'Mobile11PreviewHeader.tsx',
        'Mobile11PreviewFooter.tsx',
        'whatsapp/PreviewMobile11Whatsapp.tsx',
        'sms/PreviewMobile11Sms.tsx',
        'calls/PreviewMobile11Call.tsx',
        'mobile11.css',
        'components/navigation/Mobile11HomeIcon.tsx',
        'components/status-bar/Mobile11WifiIcon.tsx',
        'whatsapp/WhatsappAvatarImage.tsx',
        'whatsapp/WhatsappAvatarImageSrc.ts',
    ]) {
        assert.equal(existsSync(resolve(designDirectory, file)), true, `Missing ${file}`);
    }
});

test('mobile 11 does not import components from another mobile', () => {
    const whatsappHeaderSource = readFileSync(resolve(designDirectory, 'whatsapp', 'whatsapp-header', 'WhatsappMobileHeaderUser.tsx'), 'utf8');

    assert.doesNotMatch(whatsappHeaderSource, /mobile-10|mobile-11/);
    assert.match(whatsappHeaderSource, /Mobile11MoreVerticalIcon/);
    assert.match(whatsappHeaderSource, /WhatsappAvatarImage/);
});

test('mobile 11 keeps the message line height on every rendered line', () => {
    const bubbleSource = readFileSync(resolve(designDirectory, 'whatsapp', 'whatsapp-bubbles', 'WhatsappMobileTextBubble.tsx'), 'utf8');
    const conversationSource = readFileSync(resolve(designDirectory, 'whatsapp', 'WhatsappConversation.tsx'), 'utf8');

    assert.match(bubbleSource, /data-testid="selectable-text"[\s\S]*leading-\[22\.5px\]/);
    assert.match(conversationSource, /<span key=\{key\} className="leading-\[22\.5px\]">/);
});

test('mobile 10 is registered independently', () => {
    const profilesSource = readFileSync(resolve(designDirectory, '..', 'mobilePreviewProfiles.tsx'), 'utf8');
    const typesSource = readFileSync(resolve(designDirectory, '../../../../types.ts'), 'utf8');
    const catalogSource = readFileSync(resolve(process.cwd(), 'app/Support/MobileDesignCatalog.php'), 'utf8');

    assert.match(profilesSource, /'mobile-11':\s*\{/);
    assert.match(profilesSource, /renderFrame: renderMobile11Frame/);
    assert.match(typesSource, /'mobile-11'/);
    assert.match(catalogSource, /'key' => 'mobile-11'/);
});

test('mobile 10 uses Google Sans Flex in its isolated styles', () => {
    const colorsSource = readFileSync(resolve(designDirectory, 'mobile11Colors.ts'), 'utf8');
    const cssSource = readFileSync(resolve(designDirectory, 'mobile11.css'), 'utf8');
    const whatsappSource = readFileSync(resolve(designDirectory, 'whatsapp', 'PreviewMobile11Whatsapp.tsx'), 'utf8');
    const smsSource = readFileSync(resolve(designDirectory, 'sms', 'PreviewMobile11Sms.tsx'), 'utf8');

    assert.match(colorsSource, /'Google Sans Flex', sans-serif/);
    assert.match(cssSource, /\.mobile11-font[\s\S]*font-family: 'Google Sans Flex', sans-serif !important/);
    assert.match(whatsappSource, /font-family: Roboto, sans-serif !important/);
    assert.match(smsSource, /fontFamily: mobile11FontFamily/);
    assert.doesNotMatch(cssSource, /Roboto|Rocoto/);
});

test('mobile 10 SMS uses the mobile 3 color palette', () => {
    assert.deepEqual(getMobile11SmsColors('light'), getMobile3SmsColors('light'));
    assert.deepEqual(getMobile11SmsColors('dark'), getMobile3SmsColors('dark'));
});

test('mobile 10 keeps Mobile 9 behavior and status bar geometry', () => {
    const headerSource = readFileSync(resolve(designDirectory, 'Mobile11PreviewHeader.tsx'), 'utf8');
    const batterySource = readFileSync(resolve(designDirectory, 'Mobile11BatteryIcon.tsx'), 'utf8');
    const signalSource = readFileSync(resolve(designDirectory, 'components', 'status-bar', 'Mobile11CellSignalIcon.tsx'), 'utf8');
    const whatsappSource = readFileSync(resolve(designDirectory, 'whatsapp', 'PreviewMobile11Whatsapp.tsx'), 'utf8');

    assert.match(headerSource, /setBatteryLevel\(\[100, 90, 80, 70, 60, 50, 40, 30, 20, 10\]/);
    assert.match(headerSource, /Mobile11CellSignalIcon/);
    assert.match(headerSource, /Mobile11BatteryIcon level=\{batteryLevel\}/);
    assert.match(batterySource, /getMobile11BatteryProgressWidth/);
    assert.match(signalSource, /senal-10\.png/);
    assert.match(signalSource, /senal-9-oscuro\.png/);
    assert.match(headerSource, /themeMode=\{themeMode\}/);
    assert.match(whatsappSource, /getWhatsappBehaviorProfile\('mobile-11'\)/);
});

test('mobile 10 SMS header includes camera between phone and menu with controlled spacing', () => {
    const previewSource = readFileSync(resolve(designDirectory, 'sms', 'PreviewMobile11Sms.tsx'), 'utf8');
    const headerSource = readFileSync(resolve(designDirectory, 'sms', 'sms-header', 'SmsMobileHeader.tsx'), 'utf8');
    const whatsappHeaderSource = readFileSync(resolve(designDirectory, 'whatsapp', 'whatsapp-header', 'WhatsappMobileHeaderUser.tsx'), 'utf8');

    assert.match(previewSource, /showVideoCall=\{true\}/);
    assert.match(headerSource, /className="flex items-center gap-\[5px\]"/);
    assert.match(headerSource, /label="Llamar"[\s\S]*aria-label="Videollamada"[\s\S]*aria-label="Opciones"/);
    assert.match(headerSource, /video-call-refreshed/);
    assert.match(headerSource, /viewBox="0 0 22 22" height="24" width="22"/);
    assert.match(headerSource, /M4 20C3\.45 20[\s\S]*L18 14\.5V18C18 18\.55[\s\S]*H4Z/);
    assert.doesNotMatch(headerSource, /H4ZM4 18H16V6H4V18Z/);
    assert.match(whatsappHeaderSource, /M4 20C3\.45 20[\s\S]*H4ZM4 18H16V6H4V18Z/);
});

test('mobile 11 SMS status bar uses white icons without changing WhatsApp', () => {
    const headerSource = readFileSync(resolve(designDirectory, 'Mobile11PreviewHeader.tsx'), 'utf8');
    const smsSource = readFileSync(resolve(designDirectory, 'sms', 'PreviewMobile11Sms.tsx'), 'utf8');
    const profilesSource = readFileSync(resolve(designDirectory, '..', 'mobilePreviewProfiles.tsx'), 'utf8');

    assert.match(smsSource, /headerVariant="sms"/);
    assert.match(headerSource, /variant === 'sms' \? '#FFFFFF'/);
    assert.match(profilesSource, /sms: \{ kind: 'custom', Preview: PreviewMobile11Sms \}/);
    assert.doesNotMatch(profilesSource, /'mobile-11'[\s\S]*sms: \{ variant: 'mobile-1'/);
});
