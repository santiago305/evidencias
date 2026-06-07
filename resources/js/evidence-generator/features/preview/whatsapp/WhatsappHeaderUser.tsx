import { WhatsappDesktopHeaderUser } from './whatsapp-header/WhatsappDesktopHeaderUser';
import { WhatsappMobileHeaderUser } from './whatsapp-header/WhatsappMobileHeaderUser';
import type { MsgStatus } from './WhatsappPieces';
import type { WhatsappData } from './whatsappTypes';
import type { PreviewThemeMode } from '../../../types';

type WhatsappHeaderUserProps = {
    data: WhatsappData;
    status?: MsgStatus;
    showTemporaryIndicator?: boolean;
    displayTitle?: string;
    themeMode?: PreviewThemeMode;
    compact?: boolean;
};

export function WhatsappHeaderUser({
    data,
    status,
    showTemporaryIndicator = true,
    displayTitle,
    themeMode = 'light',
    compact = false,
}: WhatsappHeaderUserProps) {
    const headerProps = {
        data,
        displayTitle,
        showTemporaryIndicator,
        status,
        themeMode,
    };

    return compact ? <WhatsappMobileHeaderUser {...headerProps} /> : <WhatsappDesktopHeaderUser {...headerProps} />;
}
