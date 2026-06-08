import { Fragment, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { formatWhatsappTimeValue, getDateKeyFromLocalDateTime, getDayChipTextForDate } from '../../../../../lib/whatsapp/time';
import type { GeneratedMessage, PreviewDeviceMode, PreviewThemeMode } from '../../../../../types';
import { WhatsappInputBar } from './whatsapp-footer';
import { WhatsappConversationBackground } from './whatsapp-background/WhatsappConversationBackground';
import {
    ActiveTemporalMessage,
    Bubble,
    DayChip,
    DesactiveTemporalMessage,
    EncryptedMessage,
    TempporalMessage,
    type MsgStatus,
} from './whatsapp-bubbles';
import { createWhatsappAvatarTheme } from './avatarTheme';
import type { WhatsappConversationMessage } from './buildWhatsappConversation';
import { buildWhatsappConversation } from './buildWhatsappConversation';
import type { WhatsappData } from './whatsappTypes';

const ADVISOR_QUOTE_ACCENT_COLOR = '#0063CB';
const ADVISOR_QUOTE_AUTHOR_COLOR = '#0078D7';
const DOCUMENT_NUMBER_PATTERN = /\d{8,9}/g;
const STRONG_TEXT_PATTERN = /\*([^*]+?)\*/g;

function buildAvatarSeed(data: WhatsappData): string {
    return [data.telefono, data.nombre, data.dni, data.nombreAsesor].map((value) => value?.trim()).find((value) => !!value) ?? 'contact';
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

function isDigit(value: string | undefined): boolean {
    return value !== undefined && /\d/.test(value);
}

function renderDocumentNumberLinks(line: string, lineIndex: number, keyPrefix = 'document-number', indexOffset = 0): ReactNode[] {
    const parts: ReactNode[] = [];
    let lastIndex = 0;

    for (const match of line.matchAll(DOCUMENT_NUMBER_PATTERN)) {
        const documentNumber = match[0];
        const matchIndex = match.index ?? 0;
        const previousCharacter = line[matchIndex - 1];
        const nextCharacter = line[matchIndex + documentNumber.length];

        if (isDigit(previousCharacter) || isDigit(nextCharacter)) {
            continue;
        }

        if (matchIndex > lastIndex) {
            parts.push(line.slice(lastIndex, matchIndex));
        }

        parts.push(
            <a
                key={`${keyPrefix}-${lineIndex}-${indexOffset + matchIndex}`}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="segoe-ui-negrita cursor-pointer text-[#1B8755] no-underline select-text hover:underline focus-visible:bg-[#1B8755] focus-visible:text-white focus-visible:underline-offset-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A884]"
            >
                {documentNumber}
            </a>,
        );

        lastIndex = matchIndex + documentNumber.length;
    }

    if (parts.length === 0) {
        return [line];
    }

    if (lastIndex < line.length) {
        parts.push(line.slice(lastIndex));
    }

    return parts;
}

function renderFormattedLine(line: string, lineIndex: number): ReactNode[] {
    const parts: ReactNode[] = [];
    let lastIndex = 0;

    for (const match of line.matchAll(STRONG_TEXT_PATTERN)) {
        const strongText = match[1] ?? '';
        const matchIndex = match.index ?? 0;

        if (matchIndex > lastIndex) {
            parts.push(...renderDocumentNumberLinks(line.slice(lastIndex, matchIndex), lineIndex, 'document-number', lastIndex));
        }

        parts.push(
            <strong key={`strong-text-${lineIndex}-${matchIndex}`} className="segoe-ui-negrita">
                {renderDocumentNumberLinks(strongText, lineIndex, 'strong-document-number', matchIndex + 1)}
            </strong>,
        );

        lastIndex = matchIndex + match[0].length;
    }

    if (parts.length === 0) {
        return renderDocumentNumberLinks(line, lineIndex);
    }

    if (lastIndex < line.length) {
        parts.push(...renderDocumentNumberLinks(line.slice(lastIndex), lineIndex, 'document-number', lastIndex));
    }

    return parts;
}

function linesToSpans(lines: string[]) {
    return lines.map((line, idx) => {
        const key = `${idx}-${line.slice(0, 8)}`;
        return <span key={key}>{renderFormattedLine(line, idx)}</span>;
    });
}

function resolveMessageDateKey(message: WhatsappConversationMessage, fallbackDateKey: string): string {
    return message.dateKey ?? fallbackDateKey;
}

function normalizeGeneratedMessages(
    messages: GeneratedMessage[] | undefined,
    messageStatus: MsgStatus | undefined,
): WhatsappConversationMessage[] | null {
    if (!messages) {
        return null;
    }

    return messages.map((msg) => ({
        ...msg,
        time: formatWhatsappTimeValue(msg.time),
        status: msg.side === 'out' ? (msg.status ?? messageStatus) : msg.status,
    }));
}

export function WhatsappConversation({
    data,
    messageStatus,
    messages,
    showDefaultTemporalMessage = true,
    inlineTemporalMode = null,
    inlineTemporalInsertIndex: initialInlineTemporalInsertIndex = null,
    displayTitle,
    deviceMode = 'desktop',
    themeMode = 'light',
}: {
    data: WhatsappData;
    messageStatus?: MsgStatus;
    messages?: GeneratedMessage[];
    showDefaultTemporalMessage?: boolean;
    inlineTemporalMode?: 'active' | 'deactive' | null;
    inlineTemporalInsertIndex?: number | null;
    displayTitle?: string;
    deviceMode?: PreviewDeviceMode;
    themeMode?: PreviewThemeMode;
}) {
    const conversationMessages = useMemo((): WhatsappConversationMessage[] => {
        return normalizeGeneratedMessages(messages, messageStatus) ?? buildWhatsappConversation(data, messageStatus);
    }, [data, messageStatus, messages]);

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

    const fallbackDateKey = useMemo(
        () => getDateKeyFromLocalDateTime(data.fechaHora) ?? getDateKeyFromLocalDateTime(data.fechaHoraRegistro) ?? '',
        [data.fechaHora, data.fechaHoraRegistro],
    );
    const dayChipReference = data.fechaHoraRegistro || data.fechaHora;
    const firstDayChipDateKey = conversationMessages[0] ? resolveMessageDateKey(conversationMessages[0], fallbackDateKey) : fallbackDateKey;
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;

        if (!scrollContainer) {
            return;
        }

        const frameId = window.requestAnimationFrame(() => {
            const { scrollHeight, clientHeight } = scrollContainer;

            if (scrollHeight <= clientHeight) {
                return;
            }

            const maxScrollTop = scrollHeight - clientHeight;
            const scrollRatios = [0.18, 0.42, 0.68, 1];
            const scrollRatio = scrollRatios[Math.floor(Math.random() * scrollRatios.length)] ?? 0.42;

            scrollContainer.scrollTop = Math.round(maxScrollTop * scrollRatio);
        });

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, [conversationMessages, firstDayChipDateKey, inlineTemporalMode, resolvedInlineTemporalInsertIndex, showDefaultTemporalMessage]);

    return (
        <div className="h-full w-full overflow-hidden">
            {/* Fondo WhatsApp */}
            <div className="relative h-full min-h-0 overflow-hidden">
                <WhatsappConversationBackground themeMode={themeMode} />

                <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
                    {/* Mensajes */}
                    <div className="min-h-0 flex-1 overflow-hidden">
                        <div
                            ref={scrollContainerRef}
                            className={[
                                deviceMode === 'mobile' ? 'scrollbar-mobile-soft' : 'scrollbar-soft',
                                'h-full w-full overflow-y-auto',
                            ]
                                .filter(Boolean)
                                .join(' ')}
                        >
                            {firstDayChipDateKey !== '' && <DayChip text={getDayChipTextForDate(firstDayChipDateKey, dayChipReference)} />}
                            <EncryptedMessage deviceMode={deviceMode} />
                            {showDefaultTemporalMessage && <TempporalMessage deviceMode={deviceMode} />}

                            {conversationMessages.map((msg, idx) => {
                                const prev = conversationMessages[idx - 1];
                                const next = conversationMessages[idx + 1];
                                const currentDateKey = resolveMessageDateKey(msg, fallbackDateKey);
                                const previousDateKey = prev ? resolveMessageDateKey(prev, fallbackDateKey) : null;
                                const showsDayChip = currentDateKey !== '' && idx > 0 && currentDateKey !== previousDateKey;
                                const markerBeforeCurrent = resolvedInlineTemporalInsertIndex === idx;
                                const markerAfterCurrent = resolvedInlineTemporalInsertIndex === idx + 1;
                                const isFirstInGroup = idx === 0 || markerBeforeCurrent || prev.side !== msg.side;
                                const staysInSameGroup = !!next && !markerAfterCurrent && next.side === msg.side;
                                const wrapperSpacing = staysInSameGroup ? 'mb-0.5' : 'mb-4';
                                return (
                                    <Fragment key={`message-${idx}-${msg.side}`}>
                                        {showsDayChip && <DayChip text={getDayChipTextForDate(currentDateKey, dayChipReference)} />}

                                        <div className={wrapperSpacing}>
                                            <Bubble
                                                side={msg.side}
                                                firstInGroup={isFirstInGroup}
                                                time={msg.time}
                                                status={msg.status}
                                                quote={
                                                    msg.quote
                                                        ? {
                                                              author: msg.quote.side === 'out' ? 'Tú' : (displayTitle ?? 'Cliente'),
                                                              text: msg.quote.text,
                                                              accentColor:
                                                                  msg.quote.side === 'out'
                                                                      ? ADVISOR_QUOTE_ACCENT_COLOR
                                                                      : clientQuoteTheme.accentColor,
                                                              authorColor:
                                                                  msg.quote.side === 'out'
                                                                      ? ADVISOR_QUOTE_AUTHOR_COLOR
                                                                      : clientQuoteTheme.authorColor,
                                                          }
                                                        : undefined
                                                }
                                                deviceMode={deviceMode}
                                            >
                                                {linesToSpans(msg.lines)}
                                            </Bubble>
                                        </div>

                                        {markerAfterCurrent && inlineTemporalMode === 'active' && <ActiveTemporalMessage deviceMode={deviceMode} />}
                                        {markerAfterCurrent && inlineTemporalMode === 'deactive' && <DesactiveTemporalMessage deviceMode={deviceMode} />}
                                    </Fragment>
                                );
                            })}
                        </div>
                    </div>

                    <div className="shrink-0">
                        <WhatsappInputBar themeMode={themeMode} deviceMode={deviceMode} />
                    </div>
                </div>
            </div>
        </div>
    );
}
