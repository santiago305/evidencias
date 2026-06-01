import type { FormState } from '../types';

export function createInitialFormState(): FormState {
    return {
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
    };
}
