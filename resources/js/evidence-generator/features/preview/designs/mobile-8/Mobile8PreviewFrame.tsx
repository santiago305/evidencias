import type { ReactNode } from 'react';
import type { PreviewThemeMode } from '../../../../types';
import type { MobileNotificationIconId } from '../../mobileNotifications';
import { Mobile8PreviewFooter } from './Mobile8PreviewFooter';
import { Mobile8PreviewHeader } from './Mobile8PreviewHeader';
import './mobile8.css';

type Mobile8PreviewFrameProps = {
    children: ReactNode;
    themeMode: PreviewThemeMode;
    notificationIds?: MobileNotificationIconId[];
    statusBarBackground?: string;
    contentClassName?: string;
    hideSystemHeader?: boolean;
    hideSystemFooter?: boolean;
};

export function Mobile8PreviewFrame({
    children,
    themeMode,
    notificationIds,
    statusBarBackground,
    contentClassName = '',
    hideSystemHeader = false,
    hideSystemFooter = false,
}: Mobile8PreviewFrameProps) {
    return (
        <div className="mobile8-font flex h-full w-full items-center justify-center">
            <div
                id="CAPTURA"
                className="flex h-[875px] max-h-[calc(100vh-2.5rem)] w-[390.75px] max-w-full flex-col overflow-hidden bg-white shadow-2xl"
            >
                {!hideSystemHeader ? (
                    <Mobile8PreviewHeader themeMode={themeMode} notificationIds={notificationIds} statusBarBackground={statusBarBackground} />
                ) : null}
                <div className={['min-h-0 flex-1 overflow-hidden', contentClassName].filter(Boolean).join(' ')}>{children}</div>
                {!hideSystemFooter ? <Mobile8PreviewFooter themeMode={themeMode} /> : null}
            </div>
        </div>
    );
}
