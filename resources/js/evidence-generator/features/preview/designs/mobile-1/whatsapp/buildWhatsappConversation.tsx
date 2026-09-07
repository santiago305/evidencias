import { buildWhatsappConversation as buildSharedWhatsappConversation } from '../../shared/whatsapp/buildWhatsappConversation';
import type { WhatsappData } from '../../shared/whatsapp/whatsappTypes';
import type { WhatsappMessageStatus } from '../../shared/whatsapp/whatsappTypes';

export type { WhatsappConversationMessage } from '../../shared/whatsapp/buildWhatsappConversation';
export const buildWhatsappConversation = (data: WhatsappData, messageStatus?: WhatsappMessageStatus) =>
    buildSharedWhatsappConversation(data, messageStatus, 'mobile-1');
