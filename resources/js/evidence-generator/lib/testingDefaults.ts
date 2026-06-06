import type { FormState } from '../types';

const MALE_CLIENT_NAMES = ['Juan Perez', 'Carlos Ramirez', 'Miguel Torres', 'Luis Garcia', 'Jorge Mendoza'] as const;

function formatDateTimeLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function pickClientName(random: () => number): string {
    const index = Math.floor(random() * MALE_CLIENT_NAMES.length);

    return MALE_CLIENT_NAMES[Math.min(index, MALE_CLIENT_NAMES.length - 1)] ?? MALE_CLIENT_NAMES[0];
}

function buildClientDni(random: () => number): string {
    const value = Math.floor(10000000 + random() * 90000000);

    return String(value).slice(0, 8);
}

export function applyConversationTestDefaults(form: FormState, now = new Date(), random: () => number = Math.random): FormState {
    const registrationDate = new Date(now);
    const minimumDate = new Date(registrationDate);
    minimumDate.setMinutes(registrationDate.getMinutes() - 75);

    return {
        ...form,
        telefono: form.telefono.trim() === '' ? '999999999' : form.telefono,
        nombre: form.nombre.trim() === '' ? pickClientName(random) : form.nombre,
        dniCliente: form.dniCliente.trim() === '' ? buildClientDni(random) : form.dniCliente,
        monto: form.monto.trim() === '' ? '99999' : form.monto,
        tasa: form.tasa.trim() === '' ? '9.99' : form.tasa,
        cuota: form.cuota.trim() === '' ? '2148' : form.cuota,
        plazo: form.plazo.trim() === '' ? '60' : form.plazo,
        fechaHora: form.fechaHora.trim() === '' ? formatDateTimeLocal(minimumDate) : form.fechaHora,
        fechaHoraRegistro: form.fechaHoraRegistro.trim() === '' ? formatDateTimeLocal(registrationDate) : form.fechaHoraRegistro,
        duracion: form.duracion.trim() === '' ? '60' : form.duracion,
    };
}
