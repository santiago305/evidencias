import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveSmsPhoneDisplay } from './contactHeaderIdentity.ts';

test('SMS identity always applies the design phone formatter regardless of name', () => {
    const formatFamilyPhone = (phone: string) => `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;

    assert.equal(resolveSmsPhoneDisplay({ nombre: 'María José', telefono: '987654321' }, formatFamilyPhone), '987 654 321');
    assert.equal(resolveSmsPhoneDisplay({ nombre: '', telefono: '987654321' }, formatFamilyPhone), '987 654 321');
    assert.equal(resolveSmsPhoneDisplay({ nombre: 'María José', telefono: '   ' }, formatFamilyPhone), '-');
});
