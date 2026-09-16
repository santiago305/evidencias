import { createElement } from 'react';
import type { ReactNode } from 'react';
import type { PreviewThemeMode } from '../../../../../../types';
import { WhatsappMobileInputBar } from './WhatsappMobileInputBar';

export { MoreConversationIndicator } from './MoreConversationIndicator';
export { WhatsappMobileInputBar } from './WhatsappMobileInputBar';
export { Mobile11QuickActionButton } from './Mobile11QuickActionButton';

export function WhatsappInputBar({
    themeMode = 'light',
    composerAccessory,
    composerLayout,
}: {
    themeMode?: PreviewThemeMode;
    composerAccessory?: ReactNode;
    composerLayout?: { messageAreaMaxWidth?: string };
}) {
    return createElement(WhatsappMobileInputBar, { themeMode, composerAccessory });
}
