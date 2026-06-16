import type { ReactNode } from 'react';
import { pick } from '../../../../../lib/whatsapp/random';
import type { TipoCliente } from '../../../../../types';

export type ConversationIntent =
    | 'informacion_general'
    | 'analitico'
    | 'evaluador'
    | 'listo_para_proceso'
    | 'practico_logistica'
    | 'oportunista'
    | 'desinteresado';

export interface ConversationQuestionAwarePlan {
    advisorReplyLines?: string[];
    followupLines?: ReactNode[];
}

export interface ContactadoSecondExchangePlan {
    clientLines: string[];
    advisorLines: string[];
}

const conversationIntentSet = new Set<ConversationIntent>([
    'informacion_general',
    'analitico',
    'evaluador',
    'listo_para_proceso',
    'practico_logistica',
    'oportunista',
    'desinteresado',
]);

function normalizeTextForMatching(lines: string[]) {
    return lines
        .join(' ')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

function joinSpanishParts(parts: string[]) {
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return `${parts[0]} y ${parts[1]}`;
    return `${parts.slice(0, -1).join(', ')} y ${parts[parts.length - 1]}`;
}

function formatTasaValue(value: string | null) {
    if (!value) return 'N/A';
    return value.includes('%') ? value : `${value}%`;
}

function buildLoanSummaryReply({
    formattedMonto,
    formattedCuota,
    plazoValue,
    tasaValue,
}: {
    formattedMonto: string | null;
    formattedCuota: string | null;
    plazoValue: string | null;
    tasaValue: string | null;
}) {
    const parts: string[] = [];

    if (formattedMonto) {
        parts.push(`monto S/${formattedMonto}`);
    }

    if (formattedCuota) {
        parts.push(`cuota S/${formattedCuota}`);
    }

    if (plazoValue) {
        parts.push(`plazo ${plazoValue} meses`);
    }

    if (tasaValue) {
        parts.push(`tasa ${formatTasaValue(tasaValue)}`);
    }

    if (parts.length === 0) {
        return 'Claro. Le puedo recordar el detalle del prestamo por este medio.';
    }

    return `Claro. Le recuerdo el detalle del prestamo: ${joinSpanishParts(parts)}.`;
}

export function isConversationIntent(value: string | undefined): value is ConversationIntent {
    return conversationIntentSet.has(value as ConversationIntent);
}

export function buildQuestionAwarePlan({
    mode,
    intent,
    replyLines,
    simulationLines,
}: {
    mode: 'contactado' | 'informativo';
    intent: ConversationIntent;
    replyLines: string[];
    simulationLines: ReactNode[];
}): ConversationQuestionAwarePlan | null {
    const text = normalizeTextForMatching(replyLines);

    if (mode === 'informativo' && intent === 'informacion_general') {
        return {
            followupLines: simulationLines,
        };
    }

    if (intent === 'analitico') {
        if (/como son los pagos|detalle de pagos|opciones de pago/.test(text)) {
            return {
                advisorReplyLines: [
                    'Claro, los pagos son de manera mensual y el descuento se realiza por planilla en caso usted se encuentre en planilla.',
                ],
            };
        }

        if (/terminaria pagando|pagaria en total|total aproximadamente|termina siendo/.test(text)) {
            return {
                advisorReplyLines: [
                    'Claro, para ver cuanto terminaria pagando debe multiplicar su cuota por el numero de meses del plazo. En estos momentos le paso su simulacion para que pueda revisarlo mejor.',
                ],
                followupLines: simulationLines,
            };
        }

        if (/cuota|mensual|al mes|sale mensual/.test(text)) {
            return {
                advisorReplyLines: [
                    'Entiendo, en estos momentos le paso su simulacion donde podra ver la cuota aproximada de este prestamo preaprobado.',
                ],
                followupLines: simulationLines,
            };
        }

        if (/tasa/.test(text)) {
            return {
                advisorReplyLines: [
                    'Entiendo, en estos momentos le paso su simulacion donde podra ver la tasa referencial y las condiciones principales del prestamo.',
                ],
                followupLines: simulationLines,
            };
        }

        if (/aprobarian|monto exacto|que monto|cuanto me darian/.test(text)) {
            return {
                advisorReplyLines: [
                    'Entiendo, en estos momentos le paso su simulacion donde podra ver el monto referencial de este prestamo preaprobado.',
                ],
                followupLines: simulationLines,
            };
        }

        return {
            advisorReplyLines: ['Entiendo, en estos momentos le paso su simulacion donde podra ver el detalle de monto, cuota, plazo y tasa.'],
            followupLines: simulationLines,
        };
    }

    if (intent === 'evaluador') {
        return {
            advisorReplyLines: ['Entiendo, en estos momentos le paso su simulacion de este prestamo preaprobado para que pueda ver lo consultado.'],
            followupLines: simulationLines,
        };
    }

    if (intent === 'listo_para_proceso') {
        if (/solo|algo mas|aparte/.test(text)) {
            return {
                advisorReplyLines: [
                    'Claro, no es solo eso. Para avanzar con su prestamo necesita su DNI fisico vigente, sus ultimas 3 boletas de pago y su tarjeta Multired.',
                ],
            };
        }

        if (/copia|original/.test(text)) {
            return {
                advisorReplyLines: [
                    'Claro. Para avanzar con su prestamo necesita su DNI fisico vigente, sus ultimas 3 boletas de pago y su tarjeta Multired.',
                ],
            };
        }

        return {
            advisorReplyLines: [
                'Claro. Para avanzar con su prestamo necesita su DNI fisico vigente, sus ultimas 3 boletas de pago y su tarjeta Multired.',
            ],
        };
    }

    if (intent === 'practico_logistica') {
        if (/fin de semana|fines de semana|horario|horarios|atienden|atencion|sabado|sábado/.test(text)) {
            return {
                advisorReplyLines: [
                    'Claro. La atencion es de lunes a sabado y puede acercarse a la agencia del Banco de la Nacion mas cercana para continuar con el proceso.',
                ],
            };
        }

        if (/hoy|manana|sin cita/.test(text)) {
            return {
                advisorReplyLines: [
                    'Claro. Debe acercarse a la agencia mas cercana del Banco de la Nacion para continuar, y si desea puede validar el horario de la sede que le quede mas comoda.',
                ],
            };
        }

        if (/otra ciudad|cualquier agencia|cualquier sede/.test(text)) {
            return {
                advisorReplyLines: [
                    'Claro. Puede acercarse a la agencia del Banco de la Nacion que le quede mas cercana para continuar con el proceso.',
                ],
            };
        }

        return {
            advisorReplyLines: ['Claro. El tramite se realiza en la agencia mas cercana del Banco de la Nacion.'],
        };
    }

    if (intent === 'oportunista') {
        if (mode === 'informativo' && /puede cambiar el monto o condiciones con el tiempo/.test(text)) {
            return {
                advisorReplyLines: ['Claro. El prestamo preaprobado puede mantenerse vigente hasta fin de mes, pero cambia cada mes.'],
            };
        }

        if (/fecha limite|hasta que dia|hasta cuando|tiempo tengo|vigente|vence/.test(text)) {
            return {
                advisorReplyLines: ['Claro. En este caso, el prestamo preaprobado puede mantenerse vigente hasta fin de mes.'],
            };
        }

        return {
            advisorReplyLines: ['Claro. El prestamo preaprobado puede mantenerse vigente hasta fin de mes.'],
        };
    }

    return null;
}

export function buildContactadoSecondExchange({
    intent,
    tipoCliente,
    formattedMonto,
    formattedCuota,
    plazoValue,
    tasaValue,
    rng,
}: {
    intent: ConversationIntent;
    tipoCliente: TipoCliente;
    formattedMonto: string | null;
    formattedCuota: string | null;
    plazoValue: string | null;
    tasaValue: string | null;
    rng: () => number;
}): ContactadoSecondExchangePlan | null {
    if (rng() >= 0.45 || intent === 'desinteresado') {
        return null;
    }

    const requirementsReply =
        'Claro. Para avanzar con su prestamo necesita su DNI fisico vigente, sus ultimas 3 boletas de pago y su tarjeta Multired.';
    const logisticsReply = 'Claro. El tramite se realiza en la agencia mas cercana del Banco de la Nacion.';
    const summaryReply = buildLoanSummaryReply({
        formattedMonto,
        formattedCuota,
        plazoValue,
        tasaValue,
    });

    const profileOptionsByIntent: Record<TipoCliente, Record<Exclude<ConversationIntent, 'desinteresado'>, ContactadoSecondExchangePlan[]>> = {
        apurado: {
            informacion_general: [
                {
                    clientLines: ['Ok, y que necesito llevar?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['Entiendo, y a que agencia tendria que ir?'],
                    advisorLines: [logisticsReply],
                },
            ],
            analitico: [
                {
                    clientLines: ['Ok, y que necesito llevar?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['Entiendo, y donde tendria que ir?'],
                    advisorLines: [logisticsReply],
                },
            ],
            evaluador: [
                {
                    clientLines: ['Ok, y que necesito llevar?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['Entiendo, y donde tendria que ir?'],
                    advisorLines: [logisticsReply],
                },
            ],
            listo_para_proceso: [
                {
                    clientLines: ['Ok, y me podrias brindar el detalle del prestamo?'],
                    advisorLines: [summaryReply],
                },
                {
                    clientLines: ['Entiendo, y a que agencia tendria que ir?'],
                    advisorLines: [logisticsReply],
                },
            ],
            practico_logistica: [
                {
                    clientLines: ['Ok, y que necesito llevar?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['Entiendo, y me recuerdas el detalle del prestamo?'],
                    advisorLines: [summaryReply],
                },
            ],
            oportunista: [
                {
                    clientLines: ['Ok, y me recuerdas el detalle del prestamo?'],
                    advisorLines: [summaryReply],
                },
                {
                    clientLines: ['Entiendo, y que necesito llevar?'],
                    advisorLines: [requirementsReply],
                },
            ],
        },
        sereno: {
            informacion_general: [
                {
                    clientLines: ['Entiendo, me podria indicar que documentos necesito?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['De acuerdo, me podria indicar a que agencia tendria que acercarme?'],
                    advisorLines: [logisticsReply],
                },
            ],
            analitico: [
                {
                    clientLines: ['Entiendo, me podria indicar tambien los requisitos?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['De acuerdo, y donde tendria que realizar el tramite?'],
                    advisorLines: [logisticsReply],
                },
            ],
            evaluador: [
                {
                    clientLines: ['Gracias, y que documentos necesitaria para avanzar?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['Entiendo, y en que agencia tendria que continuar?'],
                    advisorLines: [logisticsReply],
                },
            ],
            listo_para_proceso: [
                {
                    clientLines: ['Entiendo, tambien me podria recordar el detalle del prestamo?'],
                    advisorLines: [summaryReply],
                },
                {
                    clientLines: ['De acuerdo, y en que agencia tendria que presentarme?'],
                    advisorLines: [logisticsReply],
                },
            ],
            practico_logistica: [
                {
                    clientLines: ['Entiendo, y que documentos necesitaria llevar?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['Gracias, tambien me podria recordar el detalle del prestamo?'],
                    advisorLines: [summaryReply],
                },
            ],
            oportunista: [
                {
                    clientLines: ['Entiendo, me podria recordar tambien el detalle del prestamo?'],
                    advisorLines: [summaryReply],
                },
                {
                    clientLines: ['De acuerdo, y que documentos necesitaria para avanzar?'],
                    advisorLines: [requirementsReply],
                },
            ],
        },
        desconfiado: {
            informacion_general: [
                {
                    clientLines: ['Entiendo, me podria confirmar exactamente que documentos piden?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['De acuerdo, me podria confirmar en que agencia tendria que hacer el tramite?'],
                    advisorLines: [logisticsReply],
                },
            ],
            analitico: [
                {
                    clientLines: ['Entiendo, me podria confirmar tambien los requisitos reales?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['De acuerdo, en que agencia se realiza exactamente el tramite?'],
                    advisorLines: [logisticsReply],
                },
            ],
            evaluador: [
                {
                    clientLines: ['Entiendo, y que documentos exactos tendria que presentar?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['De acuerdo, me podria confirmar donde se realiza el proceso?'],
                    advisorLines: [logisticsReply],
                },
            ],
            listo_para_proceso: [
                {
                    clientLines: ['Entiendo, ahora me podria confirmar el detalle del prestamo?'],
                    advisorLines: [summaryReply],
                },
                {
                    clientLines: ['De acuerdo, y en que agencia se presenta todo esto?'],
                    advisorLines: [logisticsReply],
                },
            ],
            practico_logistica: [
                {
                    clientLines: ['Entiendo, me podria confirmar tambien que documentos tendria que llevar?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['De acuerdo, tambien me podria detallar nuevamente el prestamo?'],
                    advisorLines: [summaryReply],
                },
            ],
            oportunista: [
                {
                    clientLines: ['Entiendo, me podria confirmar tambien el detalle del prestamo?'],
                    advisorLines: [summaryReply],
                },
                {
                    clientLines: ['De acuerdo, y cuales serian exactamente los requisitos?'],
                    advisorLines: [requirementsReply],
                },
            ],
        },
        frio: {
            informacion_general: [
                {
                    clientLines: ['Y que necesito llevar?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['Y a que agencia voy?'],
                    advisorLines: [logisticsReply],
                },
            ],
            analitico: [
                {
                    clientLines: ['Y que necesito llevar?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['Y donde es?'],
                    advisorLines: [logisticsReply],
                },
            ],
            evaluador: [
                {
                    clientLines: ['Y que necesito llevar?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['Y donde sigo?'],
                    advisorLines: [logisticsReply],
                },
            ],
            listo_para_proceso: [
                {
                    clientLines: ['Y el detalle del prestamo?'],
                    advisorLines: [summaryReply],
                },
                {
                    clientLines: ['Y a que agencia voy?'],
                    advisorLines: [logisticsReply],
                },
            ],
            practico_logistica: [
                {
                    clientLines: ['Y que necesito llevar?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['Y el detalle del prestamo?'],
                    advisorLines: [summaryReply],
                },
            ],
            oportunista: [
                {
                    clientLines: ['Y el detalle del prestamo?'],
                    advisorLines: [summaryReply],
                },
                {
                    clientLines: ['Y que necesito llevar?'],
                    advisorLines: [requirementsReply],
                },
            ],
        },
        conversador: {
            informacion_general: [
                {
                    clientLines: ['Entiendo, y que tendria que llevar para avanzar?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['Buenisimo, y a que agencia tendria que acercarme?'],
                    advisorLines: [logisticsReply],
                },
            ],
            analitico: [
                {
                    clientLines: ['Entiendo, y que documentos me pedirian?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['Buenisimo, y donde tendria que hacer el tramite?'],
                    advisorLines: [logisticsReply],
                },
            ],
            evaluador: [
                {
                    clientLines: ['Perfecto, y que necesitaria llevar para continuar?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['Entiendo, y en que agencia tendria que seguir?'],
                    advisorLines: [logisticsReply],
                },
            ],
            listo_para_proceso: [
                {
                    clientLines: ['Perfecto, y me podrias recordar el detalle del prestamo?'],
                    advisorLines: [summaryReply],
                },
                {
                    clientLines: ['Entiendo, y a que agencia tendria que ir entonces?'],
                    advisorLines: [logisticsReply],
                },
            ],
            practico_logistica: [
                {
                    clientLines: ['Buenisimo, y que documentos tendria que llevar?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['Perfecto, y me recuerdas el detalle del prestamo?'],
                    advisorLines: [summaryReply],
                },
            ],
            oportunista: [
                {
                    clientLines: ['Entiendo, y me podrias recordar el detalle del prestamo?'],
                    advisorLines: [summaryReply],
                },
                {
                    clientLines: ['Perfecto, y que tendria que llevar para avanzar?'],
                    advisorLines: [requirementsReply],
                },
            ],
        },
        indeciso: {
            informacion_general: [
                {
                    clientLines: ['Entiendo, y que documentos necesitaria si decido avanzar?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['De acuerdo, y a que agencia tendria que acercarme si lo tomo?'],
                    advisorLines: [logisticsReply],
                },
            ],
            analitico: [
                {
                    clientLines: ['Entiendo, y que requisitos necesitaria si decido continuar?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['De acuerdo, y donde tendria que realizar el tramite si avanzo?'],
                    advisorLines: [logisticsReply],
                },
            ],
            evaluador: [
                {
                    clientLines: ['Entiendo, y que documentos necesitaria para seguir despues?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['Gracias, y en que agencia tendria que continuar si me animo?'],
                    advisorLines: [logisticsReply],
                },
            ],
            listo_para_proceso: [
                {
                    clientLines: ['Entiendo, tambien me podria recordar el detalle del prestamo?'],
                    advisorLines: [summaryReply],
                },
                {
                    clientLines: ['De acuerdo, y a que agencia tendria que ir si avanzo?'],
                    advisorLines: [logisticsReply],
                },
            ],
            practico_logistica: [
                {
                    clientLines: ['Entiendo, y que documentos necesitaria llevar?'],
                    advisorLines: [requirementsReply],
                },
                {
                    clientLines: ['Gracias, tambien me podria recordar el detalle del prestamo?'],
                    advisorLines: [summaryReply],
                },
            ],
            oportunista: [
                {
                    clientLines: ['Entiendo, tambien me podria recordar el detalle del prestamo?'],
                    advisorLines: [summaryReply],
                },
                {
                    clientLines: ['De acuerdo, y que necesitaria llevar si decido avanzar?'],
                    advisorLines: [requirementsReply],
                },
            ],
        },
    };

    return pick(profileOptionsByIntent[tipoCliente][intent], rng);
}
