import type { PreviewThemeMode } from '../../../../../types';
import type { SmsColors } from './smsTypes';

export type Mobile13SmsHeaderColors = {
    headerBackground: string;
    headerText: string;
    backButtonBackground: string;
    backButtonBorder: string;
    backButtonText: string;
    avatarInitialTop: string;
    avatarInitialBottom: string;
    pillBackground: string;
    pillBorder: string;
    pillText: string;
    pillChevron: string;
};

export function getMobile13SmsHeaderColors(themeMode: PreviewThemeMode): Mobile13SmsHeaderColors {
    return themeMode === 'dark'
        ? {
              headerBackground: '#000000',
              headerText: '#FFFFFF',
              backButtonBackground: 'rgba(50, 50, 50, 0.78)',
              backButtonBorder: 'rgba(255, 255, 255, 0.10)',
              backButtonText: '#FFFFFF',
              avatarInitialTop: '#5B586F',
              avatarInitialBottom: '#372D4F',
              pillBackground: 'rgba(31, 31, 31, 0.90)',
              pillBorder: 'rgba(255, 255, 255, 0.12)',
              pillText: '#FFFFFF',
              pillChevron: '#8A8A8A',
          }
        : {
              headerBackground: '#FFFFFF',
              headerText: '#000000',
              backButtonBackground: 'rgba(255, 255, 255, 0.68)',
              backButtonBorder: 'rgba(100, 100, 100, 0.20)',
              backButtonText: '#000000',
              avatarInitialTop: '#9DB1D5',
              avatarInitialBottom: '#7782BA',
              pillBackground: 'rgba(255, 255, 255, 0.82)',
              pillBorder: 'rgba(100, 100, 100, 0.25)',
              pillText: '#000000',
              pillChevron: '#8A8A8A',
          };
}

export function getMobile13SmsColors(themeMode: PreviewThemeMode): SmsColors {
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
              shell: '#F9ECE6',
              header: '#F9ECE6',
              conversation: '#FFF6F1',
              receivedBubble: '#FAEAEB',
              sentBubble: '#FEDADA',
              sentText: '#24181A',
              primaryText: '#24181A',
              secondaryText: '#524444',
              headerIcon: '#524444',
              headerActionIcon: '#524444',
              composer: '#FAEAEB',
              tealPoint: '#FF63B7',
              link: '#524444',
              audioBackground: '#FEDDB4',
              audioIcon: '#281800',
              redPoint: '#FF63B7',
              menuIndicator: '#FF63B7',
              statusCheck: '#524444',
              readReceiptBackground: '#FFF6F7',
              readReceiptForeground: '#524444',
              metadataIcon: '#524444',
              avatarBackground: '#4DCDE6',
              avatarForeground: '#FFFFFF',
              systemNavigationForeground: '#747274',
              quickReplyBorder: '#CDBABB',
          };
}

export function getSmsColors(themeMode: PreviewThemeMode): SmsColors {
    return getMobile13SmsColors(themeMode);
}

export function shouldShowSmsAccentPoint(randomValue = Math.random()): boolean {
    return randomValue < 0.5;
}
