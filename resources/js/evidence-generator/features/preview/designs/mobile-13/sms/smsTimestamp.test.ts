import assert from 'node:assert/strict';
import test from 'node:test';
import { formatMobile13SmsTimestamp } from './smsTimestamp.ts';

test('formats today, yesterday, and two calendar days ago in Spanish', () => {
    const currentDate = new Date('2026-06-08T17:00:00.000Z');

    assert.equal(formatMobile13SmsTimestamp('2026-06-08', '11:16', currentDate), 'hoy, 11:16a.m.');
    assert.equal(formatMobile13SmsTimestamp('2026-06-07', '11:16', currentDate), 'ayer, 11:16a.m.');
    assert.equal(formatMobile13SmsTimestamp('2026-06-06', '11:16', currentDate), 'anteayer, 11:16a.m.');
});

test('formats older dates with explicit Spanish weekday and month abbreviations', () => {
    const currentDate = new Date('2026-06-08T17:00:00.000Z');

    assert.equal(formatMobile13SmsTimestamp('2026-06-04', '11:16', currentDate), 'jue, 4 jun., 11:16a.m.');
    assert.equal(formatMobile13SmsTimestamp('2026-09-24', '11:16', new Date('2026-09-28T17:00:00.000Z')), 'jue, 24 sept., 11:16a.m.');
    assert.equal(formatMobile13SmsTimestamp('2026-09-04', '09:05', new Date('2026-09-28T17:00:00.000Z')), 'vie, 4 sept., 9:05a.m.');
});

test('classifies calendar days across month and year boundaries', () => {
    assert.equal(formatMobile13SmsTimestamp('2026-06-30', '11:16', new Date('2026-07-01T17:00:00.000Z')), 'ayer, 11:16a.m.');
    assert.equal(formatMobile13SmsTimestamp('2025-12-31', '23:59', new Date('2026-01-01T06:30:00.000Z')), 'ayer, 11:59p.m.');
    assert.equal(formatMobile13SmsTimestamp('2025-12-15', '08:30', new Date('2026-01-01T17:00:00.000Z')), 'lun, 15 dic. 2025, 8:30a.m.');
});

test('uses Peru calendar dates for midnight boundaries', () => {
    assert.equal(formatMobile13SmsTimestamp('2026-09-27', '23:59', new Date('2026-09-28T05:30:00.000Z')), 'ayer, 11:59p.m.');
});

test('formats 12-hour time without a space before the Spanish meridiem', () => {
    const currentDate = new Date('2026-06-08T17:00:00.000Z');

    assert.equal(formatMobile13SmsTimestamp('2026-06-08', '00:05', currentDate), 'hoy, 12:05a.m.');
    assert.equal(formatMobile13SmsTimestamp('2026-06-08', '12:05', currentDate), 'hoy, 12:05p.m.');
    assert.equal(formatMobile13SmsTimestamp('2026-06-08', '15:30', currentDate), 'hoy, 3:30p.m.');
    assert.equal(formatMobile13SmsTimestamp('2026-06-08', '23:59', currentDate), 'hoy, 11:59p.m.');
});
