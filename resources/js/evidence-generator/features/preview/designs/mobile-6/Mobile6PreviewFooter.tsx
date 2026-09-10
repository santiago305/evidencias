import type { PreviewThemeMode } from '../../../../types';

function AndroidBackIcon({ color }: { color: string }) {
    return (
        <svg data-android-navigation-icon="back" width="28" height="28" viewBox="0 0 34 34" aria-hidden="true">
            <polygon points="25,6 5,17 25,28" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    );
}

function AndroidHomeIcon({ color }: { color: string }) {
    return (
        <svg data-android-navigation-icon="home" width="28" height="28" viewBox="0 0 34  34" aria-hidden="true">
            <circle cx="17" cy="17" r="10.8" fill="none" stroke={color} strokeWidth="2" />
        </svg>
    );
}

function AndroidRecentsIcon({ color }: { color: string }) {
    return (
        <svg data-android-navigation-icon="recents" width="28" height="28" viewBox="0 0 34 34" aria-hidden="true">
            <rect x="7.5" y="7.5" width="19" height="19" rx="0.8" fill="none" stroke={color} strokeWidth="2" />
        </svg>
    );
}

export function Mobile6PreviewFooter({
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
    const isSmsVariant = variant === 'sms';
    const backgroundColor =
        systemFooterBackground ??
        (isSmsVariant && isDark ? '#101417' : isDark ? '#000000' : '#FFFFFF');
    const foregroundColor =
    systemFooterForeground ??
    (isSmsVariant && isDark
        ? '#B8BDC2'
        : isDark
          ? '#C2C5C9'
          : '#6B6C6E');

    return (
        <div
            className="flex h-[50px] shrink-0 items-center justify-center gap-[65px]"
            style={{ backgroundColor, color: foregroundColor }}
            data-mobile6-system-navigation="three-button"
        >
            <AndroidBackIcon color={foregroundColor} />
            <AndroidHomeIcon color={foregroundColor} />
            <AndroidRecentsIcon color={foregroundColor} />
        </div>
    );
}
