import type { PreviewThemeMode } from '../../../../types';
import type { MobileSystemChromeProfile } from '../shared/mobile-preview';
import { getSmsColors } from '../shared/sms/smsAppearance';
import type { WhatsappColorProfile } from '../shared/whatsapp/whatsappColorProfile';

export const mobile5WhatsappColors: Record<PreviewThemeMode, WhatsappColorProfile> = {
    light: {
        headerBackground: '#FFFFFF',
        headerText: '#11161B',
        headerIcons: '#151A1F',
        conversationBackground: '#FFFFFF',
        wallpaperPattern: '#EEEEEE',
        avatarBackground: '#F4DED1',
        avatarText: '#82563B',
        outgoingBubble: '#5E47DF',
        outgoingText: '#FFFFFF',
        outgoingMetadata: '#AF9FFF',
        incomingBubble: '#EEEEEE',
        incomingText: '#11161B',
        incomingMetadata: '#5D6266',
        readChecks: '#7FC1FD',
        dateChipBackground: '#F6F5F3',
        dateChipText: '#5D6266',
        composerBackground: '#FFFFFF',
        composerText: '#5D6266',
        composerIcons: '#5D6266',
        microphoneBackground: '#5E47DF',
        microphoneIcon: '#FFFFFF',
    },
    dark: {
        headerBackground: '#161817',
        headerText: '#F7F8FA',
        headerIcons: '#F7F8FA',
        conversationBackground: '#161817',
        wallpaperPattern: '#252626',
        avatarBackground: '#35271E',
        avatarText: '#D8A789',
        outgoingBubble: '#433597',
        outgoingText: '#F7F8FA',
        outgoingMetadata: '#A199D5',
        incomingBubble: '#242625',
        incomingText: '#F7F8FA',
        incomingMetadata: '#A7A9A8',
        readChecks: '#5FA0FA',
        dateChipBackground: '#1F272A',
        dateChipText: '#8D9598',
        composerBackground: '#1F272A',
        composerText: '#8D9598',
        composerIcons: '#8D9598',
        microphoneBackground: '#A791FE',
        microphoneIcon: '#0B1014',
    },
};

export const mobile5WhatsappSystemChrome: Record<PreviewThemeMode, MobileSystemChromeProfile> = {
    light: {
        headerBackground: '#FFFFFF',
        headerForeground: '#404040',
        footerBackground: '#FFFFFF',
        footerForeground: '#7A7A7A',
    },
    dark: {
        headerBackground: '#161817',
        headerForeground: '#E8E8E8',
        footerBackground: '#161817',
        footerForeground: '#A2A2A2',
    },
};

export const mobile5SmsSurfaceColors = {
    light: {
        header: getSmsColors('light', 'mobile-3').header,
        composer: getSmsColors('light', 'mobile-3').composer,
    },
    dark: {
        header: getSmsColors('dark', 'mobile-3').header,
        composer: getSmsColors('dark', 'mobile-3').composer,
    },
} as const;

export const mobile5SmsSystemChrome: Record<PreviewThemeMode, MobileSystemChromeProfile> = {
    light: {
        headerBackground: mobile5SmsSurfaceColors.light.header,
        headerForeground: mobile5WhatsappSystemChrome.light.headerForeground,
        footerBackground: mobile5SmsSurfaceColors.light.composer,
        footerForeground: mobile5WhatsappSystemChrome.light.footerForeground,
    },
    dark: {
        headerBackground: mobile5SmsSurfaceColors.dark.header,
        headerForeground: mobile5WhatsappSystemChrome.dark.headerForeground,
        footerBackground: mobile5SmsSurfaceColors.dark.composer,
        footerForeground: mobile5WhatsappSystemChrome.dark.footerForeground,
    },
};

export const mobile5BatteryProgress = {
    light: '#D9D7D7',
    dark: '#636363',
} as const;
