import { createElement } from 'react';
import { WhatsappDesktopInputBar } from './WhatsappDesktopInputBar';
import { WhatsappMobileInputBar } from './WhatsappMobileInputBar';
import type { PreviewThemeMode } from '../../../../types';

export { WhatsappDesktopInputBar } from './WhatsappDesktopInputBar';
export { WhatsappMobileInputBar } from './WhatsappMobileInputBar';

export function WhatsappInputBar({
    themeMode = 'light',
    deviceMode = 'desktop',
}: {
    themeMode?: PreviewThemeMode;
    deviceMode?: 'desktop' | 'mobile';
}) {
    return deviceMode === 'mobile' ? createElement(WhatsappMobileInputBar, { themeMode }) : createElement(WhatsappDesktopInputBar, { themeMode });
}
