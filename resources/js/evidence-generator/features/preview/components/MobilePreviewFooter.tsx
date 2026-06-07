interface MobilePreviewFooterProps {
    themeMode: 'light' | 'dark';
}

export function MobilePreviewFooter({ themeMode }: MobilePreviewFooterProps) {
    const isDark = themeMode === 'dark';

    return (
        <div className={['shrink-0 px-3 py-2', isDark ? 'bg-[#101418]' : 'bg-white'].join(' ')}>
            <div className={['mx-auto h-[5px] w-24 rounded-full', isDark ? 'bg-white/75' : 'bg-slate-500'].join(' ')} />
        </div>
    );
}
