import { WhatsappConversationBackground } from './whatsapp-background/WhatsappConversationBackground';
import { ActiveTemporalMessage, Bubble, DayChip, DesactiveTemporalMessage, TempporalMessage } from './whatsapp-bubbles';
import { MoreConversationIndicator, WhatsappInputBar } from './whatsapp-footer';
import type { WhatsappMobileVisualAdapter } from '../../shared/whatsapp/whatsappVisualAdapter';
import { Mobile14EncryptedMessage } from './Mobile14EncryptedMessage';

export const mobile14WhatsappVisualAdapter: WhatsappMobileVisualAdapter = {
    ConversationBackground: WhatsappConversationBackground,
    DayChip,
    EncryptedMessage: Mobile14EncryptedMessage,
    TempporalMessage,
    ActiveTemporalMessage,
    DesactiveTemporalMessage,
    Bubble,
    MoreConversationIndicator,
    InputBar: WhatsappInputBar,
};

export type { WhatsappMobileVisualAdapter };
