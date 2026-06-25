import assert from 'node:assert/strict';
import test from 'node:test';
import {
    clearReplayHydratedForm,
    getGenerateEvidenceActionLabel,
    hydrateReplayForm,
    isReplayGenerateBlocked,
    shouldApplyReplayLookupResult,
} from './replayForm.ts';
import type { FormState } from '../types.ts';

function createFilledForm(): FormState {
    return {
        telefono: '999999999',
        nombre: 'Cliente Anterior',
        dniCliente: '12345678',
        monto: '2500',
        tasa: '2.5%',
        cuota: '300',
        plazo: '12 meses',
        fechaHora: '2026-06-20T10:00',
        fechaHoraRegistro: '2026-06-20T10:05',
        duracion: '8',
        img_64: 'data:image/png;base64,old-image',
        img_64_file: null,
        modoEntrada: 'informativo',
    };
}

test('hydrateReplayForm fills replay fields, keeps file input empty, and reuses stored mode/image values', () => {
    const nextForm = hydrateReplayForm(createFilledForm(), {
        telefono: '988111222',
        nombre: 'Ana Diaz',
        dniCliente: '87654321',
        monto: '5100',
        tasa: '1.8%',
        cuota: '470',
        plazo: '18 meses',
        fechaHora: '2026-06-25T14:30',
        fechaHoraRegistro: '2026-06-25T14:31',
        duracion: '11',
        modoEntrada: 'contactado',
        img_64: 'data:image/png;base64,new-image',
    });

    assert.deepEqual(nextForm, {
        telefono: '988111222',
        nombre: 'Ana Diaz',
        dniCliente: '87654321',
        monto: '5100',
        tasa: '1.8%',
        cuota: '470',
        plazo: '18 meses',
        fechaHora: '2026-06-25T14:30',
        fechaHoraRegistro: '2026-06-25T14:31',
        duracion: '11',
        img_64: 'data:image/png;base64,new-image',
        img_64_file: null,
        modoEntrada: 'contactado',
    });
});

test('clearReplayHydratedForm removes stale replay values after a failed lookup', () => {
    assert.deepEqual(clearReplayHydratedForm(createFilledForm()), {
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

test('shouldApplyReplayLookupResult only accepts the response for the current sal', () => {
    assert.equal(shouldApplyReplayLookupResult('EVC-002', 'EVC-002'), true);
    assert.equal(shouldApplyReplayLookupResult('EVC-003', 'EVC-002'), false);
    assert.equal(shouldApplyReplayLookupResult('', 'EVC-002'), false);
});

test('replay generation stays blocked while the replay lookup is pending', () => {
    assert.equal(isReplayGenerateBlocked({ isGenerating: false, isReplayLookupPending: true, seedCodeInput: 'EVC-002' }), true);
    assert.equal(isReplayGenerateBlocked({ isGenerating: false, isReplayLookupPending: false, seedCodeInput: 'EVC-002' }), false);
    assert.equal(isReplayGenerateBlocked({ isGenerating: true, isReplayLookupPending: false, seedCodeInput: '' }), true);
});

test('generate action label reflects loading and regeneration states', () => {
    assert.equal(getGenerateEvidenceActionLabel({ isGenerating: false, isReplayLookupPending: true, seedCodeInput: 'EVC-002' }), 'Cargando evidencia...');
    assert.equal(getGenerateEvidenceActionLabel({ isGenerating: true, isReplayLookupPending: false, seedCodeInput: 'EVC-002' }), 'Regenerando...');
    assert.equal(getGenerateEvidenceActionLabel({ isGenerating: false, isReplayLookupPending: false, seedCodeInput: 'EVC-002' }), 'Regenerar evidencia');
    assert.equal(getGenerateEvidenceActionLabel({ isGenerating: false, isReplayLookupPending: false, seedCodeInput: '' }), 'Generar evidencia');
});
