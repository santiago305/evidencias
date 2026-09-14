import { WhatsappConversationBackground } from './whatsapp-background/WhatsappConversationBackground';
import { ActiveTemporalMessage, Bubble, DayChip, DesactiveTemporalMessage, TempporalMessage } from './whatsapp-bubbles';
import { MoreConversationIndicator, WhatsappInputBar } from './whatsapp-footer';
import type { WhatsappMobileVisualAdapter } from '../../shared/whatsapp/whatsappVisualAdapter';
import { Mobile8EncryptedMessage } from './Mobile8EncryptedMessage';

export const mobile8WhatsappVisualAdapter: WhatsappMobileVisualAdapter = {
    ConversationBackground: WhatsappConversationBackground,
    DayChip,
    EncryptedMessage: Mobile8EncryptedMessage,
    TempporalMessage,
    ActiveTemporalMessage,
    DesactiveTemporalMessage,
    Bubble,
    MoreConversationIndicator,
    InputBar: WhatsappInputBar,
};

export type { WhatsappMobileVisualAdapter };
