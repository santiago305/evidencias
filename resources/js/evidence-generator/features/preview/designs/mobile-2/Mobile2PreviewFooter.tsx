import type { PreviewThemeMode } from '../../../../types';
import { getSmsColors } from '../mobile-3/sms/smsAppearance';

function AndroidBackIcon({ color }: { color: string }) {
    return (
        <svg data-android-navigation-icon="back" width="30" height="30" viewBox="0 0 34 34">
            <polygon points="25,6 5,17 25,28" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    );
}

function AndroidHomeIcon({ color }: { color: string }) {
    return (
        <svg data-android-navigation-icon="home" width="30" height="30" viewBox="0 0 34 34">
            <circle cx="17" cy="17" r="10.8" fill="none" stroke={color} strokeWidth="2" />
        </svg>
    );
}

function AndroidRecentsIcon({ color }: { color: string }) {
    return (
        <svg data-android-navigation-icon="recents" width="30" height="30" viewBox="0 0 34 34">
            <rect x="7.5" y="7.5" width="19" height="19" rx="0.8" fill="none" stroke={color} strokeWidth="2" />
        </svg>
    );
}

export function Mobile2PreviewFooter({ themeMode, variant = 'default' }: { themeMode: PreviewThemeMode; variant?: 'default' | 'sms' }) {
    const isDark = themeMode === 'dark';
    const isSmsVariant = variant === 'sms';
    const smsColors = getSmsColors(themeMode, 'mobile-2');

    const bg = isSmsVariant ? smsColors.conversation : isDark ? '#05090C' : '#F7F8FA';
    const color = isSmsVariant ? smsColors.systemNavigationForeground : isDark ? '#B8BABC' : '#777777';
    const navigationIcons = isSmsVariant
        ? [
              <AndroidRecentsIcon key="recents" color={color} />,
              <AndroidHomeIcon key="home" color={color} />,
              <AndroidBackIcon key="back" color={color} />,
          ]
        : [
              <AndroidBackIcon key="back" color={color} />,
              <AndroidHomeIcon key="home" color={color} />,
              <AndroidRecentsIcon key="recents" color={color} />,
          ];

    return (
        <div className="flex h-[50px] shrink-0 items-center justify-center gap-[95px]" style={{ backgroundColor: bg }}>
            {navigationIcons}
        </div>
    );
}
