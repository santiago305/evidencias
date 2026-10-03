import type { PreviewThemeMode } from '../../../../../types';
import type { SmsColors } from './smsTypes';

export function getMobile15SmsColors(themeMode: PreviewThemeMode): SmsColors {
    return themeMode === 'dark'
        ? {
              shell: '#271D1E',
              header: '#271D1E',
              conversation: '#1C1010',
              receivedBubble: '#271D1E',
              sentBubble: '#FFA7A9',
              sentText: '#2F0809',
              primaryText: '#EEDEDE',
              secondaryText: '#D4C4C4',
              headerIcon: '#D7C1C3',
              headerActionIcon: '#D7C1C3',
              composer: '#271D1E',
              tealPoint: '#FF63B7',
              link: '#D4C4C4',
              audioBackground: '#5E421B',
              audioIcon: '#FEDDB4',
              redPoint: '#FF63B7',
              menuIndicator: '#FF63B7',
              statusCheck: '#D4C4C4',
              readReceiptBackground: '#1C1010',
              readReceiptForeground: '#D4C4C4',
              metadataIcon: '#D4C4C4',
              avatarBackground: '#5CB973',
              avatarForeground: '#202125',
              systemNavigationForeground: '#FFFFFF',
              quickReplyBorder: '#6E5A5B',
          }
        : {
              shell: '#F1FCFF',
              header: '#E3F0F8',
              conversation: '#F1FCFF',
              receivedBubble: '#E3F0F8',
              sentBubble: '#B9E9FF',
              sentText: '#131E24',
              primaryText: '#131E24',
              secondaryText: '#46545B',
              headerIcon: '#46545B',
              headerActionIcon: '#46545B',
              composer: '#E3F0F8',
              tealPoint: '#35A9D6',
              link: '#46545B',
              audioBackground: '#E7DDFF',
              audioIcon: '#4A3C5F',
              redPoint: '#FF63B7',
              menuIndicator: '#35A9D6',
              statusCheck: '#46545B',
              readReceiptBackground: '#F1FCFF',
              readReceiptForeground: '#46545B',
              metadataIcon: '#46545B',
              avatarBackground: '#BC57FF',
              avatarForeground: '#FFFFFF',
              systemNavigationForeground: '#747274',
              quickReplyBorder: '#B8C9D3',
          };
}

export function getSmsColors(themeMode: PreviewThemeMode): SmsColors {
    return getMobile15SmsColors(themeMode);
}

export function shouldShowSmsAccentPoint(randomValue = Math.random()): boolean {
    return randomValue < 0.5;
}
