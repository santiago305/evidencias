import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { getSmsColors } from '../shared/sms/smsAppearance.ts';

const designDirectory = dirname(fileURLToPath(import.meta.url));

function readDesignSources(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = resolve(directory, entry.name);

        return entry.isDirectory() ? readDesignSources(path) : /\.(css|ts|tsx)$/.test(entry.name) ? [readFileSync(path, 'utf8')] : [];
    });
}

test('mobile 12 has local previews for every supported channel', () => {
    for (const file of [
        'Mobile12PreviewFrame.tsx',
        'Mobile12PreviewHeader.tsx',
        'Mobile12PreviewFooter.tsx',
        'whatsapp/PreviewMobile12Whatsapp.tsx',
        'sms/PreviewMobile12Sms.tsx',
        'calls/PreviewMobile12Call.tsx',
        'mobile12.css',
    ]) {
        assert.equal(existsSync(resolve(designDirectory, file)), true, `Missing ${file}`);
    }
});

test('mobile 12 does not import components from another mobile', () => {
    const forbiddenImport = /from\s+['"][^'"]*mobile-(?:[1-9]|10|11)(?:\/|['"])/;

    for (const source of readDesignSources(designDirectory)) {
        assert.doesNotMatch(source, forbiddenImport);
    }
});

test('mobile 12 applies Chococooky to the complete preview frame', () => {
    const frameSource = readFileSync(resolve(designDirectory, 'Mobile12PreviewFrame.tsx'), 'utf8');
    const cssSource = readFileSync(resolve(designDirectory, 'mobile12.css'), 'utf8');

    assert.match(frameSource, /id="CAPTURA"[\s\S]*mobile12-font/);
    assert.match(cssSource, /\.mobile12-font,\s*\.mobile12-font \*[\s\S]*font-family: 'Mobile12Chococooky' !important/);
    assert.match(cssSource, /url\('\/fonts\/Chococooky\.ttf'\)/);
});

test('mobile 12 is registered with local previews and shared behavior', () => {
    const profilesSource = readFileSync(resolve(designDirectory, '..', 'mobilePreviewProfiles.tsx'), 'utf8');
    const typesSource = readFileSync(resolve(designDirectory, '../../../../types.ts'), 'utf8');
    const whatsappProfilesSource = readFileSync(resolve(designDirectory, '../shared/whatsapp/whatsappProfiles.ts'), 'utf8');

    assert.match(profilesSource, /'mobile-12':\s*\{/);
    assert.match(profilesSource, /renderFrame:\s*renderMobile12Frame/);
    assert.match(profilesSource, /PreviewMobile12Whatsapp/);
    assert.match(profilesSource, /PreviewMobile12Sms/);
    assert.match(profilesSource, /PreviewMobile12Call/);
    assert.match(typesSource, /'mobile-12'/);
    assert.match(whatsappProfilesSource, /'mobile-12':\s*'standard'/);
});

test('mobile 12 SMS status bar sets a theme-appropriate notification foreground', () => {
    const smsPreviewSource = readFileSync(resolve(designDirectory, 'sms', 'PreviewMobile12Sms.tsx'), 'utf8');

    assert.match(smsPreviewSource, /systemHeaderForeground=\{themeMode === 'dark' \? '#FFFFFF' : '#5F6368'\}/);
});

test('mobile 12 SMS message times sit beside the bottom edge of each bubble', () => {
    const bubbleSource = readFileSync(resolve(designDirectory, 'sms', 'sms-bubbles', 'SmsMobileTextBubble.tsx'), 'utf8');
    const metadataSource = readFileSync(resolve(designDirectory, 'sms', 'sms-bubbles', 'SmsMessageMetadata.tsx'), 'utf8');

    assert.match(bubbleSource, /'flex items-end gap-\[5px\] px-\[5px\]'/);
    assert.match(bubbleSource, /isMetadataVisible && isOutgoing \? \([\s\S]*?<SmsMessageMetadata[\s\S]*?isMetadataVisible && !isOutgoing/);
    assert.match(metadataSource, /shrink-0/);
    assert.doesNotMatch(metadataSource, /mt-\[/);
});

test('mobile 12 keeps mobile 3 colors and mobile 10 WhatsApp header icon geometry', async () => {
    assert.equal(existsSync(resolve(designDirectory, 'sms', 'smsAppearance.ts')), true, 'Missing sms/smsAppearance.ts');

    const { getMobile12SmsColors } = await import('./sms/smsAppearance.ts');

    assert.deepEqual(getMobile12SmsColors('light'), getSmsColors('light', 'mobile-3'));
    assert.deepEqual(getMobile12SmsColors('dark'), getSmsColors('dark', 'mobile-3'));

    const headerSource = readFileSync(resolve(designDirectory, 'whatsapp', 'whatsapp-header', 'WhatsappMobileHeaderUser.tsx'), 'utf8');

    assert.match(headerSource, /Mobile12MoreVerticalIcon/);
    assert.match(headerSource, /viewBox="0 -4 22 22"/);
    assert.match(headerSource, /M4 20C3\.45 20[\s\S]*H4ZM4 18H16V6H4V18Z/);
    assert.match(headerSource, /viewBox="-2 -2 22 26"/);
    assert.match(headerSource, /M19\.95 21C17\.8667 21[\s\S]*L14\.975 17\.95Z/);
    assert.match(headerSource, /gap-\[22\.5px\]/);
});
