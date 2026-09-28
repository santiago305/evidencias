import type { GeneratedMessage } from '../../../../../../types';
import { formatMobile13SmsTimestamp } from '../smsTimestamp';

export function SmsMessageMetadata({
    message,
    textColor,
    placement = 'below',
    currentDate,
}: {
    message: Pick<GeneratedMessage, 'side' | 'time' | 'dateKey'>;
    textColor: string;
    placement?: 'below' | 'inline';
    currentDate?: Date;
}) {
    const isInline = placement === 'inline';

    return (
        <div
            className={[
                isInline
                    ? 'flex h-[18.75px] items-center gap-[1.5px] text-[10.5px] leading-none'
                    : 'mt-[7px] flex items-center gap-[1.5px] text-[10.5px] leading-none',
                message.side === 'out' ? (isInline ? 'justify-end' : 'justify-end pr-[5px]') : isInline ? 'justify-start' : 'justify-start pl-[5px]',
            ].join(' ')}
            style={{ color: textColor }}
        >
            <span>{formatMobile13SmsTimestamp(message.dateKey ?? '', message.time, currentDate)}</span>
        </div>
    );
}
