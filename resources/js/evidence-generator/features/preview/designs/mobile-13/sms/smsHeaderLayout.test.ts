import assert from 'node:assert/strict';
import test from 'node:test';
import { SMS_BLUR_HEIGHT, SMS_HEADER_HEIGHT, SMS_INITIAL_CONTENT_OFFSET, SMS_STATUS_BAR_HEIGHT } from './smsHeaderLayout.ts';

test('mobile 13 SMS top composition uses coordinated vertical dimensions', () => {
    assert.equal(SMS_STATUS_BAR_HEIGHT, 40);
    assert.equal(SMS_HEADER_HEIGHT, 110);
    assert.equal(SMS_INITIAL_CONTENT_OFFSET, 150);
    assert.equal(SMS_BLUR_HEIGHT, 145);
    assert.equal(SMS_STATUS_BAR_HEIGHT + SMS_HEADER_HEIGHT, SMS_INITIAL_CONTENT_OFFSET);
});
