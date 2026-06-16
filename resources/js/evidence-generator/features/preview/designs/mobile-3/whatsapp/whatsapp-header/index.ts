import { createElement } from 'react';
import type { PreviewThemeMode } from '../../../../../../types';
import type { MsgStatus } from '../WhatsappPieces';
import type { WhatsappData } from '../whatsappTypes';
import { WhatsappMobileHeaderUser } from './WhatsappMobileHeaderUser';

type WhatsappHeaderUserProps = {
    data: WhatsappData;
    status?: MsgStatus;
    showTemporaryIndicator?: boolean;
    displayTitle?: string;
    themeMode?: PreviewThemeMode;
};

export { WhatsappMobileHeaderUser } from './WhatsappMobileHeaderUser';

export function WhatsappHeaderUser({ data, status, showTemporaryIndicator = true, displayTitle, themeMode = 'light' }: WhatsappHeaderUserProps) {
    return createElement(WhatsappMobileHeaderUser, {
        data,
        displayTitle,
        showTemporaryIndicator,
        status,
        themeMode,
    });
}
