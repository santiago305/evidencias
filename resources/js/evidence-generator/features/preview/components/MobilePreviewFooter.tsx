interface MobilePreviewFooterProps {
    themeMode: 'light' | 'dark';
}

export function MobilePreviewFooter({ themeMode }: MobilePreviewFooterProps) {
    const isDark = themeMode === 'dark';

    return (
        <div className={['shrink-0 px-6 pt-2 pb-3', isDark ? 'bg-[#101418]' : 'bg-white'].join(' ')}>
            <div className={['mx-auto h-1.5 w-24 rounded-full', isDark ? 'bg-white/75' : 'bg-slate-900'].join(' ')} />
        </div>
    );
}
