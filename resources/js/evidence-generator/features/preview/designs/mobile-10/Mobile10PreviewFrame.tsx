import type { ReactNode } from 'react';
import type { PreviewThemeMode } from '../../../../types';
import type { MobileNotificationIconId } from '../../mobileNotifications';
import { Mobile10PreviewFooter } from './Mobile10PreviewFooter';
import { Mobile10PreviewHeader } from './Mobile10PreviewHeader';
import './mobile10.css';

type Mobile10PreviewFrameProps = {
    children: ReactNode;
    themeMode: PreviewThemeMode;
    notificationIds?: MobileNotificationIconId[];
    statusBarBackground?: string;
    contentClassName?: string;
    hideSystemHeader?: boolean;
    hideSystemFooter?: boolean;
    widthClassName?: string;
};

export function Mobile10PreviewFrame({
    children,
    themeMode,
    notificationIds,
    statusBarBackground,
    contentClassName = '',
    hideSystemHeader = false,
    hideSystemFooter = false,
    widthClassName = 'w-[366.75px]',
}: Mobile10PreviewFrameProps) {
    return (
        <div className="mobile10-font flex h-full w-full items-center justify-center">
            <div
                id="CAPTURA"
                className={`flex h-[875px] max-h-[calc(100vh-2.5rem)] ${widthClassName} max-w-full flex-col overflow-hidden bg-white shadow-2xl`}
            >
                {!hideSystemHeader ? (
                    <Mobile10PreviewHeader themeMode={themeMode} notificationIds={notificationIds} statusBarBackground={statusBarBackground} />
                ) : null}
                <div className={['min-h-0 flex-1 overflow-hidden', contentClassName].filter(Boolean).join(' ')}>{children}</div>
                {!hideSystemFooter ? <Mobile10PreviewFooter themeMode={themeMode} /> : null}
            </div>
        </div>
    );
}
