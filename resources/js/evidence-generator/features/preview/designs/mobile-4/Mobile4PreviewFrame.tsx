import type { ReactNode } from 'react';
import type { PreviewThemeMode } from '../../../../types';
import type { MobileNotificationIconId } from '../../mobileNotifications';
import { Mobile1PreviewFooter } from '../mobile-3/Mobile1PreviewFooter';
import { Mobile4PreviewHeader } from './Mobile4PreviewHeader';

type Mobile4PreviewFrameProps = {
    children: ReactNode;
    themeMode: PreviewThemeMode;
    notificationIds?: MobileNotificationIconId[];
    statusBarBackground?: string;
    contentClassName?: string;
    hideSystemHeader?: boolean;
    hideSystemFooter?: boolean;
};

export function Mobile4PreviewFrame({
    children,
    themeMode,
    notificationIds,
    statusBarBackground,
    contentClassName = '',
    hideSystemHeader = false,
    hideSystemFooter = false,
}: Mobile4PreviewFrameProps) {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div
                id="CAPTURA"
                className="flex h-[875px] max-h-[calc(100vh-2.5rem)] w-[418.75px] max-w-full flex-col overflow-hidden bg-white shadow-2xl"
            >
                {!hideSystemHeader ? (
                    <Mobile4PreviewHeader themeMode={themeMode} notificationIds={notificationIds} statusBarBackground={statusBarBackground} />
                ) : null}
                <div className={['min-h-0 flex-1 overflow-hidden', contentClassName].filter(Boolean).join(' ')}>{children}</div>
                {!hideSystemFooter ? <Mobile1PreviewFooter themeMode={themeMode} /> : null}
            </div>
        </div>
    );
}
