import type { GeneratedMessage } from '../../../../../types';
import { resolveSmsDateKey, resolveSmsMessageStatus } from './smsDateTime.ts';
import type { SmsConversationMessage, SmsData, SmsGroupPosition } from './smsTypes';

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

export function shouldShowSmsDateSeparator(previousDateKey: string | undefined, currentDateKey: string, _currentDate = new Date()): boolean {
    void _currentDate;

    return previousDateKey === undefined || previousDateKey !== currentDateKey;
}

export function getSmsGroupPosition(messages: SmsConversationMessage[], index: number): SmsGroupPosition {
    const message = messages[index];
    const previous = messages[index - 1];
    const next = messages[index + 1];
    const sameAsPrevious = previous?.side === message?.side && previous?.dateKey === message?.dateKey;
    const sameAsNext = next?.side === message?.side && next?.dateKey === message?.dateKey;

    if (!sameAsPrevious && !sameAsNext) return 'single';
    if (!sameAsPrevious && sameAsNext) return 'first';
    if (sameAsPrevious && sameAsNext) return 'middle';

    return 'last';
}

export function shouldShowSmsMessageMetadata(messageIndex: number, messageCount: number): boolean {
    return messageCount > 0 && messageIndex === messageCount - 1;
}

export function toggleSmsMetadataVisibility(isVisible: boolean): boolean {
    return !isVisible;
}
