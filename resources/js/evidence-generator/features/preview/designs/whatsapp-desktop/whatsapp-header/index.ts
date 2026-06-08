import { createElement } from 'react';
import { WhatsappDesktopHeaderUser } from './WhatsappDesktopHeaderUser';
import type { MsgStatus } from '../WhatsappPieces';
import type { WhatsappData } from '../whatsappTypes';
import type { PreviewThemeMode } from '../../../../../types';

type WhatsappHeaderUserProps = {
    data: WhatsappData;
    status?: MsgStatus;
    showTemporaryIndicator?: boolean;
    displayTitle?: string;
    themeMode?: PreviewThemeMode;
    compact?: boolean;
};

export { WhatsappDesktopHeaderUser } from './WhatsappDesktopHeaderUser';

export function WhatsappHeaderUser({
    data,
    status,
    showTemporaryIndicator = true,
    displayTitle,
    themeMode = 'light',
    compact = false,
}: WhatsappHeaderUserProps) {
    void compact;

    return createElement(WhatsappDesktopHeaderUser, {
        data,
        displayTitle,
        showTemporaryIndicator,
        status,
        themeMode,
    });
}

