import type { ReactNode } from 'react';
import type { PreviewThemeMode } from '../../../../types';
import type { MobileNotificationIconId } from '../../mobileNotifications';
import { Mobile15PreviewFooter } from './Mobile15PreviewFooter';
import { Mobile15PreviewHeader } from './Mobile15PreviewHeader';
import './mobile15.css';

type Mobile15PreviewFrameProps = {
    children: ReactNode;
    themeMode: PreviewThemeMode;
    notificationIds?: MobileNotificationIconId[];
    statusBarBackground?: string;
    statusBarForeground?: string;
    systemFooterBackground?: string;
    contentClassName?: string;
    hideSystemHeader?: boolean;
    hideSystemFooter?: boolean;
};

export function Mobile15PreviewFrame({
    children,
    themeMode,
    notificationIds,
    statusBarBackground,
    statusBarForeground,
    systemFooterBackground,
    contentClassName = '',
    hideSystemHeader = false,
    hideSystemFooter = false,
}: Mobile15PreviewFrameProps) {
    return (
        <div className="mobile15-font flex h-full w-full items-center justify-center">
            <div
                id="CAPTURA"
                className="flex h-[875px] max-h-[calc(100vh-2.5rem)] w-[390.75px] max-w-full flex-col overflow-hidden bg-white shadow-2xl"
            >
                {!hideSystemHeader ? (
                    <Mobile15PreviewHeader
                        themeMode={themeMode}
                        notificationIds={notificationIds}
                        statusBarBackground={statusBarBackground}
                        statusBarForeground={statusBarForeground}
                    />
                ) : null}
                <div className={['min-h-0 flex-1 overflow-hidden', contentClassName].filter(Boolean).join(' ')}>{children}</div>
                {!hideSystemFooter ? <Mobile15PreviewFooter themeMode={themeMode} systemFooterBackground={systemFooterBackground} /> : null}
            </div>
        </div>
    );
}
