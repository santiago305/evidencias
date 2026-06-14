import assert from 'node:assert/strict';
import test from 'node:test';
import { createInitialFormState } from './formState.ts';

test('createInitialFormState returns an empty form ready for a new evidence', () => {
    assert.deepEqual(createInitialFormState(), {
        telefono: '',
        nombre: '',
        dniCliente: '',
        monto: '',
        tasa: '',
        cuota: '',
        plazo: '',
        fechaHora: '',
        fechaHoraRegistro: '',
        duracion: '',
        img_64: '',
        img_64_file: null,
        modoEntrada: 'informativo',
    });
});
