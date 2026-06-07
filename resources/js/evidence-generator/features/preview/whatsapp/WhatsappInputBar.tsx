import { WhatsappDesktopInputBar } from './whatsapp-footer/WhatsappDesktopInputBar';
import { WhatsappMobileInputBar } from './whatsapp-footer/WhatsappMobileInputBar';
import type { PreviewThemeMode } from '../../../types';

export function WhatsappInputBar({
    themeMode = 'light',
    deviceMode = 'desktop',
}: {
    themeMode?: PreviewThemeMode;
    deviceMode?: 'desktop' | 'mobile';
}) {
    return deviceMode === 'mobile' ? <WhatsappMobileInputBar themeMode={themeMode} /> : <WhatsappDesktopInputBar themeMode={themeMode} />;
}
