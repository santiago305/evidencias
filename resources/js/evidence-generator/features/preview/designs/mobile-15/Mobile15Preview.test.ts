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

test('mobile 15 SMS exposes the conversation top corners against the existing header color', () => {
    const preview = readFileSync(resolve(designDirectory, 'sms', 'PreviewMobile15Sms.tsx'), 'utf8');
    const conversation = readFileSync(resolve(designDirectory, 'sms', 'SmsConversation.tsx'), 'utf8');
    const appearance = readFileSync(resolve(designDirectory, 'sms', 'smsAppearance.ts'), 'utf8');

    assert.match(preview, /backgroundColor: colors\.header/);
    assert.match(conversation, /overflow-hidden rounded-t-\[28px\]/);
    assert.match(appearance, /shell: '#F1FCFF',[\s\S]*?header: '#E3F0F8',[\s\S]*?conversation: '#F1FCFF'/);
});

test('mobile 15 footer renders back, empty home circle, and horizontal recents in order', () => {
    const footer = readFileSync(resolve(designDirectory, 'Mobile15PreviewFooter.tsx'), 'utf8');
    const backPosition = footer.indexOf('data-android-navigation-icon="back"');
    const homePosition = footer.indexOf('data-android-navigation-icon="home"');
    const recentsPosition = footer.indexOf('data-android-navigation-icon="recents"');

    assert.ok(backPosition >= 0 && backPosition < homePosition && homePosition < recentsPosition);
    assert.match(footer, /d="M15\.8 6\.8L8\.2 12l7\.6 5\.2"[\s\S]*?fill="none"[\s\S]*?strokeLinecap="round"[\s\S]*?strokeLinejoin="round"/);
    assert.match(footer, /<circle\s+cx="12"\s+cy="12"\s+r="6\.2"\s+fill="none"\s+stroke="currentColor"/);
    assert.match(footer, /d="M5 7h14M5 12h14M5 17h14"/);
    assert.doesNotMatch(footer, /<polygon|<rect/);
    assert.match(footer, /systemFooterBackground/);
    assert.match(footer, /systemFooterForeground/);
});

test('mobile 15 SMS footer uses the conversation background color', () => {
    const frame = readFileSync(resolve(designDirectory, 'Mobile15PreviewFrame.tsx'), 'utf8');
    const smsPreview = readFileSync(resolve(designDirectory, 'sms', 'PreviewMobile15Sms.tsx'), 'utf8');

    assert.match(smsPreview, /systemFooterBackground=\{colors\.conversation\}/);
    assert.match(frame, /<Mobile15PreviewFooter\s+themeMode=\{themeMode\}\s+systemFooterBackground=\{systemFooterBackground\}/);
});

test('mobile 15 SMS status bar always uses the SMS header background color', () => {
    const smsPreview = readFileSync(resolve(designDirectory, 'sms', 'PreviewMobile15Sms.tsx'), 'utf8');

    assert.match(smsPreview, /statusBarBackground=\{colors\.header\}/);
});

test('mobile 15 dark SMS phone and composer icons match the status bar foreground', () => {
    const header = readFileSync(resolve(designDirectory, 'sms', 'sms-header', 'SmsMobileHeader.tsx'), 'utf8');
    const inputBar = readFileSync(resolve(designDirectory, 'sms', 'sms-footer', 'SmsMobileInputBar.tsx'), 'utf8');
    const appearance = readFileSync(resolve(designDirectory, 'sms', 'smsAppearance.ts'), 'utf8');

    assert.match(header, /darkPhoneTextClassName = 'text-\[#C7C5D0\]'/);
    assert.match(header, /truncate text-\[18px\] leading-none tracking-\[-0\.2px\] \$\{phoneTextClassName\}/);
    assert.match(inputBar, /style=\{\{ color: colors\.headerIcon \}\}/);
    assert.match(appearance, /headerIcon: '#C7C5D0'/);
    assert.match(appearance, /headerActionIcon: '#C7C5D0'/);
});

test('mobile 15 dark client bubbles use the reference foreground while advisor bubbles keep their palette', () => {
    const bubble = readFileSync(resolve(designDirectory, 'sms', 'sms-bubbles', 'SmsMobileTextBubble.tsx'), 'utf8');
    const appearance = readFileSync(resolve(designDirectory, 'sms', 'smsAppearance.ts'), 'utf8');

    assert.match(appearance, /receivedBubble: '#201F24',[\s\S]*?receivedText: '#C7C5D0',[\s\S]*?sentBubble: '#A9B5FF'/);
    assert.match(bubble, /const backgroundColor = isOutgoing \? colors\.sentBubble : colors\.receivedBubble/);
    assert.match(bubble, /const textColor = isOutgoing \? colors\.sentText : colors\.receivedText \?\? colors\.primaryText/);
});

test('mobile 15 SMS header accepts separate phone text classes for light and dark themes', () => {
    const header = readFileSync(resolve(designDirectory, 'sms', 'sms-header', 'SmsMobileHeader.tsx'), 'utf8');

    assert.match(header, /lightPhoneTextClassName\?: string/);
    assert.match(header, /darkPhoneTextClassName\?: string/);
    assert.match(header, /lightPhoneTextClassName = 'text-black'/);
    assert.match(header, /darkPhoneTextClassName = 'text-\[#C7C5D0\]'/);
    assert.match(header, /themeMode === 'dark' \? darkPhoneTextClassName : lightPhoneTextClassName/);
    assert.match(header, /truncate text-\[18px\] leading-none tracking-\[-0\.2px\] \$\{phoneTextClassName\}/);
});

test('mobile 15 dark SMS status bar uses the requested foreground color', () => {
    const frame = readFileSync(resolve(designDirectory, 'Mobile15PreviewFrame.tsx'), 'utf8');
    const smsPreview = readFileSync(resolve(designDirectory, 'sms', 'PreviewMobile15Sms.tsx'), 'utf8');

    assert.match(smsPreview, /statusBarForeground=\{themeMode === 'dark' \? '#C7C5D0' : undefined\}/);
    assert.match(frame, /<Mobile15PreviewHeader[\s\S]*?statusBarForeground=\{statusBarForeground\}/);
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
