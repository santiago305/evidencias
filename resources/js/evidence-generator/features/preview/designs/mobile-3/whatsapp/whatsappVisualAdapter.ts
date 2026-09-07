import { WhatsappConversationBackground } from './whatsapp-background/WhatsappConversationBackground';
import { ActiveTemporalMessage, Bubble, DayChip, DesactiveTemporalMessage, EncryptedMessage, TempporalMessage } from './whatsapp-bubbles';
import { MoreConversationIndicator, WhatsappInputBar } from './whatsapp-footer';
import type { WhatsappMobileVisualAdapter } from '../../shared/whatsapp/whatsappVisualAdapter';

export const mobile3WhatsappVisualAdapter: WhatsappMobileVisualAdapter = {
    ConversationBackground: WhatsappConversationBackground,
    DayChip,
    EncryptedMessage,
    TempporalMessage,
    ActiveTemporalMessage,
    DesactiveTemporalMessage,
    Bubble,
    MoreConversationIndicator,
    InputBar: WhatsappInputBar,
};
