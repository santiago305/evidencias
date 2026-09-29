import type { SmsColors, SmsConversationMessage, SmsGroupPosition } from '../smsTypes';

type SmsBubbleTailProps = {
    side: 'left' | 'right';
    color: string;
};

const SMS_TAIL_PATH = `
    M 0 0
    H 22

    C 21.6 2.2
      19.6 4.0
      17.6 6.4

    C 16.2 7.7
      15.9 9.4
      15.9 11.0

    C 16.0 13.6
      17.2 15.7
      19.1 17.0

    C 19.0 17.6
      18.2 17.7
      17.4 17.4

    C 11.6 16.0
      8.3 12.6
      4.0 10.4

    C 2.6 9.6
      1.2 8.6
      0 8.3

    Z
`;

function SmsBubbleTail({ side, color }: SmsBubbleTailProps) {
    return (
        <span
            aria-hidden="true"
            data-mobile13-sms-tail={side}
            className={[
                'pointer-events-none absolute bottom-[-8px] z-0',
                side === 'right' ? 'right-[6px]' : 'left-[6px]',
            ].join(' ')}
            style={{ color }}
        >
            <svg
                width="22"
                height="18"
                viewBox="0 0 22 18"
                fill="none"
                preserveAspectRatio="xMidYMid meet"
                className="block"
                aria-hidden="true"
            >
                <path
                    d={SMS_TAIL_PATH}
                    transform={side === 'left' ? 'translate(22 0) scale(-1 1)' : undefined}
                    fill="currentColor"
                />
            </svg>
        </span>
    );
}

export function SmsMobileTextBubble({
    message,
    colors,
    groupPosition,
    compactBottomSpacing = false,
}: {
    message: SmsConversationMessage;
    colors: SmsColors;
    groupPosition: SmsGroupPosition;
    compactBottomSpacing?: boolean;
}) {
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
        >
            <div className="relative max-w-[85%] flex-none text-[11px] leading-[19px]">
                {isLastInGroup && <SmsBubbleTail side={isOutgoing ? 'right' : 'left'} color={backgroundColor} />}

                <div className="relative z-10 rounded-[25px] p-[1px]" style={{ backgroundColor, color: textColor }}>
                    <div className="box-border p-[9px] select-text">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
