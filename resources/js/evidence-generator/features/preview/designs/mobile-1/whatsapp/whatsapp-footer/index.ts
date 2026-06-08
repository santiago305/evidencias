import { createElement } from 'react';
import { WhatsappMobileInputBar } from './WhatsappMobileInputBar';
import type { PreviewThemeMode } from '../../../../../../types';

export { WhatsappMobileInputBar } from './WhatsappMobileInputBar';

export function WhatsappInputBar({ themeMode = 'light' }: { themeMode?: PreviewThemeMode }) {
    return createElement(WhatsappMobileInputBar, { themeMode });
}

