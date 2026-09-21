import type { PreviewThemeMode } from '../../../../../types';
import type { SmsColors } from './smsTypes';

export function getMobile12SmsColors(themeMode: PreviewThemeMode): SmsColors {
    return themeMode === 'dark'
        ? {
              shell: '#010101',
              header: '#010101',
              conversation: '#010101',
              receivedBubble: '#2B2B2B',
              sentBubble: '#009184',
              primaryText: '#E0E1E5',
              sentText: '#E8F5FA',
              secondaryText: '#BFC0C5',
              headerIcon: '#C0C7CD',
              headerActionIcon: '#D5DBDF',
              composer: '#010101',
              tealPoint: '#70B9D1',
              link: '#68B8D0',
              audioBackground: '#484264',
              audioIcon: '#E4DDEF',
              redPoint: '#E9A0A5',
              menuIndicator: '#F3A9B3',
              statusCheck: '#C8C8CF',
              readReceiptBackground: '#010101',
              readReceiptForeground: '#E0E1E5',
              metadataIcon: '#BFC0C5',
              avatarBackground: '#5CB973',
              avatarForeground: '#202125',
              systemNavigationForeground: '#ECEDEF',
              quickReplyBorder: '#68757B',
          }
        : {
              shell: '#E9EEF2',
              header: '#E9EEF2',
              conversation: '#F6FAFD',
              receivedBubble: '#E9EEF2',
              sentBubble: '#00688D',
              sentText: '#F8FCFF',
              primaryText: '#202124',
              secondaryText: '#5F6368',
              headerIcon: '#303438',
              headerActionIcon: '#303438',
              composer: '#E9EEF2',
              tealPoint: '#008C95',
              link: '#147B86',
              audioBackground: '#E5DEFF',
              audioIcon: '#28243A',
              redPoint: '#B3261E',
              menuIndicator: '#B3261E',
              statusCheck: '#62676B',
              readReceiptBackground: '#F6FAFD',
              readReceiptForeground: '#62676B',
              metadataIcon: '#5F6368',
              avatarBackground: '#49B866',
              avatarForeground: '#FFFFFF',
              systemNavigationForeground: '#6B6C6E',
              quickReplyBorder: '#B8C2C8',
          };
}

export function getSmsColors(themeMode: PreviewThemeMode): SmsColors {
    return getMobile12SmsColors(themeMode);
}

export function shouldShowSmsAccentPoint(randomValue = Math.random()): boolean {
    return randomValue < 0.5;
}
