import type { ReactNode } from 'react';
import type { PreviewThemeMode } from '../../../../types';
import type { MobileNotificationIconId } from '../../mobileNotifications';
import { Mobile13PreviewFooter } from './Mobile13PreviewFooter';
import { Mobile13PreviewHeader } from './Mobile13PreviewHeader';
import './mobile13.css';

type Mobile13PreviewFrameProps = {
    children: ReactNode;
    themeMode: PreviewThemeMode;
    notificationIds?: MobileNotificationIconId[];
    statusBarBackground?: string;
    systemFooterBackground?: string;
    systemFooterForeground?: string;
    contentClassName?: string;
    hideSystemHeader?: boolean;
    hideSystemFooter?: boolean;
};

export function Mobile13PreviewFrame({
    children,
    themeMode,
    notificationIds,
    statusBarBackground,
    systemFooterBackground,
    systemFooterForeground,
    contentClassName = '',
    hideSystemHeader = false,
    hideSystemFooter = false,
}: Mobile13PreviewFrameProps) {
    return (
        <div className="mobile13-font flex h-full w-full items-center justify-center">
            <div
                id="CAPTURA"
                className="flex h-[875px] max-h-[calc(100vh-2.5rem)] w-[375.75px] max-w-full flex-col overflow-hidden bg-white shadow-2xl"
            >
                {!hideSystemHeader ? (
                    <Mobile13PreviewHeader themeMode={themeMode} notificationIds={notificationIds} statusBarBackground={statusBarBackground} />
                ) : null}
                <div className={['min-h-0 flex-1 overflow-hidden', contentClassName].filter(Boolean).join(' ')}>{children}</div>
                {!hideSystemFooter ? (
                    <Mobile13PreviewFooter
                        themeMode={themeMode}
                        systemFooterBackground={systemFooterBackground}
                        systemFooterForeground={systemFooterForeground}
                    />
                ) : null}
            </div>
        </div>
    );
}
