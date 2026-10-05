import type { SmsColors as SharedSmsColors } from '../../shared/sms/smsTypes';

export type SmsColors = SharedSmsColors & { receivedText?: string };
export type { SmsConversationMessage, SmsConversationType, SmsData, SmsDesignVariant, SmsGroupPosition, SmsMessageStatus } from '../../shared/sms/smsTypes';
