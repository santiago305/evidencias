import assert from 'node:assert/strict';
import test from 'node:test';
import { buildConversationVariables } from './conversationVariables.ts';

test('buildConversationVariables exposes the supported conversation placeholders in order', () => {
    const variables = buildConversationVariables(
        {
            telefono: '999999999',
            nombre: 'GEORGE SANTIAGO YACILA SANDOVAL',
            monto: '1500',
            tasa: '2.5',
            cuota: '250',
            plazo: '12',
            fechaHora: '',
            fechaHoraRegistro: '',
            duracion: '',
            modoEntrada: 'informativo',
        },
        'MARIA ELENA LOPEZ',
    );

    assert.deepEqual(variables, [
        {
            key: 'nombre_cliente',
            label: 'Nombre de cliente',
            value: 'George Santiago Yacila Sandoval',
            placeholder: '{nombre_cliente}',
            description: 'Nombre del cliente ingresado',
        },
        {
            key: 'primer_nombre_cliente',
            label: 'Primer nombre cliente',
            value: 'George',
            placeholder: '{primer_nombre_cliente}',
            description: 'Primer nombre del cliente ingresado',
        },
        {
            key: 'nombre_asesor',
            label: 'Nombre asesor',
            value: 'Maria Elena Lopez',
            placeholder: '{nombre_asesor}',
            description: 'Nombre del asesor logueado',
        },
        {
            key: 'primer_nombre_asesor',
            label: 'Primer nombre asesor',
            value: 'Maria',
            placeholder: '{primer_nombre_asesor}',
            description: 'Primer nombre del asesor logueado',
        },
        {
            key: 'telefono',
            label: 'Telefono',
            value: '999999999',
            placeholder: '{telefono}',
            description: 'Telefono ingresado en el formulario',
        },
        {
            key: 'monto',
            label: 'Monto',
            value: '1500',
            placeholder: '{monto}',
            description: 'Monto ingresado',
        },
        {
            key: 'tasa',
            label: 'Tasa',
            value: '2.5',
            placeholder: '{tasa}',
            description: 'Tasa ingresada',
        },
        {
            key: 'cuota',
            label: 'Cuota',
            value: '250',
            placeholder: '{cuota}',
            description: 'Cuota ingresada',
        },
        {
            key: 'plazo',
            label: 'Plazo',
            value: '12',
            placeholder: '{plazo}',
            description: 'Plazo ingresado',
        },
    ]);
});
