import { useState } from 'react';
import { toggleSmsMetadataVisibility } from '../smsMessages';
import type { SmsColors, SmsConversationMessage, SmsGroupPosition } from '../smsTypes';
import { SmsMessageMetadata } from './SmsMessageMetadata';

export function SmsMobileTextBubble({
    message,
    showMetadata,
    colors,
    metadataTextColor,
    groupPosition,
    compactBottomSpacing = false,
}: {
    message: SmsConversationMessage;
    showMetadata: boolean;
    colors: SmsColors;
    metadataTextColor: string;
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
              last: 'rounded-tl-[23px] rounded-tr-[4px] rounded-bl-[21px] rounded-br-[23px]',
          }[groupPosition]
        : {
              single: 'rounded-tl-[23px] rounded-tr-[23px] rounded-br-[21px] rounded-bl-[23px]',
              first: 'rounded-tl-[23px] rounded-tr-[23px] rounded-br-[21px] rounded-bl-[4px]',
              middle: 'rounded-tl-[4px] rounded-tr-[23px] rounded-br-[21px] rounded-bl-[4px]',
              last: 'rounded-tl-[4px] rounded-tr-[23px] rounded-br-[21px] rounded-bl-[23px]',
          }[groupPosition];

    return (
        <div
            id={message.id}
            className={[
                'flex items-end gap-[5px] px-[5px]',
                isOutgoing ? 'justify-end' : 'justify-start',
                groupPosition === 'single' || groupPosition === 'last' ? (compactBottomSpacing ? 'mb-[4px]' : 'mb-[18px]') : 'mb-[2px]',
            ].join(' ')}
            onClick={() => {
                setIsMetadataVisible((current) => toggleSmsMetadataVisibility(current));
            }}
        >
            {isMetadataVisible && isOutgoing ? (
                <SmsMessageMetadata
                    message={message}
                    textColor={metadataTextColor}
                />
            ) : null}
            <div className="min-w-0 max-w-[calc(100%_-110px)]" style={{ color: textColor }}>
                <div
                    className={['rounded-[21px] px-[16px] py-2.5 text-[16.2px] font-light leading-[1.20] tracking-[-0.18px]', radius].join(' ')}
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
            </div>
            {isMetadataVisible && !isOutgoing ? (
                <SmsMessageMetadata
                    message={message}
                    textColor={metadataTextColor}
                />
            ) : null}
        </div>
    );
}
