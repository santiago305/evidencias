import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { getMobile14SmsColors } from './sms/smsAppearance.ts';

const designDirectory = dirname(fileURLToPath(import.meta.url));

test('mobile 14 registers independent local previews for each channel and its frame', () => {
    for (const file of [
        'Mobile14PreviewFrame.tsx',
        'Mobile14PreviewHeader.tsx',
        'Mobile14PreviewFooter.tsx',
        'whatsapp/PreviewMobile14Whatsapp.tsx',
        'sms/PreviewMobile14Sms.tsx',
        'calls/PreviewMobile14Call.tsx',
        'mobile14.css',
    ]) {
        assert.equal(existsSync(resolve(designDirectory, file)), true, `Missing ${file}`);
    }

    const profiles = readFileSync(resolve(designDirectory, '..', 'mobilePreviewProfiles.tsx'), 'utf8');
    const types = readFileSync(resolve(designDirectory, '../../../../types.ts'), 'utf8');
    const catalog = readFileSync(resolve(process.cwd(), 'app/Support/MobileDesignCatalog.php'), 'utf8');

    assert.match(profiles, /'mobile-14':\s*\{[\s\S]*?renderFrame: renderMobile14Frame/);
    assert.match(types, /'mobile-14'/);
    assert.match(catalog, /'key' => 'mobile-14'/);
});

test('mobile 14 does not refer to another mobile implementation', () => {
    const inspectDirectory = (directory: string): void => {
        for (const entry of readdirSync(directory, { withFileTypes: true })) {
            const path = resolve(directory, entry.name);

            if (entry.isDirectory()) {
                inspectDirectory(path);
            } else if (/\.(tsx?|css)$/.test(entry.name) && !entry.name.endsWith('.test.ts')) {
                const source = readFileSync(path, 'utf8');

                assert.doesNotMatch(source, /Mobile9|mobile9|mobile-9/, path);
                assert.doesNotMatch(source, /from ['"][^'"]*mobile-(?!14\b)\d+/, path);
            }
        }
    };

    inspectDirectory(designDirectory);
});

test('mobile 14 status bar uses the supplied local VoLTE and signal SVGs', () => {
    const statusBar = readFileSync(resolve(designDirectory, 'Mobile14PreviewHeader.tsx'), 'utf8');
    const signal = readFileSync(resolve(designDirectory, 'components/status-bar/Mobile14Signal45GIcon.tsx'), 'utf8');
    const volte = readFileSync(resolve(designDirectory, 'components/status-bar/Mobile14VolteIcon.tsx'), 'utf8');

    assert.match(statusBar, /<Signal45GIcon className="ml-\[2px\] h-\[15px\] w-\[33px\]" \/>/);
    assert.match(statusBar, /<Mobile14VolteIcon \/>/);
    assert.match(signal, /viewBox="0 0 46 24"/);
    assert.match(signal, /fontSize="9\.5"/);
    assert.match(signal, />\s*4\.5G\s*</);
    assert.match(signal, /opacity="0\.25"/);
    assert.match(signal, /fill="currentColor"/);
    assert.match(volte, /text-\[8\.75px\] leading-\[0\.9375\] font-bold tracking-\[-0\.04em\]/);
    assert.match(volte, />\s*Vo\s*<br\s*\/>\s*LTE\s*</);
    assert.doesNotMatch(volte, /from ['"][^'"]*mobile-1/);
    assert.doesNotMatch(statusBar, /Mobile14CellSignalIcon|senal-14\.png/);
});

test('mobile 14 SMS composer keeps mobile 1 layout with local colors', () => {
    const composer = readFileSync(resolve(designDirectory, 'sms/sms-footer/SmsMobileInputBar.tsx'), 'utf8');

    assert.match(composer, /flex min-h-\[54px\] flex-1 items-center rounded-\[29px\]/);
    assert.match(composer, /ml-0\.5 flex size-9/);
    assert.match(composer, /className="size-\[30px\]"/);
    assert.match(composer, /colors\.audioBackground/);
    assert.match(composer, /colors\.audioIcon/);
    assert.doesNotMatch(composer, /mobile-6|w-50/);
});

test('mobile 14 SMS uses the specified light and dark palettes', () => {
    const mainColorKeys = [
        'shell',
        'header',
        'conversation',
        'receivedBubble',
        'sentBubble',
        'sentText',
        'primaryText',
        'secondaryText',
        'headerIcon',
        'headerActionIcon',
        'composer',
        'audioBackground',
        'audioIcon',
    ] as const;
    const lightColors = getMobile14SmsColors('light');
    const darkColors = getMobile14SmsColors('dark');

    assert.deepEqual(
        Object.fromEntries(mainColorKeys.map((key) => [key, lightColors[key]])),
        {
            shell: '#F1ECF0',
            header: '#F1ECF0',
            conversation: '#FEF7FE',
            receivedBubble: '#F1ECF0',
            sentBubble: '#724E96',
            sentText: '#FFFFFF',
            primaryText: '#42474D',
            secondaryText: '#42474D',
            headerIcon: '#42474D',
            headerActionIcon: '#42474D',
            composer: '#F1ECF0',
            audioBackground: '#FFD9DC',
            audioIcon: '#37000D',
        },
    );
    assert.deepEqual(
        Object.fromEntries(mainColorKeys.map((key) => [key, darkColors[key]])),
        {
            shell: '#231E24',
            header: '#231E24',
            conversation: '#110F12',
            receivedBubble: '#231E24',
            sentBubble: '#5A367C',
            sentText: '#FFFFFF',
            primaryText: '#EDE9EF',
            secondaryText: '#D0CAD2',
            headerIcon: '#D0CAD2',
            headerActionIcon: '#D0CAD2',
            composer: '#231E24',
            audioBackground: '#792D3A',
            audioIcon: '#FFD9DD',
        },
    );
});
