import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const smsDirectory = dirname(fileURLToPath(import.meta.url));

test('mobile 13 SMS composes one transparent local status bar over its own frame content', () => {
    const previewSource = readFileSync(resolve(smsDirectory, 'PreviewMobile13Sms.tsx'), 'utf8');
    const statusBarSource = readFileSync(resolve(smsDirectory, 'SmsStatusBar.tsx'), 'utf8');
    const frameSource = readFileSync(resolve(smsDirectory, '../Mobile13PreviewFrame.tsx'), 'utf8');

    assert.match(previewSource, /hideSystemHeader/);
    assert.match(frameSource, /!hideSystemHeader\s*\?/);
    assert.equal((previewSource.match(/<SmsStatusBar\b/g) ?? []).length, 1);
    assert.match(previewSource, /notificationIds=\{notificationIds\}/);
    assert.match(statusBarSource, /backgroundColor: 'transparent'/);
    assert.match(statusBarSource, /MobileNotificationIcons notificationIds=\{notificationIds\}/);
    assert.match(previewSource, /systemFooterBackground=\{colors\.shell\}/);
    assert.match(previewSource, /systemFooterForeground=\{themeMode === 'dark' \? '#FFFFFF' : '#000000'\}/);
    assert.match(previewSource, /hideSystemFooter/);
});
