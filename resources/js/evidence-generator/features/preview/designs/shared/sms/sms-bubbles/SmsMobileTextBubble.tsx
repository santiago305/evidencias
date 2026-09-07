import { useState } from 'react';
import { toggleSmsMetadataVisibility } from '../smsMessages';
import type { SmsColors, SmsConversationMessage, SmsConversationType, SmsData, SmsGroupPosition } from '../smsTypes';
import { SmsMessageMetadata } from './SmsMessageMetadata';

export function SmsMobileTextBubble({
    message,
    showMetadata,
    showLock,
    conversationType,
    data,
    colors,
    currentDate,
    groupPosition,
    compactBottomSpacing = false,
}: {
    message: SmsConversationMessage;
    showMetadata: boolean;
    showLock: boolean;
    conversationType: SmsConversationType;
    data: SmsData;
    colors: SmsColors;
    currentDate?: Date;
    groupPosition: SmsGroupPosition;
    compactBottomSpacing?: boolean;
}) {
    const [isMetadataVisible, setIsMetadataVisible] = useState(showMetadata);
    const isOutgoing = message.side === 'out';
    const backgroundColor = isOutgoing ? colors.sentBubble : colors.receivedBubble;
    const textColor = isOutgoing ? colors.sentText : colors.primaryText;
    const radius = isOutgoing
        ? {
              single: 'rounded-tl-[23px] rounded-tr-[23px] rounded-bl-[21px] rounded-br-[23px]',
              first: 'rounded-tl-[23px] rounded-tr-[23px] rounded-bl-[21px] rounded-br-[4px]',
              middle: 'rounded-tl-[8px] rounded-tr-[4px] rounded-br-[4px] rounded-bl-[21px]',
              last: 'rounded-tl-[23px] rounded-tr-[4px] rounded-bl-[21px] rounded-br-[5px]',
          }[groupPosition]
        : {
              single: 'rounded-tl-[23px] rounded-tr-[23px] rounded-br-[21px] rounded-br-[23px]',
              first: 'rounded-tl-[23px] rounded-tr-[23px] rounded-br-[21px] rounded-bl-[4px]',
              middle: 'rounded-tl-[4px] rounded-tr-[23px] rounded-br-[21px] rounded-bl-[4px]',
              last: 'rounded-tl-[5px] rounded-tr-[23px] rounded-br-[21px] rounded-bl-[23px]',
          }[groupPosition];

    return (
        <div
            id={message.id}
            className={[
                'flex px-[9px]',
                isOutgoing ? 'justify-end' : 'justify-start',
                groupPosition === 'single' || groupPosition === 'last' ? (compactBottomSpacing ? 'mb-[4px]' : 'mb-[18px]') : 'mb-[2px]',
            ].join(' ')}
            onClick={() => {
                setIsMetadataVisible((current) => toggleSmsMetadataVisibility(current));
            }}
        >
            <div className="max-w-[78%]" style={{ color: textColor }}>
                <div
                    className={['rounded-[21px] px-[14px] py-2.5 text-[14.5px] leading-[1.39] tracking-[-0.18px]', radius].join(' ')}
                    style={{ backgroundColor }}
                >
                    <div className="break-words whitespace-pre-wrap">
                        {message.lines.map((line, index) => (
                            <span key={`${message.id}-line-${index}`} className={index < message.lines.length - 1 ? 'block' : undefined}>
                                {line}
                            </span>
                        ))}
                    </div>
                </div>
                {isMetadataVisible ? (
                    <SmsMessageMetadata
                        message={message}
                        data={data}
                        currentDate={currentDate}
                        conversationType={conversationType}
                        conversationColor={colors.readReceiptBackground}
                        textColor={colors.secondaryText}
                        checkColor={colors.metadataIcon}
                        lockColor={colors.metadataIcon}
                        showLock={showLock}
                    />
                ) : null}
            </div>
        </div>
    );
}
