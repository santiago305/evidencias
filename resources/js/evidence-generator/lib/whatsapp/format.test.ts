import assert from 'node:assert/strict';
import test from 'node:test';
import { completeAmountDecimals, formatConversationAmount } from './format.ts';

test('amount input completes to at least two decimal places when editing ends', () => {
    for (const [input, expected] of [
        ['100', '100.00'],
        ['12.5', '12.50'],
        ['12,5', '12,50'],
        ['12.345', '12.345'],
        ['1 200,0', '1200,00'],
        ['', ''],
    ]) {
        assert.equal(completeAmountDecimals(input), expected);
    }
});

test('conversation amount adds decimal zeros to integers and preserves decimal input except whitespace', () => {
    for (const [input, expected] of [
        ['100', '100.00'],
        ['1500', '1500.00'],
        ['1500.50', '1500.50'],
        ['1500.75', '1500.75'],
        ['100.0', '100.0'],
        ['100,00', '100,00'],
        ['1500,50', '1500,50'],
        ['1500,75', '1500,75'],
        ['12,0', '12,0'],
        ['1 2000,00', '12000,00'],
        ['1\u00A02000,00', '12000,00'],
    ]) {
        assert.equal(formatConversationAmount(input), expected);
    }
});
