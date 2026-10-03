import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const designDirectory = dirname(fileURLToPath(import.meta.url));

test('mobile 3 SMS status bar uses its header and header action colors in both themes', () => {
    const frameRenderers = readFileSync(resolve(designDirectory, '../shared/mobile-preview/frameRenderers.tsx'), 'utf8');

    assert.match(frameRenderers, /const smsColors = props\.channel === 'sms' \? getSmsColors\(props\.themeMode, 'mobile-3'\) : undefined;/);
    assert.match(frameRenderers, /systemHeaderBackground=\{systemChrome\?\.headerBackground \?\? smsColors\?\.header\}/);
    assert.match(frameRenderers, /systemHeaderForeground=\{systemChrome\?\.headerForeground \?\? smsColors\?\.headerActionIcon\}/);
});
