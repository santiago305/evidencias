import type { PreviewThemeMode } from '../../../../../types';
import type { SmsColors } from './smsTypes';

export function getMobile7SmsColors(themeMode: PreviewThemeMode): SmsColors {
    return themeMode === 'dark'
        ? {
              shell: '#271D1E', header: '#271D1E', conversation: '#1C1010', receivedBubble: '#271D1E', sentBubble: '#FFA7A9', sentText: '#2F0809', primaryText: '#EEDEDE', secondaryText: '#D4C4C4', headerIcon: '#D7C1C3', headerActionIcon: '#D7C1C3', composer: '#271D1E', tealPoint: '#FF63B7', link: '#D4C4C4', audioBackground: '#5E421B', audioIcon: '#FEDDB4', redPoint: '#FF63B7', menuIndicator: '#FF63B7', statusCheck: '#D4C4C4', readReceiptBackground: '#1C1010', readReceiptForeground: '#D4C4C4', metadataIcon: '#D4C4C4', avatarBackground: '#5CB973', avatarForeground: '#202125', systemNavigationForeground: '#FFFFFF', quickReplyBorder: '#6E5A5B',
          }
        : {
              shell: '#FAEAEB', header: '#FAEAEB', conversation: '#FFF6F7', receivedBubble: '#FAEAEB', sentBubble: '#FEDADA', sentText: '#24181A', primaryText: '#24181A', secondaryText: '#524444', headerIcon: '#524444', headerActionIcon: '#524444', composer: '#FAEAEB', tealPoint: '#FF63B7', link: '#524444', audioBackground: '#FEDDB4', audioIcon: '#281800', redPoint: '#FF63B7', menuIndicator: '#FF63B7', statusCheck: '#524444', readReceiptBackground: '#FFF6F7', readReceiptForeground: '#524444', metadataIcon: '#524444', avatarBackground: '#5CB973', avatarForeground: '#FFFFFF', systemNavigationForeground: '#747274', quickReplyBorder: '#CDBABB',
          };
}

export function getSmsColors(themeMode: PreviewThemeMode): SmsColors {
    return getMobile7SmsColors(themeMode);
}

export function shouldShowSmsAccentPoint(): boolean {
    return false;
}
