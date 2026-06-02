import assert from 'node:assert/strict';
import test from 'node:test';
import { createInitialFormState } from './formState.ts';

test('createInitialFormState returns an empty form ready for a new evidence', () => {
    assert.deepEqual(createInitialFormState(), {
        nombreAsesor: '',
        dni: '',
        telefono: '',
        nombre: '',
        monto: '',
        tasa: '',
        cuota: '',
        plazo: '',
        fechaHora: '',
        duracion: '',
        modoEntrada: 'informativo',
    });
});

test('createInitialFormState seeds advisor identity from the current user', () => {
    assert.deepEqual(
        createInitialFormState({
            name: 'Ana Lopez',
            dni: '12345678',
        }),
        {
            nombreAsesor: 'Ana Lopez',
            dni: '12345678',
            telefono: '',
            nombre: '',
            monto: '',
            tasa: '',
            cuota: '',
            plazo: '',
            fechaHora: '',
            duracion: '',
            modoEntrada: 'informativo',
        },
    );
});
