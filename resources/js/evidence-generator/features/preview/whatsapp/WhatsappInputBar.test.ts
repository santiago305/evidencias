import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('WhatsappInputBar mobile input uses the local WhatsApp Segoe UI font', () => {
    const componentSource = readFileSync(new URL('./WhatsappInputBar.tsx', import.meta.url), 'utf8');
    const appStyles = readFileSync(new URL('../../../../../css/app.css', import.meta.url), 'utf8');
    const fontStyles = readFileSync(new URL('../../../../../css/fonts/segoe-ui/stylesheet.css', import.meta.url), 'utf8');

    assert.match(componentSource, /className="segoe-ui min-w-0 flex-1/);
    assert.match(componentSource, /fontFamily: "'Whatsapp Segoe UI', 'Segoe UI', system-ui, sans-serif"/);
    assert.match(appStyles, /\.segoe-ui\{\s*font-family: 'Whatsapp Segoe UI', 'Segoe UI', system-ui, sans-serif;\s*\}/);
    assert.match(fontStyles, /font-family: 'Whatsapp Segoe UI';/);
});
