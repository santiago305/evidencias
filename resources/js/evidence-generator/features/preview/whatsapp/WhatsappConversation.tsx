import { Fragment, useMemo, type ReactNode } from 'react';
import bgWhatsapp from '../../../assets/1.png';
import { getDayChipText } from '../../../lib/whatsapp/time';
import type { GeneratedMessage } from '../../../types';
import { WhatsappInputBar } from './WhatsappInputBar';
import { createWhatsappAvatarTheme } from './avatarTheme';
import {
    ActiveTemporalMessage,
    Bubble,
    DayChip,
    DesactiveTemporalMessage,
    EncryptedMessage,
    TempporalMessage,
    type MsgStatus,
} from './WhatsappPieces';
import type { WhatsappConversationMessage } from './buildWhatsappConversation';
import { buildWhatsappConversation } from './buildWhatsappConversation';
import type { WhatsappData } from './whatsappTypes';

const ADVISOR_QUOTE_ACCENT_COLOR = '#0063CB';
const ADVISOR_QUOTE_AUTHOR_COLOR = '#0078D7';

function buildAvatarSeed(data: WhatsappData): string {
    return (
        [data.telefono, data.nombre, data.dni, data.nombreAsesor]
            .map((value) => value?.trim())
            .find((value) => !!value) ?? 'contact'
    );
}

function lightenHexColor(hexColor: string, ratio = 0.2): string {
    const normalized = hexColor.replace('#', '');

    if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
        return hexColor;
    }

    const channels = [0, 2, 4].map((start) => Number.parseInt(normalized.slice(start, start + 2), 16));
    const nextChannels = channels.map((channel) => Math.round(channel + (255 - channel) * ratio));

    return `#${nextChannels.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

function linesToSpans(lines: ReactNode[]) {
    return lines.map((line, idx) => {
        const key = typeof line === 'string' ? `${idx}-${line.slice(0, 8)}` : `${idx}`;
        return <span key={key}>{line}</span>;
    });
}

export function WhatsappConversation({
    data,
    messageStatus,
    messages,
    showDefaultTemporalMessage = true,
    inlineTemporalMode = null,
    inlineTemporalInsertIndex: initialInlineTemporalInsertIndex = null,
    displayTitle,
}: {
    data: WhatsappData;
    messageStatus?: MsgStatus;
    messages?: GeneratedMessage[];
    showDefaultTemporalMessage?: boolean;
    inlineTemporalMode?: 'active' | 'deactive' | null;
    inlineTemporalInsertIndex?: number | null;
    displayTitle?: string;
}) {
    const conversationMessages = useMemo(
        (): WhatsappConversationMessage[] => messages ?? buildWhatsappConversation(data, messageStatus),
        [data, messageStatus, messages],
    );

    const resolvedInlineTemporalInsertIndex = useMemo(() => {
        if (initialInlineTemporalInsertIndex !== null) {
            return initialInlineTemporalInsertIndex;
        }

        if (!inlineTemporalMode || conversationMessages.length < 2) {
            return null;
        }

        return Math.floor(Math.random() * (conversationMessages.length - 1)) + 1;
    }, [conversationMessages, initialInlineTemporalInsertIndex, inlineTemporalMode]);

    const clientQuoteTheme = useMemo(() => {
        const avatarTheme = createWhatsappAvatarTheme(buildAvatarSeed(data));

        return {
            accentColor: avatarTheme.icon,
            authorColor: lightenHexColor(avatarTheme.icon),
        };
    }, [data]);

    return (
        <div className="h-full w-full overflow-hidden">
            {/* Fondo WhatsApp */}
            <div className="relative h-full min-h-0 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: `url(${bgWhatsapp})` }} />

                <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
                    {/* Mensajes */}
                    <div className="min-h-0 flex-1 overflow-hidden">
                        <div className="scrollbar-soft h-full w-full overflow-y-auto">
                            <DayChip text={getDayChipText(data.fechaHora)} />
                            <EncryptedMessage />
                            {showDefaultTemporalMessage && <TempporalMessage />}

                            {conversationMessages.map((msg, idx) => {
                                const prev = conversationMessages[idx - 1];
                                const next = conversationMessages[idx + 1];
                                const markerBeforeCurrent = resolvedInlineTemporalInsertIndex === idx;
                                const markerAfterCurrent = resolvedInlineTemporalInsertIndex === idx + 1;
                                const isFirstInGroup = idx === 0 || markerBeforeCurrent || prev.side !== msg.side;
                                const staysInSameGroup = !!next && !markerAfterCurrent && next.side === msg.side;
                                const wrapperSpacing = staysInSameGroup ? 'mb-0.5' : 'mb-4';
                                return (
                                    <Fragment key={`message-${idx}-${msg.side}`}>
                                        <div className={wrapperSpacing}>
                                            <Bubble
                                                side={msg.side}
                                                firstInGroup={isFirstInGroup}
                                                time={msg.time}
                                                status={msg.status}
                                                quote={
                                                    msg.quote
                                                        ? {
                                                              author: msg.quote.side === 'out' ? 'Tú' : displayTitle ?? 'Cliente',
                                                              text: msg.quote.text,
                                                              accentColor:
                                                                  msg.quote.side === 'out' ? ADVISOR_QUOTE_ACCENT_COLOR : clientQuoteTheme.accentColor,
                                                              authorColor:
                                                                  msg.quote.side === 'out' ? ADVISOR_QUOTE_AUTHOR_COLOR : clientQuoteTheme.authorColor,
                                                          }
                                                        : undefined
                                                }
                                            >
                                                {linesToSpans(msg.lines)}
                                            </Bubble>
                                        </div>

                                        {markerAfterCurrent && inlineTemporalMode === 'active' && <ActiveTemporalMessage />}
                                        {markerAfterCurrent && inlineTemporalMode === 'deactive' && <DesactiveTemporalMessage />}
                                    </Fragment>
                                );
                            })}
                        </div>
                    </div>

                    <div className="shrink-0">
                        <WhatsappInputBar />
                    </div>
                </div>
            </div>
        </div>
    );
}
