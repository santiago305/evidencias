import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('WhatsappHeaderUser applies compact mobile spacing and lets title area fill its parent width', () => {
    const source = readFileSync(new URL('./WhatsappHeaderUser.tsx', import.meta.url), 'utf8');

    assert.match(source, /compact \? 'px-1 py-2\.5' : 'px-3 py-2'/);
    assert.match(source, /\['flex min-w-0 items-center gap-2', compact \? 'flex-1' : ''\]/);
    assert.match(source, /\['min-w-0 leading-tight', compact \? 'flex-1' : ''\]/);
    assert.match(source, /\[compact \? 'segoe-ui leading-\[17px\] pb-px' : 'segoe-ui-semibold', 'truncate text-\[13px\] tracking-tight'/);
    assert.match(source, /\['truncate font-medium', compact \? 'text-\[11px\]' : 'text-\[9px\]'/);
    assert.match(source, /const headerTitle = displayTitle \?\? \(data\.nombre\?\.trim\(\) \? data\.nombre : 'Aracely MD'\);/);
    assert.match(source, /if \(!compact\) \{\s+return null;\s+\}/);
    assert.match(source, /\^\\p\{L\}\$/);
    assert.match(source, /data-avatar-initial="true"/);
    assert.match(source, /mobileAvatarInitial \? \(/);
    assert.match(source, /data-icon="default-contact-refreshed"/);
});
