import type { WhatsappMobileVisualAdapter } from '../../shared/whatsapp/whatsappVisualAdapter';
import { WhatsappConversationBackground } from './whatsapp-background/WhatsappConversationBackground';
import { ActiveTemporalMessage, Bubble, DayChip, DesactiveTemporalMessage, EncryptedMessage, TempporalMessage } from './whatsapp-bubbles';
import { MoreConversationIndicator, WhatsappInputBar } from './whatsapp-footer';

export const mobile6WhatsappVisualAdapter: WhatsappMobileVisualAdapter = {
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
