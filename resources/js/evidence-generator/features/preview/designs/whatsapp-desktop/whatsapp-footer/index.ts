import { createElement } from 'react';
import type { PreviewThemeMode } from '../../../../../types';
import { WhatsappDesktopInputBar } from './WhatsappDesktopInputBar';

export { MoreConversationIndicator } from './MoreConversationIndicator';
export { WhatsappDesktopInputBar } from './WhatsappDesktopInputBar';

export function WhatsappInputBar({
    themeMode = 'light',
    deviceMode = 'desktop',
}: {
    themeMode?: PreviewThemeMode;
    deviceMode?: 'desktop' | 'mobile';
}) {
    void deviceMode;

    return createElement(WhatsappDesktopInputBar, { themeMode });
}
