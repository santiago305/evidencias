import assert from 'node:assert/strict';
import test from 'node:test';
import { formatMobile13SmsPhone } from './smsHeaderIdentity.ts';

test('keeps the existing Mobile-13 SMS phone formatting', () => {
    assert.equal(formatMobile13SmsPhone('999999999'), '999 999 999');
    assert.equal(formatMobile13SmsPhone('  123  '), '123');
    assert.equal(formatMobile13SmsPhone(''), '-');
});
