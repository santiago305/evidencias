import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const designDirectory = dirname(fileURLToPath(import.meta.url));

test('mobile 9 has local previews for every supported channel', () => {
    for (const file of [
        'Mobile9PreviewFrame.tsx',
        'Mobile9PreviewHeader.tsx',
        'Mobile9PreviewFooter.tsx',
        'whatsapp/PreviewMobile9Whatsapp.tsx',
        'sms/PreviewMobile9Sms.tsx',
        'calls/PreviewMobile9Call.tsx',
        'mobile9.css',
    ]) {
        assert.equal(existsSync(resolve(designDirectory, file)), true, `Missing ${file}`);
    }
});

test('mobile 9 is registered independently', () => {
    const profilesSource = readFileSync(resolve(designDirectory, '..', 'mobilePreviewProfiles.tsx'), 'utf8');
    const typesSource = readFileSync(resolve(designDirectory, '../../../../types.ts'), 'utf8');
    const catalogSource = readFileSync(resolve(process.cwd(), 'app/Support/MobileDesignCatalog.php'), 'utf8');

    assert.match(profilesSource, /'mobile-9':\s*\{/);
    assert.match(profilesSource, /renderFrame: renderMobile9Frame/);
    assert.match(typesSource, /'mobile-9'/);
    assert.match(catalogSource, /'key' => 'mobile-9'/);
});

test('mobile 9 uses Google Sans Flex in its isolated styles', () => {
    const colorsSource = readFileSync(resolve(designDirectory, 'mobile9Colors.ts'), 'utf8');
    const cssSource = readFileSync(resolve(designDirectory, 'mobile9.css'), 'utf8');
    const whatsappSource = readFileSync(resolve(designDirectory, 'whatsapp', 'PreviewMobile9Whatsapp.tsx'), 'utf8');
    const smsSource = readFileSync(resolve(designDirectory, 'sms', 'PreviewMobile9Sms.tsx'), 'utf8');

    assert.match(colorsSource, /'Google Sans Flex', sans-serif/);
    assert.match(cssSource, /\.mobile9-font[\s\S]*font-family: 'Google Sans Flex', sans-serif !important/);
    assert.match(whatsappSource, /font-family: Roboto, sans-serif !important/);
    assert.match(smsSource, /fontFamily: mobile9FontFamily/);
    assert.doesNotMatch(cssSource, /Roboto|Rocoto/);
});

test('mobile 9 keeps Mobile 7 behavior and status bar geometry', () => {
    const headerSource = readFileSync(resolve(designDirectory, 'Mobile9PreviewHeader.tsx'), 'utf8');
    const batterySource = readFileSync(resolve(designDirectory, 'Mobile9BatteryIcon.tsx'), 'utf8');
    const signalSource = readFileSync(resolve(designDirectory, 'components', 'status-bar', 'Mobile9CellSignalIcon.tsx'), 'utf8');
    const whatsappSource = readFileSync(resolve(designDirectory, 'whatsapp', 'PreviewMobile9Whatsapp.tsx'), 'utf8');

    assert.match(headerSource, /setBatteryLevel\(\[100, 90, 80, 70, 60, 50, 40, 30, 20, 10\]/);
    assert.match(headerSource, /Mobile9CellSignalIcon/);
    assert.match(headerSource, /Mobile9WifiIcon/);
    assert.match(headerSource, /Mobile9BatteryIcon level=\{batteryLevel\}/);
    assert.match(batterySource, /getMobile9BatteryProgressWidth/);
    assert.match(signalSource, /senal-9\.png/);
    assert.match(signalSource, /senal-9-oscuro\.png/);
    assert.match(headerSource, /themeMode=\{themeMode\}/);
    assert.match(whatsappSource, /getWhatsappBehaviorProfile\('mobile-9'\)/);
});

test('mobile 9 SMS header includes camera between phone and menu with controlled spacing', () => {
    const previewSource = readFileSync(resolve(designDirectory, 'sms', 'PreviewMobile9Sms.tsx'), 'utf8');
    const headerSource = readFileSync(resolve(designDirectory, 'sms', 'sms-header', 'SmsMobileHeader.tsx'), 'utf8');
    const whatsappHeaderSource = readFileSync(resolve(designDirectory, 'whatsapp', 'whatsapp-header', 'WhatsappMobileHeaderUser.tsx'), 'utf8');

    assert.match(previewSource, /showVideoCall=\{true\}/);
    assert.match(headerSource, /className="flex items-center gap-\[5px\]"/);
    assert.match(headerSource, /label="Llamar"[\s\S]*aria-label="Videollamada"[\s\S]*aria-label="Opciones"/);
    assert.match(headerSource, /video-call-refreshed/);
    assert.match(headerSource, /viewBox="0 0 22 22" height="26" width="23"/);
    assert.match(headerSource, /M4 20C3\.45 20[\s\S]*L18 14\.5V18C18 18\.55[\s\S]*H4Z/);
    assert.doesNotMatch(headerSource, /H4ZM4 18H16V6H4V18Z/);
    assert.match(whatsappHeaderSource, /M4 20C3\.45 20[\s\S]*H4ZM4 18H16V6H4V18Z/);
});
