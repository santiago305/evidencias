import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { formatWhatsappTimeValue, getDateKeyFromLocalDateTime, getDayChipTextForDate } from '../../../../../lib/whatsapp/time';
import type { GeneratedMessage, PreviewThemeMode } from '../../../../../types';
import { shouldShowConversationMoreIndicator } from '../../whatsappConversationIndicator';
import type { WhatsappConversationMessage } from './buildWhatsappConversation';
import { buildWhatsappConversation } from './buildWhatsappConversation';
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
import { MoreConversationIndicator, WhatsappInputBar } from './whatsapp-footer';
import { buildMobileAdvisorQuoteColors, buildMobileClientQuoteTheme } from './whatsappAppearance';
import type { WhatsappData } from './whatsappTypes';

const DOCUMENT_NUMBER_PATTERN = /\d{8,9}/g;
const STRONG_TEXT_PATTERN = /\*([^*]+?)\*/g;

function isDigit(value: string | undefined): boolean {
    return value !== undefined && /\d/.test(value);
}

function renderDocumentNumberLinks(
    line: string,
    lineIndex: number,
    themeMode: PreviewThemeMode,
    keyPrefix = 'document-number',
    indexOffset = 0,
): ReactNode[] {
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    const documentNumberColor = themeMode === 'dark' ? 'text-[#62bcd4]' : 'text-[#0f63ac]';

    for (const match of line.matchAll(DOCUMENT_NUMBER_PATTERN)) {
        const documentNumber = match[0];
        const matchIndex = match.index ?? 0;
        const previousCharacter = line[matchIndex - 1];
        const nextCharacter = line[matchIndex + documentNumber.length];

        if (isDigit(previousCharacter) || isDigit(nextCharacter)) continue;

        if (matchIndex > lastIndex) parts.push(line.slice(lastIndex, matchIndex));

        parts.push(
            <a
                key={`${keyPrefix}-${lineIndex}-${indexOffset + matchIndex}`}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className={['font-bold cursor-pointer select-text underline', documentNumberColor].join(' ')}
            >
                {documentNumber}
            </a>,
        );

        lastIndex = matchIndex + documentNumber.length;
    }

    if (parts.length === 0) return [line];
    if (lastIndex < line.length) parts.push(line.slice(lastIndex));

    return parts;
}

function renderFormattedLine(line: string, lineIndex: number, themeMode: PreviewThemeMode): ReactNode[] {
    const parts: ReactNode[] = [];
    let lastIndex = 0;

    for (const match of line.matchAll(STRONG_TEXT_PATTERN)) {
        const strongText = match[1] ?? '';
        const matchIndex = match.index ?? 0;

        if (matchIndex > lastIndex) {
            parts.push(...renderDocumentNumberLinks(line.slice(lastIndex, matchIndex), lineIndex, themeMode, 'document-number', lastIndex));
        }

        parts.push(
            <strong key={`strong-text-${lineIndex}-${matchIndex}`} className="font-bold">
                {renderDocumentNumberLinks(strongText, lineIndex, themeMode, 'strong-document-number', matchIndex + 1)}
            </strong>,
        );

        lastIndex = matchIndex + match[0].length;
    }

    if (parts.length === 0) return renderDocumentNumberLinks(line, lineIndex, themeMode);

    if (lastIndex < line.length) {
        parts.push(...renderDocumentNumberLinks(line.slice(lastIndex), lineIndex, themeMode, 'document-number', lastIndex));
    }

    return parts;
}

function linesToSpans(lines: string[], themeMode: PreviewThemeMode) {
    return lines.map((line, idx) => {
        const key = `${idx}-${line.slice(0, 8)}`;
        return <span key={key}>{renderFormattedLine(line, idx, themeMode)}</span>;
    });
}

function resolveMessageDateKey(message: WhatsappConversationMessage, fallbackDateKey: string): string {
    return message.dateKey ?? fallbackDateKey;
}

function normalizeGeneratedMessages(
    messages: GeneratedMessage[] | undefined,
    messageStatus: MsgStatus | undefined,
): WhatsappConversationMessage[] | null {
    if (!messages) return null;

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
    themeMode = 'light',
}: {
    data: WhatsappData;
    messageStatus?: MsgStatus;
    messages?: GeneratedMessage[];
    showDefaultTemporalMessage?: boolean;
    inlineTemporalMode?: 'active' | 'deactive' | null;
    inlineTemporalInsertIndex?: number | null;
    displayTitle?: string;
    themeMode?: PreviewThemeMode;
}) {
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    const [scrollThumb, setScrollThumb] = useState({
        top: 8,
        height: 60,
        visible: false,
    });
    const [showMoreConversationIndicator, setShowMoreConversationIndicator] = useState(false);

    const updateScrollState = useCallback(() => {
        const el = scrollContainerRef.current;

        if (!el) return;

        const { scrollTop, scrollHeight, clientHeight } = el;

        if (scrollHeight <= clientHeight) {
            setScrollThumb((prev) => ({ ...prev, visible: false }));
            setShowMoreConversationIndicator(false);
            return;
        }

        const trackPadding = 8;
        const trackHeight = clientHeight - trackPadding * 2;
        const thumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, 38);
        const maxThumbTop = trackHeight - thumbHeight;
        const scrollProgress = scrollTop / (scrollHeight - clientHeight);

        setScrollThumb({
            top: trackPadding + maxThumbTop * scrollProgress,
            height: thumbHeight,
            visible: true,
        });
        setShowMoreConversationIndicator(shouldShowConversationMoreIndicator(scrollTop, scrollHeight, clientHeight, 'mobile'));
    }, []);

    const conversationMessages = useMemo((): WhatsappConversationMessage[] => {
        return normalizeGeneratedMessages(messages, messageStatus) ?? buildWhatsappConversation(data, messageStatus);
    }, [data, messageStatus, messages]);

    const resolvedInlineTemporalInsertIndex = useMemo(() => {
        if (initialInlineTemporalInsertIndex !== null) return initialInlineTemporalInsertIndex;
        if (!inlineTemporalMode || conversationMessages.length < 2) return null;

        return Math.floor(Math.random() * (conversationMessages.length - 1)) + 1;
    }, [conversationMessages, initialInlineTemporalInsertIndex, inlineTemporalMode]);

    const fallbackDateKey = useMemo(
        () => getDateKeyFromLocalDateTime(data.fechaHora) ?? getDateKeyFromLocalDateTime(data.fechaHoraRegistro) ?? '',
        [data.fechaHora, data.fechaHoraRegistro],
    );

    const firstDayChipDateKey = conversationMessages[0] ? resolveMessageDateKey(conversationMessages[0], fallbackDateKey) : fallbackDateKey;
    const clientQuoteTheme = useMemo(() => {
        return buildMobileClientQuoteTheme(data);
    }, [data]);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;

        if (!scrollContainer) return;

        const frameId = window.requestAnimationFrame(() => {
            const { scrollHeight, clientHeight } = scrollContainer;

            if (scrollHeight <= clientHeight) {
                updateScrollState();
                return;
            }

            const maxScrollTop = scrollHeight - clientHeight;
            const scrollRatios = [0.18, 0.42, 0.68, 1];
            const scrollRatio = scrollRatios[Math.floor(Math.random() * scrollRatios.length)] ?? 0.42;

            scrollContainer.scrollTop = Math.round(maxScrollTop * scrollRatio);
            updateScrollState();
        });

        return () => window.cancelAnimationFrame(frameId);
    }, [
        conversationMessages,
        firstDayChipDateKey,
        inlineTemporalMode,
        resolvedInlineTemporalInsertIndex,
        showDefaultTemporalMessage,
        updateScrollState,
    ]);

    return (
        <div className="h-full w-full overflow-hidden">
            <div className="relative h-full min-h-0 overflow-hidden">
                <WhatsappConversationBackground themeMode={themeMode} />

                <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
                    <div className="relative min-h-0 flex-1 overflow-hidden">
                        <div
                            ref={scrollContainerRef}
                            onScroll={updateScrollState}
                            className="scrollbar-mobile-soft h-full w-full overflow-y-auto pr-[4px]"
                        >
                            {firstDayChipDateKey !== '' && <DayChip text={getDayChipTextForDate(firstDayChipDateKey)} themeMode={themeMode} />}
                            <EncryptedMessage themeMode={themeMode} />
                            {showDefaultTemporalMessage && <TempporalMessage themeMode={themeMode} />}

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
                                const quoteColors =
                                    msg.quote?.side === 'out'
                                        ? buildMobileAdvisorQuoteColors(msg.quote.side, themeMode)
                                        : msg.quote
                                          ? clientQuoteTheme
                                          : null;

                                return (
                                    <Fragment key={`message-${idx}-${msg.side}`}>
                                        {showsDayChip && <DayChip text={getDayChipTextForDate(currentDateKey)} themeMode={themeMode} />}

                                        <div className={wrapperSpacing}>
                                            <Bubble
                                                side={msg.side}
                                                firstInGroup={isFirstInGroup}
                                                time={msg.time}
                                                status={msg.status}
                                                themeMode={themeMode}
                                                quote={
                                                    msg.quote && quoteColors
                                                        ? {
                                                              author: msg.quote.side === 'out' ? 'Tú' : (displayTitle ?? 'Cliente'),
                                                              text: msg.quote.text,
                                                              accentColor: quoteColors.accentColor,
                                                              authorColor: quoteColors.authorColor,
                                                          }
                                                        : undefined
                                                }
                                            >
                                                {linesToSpans(msg.lines, themeMode)}
                                            </Bubble>
                                        </div>

                                        {markerAfterCurrent && inlineTemporalMode === 'active' && <ActiveTemporalMessage themeMode={themeMode} />}
                                        {markerAfterCurrent && inlineTemporalMode === 'deactive' && (
                                            <DesactiveTemporalMessage themeMode={themeMode} />
                                        )}
                                    </Fragment>
                                );
                            })}
                        </div>

                        {scrollThumb.visible && (
                            <div
                                className="pointer-events-none absolute right-[2px] z-20 rounded-full bg-black/30"
                                style={{
                                    top: `${scrollThumb.top}px`,
                                    height: `${scrollThumb.height}px`,
                                    width: '2px',
                                }}
                            />
                        )}

                        {showMoreConversationIndicator && (
                            <div className="pointer-events-none absolute right-2.5 bottom-[10px] z-30">
                                <MoreConversationIndicator themeMode={themeMode} />
                            </div>
                        )}
                    </div>

                    <div className="shrink-0">
                        <WhatsappInputBar themeMode={themeMode} />
                    </div>
                </div>
            </div>
        </div>
    );
}
