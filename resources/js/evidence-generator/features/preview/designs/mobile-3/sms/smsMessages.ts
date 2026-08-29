import type { GeneratedMessage } from '../../../../../types';
import { isSmsDateKeyToday, resolveSmsDateKey, resolveSmsMessageStatus } from './smsDateTime.ts';
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

export function shouldShowSmsDateSeparator(previousDateKey: string | undefined, currentDateKey: string, currentDate = new Date()): boolean {
    return !isSmsDateKeyToday(currentDateKey, currentDate) && (previousDateKey === undefined || previousDateKey !== currentDateKey);
}

export function shouldShowSmsMessageMetadata(messageIndex: number, messageCount: number): boolean {
    return messageCount > 0 && messageIndex === messageCount - 1;
}

export function toggleSmsMetadataVisibility(isVisible: boolean): boolean {
    return !isVisible;
}
