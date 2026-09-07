import type { PreviewThemeMode } from '../../../../types';

type Mobile5PreviewFooterProps = {
    themeMode: PreviewThemeMode;
    systemFooterBackground?: string;
    systemFooterForeground?: string;
};

function Mobile5RecentsIcon({ color }: { color: string }) {
    return (
        <svg data-android-navigation-icon="recents" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <rect
                x="6.5"
                y="6.5"
                width="11"
                height="11"
                rx="1.2"
                fill="none"
                stroke={color}
                strokeWidth="1.8"
                shapeRendering="geometricPrecision"
            />
        </svg>
    );
}

function Mobile5HomeIcon({ color }: { color: string }) {
    return (
        <svg data-android-navigation-icon="home" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="6.2" fill="none" stroke={color} strokeWidth="1.8" shapeRendering="geometricPrecision" />
        </svg>
    );
}

function Mobile5BackIcon({ color }: { color: string }) {
    return (
        <svg data-android-navigation-icon="back" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M15.8 6.8L8.2 12l7.6 5.2"
                fill="none"
                stroke={color}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                shapeRendering="geometricPrecision"
            />
        </svg>
    );
}

export function Mobile5PreviewFooter({ themeMode, systemFooterBackground, systemFooterForeground }: Mobile5PreviewFooterProps) {
    const isDark = themeMode === 'dark';
    const background = systemFooterBackground ?? (isDark ? '#11181D' : '#F3F3F3');
    const foreground = systemFooterForeground ?? (isDark ? '#A8ADB3' : '#6E6E6E');

    return (
        <div className="flex h-[54px] shrink-0 items-center justify-center" style={{ backgroundColor: background }}>
            <div className="flex items-center justify-center gap-[72px]">
                <Mobile5RecentsIcon color={foreground} />
                <Mobile5HomeIcon color={foreground} />
                <Mobile5BackIcon color={foreground} />
            </div>
        </div>
    );
}
