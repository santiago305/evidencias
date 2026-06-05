import assert from 'node:assert/strict';
import test from 'node:test';
import { buildConversationVariables } from './conversationVariables.ts';

test('buildConversationVariables exposes only canonical placeholders in order', () => {
    const variables = buildConversationVariables();

    assert.deepEqual(variables, [
        {
            key: 'saludo',
            placeholder: '{saludo}',
        },
        {
            key: 'nombre_cliente',
            placeholder: '{nombre_cliente}',
        },
        {
            key: 'primer_nombre_cliente',
            placeholder: '{primer_nombre_cliente}',
        },
        {
            key: 'nombre_asesor',
            placeholder: '{nombre_asesor}',
        },
        {
            key: 'primer_nombre_asesor',
            placeholder: '{primer_nombre_asesor}',
        },
        {
            key: 's_asesor',
            placeholder: '{s_asesor(asesor)}',
        },
        {
            key: 'telefono',
            placeholder: '{telefono}',
        },
        {
            key: 'dni_cliente',
            placeholder: '{dni_cliente}',
        },
        {
            key: 'monto',
            placeholder: '{monto}',
        },
        {
            key: 'tasa',
            placeholder: '{tasa}',
        },
        {
            key: 'cuota',
            placeholder: '{cuota}',
        },
        {
            key: 'plazo',
            placeholder: '{plazo}',
        },
    ]);
});
