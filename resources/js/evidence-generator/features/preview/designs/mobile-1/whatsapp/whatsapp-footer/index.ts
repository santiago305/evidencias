import { createElement } from 'react';
import type { PreviewThemeMode } from '../../../../../../types';
import { WhatsappMobileInputBar } from './WhatsappMobileInputBar';

export { MoreConversationIndicator } from './MoreConversationIndicator';
export { WhatsappMobileInputBar } from './WhatsappMobileInputBar';

export function WhatsappInputBar({ themeMode = 'light' }: { themeMode?: PreviewThemeMode }) {
    return createElement(WhatsappMobileInputBar, { themeMode });
}
