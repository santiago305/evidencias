import assert from 'node:assert/strict';
import test from 'node:test';
import type { FormState } from '../types.ts';
import { createInitialFormState } from './formState.ts';
import { applyConversationTestDefaults } from './testingDefaults.ts';

test('applyConversationTestDefaults fills empty evidence fields for conversation testing', () => {
    const form = applyConversationTestDefaults(createInitialFormState(), new Date('2026-06-06T15:30:00'), () => 0);

    assert.deepEqual(form, {
        telefono: '999999999',
        nombre: 'Juan Perez',
        dniCliente: '10000000',
        monto: '99999',
        tasa: '9.99',
        cuota: '2148',
        plazo: '60',
        fechaHora: '2026-06-06T14:15',
        fechaHoraRegistro: '2026-06-06T15:30',
        duracion: '60',
        img_64: '',
        img_64_file: null,
        modoEntrada: 'informativo',
    });
});

test('applyConversationTestDefaults keeps values already entered by the user', () => {
    const baseForm: FormState = {
        ...createInitialFormState(),
        nombre: 'Pedro Cliente',
        monto: '3250',
        fechaHora: '2026-06-06T10:00',
    };

    const form = applyConversationTestDefaults(baseForm, new Date('2026-06-06T15:30:00'), () => 0);

    assert.equal(form.nombre, 'Pedro Cliente');
    assert.equal(form.monto, '3250');
    assert.equal(form.fechaHora, '2026-06-06T10:00');
    assert.equal(form.dniCliente, '10000000');
});
