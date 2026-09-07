import type { GeneratedMessage, PreviewProps } from '../../../../../types';

export type SmsData = NonNullable<PreviewProps['data']>;
export type SmsDesignVariant = 'mobile-1' | 'mobile-2' | 'mobile-3';
export type SmsMessageStatus = NonNullable<GeneratedMessage['status']>;
export type SmsConversationType = 'rcs' | 'sms';
export type SmsGroupPosition = 'single' | 'first' | 'middle' | 'last';

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
    sentText: string;
    primaryText: string;
    secondaryText: string;
    headerIcon: string;
    headerActionIcon: string;
    composer: string;
    tealPoint: string;
    link: string;
    audioBackground: string;
    audioIcon: string;
    redPoint: string;
    menuIndicator: string;
    statusCheck: string;
    readReceiptBackground: string;
    readReceiptForeground: string;
    metadataIcon: string;
    avatarBackground: string;
    avatarForeground: string;
    systemNavigationForeground: string;
    quickReplyBorder: string;
}
