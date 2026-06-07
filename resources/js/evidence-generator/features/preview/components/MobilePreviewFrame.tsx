import type { ReactNode } from 'react';
import type { PreviewThemeMode } from '../../../types';
import { MobilePreviewFooter } from './MobilePreviewFooter';
import { MobilePreviewHeader } from './MobilePreviewHeader';

interface MobilePreviewFrameProps {
    title: string;
    subtitle?: string;
    themeMode: PreviewThemeMode;
    children: ReactNode;
    contentClassName?: string;
    hideSystemHeader?: boolean;
    hideSystemFooter?: boolean;
}

export function MobilePreviewFrame({
    title,
    subtitle,
    themeMode,
    children,
    contentClassName = '',
    hideSystemHeader = false,
    hideSystemFooter = false,
}: MobilePreviewFrameProps) {
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
                {!hideSystemHeader ? <MobilePreviewHeader title={title} subtitle={subtitle} themeMode={themeMode} /> : null}
                <div className={['min-h-0 flex-1 overflow-hidden', contentClassName].filter(Boolean).join(' ')}>{children}</div>
                {!hideSystemFooter ? <MobilePreviewFooter themeMode={themeMode} /> : null}
            </div>
        </div>
    );
}
