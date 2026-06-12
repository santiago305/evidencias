import type { FormState } from '../types';

export function createInitialFormState(): FormState {
    return {
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
        modoEntrada: 'informativo',
    };
}
