import type { PreviewThemeMode } from '../../../../../../types';
import { useWhatsappColorProfile } from '../whatsappColorProfile';
import { WhatsappDarkConversationBackground } from './WhatsappDarkConversationBackground';
import { WhatsappLightConversationBackground } from './WhatsappLightConversationBackground';

export function WhatsappConversationBackground({ themeMode }: { themeMode: PreviewThemeMode }) {
    const colors = useWhatsappColorProfile();

    return themeMode === 'dark' ? <WhatsappDarkConversationBackground colors={colors} /> : <WhatsappLightConversationBackground colors={colors} />;
}
