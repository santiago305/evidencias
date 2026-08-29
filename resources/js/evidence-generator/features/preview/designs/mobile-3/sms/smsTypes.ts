import type { GeneratedMessage, PreviewProps } from '../../../../../types';

export type SmsData = NonNullable<PreviewProps['data']>;
export type SmsMessageStatus = NonNullable<GeneratedMessage['status']>;
export type SmsConversationType = 'rcs' | 'sms';

export interface SmsConversationMessage {
    id?: string;
    side: GeneratedMessage['side'];
    lines: string[];
    time: string;
    dateKey: string;
    status?: SmsMessageStatus;
}

export interface SmsColors {
    shell: string;
    header: string;
    conversation: string;
    receivedBubble: string;
    sentBubble: string;
    primaryText: string;
    secondaryText: string;
    headerIcon: string;
    composer: string;
    tealPoint: string;
    link: string;
    audioBackground: string;
    audioIcon: string;
    redPoint: string;
    statusCheck: string;
    readReceiptBackground: string;
    readReceiptForeground: string;
    metadataIcon: string;
}
