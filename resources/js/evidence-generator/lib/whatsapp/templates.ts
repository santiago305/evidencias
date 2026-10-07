import { s_cliente } from '../../../lib/s_cliente.ts';
import { defaultAdvisorSignature } from '../../config/whatsapp/signature.ts';
import { defaultTemplateValues } from '../../config/whatsapp/templateDefaults.ts';
import { interpolateGenderedAdvisorWords, uppercaseFirstLetter } from './genderedAdvisorWords.ts';
import { parseDateKey } from './time.ts';

export function interpolateTemplate(text: string, values: Record<string, string>, sexoCliente?: string) {
    const withGenderedAdvisorWords = interpolateGenderedAdvisorWords(text, values.sexualidad_asesor ?? 'M');
    const clientTreatment = values['cliente(cliente)'] ?? 'Sr/a';
    const withClientTreatment = withGenderedAdvisorWords.replace(/\{s_cliente\(cliente\)\}/gu, clientTreatment);
    const gender = sexoCliente === 'M' ? 'm' : sexoCliente === 'F' ? 'f' : undefined;
    const withGenderedClientNouns = withClientTreatment.replace(/\{s_cliente\(([^{}()]*)\)\}/gu, (marker, argument: string) => {
        const word = argument.trim().normalize('NFC');
        return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+$/u.test(word) ? s_cliente(word, gender) : marker;
    });

    return uppercaseFirstLetter(
        withGenderedClientNouns.replace(/\{(\w+)\}/g, (_, key: string) => {
            return values[key] ?? `{${key}}`;
        }),
    );
}

export function getFirstName(fullName: string) {
    const cleaned = fullName.trim();
    if (!cleaned) return '';
    return cleaned.split(/\s+/)[0] ?? '';
}

export function buildWhatsappTemplateValues({
    nombreCliente,
    nombreAsesor,
    saludo,
    tramo,
    montoFormateado,
    sexualidadAsesor,
    sexoCliente,
    fechaNacimiento,
}: {
    nombreCliente: string;
    nombreAsesor: string;
    saludo: string;
    tramo: string;
    montoFormateado: string | null;
    sexualidadAsesor?: 'M' | 'F';
    sexoCliente?: string;
    fechaNacimiento?: string;
}) {
    const nombreAsesorFirst = getFirstName(nombreAsesor) || 'Maria';
    const birthDateParts = parseDateKey(fechaNacimiento ?? '');
    const formattedBirthDate = birthDateParts
        ? `${String(birthDateParts.day).padStart(2, '0')}/${String(birthDateParts.month).padStart(2, '0')}/${birthDateParts.year}`
        : '';

    return {
        asesor: nombreAsesorFirst,
        asesor_nombre: nombreAsesor,
        cliente: nombreCliente,
        firma: defaultAdvisorSignature,
        saludo: saludo.toLocaleLowerCase('es-PE'),
        tramo,
        sexualidad_asesor: sexualidadAsesor ?? 'M',
        'cliente(cliente)': sexoCliente === 'M' ? 'Sr' : sexoCliente === 'F' ? 'Sra' : 'Sr/a',
        fecha_nacimiento: formattedBirthDate,
        monto: montoFormateado ?? defaultTemplateValues.monto_formateado,
        monto_formateado: montoFormateado ?? defaultTemplateValues.monto_formateado,
    };
}
