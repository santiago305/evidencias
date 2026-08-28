import type { GeneratedMessage } from '../../../../../types';
import { resolveSmsDateKey, resolveSmsMessageStatus } from './smsDateTime.ts';
import type { SmsConversationMessage, SmsData } from './smsTypes';

export function buildSmsMessages(data: SmsData): SmsConversationMessage[] {
    const fallbackStatus = data.previewSnapshot?.messageStatus;

    return (data.generatedMessages ?? []).map((message: GeneratedMessage, index) => ({
        id: message.id_ ?? `sms-message-${index}-${message.dateKey ?? 'unknown'}-${message.time}`,
        side: message.side,
        lines: message.lines,
        time: message.time,
        dateKey: resolveSmsDateKey(message, data),
        status: resolveSmsMessageStatus(message, fallbackStatus),
    }));
}
