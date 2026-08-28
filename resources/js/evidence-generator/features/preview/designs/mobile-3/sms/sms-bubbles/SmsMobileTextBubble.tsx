import type { SmsColors, SmsConversationMessage, SmsData } from '../smsTypes';
import { SmsMessageMetadata } from './SmsMessageMetadata';

export function SmsMobileTextBubble({
    message,
    isFirstInGroup,
    isLastInGroup,
    data,
    colors,
    currentDate,
}: {
    message: SmsConversationMessage;
    isFirstInGroup: boolean;
    isLastInGroup: boolean;
    data: SmsData;
    colors: SmsColors;
    currentDate?: Date;
}) {
    const isOutgoing = message.side === 'out';
    const backgroundColor = isOutgoing ? colors.sentBubble : colors.receivedBubble;
    const textColor = isOutgoing ? '#F8FCFF' : colors.primaryText;
    const radius = isOutgoing
        ? `${isFirstInGroup ? 'rounded-t-[23px]' : 'rounded-t-[21px]'} rounded-bl-[21px] ${isLastInGroup ? 'rounded-br-[5px]' : 'rounded-br-[5px]'}`
        : `${isFirstInGroup ? 'rounded-t-[23px]' : 'rounded-t-[21px]'} rounded-br-[21px] ${isLastInGroup ? 'rounded-bl-[5px]' : 'rounded-bl-[5px]'}`;

    return (
        <div
            id={message.id}
            className={['flex px-[9px]', isOutgoing ? 'justify-end' : 'justify-start', isLastInGroup ? 'mb-[18px]' : 'mb-[2px]'].join(' ')}
        >
            <div className="max-w-[78%]" style={{ color: textColor }}>
                <div
                    className={['rounded-[21px] px-[14px] py-2.5 text-[15.5px] leading-[1.39] tracking-[-0.18px]', radius].join(' ')}
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
                {isLastInGroup ? (
                    <SmsMessageMetadata
                        message={message}
                        data={data}
                        currentDate={currentDate}
                        conversationColor={colors.conversation}
                        statusColor={colors.secondaryText}
                    />
                ) : null}
            </div>
        </div>
    );
}
