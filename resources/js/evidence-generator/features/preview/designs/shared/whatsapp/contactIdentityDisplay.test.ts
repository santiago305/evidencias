import assert from 'node:assert/strict';
import test from 'node:test';
import { buildContactIdentityDisplay, resolveWhatsappHeaderIdentity } from './contactIdentityDisplay.ts';

test('WhatsApp identity preserves the supplied name and uses it in the contact profile', () => {
    const data = { nombre: '  María José Rodríguez  ', telefono: '987654321' };
    const display = buildContactIdentityDisplay(data);

    assert.deepEqual(resolveWhatsappHeaderIdentity(data), {
        title: 'María José Rodríguez',
        hasName: true,
        displaysPhone: false,
    });
    assert.equal(display.headerTitle, 'María José Rodríguez');
    assert.equal(display.profileTitle, 'María José Rodríguez');
    assert.equal(display.headerDisplaysPhone, false);
    assert.equal(display.showAddContactAction, false);
});

test('WhatsApp identity uses the formatted phone when no name exists', () => {
    const display = buildContactIdentityDisplay({ nombre: '   ', telefono: '987654321' });

    assert.equal(display.headerTitle, '+51 987 654 321');
    assert.equal(display.profileTitle, display.headerTitle);
    assert.equal(display.profileSubtitle, '');
    assert.equal(display.headerDisplaysPhone, true);
    assert.equal(display.showAddContactAction, true);
});

test('WhatsApp identity is deterministic and uses a neutral fallback', () => {
    const originalRandom = Math.random;

    try {
        Math.random = () => 0.99;
        const first = buildContactIdentityDisplay({ nombre: '', telefono: '' });
        Math.random = () => 0.01;
        const second = buildContactIdentityDisplay({ nombre: '', telefono: '' });

        assert.deepEqual(first, second);
        assert.equal(first.headerTitle, '-');
    } finally {
        Math.random = originalRandom;
    }
});
