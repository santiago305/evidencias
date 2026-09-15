import { createElement, type ReactNode } from 'react';
import type { PreviewThemeMode } from '../../../../../../types';
import { WhatsappMobileInputBar } from './WhatsappMobileInputBar';

export { MoreConversationIndicator } from './MoreConversationIndicator';
export { Mobile10QuickActionButton } from './Mobile10QuickActionButton';
export { WhatsappMobileInputBar } from './WhatsappMobileInputBar';

export function WhatsappInputBar({
    themeMode = 'light',
    composerAccessory,
    composerLayout,
}: {
    themeMode?: PreviewThemeMode;
    composerAccessory?: ReactNode;
    composerLayout?: { messageAreaMaxWidth?: string };
}) {
    return createElement(WhatsappMobileInputBar, { themeMode, composerAccessory, composerLayout });
}
