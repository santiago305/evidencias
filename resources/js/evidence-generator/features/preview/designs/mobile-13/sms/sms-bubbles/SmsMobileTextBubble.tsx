import { useState } from 'react';
import { toggleSmsMetadataVisibility } from '../smsMessages';
import { formatMobile13SmsTimestamp } from '../smsTimestamp';
import type { SmsColors, SmsConversationMessage, SmsGroupPosition } from '../smsTypes';
import { SmsMessageMetadata } from './SmsMessageMetadata';

function BubbleTail({ side, color }: { side: 'left' | 'right'; color: string }) {
    return (
        <span
            aria-hidden="true"
            className={
                side === 'left'
                    ? 'pointer-events-none absolute bottom-[-8px] left-[1px] z-0'
                    : 'pointer-events-none absolute right-[1px] bottom-[-8px] z-0'
            }
            style={{ color }}
        >
            <svg width="19" height="17" viewBox="0 0 19 17" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                {side === 'left' ? (
                    <path d="M19 0 H8 C8 5.4 7.7 10.1 1 16 C7.9 15.7 12.4 11.8 15.5 7.8 C17.2 5.5 18.2 2.9 19 0 Z" fill="currentColor" />
                ) : (
                    <path d="M0 0 H11 C11 5.4 11.3 10.1 18 16 C11.1 15.7 6.6 11.8 3.5 7.8 C1.8 5.5 0.8 2.9 0 0 Z" fill="currentColor" />
                )}
            </svg>
        </span>
    );
}

function OutgoingBubbleTail({ color }: { color: string }) {
    return (
        <span aria-hidden="true" className="pointer-events-none absolute right-[1px] bottom-[-8px] z-0" style={{ color }}>
            <svg width="19" height="17" viewBox="0 0 19 17" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                <path d="M0 0 H11 C11 5.4 11.3 10.1 18 16 C11.1 15.7 6.6 11.8 3.5 7.8 C1.8 5.5 0.8 2.9 0 0 Z" fill="currentColor" />
            </svg>
        </span>
    );
}

export function SmsMobileTextBubble({
    message,
    showMetadata,
    colors,
    groupPosition,
    compactBottomSpacing = false,
    currentDate,
}: {
    message: SmsConversationMessage;
    showMetadata: boolean;
    colors: SmsColors;
    groupPosition: SmsGroupPosition;
    compactBottomSpacing?: boolean;
    currentDate?: Date;
}) {
    const [isMetadataVisible, setIsMetadataVisible] = useState(showMetadata);
    const isOutgoing = message.side === 'out';
    const backgroundColor = isOutgoing ? colors.sentBubble : colors.receivedBubble;
    const textColor = isOutgoing ? colors.sentText : colors.primaryText;
    const isLastInGroup = groupPosition === 'single' || groupPosition === 'last';
    const staysInSameGroup = groupPosition === 'first' || groupPosition === 'middle';
    const wrapperSpacing = staysInSameGroup ? 'mb-[5px]' : compactBottomSpacing ? 'mb-[4px]' : 'mb-3';

    return (
        <div
            id={message.id}
            className={`flex px-[15px] ${isOutgoing ? 'justify-end' : 'justify-start'} ${wrapperSpacing}`}
            onClick={() => {
                setIsMetadataVisible((current) => toggleSmsMetadataVisibility(current));
            }}
        >
            <div className="relative max-w-[87%] flex-none text-[11px] leading-[19px]">
                {isLastInGroup ? (
                    isOutgoing ? (
                        <OutgoingBubbleTail color={backgroundColor} />
                    ) : (
                        <BubbleTail side="left" color={backgroundColor} />
                    )
                ) : null}

                <div className="relative z-10 rounded-[20px] p-[1px]" style={{ backgroundColor, color: textColor }}>
                    <div className="box-border p-[5px] select-text">
                        <div className="relative overflow-hidden ps-[3.75px] pe-[3.75px] whitespace-pre-wrap">
                            <span
                                className="visible text-[14.5px] leading-[19px]"
                                style={{
                                    minHeight: '0px',
                                    fontFamily: 'Inter',
                                    fontWeight: 320,
                                }}
                            >
                                {message.lines.map((line, index) => (
                                    <span key={`${message.id}-line-${index}`} className={index < message.lines.length - 1 ? 'block' : undefined}>
                                        {line}
                                    </span>
                                ))}
                            </span>
                            <span>
                                <span aria-hidden="true" className="invisible inline-flex h-0 align-middle text-[0.859375rem] leading-[23.75px]">
                                    <span className="shrink-0 grow-0">{formatMobile13SmsTimestamp(message.dateKey, message.time, currentDate)}</span>
                                </span>
                            </span>
                        </div>

                        {isMetadataVisible ? (
                            <div className="relative z-10 float-right -mt-[15px] -mb-[6.25px] ps-[5px] pe-0">
                                <SmsMessageMetadata message={message} textColor={colors.secondaryText} placement="inline" currentDate={currentDate} />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
