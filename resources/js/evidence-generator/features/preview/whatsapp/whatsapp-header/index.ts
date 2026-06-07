import { createElement } from 'react';
import { WhatsappDesktopHeaderUser } from './WhatsappDesktopHeaderUser';
import { WhatsappMobileHeaderUser } from './WhatsappMobileHeaderUser';
import type { MsgStatus } from '../WhatsappPieces';
import type { WhatsappData } from '../whatsappTypes';
import type { PreviewThemeMode } from '../../../../types';

type WhatsappHeaderUserProps = {
    data: WhatsappData;
    status?: MsgStatus;
    showTemporaryIndicator?: boolean;
    displayTitle?: string;
    themeMode?: PreviewThemeMode;
    compact?: boolean;
};

export { WhatsappDesktopHeaderUser } from './WhatsappDesktopHeaderUser';
export { WhatsappMobileHeaderUser } from './WhatsappMobileHeaderUser';

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

    return compact ? createElement(WhatsappMobileHeaderUser, headerProps) : createElement(WhatsappDesktopHeaderUser, headerProps);
}
