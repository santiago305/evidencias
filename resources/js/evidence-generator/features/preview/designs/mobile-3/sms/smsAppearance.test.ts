import assert from 'node:assert/strict';
import test from 'node:test';
import { getSmsColors } from './smsAppearance.ts';

test('preserves the original light-mode read receipt colors', () => {
    const colors = getSmsColors('light');

    assert.equal(colors.readReceiptBackground, colors.conversation);
    assert.equal(colors.readReceiptForeground, colors.statusCheck);
});

test('uses contrasting read receipt colors only in dark mode', () => {
    const colors = getSmsColors('dark');

    assert.equal(colors.readReceiptBackground, '#70B9D1');
    assert.equal(colors.readReceiptForeground, '#16333D');
});
