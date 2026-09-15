import type { ReactNode } from 'react';
import type { PreviewThemeMode } from '../../../../types';
import type { MobileNotificationIconId } from '../../mobileNotifications';
import { Mobile9PreviewFooter } from './Mobile9PreviewFooter';
import { Mobile9PreviewHeader } from './Mobile9PreviewHeader';
import './mobile9.css';

type Mobile9PreviewFrameProps = {
    children: ReactNode;
    themeMode: PreviewThemeMode;
    notificationIds?: MobileNotificationIconId[];
    statusBarBackground?: string;
    contentClassName?: string;
    hideSystemHeader?: boolean;
    hideSystemFooter?: boolean;
    widthClassName?: string;
};

export function Mobile9PreviewFrame({
    children,
    themeMode,
    notificationIds,
    statusBarBackground,
    contentClassName = '',
    hideSystemHeader = false,
    hideSystemFooter = false,
    widthClassName = 'w-[366.75px]',
}: Mobile9PreviewFrameProps) {
    return (
        <div className="mobile9-font flex h-full w-full items-center justify-center">
            <div
                id="CAPTURA"
                className={`flex h-[875px] max-h-[calc(100vh-2.5rem)] ${widthClassName} max-w-full flex-col overflow-hidden bg-white shadow-2xl`}
            >
                {!hideSystemHeader ? (
                    <Mobile9PreviewHeader themeMode={themeMode} notificationIds={notificationIds} statusBarBackground={statusBarBackground} />
                ) : null}
                <div className={['min-h-0 flex-1 overflow-hidden', contentClassName].filter(Boolean).join(' ')}>{children}</div>
                {!hideSystemFooter ? <Mobile9PreviewFooter themeMode={themeMode} /> : null}
            </div>
        </div>
    );
}
