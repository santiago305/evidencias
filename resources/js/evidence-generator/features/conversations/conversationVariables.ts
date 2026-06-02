import type { FormState } from '../../types';

export interface ConversationVariable {
    key: string;
    label: string;
    value: string;
    placeholder: string;
    description: string;
}

function toTitleCase(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/\b\p{L}/gu, (character) => character.toUpperCase());
}

function getFirstName(value: string): string {
    const normalizedValue = toTitleCase(value);
    if (normalizedValue === '') {
        return 'Asesor';
    }

    return normalizedValue.split(/\s+/)[0] ?? 'Asesor';
}

export function buildConversationVariables(form: FormState, advisorName: string): ConversationVariable[] {
    return [
        {
            key: 'nombre_cliente',
            label: 'Nombre de cliente',
            value: toTitleCase(form.nombre),
            placeholder: '{nombre_cliente}',
            description: 'Nombre del cliente ingresado',
        },
        {
            key: 'primer_nombre_cliente',
            label: 'Primer nombre cliente',
            value: getFirstName(form.nombre),
            placeholder: '{primer_nombre_cliente}',
            description: 'Primer nombre del cliente ingresado',
        },
        {
            key: 'nombre_asesor',
            label: 'Nombre asesor',
            value: toTitleCase(advisorName),
            placeholder: '{nombre_asesor}',
            description: 'Nombre del asesor logueado',
        },
        {
            key: 'primer_nombre_asesor',
            label: 'Primer nombre asesor',
            value: getFirstName(advisorName),
            placeholder: '{primer_nombre_asesor}',
            description: 'Primer nombre del asesor logueado',
        },
        {
            key: 'telefono',
            label: 'Telefono',
            value: form.telefono,
            placeholder: '{telefono}',
            description: 'Telefono ingresado en el formulario',
        },
        {
            key: 'monto',
            label: 'Monto',
            value: form.monto,
            placeholder: '{monto}',
            description: 'Monto ingresado',
        },
        {
            key: 'tasa',
            label: 'Tasa',
            value: form.tasa,
            placeholder: '{tasa}',
            description: 'Tasa ingresada',
        },
        {
            key: 'cuota',
            label: 'Cuota',
            value: form.cuota,
            placeholder: '{cuota}',
            description: 'Cuota ingresada',
        },
        {
            key: 'plazo',
            label: 'Plazo',
            value: form.plazo,
            placeholder: '{plazo}',
            description: 'Plazo ingresado',
        },
    ];
}
