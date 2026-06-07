import { WhatsappDarkConversationBackground } from './WhatsappDarkConversationBackground';
import { WhatsappLightConversationBackground } from './WhatsappLightConversationBackground';
import type { PreviewThemeMode } from '../../../../types';

export function WhatsappConversationBackground({ themeMode }: { themeMode: PreviewThemeMode }) {
    return themeMode === 'dark' ? <WhatsappDarkConversationBackground /> : <WhatsappLightConversationBackground />;
}
