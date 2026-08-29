import assert from 'node:assert/strict';
import test from 'node:test';
import { buildSmsMessages, shouldShowSmsDateSeparator, shouldShowSmsMessageMetadata, toggleSmsMetadataVisibility } from './smsMessages.ts';

test('shows a separator only when the calendar date changes', () => {
    const currentDate = new Date('2026-08-29T17:00:00.000Z');

    assert.equal(shouldShowSmsDateSeparator(undefined, '2026-08-29', currentDate), false);
    assert.equal(shouldShowSmsDateSeparator(undefined, '2026-08-28', currentDate), true);
    assert.equal(shouldShowSmsDateSeparator(undefined, '2026-08-27', currentDate), true);
    assert.equal(shouldShowSmsDateSeparator('2026-08-28', '2026-08-28', currentDate), false);
    assert.equal(shouldShowSmsDateSeparator('2026-08-28', '2026-08-29', currentDate), false);
});

test('separates calendar dates even when messages are four minutes apart', () => {
    assert.equal(shouldShowSmsDateSeparator('2026-08-27', '2026-08-28', new Date('2026-08-29T17:00:00.000Z')), true);
});

test('shows message metadata only for the final conversation message', () => {
    assert.equal(shouldShowSmsMessageMetadata(0, 3), false);
    assert.equal(shouldShowSmsMessageMetadata(1, 3), false);
    assert.equal(shouldShowSmsMessageMetadata(2, 3), true);
    assert.equal(shouldShowSmsMessageMetadata(0, 0), false);
});

test('toggles SMS message metadata visibility when the message is clicked', () => {
    assert.equal(toggleSmsMetadataVisibility(true), false);
    assert.equal(toggleSmsMetadataVisibility(false), true);
});

test('normalizes generated messages without replacing their real content', () => {
    const messages = buildSmsMessages({
        telefono: '999 111 222',
        fechaHora: '2026-06-10T08:52',
        fechaHoraRegistro: '2026-06-10T09:43',
        generatedMessages: [
            { side: 'in', time: '08:55', dateKey: '2026-06-10', lines: ['Texto recibido'] },
            { side: 'out', time: '09:00', dateKey: '2026-06-10', lines: ['Texto enviado'], id_: 'ultimo_mensaje' },
        ],
        previewSnapshot: { messageStatus: 'read' },
    } as never);

    assert.deepEqual(
        messages.map(({ id, side, lines, time, dateKey, status }) => ({ id, side, lines, time, dateKey, status })),
        [
            { id: 'sms-message-0-2026-06-10-08:55', side: 'in', lines: ['Texto recibido'], time: '08:55', dateKey: '2026-06-10', status: undefined },
            { id: 'ultimo_mensaje', side: 'out', lines: ['Texto enviado'], time: '09:00', dateKey: '2026-06-10', status: 'read' },
        ],
    );
});

test('returns no fabricated messages when generated messages are absent', () => {
    assert.deepEqual(buildSmsMessages({ fechaHora: '2026-06-10T08:52', fechaHoraRegistro: '2026-06-10T09:43' } as never), []);
});
