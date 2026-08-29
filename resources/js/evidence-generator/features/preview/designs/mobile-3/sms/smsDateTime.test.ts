import assert from 'node:assert/strict';
import test from 'node:test';
import {
    buildSmsConversationHeader,
    buildSmsConversationTimestamp,
    buildSmsDateSeparatorLabel,
    buildSmsMessageTimestamp,
    formatSmsFullDate,
    formatSmsTime,
    resolveSmsDateKey,
} from './smsDateTime.ts';

const data = { fechaHora: '2026-06-10T08:52', fechaHoraRegistro: '2026-06-10T09:43' } as const;

test('formats backend times in the Spanish short-time format', () => {
    assert.equal(formatSmsTime('16:47'), '4:47 p.\u00a0m.');
});

test('shows only the time for the conversation date when it is today', () => {
    assert.deepEqual(buildSmsConversationTimestamp('2026-06-10', '16:47', new Date('2026-06-10T23:30:00.000Z')), {
        kind: 'today',
        label: '4:47 p.\u00a0m.',
        timeLabel: '4:47 p.\u00a0m.',
    });
});

test('shows yesterday with a separate time label', () => {
    assert.deepEqual(buildSmsConversationTimestamp('2026-06-09', '16:47', new Date('2026-06-10T23:30:00.000Z')), {
        kind: 'yesterday',
        label: '4:47 p.\u00a0m.',
        timeLabel: '4:47 p.\u00a0m.',
    });
});

test('formats today, yesterday, and older SMS date separators', () => {
    const currentDate = new Date('2026-08-29T17:00:00.000Z');

    assert.deepEqual(buildSmsDateSeparatorLabel('2026-08-29', '15:57', currentDate), {
        dateLabel: 'Hoy',
        timeLabel: '3:57 p.\u00a0m.',
    });
    assert.deepEqual(buildSmsDateSeparatorLabel('2026-08-28', '15:57', currentDate), {
        dateLabel: 'Ayer',
        timeLabel: '3:57 p.\u00a0m.',
    });
});

test('keeps the separator on the Peru calendar day around UTC midnight', () => {
    const result = buildSmsDateSeparatorLabel('2026-08-28', '23:58', new Date('2026-08-29T04:30:00.000Z'));

    assert.equal(result.dateLabel, 'Hoy');
});

test('uses the existing friendly date format for older separators', () => {
    const result = buildSmsDateSeparatorLabel('2026-07-01', '20:32', new Date('2026-08-29T17:00:00.000Z'));
    const fullDate = formatSmsFullDate('2026-07-01', '20:32');

    assert.equal(result.dateLabel, fullDate.slice(0, fullDate.lastIndexOf(' · ')));
    assert.equal(result.timeLabel, '8:32 p.\u00a0m.');
});

test('builds the RCS conversation header variant', () => {
    assert.deepEqual(buildSmsConversationHeader({ telefono: '999999999', nombre: 'Sheyla' }, 0.2), {
        kind: 'rcs',
        title: 'Chat RCS con 999999999',
        description: 'Ahora el chat está encriptado de extremo a extremo.',
    });
});

test('builds the SMS/MMS conversation header variant', () => {
    assert.deepEqual(buildSmsConversationHeader({ telefono: '999999999', nombre: 'Sheyla' }, 0.8), {
        kind: 'sms',
        title: 'Mensajes de texto con Sheyla (SMS/MMS)',
    });
});

test('uses the RCS header variant as the encryption-lock source', () => {
    assert.equal(buildSmsConversationHeader({ telefono: '999999999', nombre: 'Sheyla' }, 0.2).kind, 'rcs');
    assert.equal(buildSmsConversationHeader({ telefono: '999999999', nombre: 'Sheyla' }, 0.8).kind, 'sms');
});

test('shows the full date for older conversations', () => {
    const result = buildSmsConversationTimestamp('2026-06-08', '16:47', new Date('2026-06-10T23:30:00.000Z'));

    assert.equal(result.kind, 'full-date');
    assert.equal(result.label, formatSmsFullDate('2026-06-08', '16:47'));
});

test('shows checks for an outgoing final-message candidate from today', () => {
    const result = buildSmsMessageTimestamp({ side: 'out', dateKey: '2026-06-10', time: '16:47' }, data, new Date('2026-06-10T23:30:00.000Z'));

    assert.deepEqual(result, { kind: 'today', label: '4:47 p.\u00a0m.', showChecks: true, showSmsLabel: false });
});

test('shows the SMS label and suppresses RCS indicators for a traditional SMS conversation', () => {
    const result = buildSmsMessageTimestamp({ side: 'out', dateKey: '2026-06-10', time: '10:22' }, data, new Date('2026-06-10T23:30:00.000Z'), 'sms');

    assert.deepEqual(result, { kind: 'today', label: '10:22 a.\u00a0m.', showChecks: false, showSmsLabel: true });
});

test('does not show the SMS label for an RCS conversation', () => {
    const result = buildSmsMessageTimestamp({ side: 'out', dateKey: '2026-06-10', time: '10:22' }, data, new Date('2026-06-10T23:30:00.000Z'), 'rcs');

    assert.equal(result.showSmsLabel, false);
    assert.equal(result.showChecks, true);
});

test('shows only time for an incoming message from today', () => {
    const result = buildSmsMessageTimestamp({ side: 'in', dateKey: '2026-06-10', time: '09:15' }, data, new Date('2026-06-10T23:30:00.000Z'));

    assert.deepEqual(result, { kind: 'today', label: '9:15 a.\u00a0m.', showChecks: false, showSmsLabel: false });
});

test('shows the complete date and checks for an outgoing message from another day', () => {
    const result = buildSmsMessageTimestamp({ side: 'out', dateKey: '2026-06-11', time: '03:33' }, data, new Date('2026-06-10T23:30:00.000Z'));

    assert.equal(result.kind, 'full-date');
    assert.equal(result.showChecks, true);
    assert.equal(result.label, formatSmsFullDate('2026-06-11', '03:33'));
});

test('never shows checks for an incoming final-message candidate', () => {
    const result = buildSmsMessageTimestamp({ side: 'in', dateKey: '2026-06-11', time: '03:33' }, data, new Date('2026-06-10T23:30:00.000Z'));

    assert.equal(result.showChecks, false);
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
