import type { ReactNode } from 'react';
import type { PreviewThemeMode } from '../../../../types';
import type { MobileNotificationIconId } from '../../mobileNotifications';
import type {
    MobileBatteryRenderer,
    MobileFrameDimensions,
    MobilePreviewChannel,
    MobileSystemFooterRenderer,
} from '../shared/mobile-preview/mobilePreviewTypes';
import './mobile6.css';
import { Mobile6PreviewFooter } from './Mobile6PreviewFooter';
import { Mobile6PreviewHeader } from './Mobile6PreviewHeader';

type Mobile6PreviewFrameProps = {
    children: ReactNode;
    themeMode: PreviewThemeMode;
    contentClassName?: string;
    hideSystemHeader?: boolean;
    hideSystemFooter?: boolean;
    notificationSeed?: string;
    notificationIds?: MobileNotificationIconId[];
    headerVariant?: 'default' | 'whatsapp' | 'sms';
    footerVariant?: 'default' | 'sms';
    systemHeaderBackground?: string;
    systemHeaderForeground?: string;
    systemFooterBackground?: string;
    systemFooterForeground?: string;
    batteryRenderer?: MobileBatteryRenderer;
    footerRenderer?: MobileSystemFooterRenderer;
    channel?: MobilePreviewChannel;
    frame?: MobileFrameDimensions;
};

export function Mobile6PreviewFrame({
    children,
    themeMode,
    contentClassName = '',
    hideSystemHeader = false,
    hideSystemFooter = false,
    notificationSeed,
    notificationIds,
    headerVariant = 'default',
    footerVariant = 'default',
    systemHeaderBackground,
    systemHeaderForeground,
    systemFooterBackground,
    systemFooterForeground,
    batteryRenderer,
    footerRenderer,
    channel,
    frame,
}: Mobile6PreviewFrameProps) {
    const isDark = themeMode === 'dark';

    return (
        <div className={['flex h-full w-full items-center justify-center p-5', isDark ? 'bg-slate-950' : 'bg-slate-100'].join(' ')}>
            <div
                id="CAPTURA"
                className={[
                    'mobile6-font flex h-[950px] max-h-[calc(100vh-2.5rem)] w-[487.5px] max-w-full flex-col overflow-hidden shadow-2xl',
                    isDark ? 'bg-[#101418] shadow-black/45' : 'bg-white shadow-slate-300/60',
                ].join(' ')}
                style={{ width: frame?.width, height: frame?.height }}
            >
                {!hideSystemHeader ? (
                    <Mobile6PreviewHeader
                        themeMode={themeMode}
                        notificationSeed={notificationSeed}
                        notificationIds={notificationIds}
                        variant={headerVariant}
                        systemHeaderBackground={systemHeaderBackground}
                        systemHeaderForeground={systemHeaderForeground}
                        batteryRenderer={batteryRenderer}
                    />
                ) : null}
                <div className={['min-h-0 flex-1 overflow-hidden', contentClassName].filter(Boolean).join(' ')}>{children}</div>
                {!hideSystemFooter ? (
                    footerRenderer ? (
                        footerRenderer({
                            themeMode,
                            channel: channel ?? (footerVariant === 'sms' ? 'sms' : 'whatsapp'),
                            background: systemFooterBackground,
                            foreground: systemFooterForeground,
                        })
                    ) : (
                        <Mobile6PreviewFooter
                            themeMode={themeMode}
                            variant={footerVariant}
                            systemFooterBackground={systemFooterBackground}
                            systemFooterForeground={systemFooterForeground}
                        />
                    )
                ) : null}
            </div>
        </div>
    );
}
