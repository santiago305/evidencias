import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveSmsHeaderIdentity } from './contactHeaderIdentity.ts';

test('SMS identity applies each design phone formatter only when name is missing', () => {
    const formatFamilyPhone = (phone: string) => `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;

    assert.equal(resolveSmsHeaderIdentity({ nombre: 'María José', telefono: '987654321' }, formatFamilyPhone), 'María José');
    assert.equal(resolveSmsHeaderIdentity({ nombre: '', telefono: '987654321' }, formatFamilyPhone), '987 654 321');
    assert.equal(resolveSmsHeaderIdentity({ nombre: ' ', telefono: '' }, formatFamilyPhone), '-');
});
