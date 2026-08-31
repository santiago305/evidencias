import assert from 'node:assert/strict';
import test from 'node:test';
import { getSmsColors, shouldShowSmsAccentPoint } from './smsAppearance.ts';

test('shows SMS accent points for half of random values', () => {
    assert.equal(shouldShowSmsAccentPoint(0.49), true);
    assert.equal(shouldShowSmsAccentPoint(0.5), false);
});

test('preserves the original light-mode read receipt colors', () => {
    const colors = getSmsColors('light');

    assert.equal(colors.readReceiptBackground, colors.conversation);
    assert.equal(colors.readReceiptForeground, colors.statusCheck);
});

test('uses contrasting read receipt colors only in dark mode', () => {
    const colors = getSmsColors('dark');

    assert.equal(colors.readReceiptBackground, '#101417');
    assert.equal(colors.readReceiptForeground, '#E0E1E5');
});
