import type { PreviewThemeMode } from '../../../../../types';
import type { SmsColors } from './smsTypes';

export function getMobile9SmsColors(themeMode: PreviewThemeMode): SmsColors {
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
              tealPoint: '#008C95',
              link: '#D4C4C4',
              audioBackground: '#5E421B',
              audioIcon: '#FEDDB4',
              redPoint: '#FF63B7',
              menuIndicator: '#FF0000',
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
              shell: '#EAEDF2',
              header: '#EAEDF2',
              conversation: '#F5FAFE',
              receivedBubble: '#EBF6FA',
              sentBubble: '#CBE7FF',
              sentText: '#24181A',
              primaryText: '#42474D',
              secondaryText: '#42474D',
              headerIcon: '#42474D',
              headerActionIcon: '#42474D',
              composer: '#EAEDF2',
              tealPoint: '#008C95',
              link: '#42474D',
              audioBackground: '#EBDBFF',
              audioIcon: '#42474D',
              redPoint: '#FF63B7',
              menuIndicator: '#C20808',
              statusCheck: '#42474D',
              readReceiptBackground: '#F5FAFE',
              readReceiptForeground: '#42474D',
              metadataIcon: '#42474D',
              avatarBackground: '#FF63B7',
              avatarForeground: '#FFFFFF',
              systemNavigationForeground: '#747274',
              quickReplyBorder: '#CDBABB',
          };
}

export function getSmsColors(themeMode: PreviewThemeMode): SmsColors {
    return getMobile9SmsColors(themeMode);
}

export function shouldShowSmsAccentPoint(randomValue = Math.random()): boolean {
    return randomValue < 0.5;
}
