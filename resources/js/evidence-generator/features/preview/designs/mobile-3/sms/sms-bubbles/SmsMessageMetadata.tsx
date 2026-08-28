import type { GeneratedMessage } from '../../../../../../types';
import { buildSmsMessageTimestamp } from '../smsDateTime';
import type { SmsData } from '../smsTypes';

function DoubleCheckIcon({ color, backgroundColor }: { color: string; backgroundColor: string }) {
    return (
        <svg viewBox="0 0 30 20" className="h-[17px] w-[27px] shrink-0" fill="none" aria-hidden="true">
            <circle cx="9.5" cy="10" r="7.2" stroke={color} strokeWidth="1.65" />
            <path d="m6.1 10.1 2.6 2.4 4.4-4.6" stroke={color} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="19.8" cy="10" r="8.15" fill={backgroundColor} />
            <circle cx="19.8" cy="10" r="7.2" stroke={color} strokeWidth="1.65" />
            <path d="m16.4 10.1 2.6 2.4 4.4-4.6" stroke={color} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function SmsMessageMetadata({
    message,
    data,
    currentDate,
    conversationColor,
    statusColor,
}: {
    message: Pick<GeneratedMessage, 'side' | 'status' | 'dateKey' | 'time'>;
    data: Pick<SmsData, 'fechaHora' | 'fechaHoraRegistro'>;
    currentDate?: Date;
    conversationColor: string;
    statusColor: string;
}) {
    const timestamp = buildSmsMessageTimestamp(message, data, currentDate);

    return (
        <div className="mt-[7px] flex items-center justify-end gap-[5px] pr-[5px] text-[10.5px] leading-none" style={{ color: statusColor }}>
            <span>{timestamp.label}</span>
            {timestamp.showChecks ? <DoubleCheckIcon color={statusColor} backgroundColor={conversationColor} /> : null}
        </div>
    );
}
