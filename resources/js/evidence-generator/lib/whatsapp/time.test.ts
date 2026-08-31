import assert from 'node:assert/strict';
import test from 'node:test';
import { getGreetingSlot } from './greetings.ts';
import { formatWhatsappTimeValue, getDayChipTextForDate, getTimeOfDayParts } from './time.ts';

const morningGreetings = ['Buenos dias', 'Buen dia', 'Buenos días', 'Buen día'];

test('getTimeOfDayParts uses the configured hour ranges', () => {
    const morningStart = getTimeOfDayParts(new Date(2026, 0, 1, 5, 0));
    const morningEnd = getTimeOfDayParts(new Date(2026, 0, 1, 11, 59));
    const afternoonStart = getTimeOfDayParts(new Date(2026, 0, 1, 12, 0));
    const afternoonEnd = getTimeOfDayParts(new Date(2026, 0, 1, 18, 59));
    const nightStart = getTimeOfDayParts(new Date(2026, 0, 1, 19, 0));
    const nightEnd = getTimeOfDayParts(new Date(2026, 0, 1, 4, 59));

    assert.equal(morningStart.slot, 'mañana');
    assert.equal(morningEnd.slot, 'mañana');
    assert.ok(morningGreetings.includes(morningStart.saludo));
    assert.ok(morningGreetings.includes(morningEnd.saludo));

    assert.equal(afternoonStart.slot, 'tarde');
    assert.equal(afternoonStart.saludo, 'Buenas tardes');
    assert.equal(afternoonEnd.slot, 'tarde');
    assert.equal(afternoonEnd.saludo, 'Buenas tardes');

    assert.equal(nightStart.slot, 'noche');
    assert.equal(nightStart.saludo, 'Buenas noches');
    assert.equal(nightEnd.slot, 'noche');
    assert.equal(nightEnd.saludo, 'Buenas noches');
});

test('getGreetingSlot recognizes morning greetings with and without accents', () => {
    const samples = ['Buenos dias', 'Buen dia', 'Buenos días', 'Buen día'];

    for (const sample of samples) {
        assert.equal(getGreetingSlot(sample), 'mañana');
    }
});

test('getDayChipTextForDate labels message days relative to a supplied reference timestamp', () => {
    const registrationDate = '2026-06-03T08:10';

    assert.equal(getDayChipTextForDate('2026-06-03', registrationDate), 'Hoy');
    assert.equal(getDayChipTextForDate('2026-06-02', registrationDate), 'Ayer');
    assert.equal(getDayChipTextForDate('2026-06-01', registrationDate), 'Lunes');
    assert.equal(getDayChipTextForDate('2026-05-25', registrationDate), '25/5/2026');
});

test('getDayChipTextForDate labels generated message days relative to the current Peru date by default', () => {
    const currentPeruDate = new Date('2026-06-09T17:00:00.000Z');

    assert.equal(getDayChipTextForDate('2026-06-09', undefined, currentPeruDate), 'Hoy');
    assert.equal(getDayChipTextForDate('2026-06-08', undefined, currentPeruDate), 'Ayer');
    assert.equal(getDayChipTextForDate('2026-06-06', undefined, currentPeruDate), 'Sabado');
    assert.equal(getDayChipTextForDate('2026-06-05', undefined, currentPeruDate), 'Viernes');
});

test('formatWhatsappTimeValue converts backend 24-hour times to WhatsApp short times', () => {
    assert.equal(formatWhatsappTimeValue('14:35'), '2:35 p.m.');
    assert.equal(formatWhatsappTimeValue('08:01'), '8:01 a.m.');
    assert.equal(formatWhatsappTimeValue('8:01 a. m.'), '8:01 a.m.');
});
