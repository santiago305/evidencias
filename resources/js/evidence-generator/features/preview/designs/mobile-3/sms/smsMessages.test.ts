import assert from 'node:assert/strict';
import test from 'node:test';
import { buildSmsMessages } from './smsMessages.ts';

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
