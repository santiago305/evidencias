import type { ComponentType, ReactElement, ReactNode } from 'react';
import type { MobileDesignKey, PreviewProps, PreviewThemeMode, SavedData } from '../../../../../types';
import type { MobileNotificationIconId } from '../../../mobileNotifications';
import type { SmsDesignVariant } from '../sms/smsTypes';
import type { WhatsappColorProfile } from '../whatsapp/whatsappColorProfile';
import type { WhatsappBehaviorProfile, WhatsappData, WhatsappMessageStatus } from '../whatsapp/whatsappTypes';
import type { WhatsappMobileVisualAdapter } from '../whatsapp/whatsappVisualAdapter';

export type MobilePreviewChannel = 'whatsapp' | 'sms' | 'call';

export interface WhatsappMobileHeaderProps {
    data: WhatsappData;
    status?: WhatsappMessageStatus;
    showTemporaryIndicator?: boolean;
    displayTitle?: string;
    themeMode?: PreviewThemeMode;
}

export interface MobileSystemChromeProfile {
    headerBackground?: string;
    headerForeground?: string;
    footerBackground?: string;
    footerForeground?: string;
}

export type MobileBatteryRenderer = (level: number, themeMode: PreviewThemeMode) => ReactElement;

export type MobileSystemFooterRenderer = (props: {
    themeMode: PreviewThemeMode;
    channel: MobilePreviewChannel;
    background?: string;
    foreground?: string;
}) => ReactElement;

export type MobileFrameDimensions = {
    width?: number | string;
    height?: number | string;
};

export type WhatsappComposerLayout = {
    messageAreaMaxWidth?: string;
};

export type SmsComposerLayout = {
    messageAreaMaxWidth?: string;
};

export interface MobileFrameRenderProps {
    children: ReactNode;
    data: SavedData;
    themeMode: PreviewThemeMode;
    channel: MobilePreviewChannel;
    notificationIds: MobileNotificationIconId[];
    smsShellColor?: string;
    systemChrome?: MobileSystemChromeProfile;
    batteryRenderer?: MobileBatteryRenderer;
    footerRenderer?: MobileSystemFooterRenderer;
    frame?: MobileFrameDimensions;
}

export type MobileFrameRenderer = (props: MobileFrameRenderProps) => ReactElement;

export type ComposedMobileWhatsappProfile = {
    kind: 'composed';
    Header: ComponentType<WhatsappMobileHeaderProps>;
    behaviorProfile: WhatsappBehaviorProfile;
    visualAdapter: WhatsappMobileVisualAdapter;
    colors?: Record<PreviewThemeMode, WhatsappColorProfile>;
    systemChrome?: Record<PreviewThemeMode, MobileSystemChromeProfile>;
    composerLayout?: WhatsappComposerLayout;
    renderComposerAccessory?: (themeMode: PreviewThemeMode) => ReactNode;
};

export type CustomMobileWhatsappProfile = {
    kind: 'custom';
    Preview: ComponentType<PreviewProps>;
};

export interface MobilePreviewDesignProfile {
    key: MobileDesignKey;
    renderFrame: MobileFrameRenderer;
    frame?: MobileFrameDimensions;
    batteryRenderer?: MobileBatteryRenderer;
    footerRenderer?: MobileSystemFooterRenderer;
    systemChrome?: Record<PreviewThemeMode, MobileSystemChromeProfile>;
    whatsapp: ComposedMobileWhatsappProfile | CustomMobileWhatsappProfile;
    sms: {
        variant: SmsDesignVariant;
        showVideoCall: boolean;
        composerLayout?: SmsComposerLayout;
        systemChrome?: Record<PreviewThemeMode, MobileSystemChromeProfile>;
    };
    call: {
        missedSpacingVariant?: 'mobile-1' | 'standard';
    };
}

export interface MobilePreviewRegistration {
    whatsapp: ComponentType<PreviewProps>;
    sms: ComponentType<PreviewProps>;
    call: ComponentType<PreviewProps>;
}
