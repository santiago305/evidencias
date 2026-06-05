import { defaultAdvisorSignature } from '../../config/whatsapp/signature';
import { defaultTemplateValues } from '../../config/whatsapp/templateDefaults';
import { interpolateGenderedAdvisorWords, uppercaseFirstLetter } from './genderedAdvisorWords';

export function interpolateTemplate(text: string, values: Record<string, string>) {
    const withGenderedAdvisorWords = interpolateGenderedAdvisorWords(text, values.sexualidad_asesor ?? 'M');

    return uppercaseFirstLetter(
        withGenderedAdvisorWords.replace(/\{(\w+)\}/g, (_, key: string) => {
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
}: {
    nombreCliente: string;
    nombreAsesor: string;
    saludo: string;
    tramo: string;
    montoFormateado: string | null;
    sexualidadAsesor?: 'M' | 'F';
}) {
    const nombreAsesorFirst = getFirstName(nombreAsesor) || 'Maria';

    return {
        asesor: nombreAsesorFirst,
        asesor_nombre: nombreAsesor,
        cliente: nombreCliente,
        firma: defaultAdvisorSignature,
        saludo: saludo.toLocaleLowerCase('es-PE'),
        tramo,
        sexualidad_asesor: sexualidadAsesor ?? 'M',
        monto: montoFormateado ?? defaultTemplateValues.monto_formateado,
        monto_formateado: montoFormateado ?? defaultTemplateValues.monto_formateado,
    };
}
