import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getSmsQuickReplies } from './smsQuickReplies.ts';

const message = (text: string, side: 'in' | 'out' = 'in') => ({ side, lines: [text], time: '10:00' });

test('uses the exact fallback when there is no incoming context', () => {
    assert.deepEqual(
        getSmsQuickReplies(undefined).map(({ label }) => label),
        ['Que', 'Hola', 'Mande', '😁'],
    );
});

test('prioritizes the latest incoming question', () => {
    assert.deepEqual(
        getSmsQuickReplies([message('Hola'), message('¿Puedes venir?')]).map(({ label }) => label),
        ['Sí', 'No', 'Qué', 'Mande'],
    );
});

test('ignores a newer outgoing message when finding context', () => {
    assert.deepEqual(
        getSmsQuickReplies([message('Hola'), message('Ya respondí', 'out')]).map(({ label }) => label),
        ['Hola', 'Qué tal', 'Dime', '😊'],
    );
});
