import type { PreviewThemeMode } from '../../../../types';

export function Mobile2PreviewFooter({ themeMode }: { themeMode: PreviewThemeMode }) {
    const isDark = themeMode === 'dark';

    return (
        <div className={['shrink-0 px-3 py-2', isDark ? 'bg-[#000000]' : 'bg-white'].join(' ')}>
            <div className={['mx-auto h-[5px] w-24 rounded-full', isDark ? 'bg-[#EFEFEF]' : 'bg-[#6B6C6E]'].join(' ')} />
        </div>
    );
}
