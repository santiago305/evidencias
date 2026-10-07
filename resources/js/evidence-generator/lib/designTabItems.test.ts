import assert from 'node:assert/strict';
import test from 'node:test';
import { getDesignTabItems } from './designTabItems.ts';

test('design tabs include only WhatsApp and SMS when mobile designs are registered', () => {
    assert.deepEqual(
        getDesignTabItems(true).map(({ key }) => key),
        ['whatsapp', 'sms'],
    );
});

test('design tabs include only WhatsApp when mobile designs are not registered', () => {
    assert.deepEqual(
        getDesignTabItems(false).map(({ key }) => key),
        ['whatsapp'],
    );
});
