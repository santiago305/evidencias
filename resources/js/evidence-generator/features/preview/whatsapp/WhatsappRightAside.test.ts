import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('WhatsappRightAside block and report actions use the rendered profile identity', () => {
    const source = readFileSync(new URL('./WhatsappRightAside.tsx', import.meta.url), 'utf8');

    assert.match(source, /const contactActionTitle = profileTitle \?\?/);
    assert.match(source, /`Bloquear a \$\{contactActionTitle\}`/);
    assert.match(source, /`Reportar a \$\{contactActionTitle\}`/);
    assert.doesNotMatch(source, /Bloquear a \$\{data\.nombre/);
    assert.doesNotMatch(source, /Reportar a \$\{data\.nombre/);
});
