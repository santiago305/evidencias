import type { FormState } from '../types';

export function createInitialFormState(): FormState {
    return {
        telefono: '',
        nombre: '',
        sexo: '',
        fecha_nacimiento: '',
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
