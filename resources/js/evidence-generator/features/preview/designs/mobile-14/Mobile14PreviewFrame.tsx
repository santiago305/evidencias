import type { ReactNode } from 'react';
import type { PreviewThemeMode } from '../../../../types';
import type { MobileNotificationIconId } from '../../mobileNotifications';
import { Mobile14PreviewFooter } from './Mobile14PreviewFooter';
import { Mobile14PreviewHeader } from './Mobile14PreviewHeader';
import './mobile14.css';

type Mobile14PreviewFrameProps = {
    children: ReactNode;
    themeMode: PreviewThemeMode;
    notificationIds?: MobileNotificationIconId[];
    statusBarBackground?: string;
    statusBarForeground?: string;
    statusBarTimeColor?: string;
    systemFooterBackground?: string;
    systemFooterForeground?: string;
    contentClassName?: string;
    hideSystemHeader?: boolean;
    hideSystemFooter?: boolean;
    widthClassName?: string;
};

export function Mobile14PreviewFrame({
    children,
    themeMode,
    notificationIds,
    statusBarBackground,
    statusBarForeground,
    statusBarTimeColor,
    systemFooterBackground,
    systemFooterForeground,
    contentClassName = '',
    hideSystemHeader = false,
    hideSystemFooter = false,
    widthClassName = 'w-[466.75px]',
}: Mobile14PreviewFrameProps) {
    return (
        <div className="mobile14-font flex h-full w-full items-center justify-center">
            <div
                id="CAPTURA"
                className={`flex h-[875px] max-h-[calc(100vh-2.5rem)] w-[370.75px] max-w-full flex-col overflow-hidden bg-white shadow-2xl`}
            >
                {!hideSystemHeader ? (
                    <Mobile14PreviewHeader
                        themeMode={themeMode}
                        notificationIds={notificationIds}
                        statusBarBackground={statusBarBackground}
                        foregroundColor={statusBarForeground}
                        timeColor={statusBarTimeColor}
                    />
                ) : null}
                <div className={['min-h-0 flex-1 overflow-hidden', contentClassName].filter(Boolean).join(' ')}>{children}</div>
                {!hideSystemFooter ? (
                    <Mobile14PreviewFooter
                        themeMode={themeMode}
                        systemFooterBackground={systemFooterBackground}
                        systemFooterForeground={systemFooterForeground}
                    />
                ) : null}
            </div>
        </div>
    );
}
