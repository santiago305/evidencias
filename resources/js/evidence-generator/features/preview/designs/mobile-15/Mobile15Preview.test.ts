import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const designDirectory = dirname(fileURLToPath(import.meta.url));

function readProductionSources(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = resolve(directory, entry.name);

        if (entry.isDirectory()) {
            return readProductionSources(path);
        }

        return /\.(css|ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.test.ts')
            ? [readFileSync(path, 'utf8')]
            : [];
    });
}

function readStatusBarSources(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = resolve(directory, entry.name);

        if (entry.isDirectory()) {
            return readStatusBarSources(path);
        }

        return /\.(ts|tsx)$/.test(entry.name) ? [readFileSync(path, 'utf8')] : [];
    });
}

test('mobile 15 owns local previews for WhatsApp, SMS, calls and its status bar', () => {
    for (const file of [
        'Mobile15PreviewFrame.tsx',
        'Mobile15PreviewHeader.tsx',
        'Mobile15BatteryIcon.tsx',
        'Mobile15NotificationIcons.tsx',
        'whatsapp/PreviewMobile15Whatsapp.tsx',
        'sms/PreviewMobile15Sms.tsx',
        'calls/PreviewMobile15Call.tsx',
    ]) {
        assert.equal(existsSync(resolve(designDirectory, file)), true, `Missing ${file}`);
    }
});

test('mobile 15 renders local status bar icons in the requested order', () => {
    const header = readFileSync(resolve(designDirectory, 'Mobile15PreviewHeader.tsx'), 'utf8');
    const statusBarSources = [
        header,
        readFileSync(resolve(designDirectory, 'Mobile15BatteryIcon.tsx'), 'utf8'),
        readFileSync(resolve(designDirectory, 'Mobile15NotificationIcons.tsx'), 'utf8'),
        ...[
            'components/status-bar/Mobile15AlarmIcon.tsx',
            'components/status-bar/Mobile15WifiIcon.tsx',
            'components/status-bar/Mobile15VolteIcon.tsx',
            'components/status-bar/Mobile15CellSignalIcon.tsx',
        ].map((file) => readFileSync(resolve(designDirectory, file), 'utf8')),
    ];
    const combinedSource = [
        ...statusBarSources,
        ...readStatusBarSources(resolve(designDirectory, 'components/status-bar')),
    ].join('\n');
    const wifiPosition = header.indexOf('<Mobile15WifiIcon');
    const voltePosition = header.indexOf('<Mobile15VolteIcon');
    const signalPosition = header.indexOf('<Mobile15CellSignalIcon');
    const batteryPosition = header.indexOf('<Mobile15BatteryIcon');

    assert.ok(voltePosition >= 0 && voltePosition < wifiPosition);
    assert.ok(wifiPosition < signalPosition && signalPosition < batteryPosition);
    assert.match(header, /<Mobile15VolteIcon\s*\/>\s*<Mobile15WifiIcon className="-ml-\[2px\] h-\[17\.5px\] w-\[16\.5px\]"/);
    assert.match(header, /<Mobile15CellSignalIcon className="h-\[13px\] w-\[17px\]"\s*\/>/);
    const signalIcon = readFileSync(resolve(designDirectory, 'components/status-bar/Mobile15CellSignalIcon.tsx'), 'utf8');
    assert.match(signalIcon, /viewBox="0 0 20 18"/);
    assert.equal((signalIcon.match(/<rect\b/g) ?? []).length, 4);
    assert.equal((signalIcon.match(/fill="currentColor"/g) ?? []).length, 4);
    assert.match(header, /<Mobile15NotificationIcons/);
    assert.match(combinedSource, /Vo/);
    assert.match(combinedSource, /LTE/);
    assert.doesNotMatch(combinedSource, /from ['"](?:lucide-react|@mdi\/|@\/components\/icons)/);
    assert.equal((readFileSync(resolve(designDirectory, 'Mobile15NotificationIcons.tsx'), 'utf8').match(/id: '/g) ?? []).length, 18);
});

test('mobile 15 wifi icon exposes independent horizontal and vertical offsets for every shape', () => {
    const wifiIcon = readFileSync(resolve(designDirectory, 'components/status-bar/Mobile15WifiIcon.tsx'), 'utf8');
    const movableShapes = ['UpperArc', 'MiddleArc', 'LowerArc', 'UploadArrow', 'DownloadArrow', 'Triangle'];

    for (const shape of movableShapes) {
        assert.match(wifiIcon, new RegExp(`const ${shape}X = -?\\d+(?:\\.\\d+)?;`));
        assert.match(wifiIcon, new RegExp(`const ${shape}Y = -?\\d+(?:\\.\\d+)?;`));
    }

    assert.equal((wifiIcon.match(/transform=\{/g) ?? []).length, movableShapes.length);
});

test('mobile 15 uses the same Google Sans Flex typography as mobile 10', () => {
    const colors = readFileSync(resolve(designDirectory, 'mobile15Colors.ts'), 'utf8');
    const styles = readFileSync(resolve(designDirectory, 'mobile15.css'), 'utf8');
    const mobile10Styles = readFileSync(resolve(designDirectory, '../mobile-10/mobile10.css'), 'utf8');
    const volteIcon = readFileSync(resolve(designDirectory, 'components/status-bar/Mobile15VolteIcon.tsx'), 'utf8');

    assert.match(colors, /mobile15FontFamily = "'Google Sans Flex', sans-serif"/);
    assert.match(styles, /@import url\('https:\/\/fonts\.googleapis\.com\/css2\?family=Google\+Sans\+Flex/);
    assert.match(styles, /font-family: 'Google Sans Flex', sans-serif !important/);
    assert.match(mobile10Styles, /font-family: 'Google Sans Flex', sans-serif !important/);
    assert.doesNotMatch(styles, /Mobile15Chococooky|mobile15-volte-font/);
    assert.doesNotMatch(volteIcon, /Mobile15Chococooky|mobile15-volte-font/);
});

test('mobile 15 is registered with a local frame and all three custom channels', () => {
    const profiles = readFileSync(resolve(designDirectory, '..', 'mobilePreviewProfiles.tsx'), 'utf8');
    const types = readFileSync(resolve(designDirectory, '../../../../types.ts'), 'utf8');
    const catalog = readFileSync(resolve(designDirectory, '../../../../../../../app/Support/MobileDesignCatalog.php'), 'utf8');
    const frameRenderers = readFileSync(resolve(designDirectory, '../shared/mobile-preview/frameRenderers.tsx'), 'utf8');

    assert.match(profiles, /'mobile-15':\s*\{[\s\S]*?renderFrame: renderMobile15Frame/);
    assert.match(profiles, /PreviewMobile15Whatsapp/);
    assert.match(profiles, /PreviewMobile15Sms/);
    assert.match(profiles, /PreviewMobile15Call/);
    assert.match(types, /'mobile-15'/);
    assert.match(catalog, /'key' => 'mobile-15'/);
    assert.match(frameRenderers, /export function renderMobile15Frame/);
});

test('mobile 15 header and frame do not import another mobile design', () => {
    const forbiddenMobileImport = /from\s+['"][^'"]*mobile-(?:[1-9]|1[0-4])(?:\/|['"])/;
    const sourceFiles = readProductionSources(designDirectory);

    for (const source of sourceFiles) {
        assert.doesNotMatch(source, forbiddenMobileImport);
        assert.doesNotMatch(source, /Mobile8|mobile8|mobile-8|Mobile 8|MOBILE8/);
    }
});
