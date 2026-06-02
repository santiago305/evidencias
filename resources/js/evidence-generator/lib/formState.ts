import type { FormState } from '../types';

interface UserIdentity {
    name: string;
    dni: string;
}

export function createInitialFormState(user?: UserIdentity): FormState {
    return {
        nombreAsesor: user?.name ?? '',
        dni: user?.dni ?? '',
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
