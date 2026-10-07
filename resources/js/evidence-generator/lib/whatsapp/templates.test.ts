import assert from 'node:assert/strict';
import test from 'node:test';
import { buildWhatsappTemplateValues, interpolateTemplate } from './templates.ts';

test('client treatment and birth date render from the original form values', () => {
    for (const [sexoCliente, treatment] of [
        ['M', 'Sr'],
        ['F', 'Sra'],
        ['', 'Sr/a'],
    ]) {
        const values = buildWhatsappTemplateValues({
            nombreCliente: 'Juan Perez',
            nombreAsesor: 'Ana Lopez',
            saludo: 'Buenos dias',
            tramo: 'manana',
            montoFormateado: '1500',
            sexoCliente,
            fechaNacimiento: '2001-02-03',
        });

        assert.equal(
            interpolateTemplate('Trato {s_cliente(cliente)}; nacimiento {fecha_nacimiento}', values),
            `Trato ${treatment}; nacimiento 03/02/2001`,
        );
    }
});

test('missing client treatment and birth date render safely', () => {
    const values = buildWhatsappTemplateValues({
        nombreCliente: 'Juan Perez',
        nombreAsesor: 'Ana Lopez',
        saludo: 'Buenos dias',
        tramo: 'manana',
        montoFormateado: '1500',
    });

    assert.equal(interpolateTemplate('Trato {s_cliente(cliente)}; nacimiento [{fecha_nacimiento}]', values), 'Trato Sr/a; nacimiento []');
});

test('client sex is not available through a generic conversation placeholder', () => {
    const values = buildWhatsappTemplateValues({
        nombreCliente: 'Juan Perez',
        nombreAsesor: 'Ana Lopez',
        saludo: 'Buenos dias',
        tramo: 'manana',
        montoFormateado: '1500',
        sexoCliente: 'M',
    });

    assert.equal(interpolateTemplate('Dato {sexo_cliente}', values), 'Dato {sexo_cliente}');
});

test('client noun marker receives sex internally and keeps the legacy treatment', () => {
    const values = buildWhatsappTemplateValues({
        nombreCliente: 'Juan Perez',
        nombreAsesor: 'Ana Lopez',
        saludo: 'Buenos dias',
        tramo: 'manana',
        montoFormateado: '1500',
    });

    for (const [sex, expected] of [
        ['M', 'Trato Sr: profesor, niño, estudiante, actor; {sexo_cliente}'],
        ['F', 'Trato Sra: profesora, niña, estudiante, actriz; {sexo_cliente}'],
        ['', 'Trato Sr/a: profesor(a), niño(a), estudiante, actor/actriz; {sexo_cliente}'],
    ] as const) {
        assert.equal(
            interpolateTemplate(
                'Trato {s_cliente(cliente)}: {s_cliente(profesor)}, {s_cliente(niño)}, {s_cliente(estudiante)}, {s_cliente(actor)}; {sexo_cliente}',
                { ...values, 'cliente(cliente)': sex === 'M' ? 'Sr' : sex === 'F' ? 'Sra' : 'Sr/a' },
                sex,
            ),
            expected,
            sex,
        );
    }

    assert.equal(
        interpolateTemplate('Incompleto {s_cliente()}; inválido {s_cliente(dos palabras)}', values, 'F'),
        'Incompleto {s_cliente()}; inválido {s_cliente(dos palabras)}',
    );
    assert.equal(interpolateTemplate('La {s_cliente(me\u0301dico)}', values, 'F'), 'La médica');
});
