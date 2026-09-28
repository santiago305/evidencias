import assert from 'node:assert/strict';
import test from 'node:test';
import { formatMobile13SmsPhone, getSmsHeaderDisplayValue, resolveSmsHeaderInitial } from './smsHeaderIdentity.ts';

test('resolves the first trimmed Unicode character as the SMS avatar initial', () => {
    assert.equal(resolveSmsHeaderInitial('  Santiago Gesem  '), 'S');
    assert.equal(resolveSmsHeaderInitial('  ñandú  '), 'Ñ');
    assert.equal(resolveSmsHeaderInitial(''), '');
});

test('uses the contact name or formatted phone as the SMS pill value', () => {
    assert.equal(getSmsHeaderDisplayValue(' Juan ', '999999999'), 'Juan');
    assert.equal(getSmsHeaderDisplayValue('', '999222111'), '+51 999 333 444');
    assert.equal(getSmsHeaderDisplayValue('   ', '123'), '+51 999 333 444');
});

test('preserves the exact supplied name, including accents and internal whitespace', () => {
    assert.equal(getSmsHeaderDisplayValue('  María   José  ', '999999999'), 'María   José');
});

test('keeps the existing Mobile-13 SMS phone formatting', () => {
    assert.equal(formatMobile13SmsPhone('999999999'), '999 999 999');
    assert.equal(formatMobile13SmsPhone('  123  '), '123');
    assert.equal(formatMobile13SmsPhone(''), '-');
});
