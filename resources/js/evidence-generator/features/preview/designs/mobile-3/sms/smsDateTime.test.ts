import assert from 'node:assert/strict';
import test from 'node:test';
import { buildSmsMessageTimestamp, formatSmsFullDate, formatSmsTime, resolveSmsDateKey } from './smsDateTime.ts';

const data = { fechaHora: '2026-06-10T08:52', fechaHoraRegistro: '2026-06-10T09:43' } as const;

test('formats backend times in the Spanish short-time format', () => {
    assert.equal(formatSmsTime('16:47'), '4:47 p. m.');
});

test('shows only time and checks for an outgoing message from today in Peru', () => {
    const result = buildSmsMessageTimestamp(
        { side: 'out', status: 'delivered', dateKey: '2026-06-10', time: '16:47' },
        data,
        new Date('2026-06-10T23:30:00.000Z'),
    );

    assert.deepEqual(result, { kind: 'today', label: '4:47 p. m.', showChecks: true });
});

test('shows only time for an incoming message from today', () => {
    const result = buildSmsMessageTimestamp({ side: 'in', dateKey: '2026-06-10', time: '09:15' }, data, new Date('2026-06-10T23:30:00.000Z'));

    assert.deepEqual(result, { kind: 'today', label: '9:15 a. m.', showChecks: false });
});

test('shows only the complete date for a message from another day', () => {
    const result = buildSmsMessageTimestamp(
        { side: 'out', status: 'read', dateKey: '2026-06-11', time: '03:33' },
        data,
        new Date('2026-06-10T23:30:00.000Z'),
    );

    assert.equal(result.kind, 'full-date');
    assert.equal(result.showChecks, false);
    assert.equal(result.label, formatSmsFullDate('2026-06-11', '03:33'));
});

test('uses form dates when a generated message has no valid date key', () => {
    assert.equal(resolveSmsDateKey({ dateKey: 'invalid' }, data), '2026-06-10');
    assert.equal(resolveSmsDateKey({ dateKey: undefined }, { fechaHora: 'invalid', fechaHoraRegistro: '2026-06-12T09:43' }), '2026-06-12');
});

test('does not shift date keys at the Peru midnight boundary', () => {
    const result = buildSmsMessageTimestamp(
        { side: 'out', status: 'read', dateKey: '2026-06-11', time: '00:05' },
        data,
        new Date('2026-06-11T05:30:00.000Z'),
    );

    assert.equal(result.kind, 'today');
});
