import type { ReactNode } from 'react';
import type { PreviewThemeMode } from '../../../../types';
import { Mobile1PreviewFooter } from './Mobile1PreviewFooter';
import { Mobile1PreviewHeader } from './Mobile1PreviewHeader';

type Mobile1PreviewFrameProps = {
    children: ReactNode;
    themeMode: PreviewThemeMode;
    contentClassName?: string;
    hideSystemHeader?: boolean;
    hideSystemFooter?: boolean;
    notificationSeed?: string;
    headerVariant?: 'default' | 'whatsapp';
};

export function Mobile1PreviewFrame({
    children,
    themeMode,
    contentClassName = '',
    hideSystemHeader = false,
    hideSystemFooter = false,
    notificationSeed,
    headerVariant = 'default',
}: Mobile1PreviewFrameProps) {
    const isDark = themeMode === 'dark';

    return (
        <div className={['flex h-full w-full items-center justify-center p-5', isDark ? 'bg-slate-950' : 'bg-slate-100'].join(' ')}>
            <div
                id="CAPTURA"
                className={[
                    'flex h-[950px] max-h-[calc(100vh-2.5rem)] w-[487.5px] max-w-full flex-col overflow-hidden shadow-2xl',
                    isDark ? 'bg-[#101418] shadow-black/45' : 'bg-white shadow-slate-300/60',
                ].join(' ')}
            >
                {!hideSystemHeader ? (
                    <Mobile1PreviewHeader themeMode={themeMode} notificationSeed={notificationSeed} variant={headerVariant} />
                ) : null}
                <div className={['min-h-0 flex-1 overflow-hidden', contentClassName].filter(Boolean).join(' ')}>{children}</div>
                {!hideSystemFooter ? <Mobile1PreviewFooter themeMode={themeMode} /> : null}
            </div>
        </div>
    );
}
