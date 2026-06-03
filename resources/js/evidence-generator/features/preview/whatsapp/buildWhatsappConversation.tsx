import type { ReactNode } from 'react';
import { getWhatsappConversationModeConfig } from '../../../config/whatsapp/conversationModes';
import contactadoRespuestasAsesorPorIntencionData from '../../../data/modos/contactado/respuestasAsesorPorIntencion.json';
import informativoRespuestasAsesorPorIntencionData from '../../../data/modos/informativo/respuestasAsesorPorIntencion.json';
import respuestasAsesorDespedidaData from '../../../data/respuestasAsesorDespedida.json';
import respuestasClienteData from '../../../data/respuestasCliente.json';
import respuestasClienteDespedidaData from '../../../data/respuestasClienteDespedida.json';
import respuestasContinuacionAsesorData from '../../../data/respuestasContinuacionAsesor.json';
import { formatMoneyValue } from '../../../lib/whatsapp/format';
import { mulberry32, pick, pickWithFallback } from '../../../lib/whatsapp/random';
import { buildWhatsappTemplateValues, interpolateTemplate } from '../../../lib/whatsapp/templates';
import { formatDateKeyFromDate, formatTimeShort, getTimeOfDayParts, parseLocalDateTime } from '../../../lib/whatsapp/time';
import type { TipoCliente } from '../../../types';
import { buildContactadoSecondExchange, buildQuestionAwarePlan, isConversationIntent, type ConversationIntent } from './conversationReplyRules';
import type { MsgStatus } from './WhatsappPieces';
import type { WhatsappData } from './whatsappTypes';

export interface WhatsappConversationMessage {
    side: 'in' | 'out';
    time: string;
    dateKey?: string;
    lines: ReactNode[];
    status?: MsgStatus;
    quote?: {
        side: 'in' | 'out';
        text: string;
    };
}

type ContactadoReplyProfile = 'apurado' | 'sereno' | 'desconfiado';

const contactadoReplyProfileFallbacks: Record<TipoCliente, ContactadoReplyProfile[]> = {
    apurado: ['apurado', 'sereno'],
    sereno: ['sereno', 'apurado'],
    desconfiado: ['desconfiado', 'sereno'],
    frio: ['sereno', 'apurado'],
    conversador: ['sereno', 'apurado'],
    indeciso: ['sereno', 'desconfiado'],
};

function buildDetailLine(label: string, value: ReactNode) {
    return (
        <>
            {label}: <strong>{value}</strong>
        </>
    );
}

function formatTasaValue(value: string | null) {
    if (!value) return 'N/A';
    return value.includes('%') ? value : `${value}%`;
}

function pickContactadoAdvisorReply(intent: ConversationIntent, tipoCliente: TipoCliente, rng: () => number) {
    for (const profile of contactadoReplyProfileFallbacks[tipoCliente]) {
        const options = contactadoRespuestasAsesorPorIntencionData[intent]?.[profile];
        if (Array.isArray(options) && options.length > 0) {
            return pick(options, rng);
        }
    }

    return null;
}

function pickInformativoAdvisorReply(intent: ConversationIntent, tipoCliente: TipoCliente, rng: () => number) {
    const options = informativoRespuestasAsesorPorIntencionData[intent]?.[tipoCliente];

    if (Array.isArray(options) && options.length > 0) {
        return pick(options, rng);
    }

    return null;
}

function buildDefaultSimulationLines({
    formattedMonto,
    tasaValue,
    formattedCuota,
    plazoValue,
}: {
    formattedMonto: string | null;
    tasaValue: string | null;
    formattedCuota: string | null;
    plazoValue: string | null;
}) {
    const lines: ReactNode[] = ['Simulacion:'];

    if (formattedMonto) {
        lines.push(buildDetailLine('Monto', `S/${formattedMonto}`));
    }

    if (tasaValue) {
        lines.push(buildDetailLine('Tasa', formatTasaValue(tasaValue)));
    }

    if (formattedCuota) {
        lines.push(buildDetailLine('Cuota', `S/${formattedCuota}`));
    }

    if (plazoValue) {
        lines.push(buildDetailLine('Plazo', `${plazoValue} meses`));
    }

    if (lines.length === 1) {
        lines.push('Detalle referencial por confirmar.');
    }

    return lines;
}

export function buildWhatsappConversation(data: WhatsappData, messageStatus?: MsgStatus) {
    const seed = Math.floor((Date.now() + Math.random() * 1_000_000) % 1_000_000_000);
    const rng = mulberry32(seed);

    const minimumDate = parseLocalDateTime(data.fechaHora) ?? new Date();
    const registrationDate = parseLocalDateTime(data.fechaHoraRegistro) ?? minimumDate;
    const baseDate = new Date(minimumDate);
    const { saludo, tramo } = getTimeOfDayParts(baseDate);

    const nombreCliente = data.nombre?.trim() ? data.nombre.trim() : 'Pedro Vazquez';
    const nombreAsesor = data.nombreAsesor?.trim() ? data.nombreAsesor.trim() : 'Maria Perez';

    const useThousandsMonto = rng() < 0.5;
    const useThousandsCuota = rng() < 0.5;
    const formattedMonto = data.monto?.trim() ? formatMoneyValue(data.monto, useThousandsMonto) : null;
    const formattedCuota = data.cuota?.trim() ? formatMoneyValue(data.cuota, useThousandsCuota) : null;
    const tasaValue = data.tasa?.trim() ? data.tasa.trim() : null;
    const plazoValue = data.plazo?.trim() ? data.plazo.trim() : null;

    const templateValues = buildWhatsappTemplateValues({
        nombreCliente,
        nombreAsesor,
        saludo,
        tramo,
        montoFormateado: formattedMonto,
    });
    const extendedTemplateValues = {
        ...templateValues,
        cuota: formattedCuota ?? 'N/A',
        cuota_formateada: formattedCuota ?? 'N/A',
        plazo: plazoValue ?? 'N/A',
        tasa: formatTasaValue(tasaValue),
    };

    const normalizeReply = (lines: string[]) => lines.map((line) => interpolateTemplate(line, extendedTemplateValues));
    const normalizeReplyVariant = (reply: string | string[]) => normalizeReply(Array.isArray(reply) ? reply : [reply]);

    const modeConfig = getWhatsappConversationModeConfig(data.modoEntrada, data.tipoCliente);

    const firstMessageLines = normalizeReply(pick(modeConfig.mensajeEntrada, rng));

    const continuacionesAsesor = respuestasContinuacionAsesorData;

    const statusForMessages: MsgStatus = messageStatus ?? (rng() < 0.7 ? 'read' : 'delivered');

    const pickedInitialResponse = modeConfig.respuestaClienteInicial.length > 0 ? pick(modeConfig.respuestaClienteInicial, rng) : null;
    const pickedReplyVariant = pickedInitialResponse
        ? pick(pickedInitialResponse.respuestas, rng)
        : pickWithFallback(respuestasClienteData, respuestasClienteData, rng);
    const replyLines = normalizeReplyVariant(pickedReplyVariant);
    const activeIntent =
        (data.modoEntrada === 'contactado' || data.modoEntrada === 'informativo') && isConversationIntent(pickedInitialResponse?.tipo)
            ? pickedInitialResponse.tipo
            : null;
    const simulationLines = buildDefaultSimulationLines({
        formattedMonto,
        tasaValue,
        formattedCuota,
        plazoValue,
    });
    const questionAwarePlan = activeIntent
        ? buildQuestionAwarePlan({
              mode: data.modoEntrada,
              intent: activeIntent,
              replyLines,
              simulationLines,
          })
        : null;
    const advisorReplyTemplate = activeIntent
        ? data.modoEntrada === 'contactado'
            ? pickContactadoAdvisorReply(activeIntent, data.tipoCliente, rng)
            : pickInformativoAdvisorReply(activeIntent, data.tipoCliente, rng)
        : null;
    const advisorReplyLines = questionAwarePlan?.advisorReplyLines
        ? questionAwarePlan.advisorReplyLines
        : advisorReplyTemplate
          ? normalizeReplyVariant(advisorReplyTemplate)
          : [pick(continuacionesAsesor, rng)];
    const detalleBase = questionAwarePlan?.followupLines ?? null;
    const secondExchangePlan =
        data.modoEntrada === 'contactado' && activeIntent !== null
            ? buildContactadoSecondExchange({
                  intent: activeIntent,
                  tipoCliente: data.tipoCliente,
                  formattedMonto,
                  formattedCuota,
                  plazoValue,
                  tasaValue,
                  rng,
              })
            : null;
    const shouldUseHumanFarewell = (data.modoEntrada === 'contactado' || data.modoEntrada === 'informativo') && activeIntent !== 'desinteresado';
    const despedidaClienteLines = shouldUseHumanFarewell ? normalizeReplyVariant(pick(respuestasClienteDespedidaData, rng)) : null;
    const despedidaAsesorLines = shouldUseHumanFarewell ? normalizeReplyVariant(pick(respuestasAsesorDespedidaData, rng)) : null;
    const replyGapMinCount = Math.max(replyLines.length - 1, 0);

    const minTotal = replyGapMinCount + 7;
    const customDuration = Number.parseInt(data.duracion.trim(), 10);
    const minAllowed = Math.max(modeConfig.durationMinutes.min, minTotal);
    const maxAllowed = Math.max(modeConfig.durationMinutes.max, minAllowed);
    const totalMinutes =
        Number.isFinite(customDuration) && customDuration > 0
            ? Math.max(customDuration, minTotal)
            : minAllowed <= maxAllowed
              ? minAllowed + Math.floor(rng() * (maxAllowed - minAllowed + 1))
              : minAllowed;

    const gapsCount = 7 + replyGapMinCount;
    const remaining = Math.max(0, totalMinutes - minTotal);
    const gapExtras = Array.from({ length: gapsCount }, () => 0);
    for (let i = 0; i < remaining; i += 1) {
        const idx = Math.floor(rng() * gapsCount);
        gapExtras[idx] += 1;
    }

    const gap1 = 1 + (gapExtras[0] ?? 0);
    const replyGaps = Array.from({ length: replyGapMinCount }, (_, i) => {
        return 1 + (gapExtras[i + 1] ?? 0);
    });
    const gap2 = 1 + (gapExtras[1 + replyGapMinCount] ?? 0);
    const gap3 = 1 + (gapExtras[2 + replyGapMinCount] ?? 0);
    const gap4 = 1 + (gapExtras[3 + replyGapMinCount] ?? 0);
    const gap5 = 1 + (gapExtras[4 + replyGapMinCount] ?? 0);
    const gap6 = 1 + (gapExtras[5 + replyGapMinCount] ?? 0);
    const gap7 = 1 + (gapExtras[6 + replyGapMinCount] ?? 0);

    const registrationGap = 3 + Math.floor(rng() * 8);
    const conversationEnd = new Date(registrationDate);
    conversationEnd.setMinutes(conversationEnd.getMinutes() - registrationGap);

    const t1 = new Date(conversationEnd);
    t1.setMinutes(t1.getMinutes() - totalMinutes);
    const t2 = new Date(t1);
    t2.setMinutes(t2.getMinutes() + gap1);
    const t3 = new Date(t2);
    const replyGapTotal = replyGaps.reduce((sum, gap) => sum + gap, 0);
    t3.setMinutes(t3.getMinutes() + replyGapTotal + gap2);
    const t4 = new Date(t3);
    t4.setMinutes(t4.getMinutes() + gap3);
    const replyMessages = replyLines.map((line, idx) => {
        const time = new Date(t2);
        const offset = replyGaps.slice(0, idx).reduce((sum, gap) => sum + gap, 0);
        time.setMinutes(time.getMinutes() + offset);
        return {
            side: 'in' as const,
            time: formatTimeShort(time),
            dateKey: formatDateKeyFromDate(time),
            lines: [line],
        };
    });
    const t5 = new Date(t4);
    t5.setMinutes(t5.getMinutes() + gap4);
    const t6 = new Date(t5);
    t6.setMinutes(t6.getMinutes() + gap5);
    const t7 = new Date(t6);
    t7.setMinutes(t7.getMinutes() + gap6);
    const t8 = new Date(t7);
    t8.setMinutes(t8.getMinutes() + gap7);
    const despedidaClienteTime = secondExchangePlan ? formatTimeShort(t7) : formatTimeShort(t5);
    const despedidaAsesorTime = secondExchangePlan ? formatTimeShort(t8) : formatTimeShort(t6);

    const baseMessages: WhatsappConversationMessage[] = [
        {
            side: 'out',
            time: formatTimeShort(t1),
            dateKey: formatDateKeyFromDate(t1),
            status: statusForMessages,
            lines: firstMessageLines,
        },
        ...replyMessages,
        {
            side: 'out',
            time: formatTimeShort(t3),
            dateKey: formatDateKeyFromDate(t3),
            status: statusForMessages,
            lines: advisorReplyLines,
        },
        ...(detalleBase
            ? [
                  {
                      side: 'out' as const,
                      time: formatTimeShort(t4),
                      dateKey: formatDateKeyFromDate(t4),
                      status: statusForMessages,
                      lines: detalleBase,
                  },
              ]
            : []),
        ...(secondExchangePlan
            ? [
                  {
                      side: 'in' as const,
                      time: formatTimeShort(t5),
                      dateKey: formatDateKeyFromDate(t5),
                      lines: secondExchangePlan.clientLines,
                  },
                  {
                      side: 'out' as const,
                      time: formatTimeShort(t6),
                      dateKey: formatDateKeyFromDate(t6),
                      status: statusForMessages,
                      lines: secondExchangePlan.advisorLines,
                  },
              ]
            : []),
        ...(despedidaClienteLines && despedidaAsesorLines
            ? [
                  {
                      side: 'in' as const,
                      time: despedidaClienteTime,
                      dateKey: formatDateKeyFromDate(secondExchangePlan ? t7 : t5),
                      lines: despedidaClienteLines,
                  },
                  {
                      side: 'out' as const,
                      time: despedidaAsesorTime,
                      dateKey: formatDateKeyFromDate(secondExchangePlan ? t8 : t6),
                      status: statusForMessages,
                      lines: despedidaAsesorLines,
                  },
              ]
            : []),
    ];

    return baseMessages;
}
