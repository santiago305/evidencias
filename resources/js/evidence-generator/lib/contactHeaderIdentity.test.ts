import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveContactHeaderIdentity, resolveContactPhoneDisplay } from './contactHeaderIdentity.ts';

test('prefers the trimmed contact name without changing its casing or internal spacing', () => {
    assert.deepEqual(resolveContactHeaderIdentity({ nombre: '  María   José Rodríguez  ', telefono: '987654321' }), {
        title: 'María   José Rodríguez',
        hasName: true,
        displaysPhone: false,
    });
});

test('uses the provided phone formatter when there is no name', () => {
    assert.equal(
        resolveContactHeaderIdentity({ nombre: '', telefono: '987654321' }, { formatPhone: (phone) => `+51 ${phone}` }).title,
        '+51 987654321',
    );
    assert.equal(resolveContactHeaderIdentity({ nombre: '   ', telefono: '987654321' }).title, '987654321');
});

test('uses a neutral marker when both identity fields are empty', () => {
    assert.deepEqual(resolveContactHeaderIdentity({ nombre: ' ', telefono: ' ' }), {
        title: '-',
        hasName: false,
        displaysPhone: false,
    });
});

test('resolves a formatted phone regardless of the contact name', () => {
    const namedContact = { nombre: 'María José', telefono: ' 987654321 ' };

    assert.equal(
        resolveContactPhoneDisplay(namedContact, {
            formatPhone: (phone) => `+51 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`,
        }),
        '+51 987 654 321',
    );
    assert.equal(resolveContactPhoneDisplay({ telefono: '   ' }), '-');
    assert.equal(resolveContactPhoneDisplay({ telefono: null }), '-');
});
