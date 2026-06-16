import type { PreviewThemeMode } from '../../../../types';

export function Mobile1PreviewFooter({ themeMode }: { themeMode: PreviewThemeMode }) {
    const isDark = themeMode === 'dark';

    return (
        <div className={['shrink-0 px-3.75 py-2.5', isDark ? 'bg-[#000000]' : 'bg-white'].join(' ')}>
            <div className={['mx-auto h-[6.25px] w-[120px] rounded-full', isDark ? 'bg-[#EFEFEF]' : 'bg-[#6B6C6E]'].join(' ')} />
        </div>
    );
}
