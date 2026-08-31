import type { PreviewThemeMode } from '../../../../types';

export function Mobile1PreviewFooter({ themeMode, variant = 'default' }: { themeMode: PreviewThemeMode; variant?: 'default' | 'sms' }) {
    const isDark = themeMode === 'dark';
    const isSmsVariant = variant === 'sms' && isDark;

    return (
        <div className={['shrink-0 px-3.75 py-2.5', isSmsVariant ? 'bg-[#101417]' : isDark ? 'bg-[#000000]' : 'bg-white'].join(' ')}>
            <div
                className={[
                    'mx-auto h-[6.25px] w-[120px] rounded-full',
                    isSmsVariant ? 'bg-[#ECEDEF]' : isDark ? 'bg-[#EFEFEF]' : 'bg-[#6B6C6E]',
                ].join(' ')}
            />
        </div>
    );
}
