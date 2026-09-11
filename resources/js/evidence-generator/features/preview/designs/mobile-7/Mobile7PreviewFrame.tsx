import type { ReactNode } from 'react';
import type { PreviewThemeMode } from '../../../../types';
import type { MobileNotificationIconId } from '../../mobileNotifications';
import { Mobile7PreviewFooter } from './Mobile7PreviewFooter';
import { Mobile7PreviewHeader } from './Mobile7PreviewHeader';

type Mobile7PreviewFrameProps = {
    children: ReactNode;
    themeMode: PreviewThemeMode;
    notificationIds?: MobileNotificationIconId[];
    statusBarBackground?: string;
    contentClassName?: string;
    hideSystemHeader?: boolean;
    hideSystemFooter?: boolean;
};

export function Mobile7PreviewFrame({
    children,
    themeMode,
    notificationIds,
    statusBarBackground,
    contentClassName = '',
    hideSystemHeader = false,
    hideSystemFooter = false,
}: Mobile7PreviewFrameProps) {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div
                id="CAPTURA"
                className="flex h-[875px] max-h-[calc(100vh-2.5rem)] w-[390.75px] max-w-full flex-col overflow-hidden bg-white shadow-2xl"
            >
                {!hideSystemHeader ? (
                    <Mobile7PreviewHeader themeMode={themeMode} notificationIds={notificationIds} statusBarBackground={statusBarBackground} />
                ) : null}
                <div className={['min-h-0 flex-1 overflow-hidden', contentClassName].filter(Boolean).join(' ')}>{children}</div>
                {!hideSystemFooter ? <Mobile7PreviewFooter themeMode={themeMode} /> : null}
            </div>
        </div>
    );
}
