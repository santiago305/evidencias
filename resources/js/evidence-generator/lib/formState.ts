import type { FormState } from '../types';

export function createInitialFormState(): FormState {
    return {
        telefono: '',
        nombre: '',
        monto: '',
        tasa: '',
        cuota: '',
        plazo: '',
        fechaHora: '',
        fechaHoraRegistro: '',
        duracion: '',
        modoEntrada: 'informativo',
    };
}
