import type { PreviewThemeMode } from '../../../../types';

export function Mobile12PreviewFooter({
    themeMode,
    variant = 'default',
    systemFooterBackground,
    systemFooterForeground,
}: {
    themeMode: PreviewThemeMode;
    variant?: 'default' | 'sms';
    systemFooterBackground?: string;
    systemFooterForeground?: string;
}) {
    const isDark = themeMode === 'dark';
    const isSmsVariant = variant === 'sms' && isDark;

    return (
        <div
            className={['shrink-0 px-3.75 py-2.5', systemFooterBackground ? '' : 'bg-[#010101]']
                .filter(Boolean)
                .join(' ')}
            style={systemFooterBackground ? { backgroundColor: systemFooterBackground } : undefined}
        >
            <div
                className={[
                    'mx-auto h-[3.25px] w-[120px] rounded-full',
                    systemFooterForeground ? '' : isSmsVariant ? 'bg-[#ECEDEF]' : isDark ? 'bg-[#EFEFEF]' : 'bg-[#6B6C6E]',
                ]
                    .filter(Boolean)
                    .join(' ')}
                style={systemFooterForeground ? { backgroundColor: systemFooterForeground } : undefined}
            />
        </div>
    );
}
