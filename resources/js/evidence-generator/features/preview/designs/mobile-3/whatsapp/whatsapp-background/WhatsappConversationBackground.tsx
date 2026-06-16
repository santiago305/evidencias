import type { PreviewThemeMode } from '../../../../../../types';
import { WhatsappDarkConversationBackground } from './WhatsappDarkConversationBackground';
import { WhatsappLightConversationBackground } from './WhatsappLightConversationBackground';

export function WhatsappConversationBackground({ themeMode }: { themeMode: PreviewThemeMode }) {
    return themeMode === 'dark' ? <WhatsappDarkConversationBackground /> : <WhatsappLightConversationBackground />;
}
