import assert from 'node:assert/strict';
import test from 'node:test';
import { formatMobile6SmsPhone } from './formatSmsPhone.ts';

test('formats nine-digit SMS phone numbers in groups of three', () => {
    assert.equal(formatMobile6SmsPhone('999222333'), '999 222 333');
    assert.equal(formatMobile6SmsPhone('999 222 333'), '999 222 333');
});

test('preserves unsupported SMS phone formats', () => {
    assert.equal(formatMobile6SmsPhone(''), '-');
    assert.equal(formatMobile6SmsPhone('+51999222333'), '+51999222333');
});
