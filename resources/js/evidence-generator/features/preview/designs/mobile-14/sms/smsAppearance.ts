import type { PreviewThemeMode } from '../../../../../types';
import type { SmsColors } from './smsTypes';

export function getMobile14SmsColors(themeMode: PreviewThemeMode): SmsColors {
    return themeMode === 'dark'
        ? {
              shell: '#231E24',
              header: '#231E24',
              conversation: '#110F12',
              receivedBubble: '#231E24',
              sentBubble: '#5A367C',
              sentText: '#FFFFFF',
              primaryText: '#EDE9EF',
              secondaryText: '#D0CAD2',
              headerIcon: '#D0CAD2',
              headerActionIcon: '#CDC2D0',
              composer: '#231E24',
              tealPoint: '#008C95',
              link: '#D4C4C4',
              audioBackground: '#792D3A',
              audioIcon: '#FFD9DD',
              redPoint: '#FF63B7',
              menuIndicator: '#FF0000',
              statusCheck: '#D4C4C4',
              readReceiptBackground: '#DFBAFF',
              readReceiptForeground: '#110F12',
              metadataIcon: '#D4C4C4',
              avatarBackground: '#5CB973',
              avatarForeground: '#202125',
              systemNavigationForeground: '#FFFFFF',
              quickReplyBorder: '#6E5A5B',
          }
        : {
              shell: '#F1ECF0',
              header: '#F1ECF0',
              conversation: '#FEF7FE',
              receivedBubble: '#F1ECF0',
              sentBubble: '#724E96',
              sentText: '#FFFFFF',
              primaryText: '#42474D',
              secondaryText: '#42474D',
              headerIcon: '#42474D',
              headerActionIcon: '#42474D',
              composer: '#F1ECF0',
              tealPoint: '#008C95',
              link: '#42474D',
              audioBackground: '#FFD9DC',
              audioIcon: '#37000D',
              redPoint: '#FF63B7',
              menuIndicator: '#C20808',
              statusCheck: '#42474D',
              readReceiptBackground: '#725193',
              readReceiptForeground: '#FEF7FE',
              metadataIcon: '#42474D',
              avatarBackground: '#FF63B7',
              avatarForeground: '#FFFFFF',
              systemNavigationForeground: '#747274',
              quickReplyBorder: '#CDBABB',
          };
}

export function getSmsColors(themeMode: PreviewThemeMode): SmsColors {
    return getMobile14SmsColors(themeMode);
}

export function shouldShowSmsAccentPoint(randomValue = Math.random()): boolean {
    return randomValue < 0.5;
}
