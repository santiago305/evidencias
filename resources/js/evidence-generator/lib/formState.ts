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
        TCEA: '',
        fechaHora: '',
        fechaHoraRegistro: '',
        duracion: '',
        img_64: '',
        img_64_file: null,
        modoEntrada: 'informativo',
    };
}
