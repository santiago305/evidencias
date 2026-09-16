import type { ReactNode } from 'react';
import type { PreviewThemeMode } from '../../../../types';
import type { MobileNotificationIconId } from '../../mobileNotifications';
import { Mobile11PreviewFooter } from './Mobile11PreviewFooter';
import { Mobile11PreviewHeader } from './Mobile11PreviewHeader';

type Mobile11PreviewFrameProps = {
    children: ReactNode;
    themeMode: PreviewThemeMode;
    contentClassName?: string;
    hideSystemHeader?: boolean;
    hideSystemFooter?: boolean;
    notificationSeed?: string;
    notificationIds?: MobileNotificationIconId[];
    headerVariant?: 'default' | 'whatsapp' | 'sms';
    footerVariant?: 'default' | 'whatsapp' | 'sms';
    statusBarBackground?: string;
    widthClassName?: string;
};

export function Mobile11PreviewFrame({
    children,
    themeMode,
    contentClassName = '',
    hideSystemHeader = false,
    hideSystemFooter = false,
    notificationSeed,
    notificationIds,
    headerVariant = 'default',
    footerVariant = 'default',
    statusBarBackground,
}: Mobile11PreviewFrameProps) {
    const isDark = themeMode === 'dark';

    return (
        <div className={['flex h-full w-full items-center justify-center', isDark ? 'bg-slate-150' : 'bg-slate-100'].join(' ')}>
            <div
                id="CAPTURA"
                className={[
                    'flex h-[950px] max-h-[calc(100vh-2rem)] w-[400.5px] max-w-full flex-col overflow-hidden shadow-2xl',
                    isDark ? 'bg-[#101418] shadow-black/45' : 'bg-white shadow-slate-300/60',
                ].join(' ')}
            >
                {!hideSystemHeader ? (
                    <Mobile11PreviewHeader
                        themeMode={themeMode}
                        notificationSeed={notificationSeed}
                        notificationIds={notificationIds}
                        variant={headerVariant}
                        backgroundColor={statusBarBackground}
                    />
                ) : null}
                <div className={['min-h-0 flex-1 overflow-hidden', contentClassName].filter(Boolean).join(' ')}>{children}</div>
                {!hideSystemFooter ? <Mobile11PreviewFooter themeMode={themeMode} variant={footerVariant} /> : null}
            </div>
        </div>
    );
}
