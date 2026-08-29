import type { GeneratedMessage } from '../../../../../../types';
import { buildSmsMessageTimestamp } from '../smsDateTime';
import type { SmsConversationType, SmsData } from '../smsTypes';
import { EncryptionLockIcon } from './EncryptionLockIcon';

function DoubleCheckIcon({ foregroundColor, backgroundColor }: { foregroundColor: string; backgroundColor: string }) {
    return (
        <svg viewBox="0 0 30 20" className="h-[17px] w-[27px] shrink-0" fill="none" aria-hidden="true">
            <circle cx="9.5" cy="10" r="7.2" fill={backgroundColor} />
            <circle cx="9.5" cy="10" r="7.2" stroke={foregroundColor} strokeWidth="1.65" />
            <path d="m6.1 10.1 2.6 2.4 4.4-4.6" stroke={foregroundColor} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="19.8" cy="10" r="8.15" fill={backgroundColor} />
            <circle cx="19.8" cy="10" r="7.2" fill={backgroundColor} stroke={foregroundColor} strokeWidth="1.65" />
            <path d="m16.4 10.1 2.6 2.4 4.4-4.6" stroke={foregroundColor} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function SmsMessageMetadata({
    message,
    data,
    currentDate,
    conversationType,
    conversationColor,
    textColor,
    checkColor,
    lockColor,
    showLock,
}: {
    message: Pick<GeneratedMessage, 'side' | 'status' | 'dateKey' | 'time'>;
    data: Pick<SmsData, 'fechaHora' | 'fechaHoraRegistro'>;
    currentDate?: Date;
    conversationType: SmsConversationType;
    conversationColor: string;
    textColor: string;
    checkColor: string;
    lockColor: string;
    showLock: boolean;
}) {
    const timestamp = buildSmsMessageTimestamp(message, data, currentDate, conversationType);

    return (
        <div
            className={[
                'mt-[7px] flex items-center gap-[5px] text-[10.5px] leading-none',
                message.side === 'out' ? 'justify-end pr-[5px]' : 'justify-start pl-[5px]',
            ].join(' ')}
            style={{ color: textColor }}
        >
            <span>{timestamp.label}</span>
            {timestamp.showSmsLabel ? <span>SMS</span> : null}
            {timestamp.showChecks ? <DoubleCheckIcon foregroundColor={checkColor} backgroundColor={conversationColor} /> : null}
            {showLock && conversationType === 'rcs' ? <EncryptionLockIcon color={lockColor} /> : null}
        </div>
    );
}
