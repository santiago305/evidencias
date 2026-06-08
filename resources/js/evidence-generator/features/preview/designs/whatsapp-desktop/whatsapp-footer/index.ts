import { createElement } from 'react';
import { WhatsappDesktopInputBar } from './WhatsappDesktopInputBar';
import type { PreviewThemeMode } from '../../../../../types';

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

