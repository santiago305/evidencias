import type { ReactNode } from 'react';
import type { PreviewThemeMode } from '../../../../types';
import { Mobile2PreviewFooter } from './Mobile2PreviewFooter';
import { Mobile2PreviewHeader } from './Mobile2PreviewHeader';

type Mobile2PreviewFrameProps = {
    children: ReactNode;
    themeMode: PreviewThemeMode;
    contentClassName?: string;
    hideSystemHeader?: boolean;
    hideSystemFooter?: boolean;
    notificationSeed?: string;
    headerVariant?: 'default' | 'whatsapp';
};

export function Mobile2PreviewFrame({
    children,
    themeMode,
    contentClassName = '',
    hideSystemHeader = false,
    hideSystemFooter = false,
    notificationSeed,
    headerVariant = 'default',
}: Mobile2PreviewFrameProps) {
    const isDark = themeMode === 'dark';

    return (
        <div className={['flex h-full w-full items-center justify-center p-4', isDark ? 'bg-slate-950' : 'bg-slate-100'].join(' ')}>
            <div
                id="CAPTURA"
                className={[
                    'flex h-[760px] max-h-[calc(100vh-2rem)] w-[390px] max-w-full flex-col overflow-hidden shadow-2xl',
                    isDark ? 'bg-[#101418] shadow-black/45' : 'bg-white shadow-slate-300/60',
                ].join(' ')}
            >
                {!hideSystemHeader ? (
                    <Mobile2PreviewHeader themeMode={themeMode} notificationSeed={notificationSeed} variant={headerVariant} />
                ) : null}
                <div className={['min-h-0 flex-1 overflow-hidden', contentClassName].filter(Boolean).join(' ')}>{children}</div>
                {!hideSystemFooter ? <Mobile2PreviewFooter themeMode={themeMode} /> : null}
            </div>
        </div>
    );
}
