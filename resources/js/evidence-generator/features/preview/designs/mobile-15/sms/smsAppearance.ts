import type { PreviewThemeMode } from '../../../../../types';
import type { SmsColors } from './smsTypes';

export function getMobile15SmsColors(themeMode: PreviewThemeMode): SmsColors {
    return themeMode === 'dark'
        ? {
              shell: '#141318',
              header: '#201F24',
              conversation: '#141318',
              receivedBubble: '#201F24',
              receivedText: '#C7C5D0',
              sentBubble: '#A9B5FF',
              sentText: '#131318',
              primaryText: '#F5F1F5',
              secondaryText: '#C8C3CA',
              headerIcon: '#C7C5D0',
              headerActionIcon: '#C7C5D0',
              composer: '#201F24',
              tealPoint: '#FF63B7',
              link: '#C8C3CA',
              audioBackground: '#5B3D57',
              audioIcon: '#F5EAF5',
              redPoint: '#FF63B7',
              menuIndicator: '#FF63B7',
              statusCheck: '#C8C3CA',
              readReceiptBackground: '#141318',
              readReceiptForeground: '#C8C3CA',
              metadataIcon: '#C8C3CA',
              avatarBackground: '#FF63B7',
              avatarForeground: '#202125',
              systemNavigationForeground: '#F5F1F5',
              quickReplyBorder: '#49464D',
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
