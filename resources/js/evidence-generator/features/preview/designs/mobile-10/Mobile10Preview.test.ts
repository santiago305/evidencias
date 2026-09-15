import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { getSmsColors as getMobile3SmsColors } from '../shared/sms/smsAppearance.ts';
import { getMobile10SmsColors } from './sms/smsAppearance.ts';

const designDirectory = dirname(fileURLToPath(import.meta.url));

test('mobile 10 has local previews for every supported channel', () => {
    for (const file of [
        'Mobile10PreviewFrame.tsx',
        'Mobile10PreviewHeader.tsx',
        'Mobile10PreviewFooter.tsx',
        'whatsapp/PreviewMobile10Whatsapp.tsx',
        'sms/PreviewMobile10Sms.tsx',
        'calls/PreviewMobile10Call.tsx',
        'mobile10.css',
    ]) {
        assert.equal(existsSync(resolve(designDirectory, file)), true, `Missing ${file}`);
    }
});

test('mobile 10 is registered independently', () => {
    const profilesSource = readFileSync(resolve(designDirectory, '..', 'mobilePreviewProfiles.tsx'), 'utf8');
    const typesSource = readFileSync(resolve(designDirectory, '../../../../types.ts'), 'utf8');
    const catalogSource = readFileSync(resolve(process.cwd(), 'app/Support/MobileDesignCatalog.php'), 'utf8');

    assert.match(profilesSource, /'mobile-10':\s*\{/);
    assert.match(profilesSource, /renderFrame: renderMobile10Frame/);
    assert.match(typesSource, /'mobile-10'/);
    assert.match(catalogSource, /'key' => 'mobile-10'/);
});

test('mobile 10 uses Google Sans Flex in its isolated styles', () => {
    const colorsSource = readFileSync(resolve(designDirectory, 'mobile10Colors.ts'), 'utf8');
    const cssSource = readFileSync(resolve(designDirectory, 'mobile10.css'), 'utf8');
    const whatsappSource = readFileSync(resolve(designDirectory, 'whatsapp', 'PreviewMobile10Whatsapp.tsx'), 'utf8');
    const smsSource = readFileSync(resolve(designDirectory, 'sms', 'PreviewMobile10Sms.tsx'), 'utf8');

    assert.match(colorsSource, /'Google Sans Flex', sans-serif/);
    assert.match(cssSource, /\.mobile10-font[\s\S]*font-family: 'Google Sans Flex', sans-serif !important/);
    assert.match(whatsappSource, /font-family: Roboto, sans-serif !important/);
    assert.match(smsSource, /fontFamily: mobile10FontFamily/);
    assert.doesNotMatch(cssSource, /Roboto|Rocoto/);
});

test('mobile 10 SMS uses the mobile 3 color palette', () => {
    assert.deepEqual(getMobile10SmsColors('light'), getMobile3SmsColors('light'));
    assert.deepEqual(getMobile10SmsColors('dark'), getMobile3SmsColors('dark'));
});

test('mobile 10 keeps Mobile 9 behavior and status bar geometry', () => {
    const headerSource = readFileSync(resolve(designDirectory, 'Mobile10PreviewHeader.tsx'), 'utf8');
    const batterySource = readFileSync(resolve(designDirectory, 'Mobile10BatteryIcon.tsx'), 'utf8');
    const signalSource = readFileSync(resolve(designDirectory, 'components', 'status-bar', 'Mobile10CellSignalIcon.tsx'), 'utf8');
    const whatsappSource = readFileSync(resolve(designDirectory, 'whatsapp', 'PreviewMobile10Whatsapp.tsx'), 'utf8');

    assert.match(headerSource, /setBatteryLevel\(\[100, 90, 80, 70, 60, 50, 40, 30, 20, 10\]/);
    assert.match(headerSource, /Mobile10CellSignalIcon/);
    assert.match(headerSource, /Mobile10BatteryIcon level=\{batteryLevel\}/);
    assert.match(batterySource, /getMobile10BatteryProgressWidth/);
    assert.match(signalSource, /senal-10\.png/);
    assert.match(signalSource, /senal-9-oscuro\.png/);
    assert.match(headerSource, /themeMode=\{themeMode\}/);
    assert.match(whatsappSource, /getWhatsappBehaviorProfile\('mobile-10'\)/);
});

test('mobile 10 SMS header includes camera between phone and menu with controlled spacing', () => {
    const previewSource = readFileSync(resolve(designDirectory, 'sms', 'PreviewMobile10Sms.tsx'), 'utf8');
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
