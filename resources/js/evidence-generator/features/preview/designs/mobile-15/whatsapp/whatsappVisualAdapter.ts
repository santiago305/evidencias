import { WhatsappConversationBackground } from './whatsapp-background/WhatsappConversationBackground';
import { ActiveTemporalMessage, Bubble, DayChip, DesactiveTemporalMessage, TempporalMessage } from './whatsapp-bubbles';
import { MoreConversationIndicator, WhatsappInputBar } from './whatsapp-footer';
import type { WhatsappMobileVisualAdapter } from '../../shared/whatsapp/whatsappVisualAdapter';
import { Mobile15EncryptedMessage } from './Mobile15EncryptedMessage';

export const mobile15WhatsappVisualAdapter: WhatsappMobileVisualAdapter = {
    ConversationBackground: WhatsappConversationBackground,
    DayChip,
    EncryptedMessage: Mobile15EncryptedMessage,
    TempporalMessage,
    ActiveTemporalMessage,
    DesactiveTemporalMessage,
    Bubble,
    MoreConversationIndicator,
    InputBar: WhatsappInputBar,
};

export type { WhatsappMobileVisualAdapter };
