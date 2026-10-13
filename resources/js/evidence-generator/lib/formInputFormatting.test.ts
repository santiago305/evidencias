import assert from 'node:assert/strict';
import test from 'node:test';
import { getFormNumericValidationMessage, normalizeTwoDecimalInput, sanitizeDecimalInput } from './formInputFormatting.ts';

test('decimal fields keep at most two decimals and complete integers on blur', () => {
    assert.equal(sanitizeDecimalInput('1500.987'), '1500.98');
    assert.equal(sanitizeDecimalInput('1500,5'), '1500.5');
    assert.equal(sanitizeDecimalInput('123456', false, 5), '12345');
    assert.equal(sanitizeDecimalInput('12345.255', false, 5), '12345.25');
    assert.equal(sanitizeDecimalInput('12345678.25', false, 5), '12345');
    assert.equal(sanitizeDecimalInput('99999.25', false, 5), '99999');
    assert.equal(sanitizeDecimalInput('99999.00', false, 5), '99999.00');
    assert.equal(normalizeTwoDecimalInput('99999'), '99999.00');
    assert.equal(normalizeTwoDecimalInput('123.'), '123.00');
    assert.equal(normalizeTwoDecimalInput('123.1'), '123.10');
    assert.equal(normalizeTwoDecimalInput('2.5'), '2.50');
    assert.equal(normalizeTwoDecimalInput('45.2%', true), '45.20%');
});

test('numeric form validation blocks values outside the configured limits', () => {
    const baseForm = {
        monto: '99999.00',
        tasa: '2.50',
        cuota: '250.00',
        plazo: '12',
        TCEA: '45.20',
    };

    assert.equal(getFormNumericValidationMessage(baseForm), null);
    assert.match(getFormNumericValidationMessage({ ...baseForm, monto: '100000' }) ?? '', /99999/);
    assert.match(getFormNumericValidationMessage({ ...baseForm, cuota: '250.123' }) ?? '', /2 decimales/);
    assert.match(getFormNumericValidationMessage({ ...baseForm, tasa: '2.123' }) ?? '', /porcentaje/);
    assert.match(getFormNumericValidationMessage({ ...baseForm, plazo: '12.5' }) ?? '', /entero/);
});
