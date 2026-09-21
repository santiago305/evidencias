import type { GeneratedMessage } from '../../../../../../types';
import { formatSmsTime } from '../smsDateTime';

export function SmsMessageMetadata({
    message,
    textColor,
}: {
    message: Pick<GeneratedMessage, 'side' | 'time'>;
    textColor: string;
}) {
    return (
        <div className="shrink-0 text-[12px] leading-none" style={{ color: textColor }}>
            <span>{formatSmsTime(message.time)}</span>
        </div>
    );
}
