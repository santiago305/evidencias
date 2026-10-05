import type { PreviewThemeMode } from '../../../../types';

export function Mobile15PreviewFooter({
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
    const background = systemFooterBackground ?? (isSmsVariant ? '#101417' : isDark ? '#000000' : '#FFFFFF');
    const foreground = systemFooterForeground ?? (isDark ? '#A0A0A0' : '#6B6C6E');

    return (
        <div className="flex h-[40px] shrink-0 items-center justify-center" style={{ backgroundColor: background }}>
            <div className="flex items-center justify-center gap-[92px]" style={{ color: foreground }}>
                <svg data-android-navigation-icon="back" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        d="M15.8 6.8L8.2 12l7.6 5.2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        shapeRendering="geometricPrecision"
                    />
                </svg>
                <svg data-android-navigation-icon="home" width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                    <circle
                        cx="12"
                        cy="12"
                        r="6.2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        shapeRendering="geometricPrecision"
                    />
                </svg>
                <svg data-android-navigation-icon="recents" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        d="M5 7h14M5 12h14M5 17h14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        shapeRendering="geometricPrecision"
                    />
                </svg>
            </div>
        </div>
    );
}
