import { useEffect, useState } from 'react';
import type { PreviewThemeMode } from '../../../../types';
import type { MobileNotificationIconId } from '../../mobileNotifications';
import { MobileNotificationIcons } from './Mobile13NotificationIcons';
import { EMPTY_COLOR, Mobile13BatteryIcon } from './Mobile13BatteryIcon';
import { Mobile13CellSignalIcon } from './components/status-bar/Mobile13CellSignalIcon';
import { Mobile13WifiIcon } from './components/status-bar/Mobile13WifiIcon';
import { mobile13FontFamily, mobile13WhatsappLightBackground } from './mobile13Colors';

// ==================================================
// Mobile-13 status bar foreground
// ==================================================

const MOBILE13_STATUS_BAR_LIGHT_FOREGROUND = '#0E0C0C';

type Mobile13PreviewHeaderProps = {
    themeMode: PreviewThemeMode;
    notificationIds?: MobileNotificationIconId[];
    statusBarBackground?: string;
};

export function Mobile13PreviewHeader({ themeMode, notificationIds, statusBarBackground }: Mobile13PreviewHeaderProps) {
    const [time, setTime] = useState('');
    const [batteryLevel, setBatteryLevel] = useState(90);
    useEffect(() => {
        const update = () => {
            const now = new Date();
            const hours12 = now.getHours() % 12 || 12;
            const minutes = String(now.getMinutes()).padStart(2, '0');
            setTime(`${hours12}:${minutes}`);
            setBatteryLevel([100, 90, 80, 70, 60, 50, 40, 30, 20, 10][Math.floor(now.getHours() / 2) % 10] ?? 90);
        };
        update();
        const interval = window.setInterval(update, 30_000);
        return () => window.clearInterval(interval);
    }, []);
    const isDark = themeMode === 'dark';
    const statusBarForeground = isDark
        ? '#F5F7FA'
        : MOBILE13_STATUS_BAR_LIGHT_FOREGROUND;
    return (
        <div
            className="shrink-0 px-[20px] pt-[15px] pb-[0px]"
            style={{
                backgroundColor: statusBarBackground ?? (isDark ? '#0B1014' : mobile13WhatsappLightBackground),
                color: statusBarForeground,
            }}
        >
            <div className="flex h-[25px] ml-[18px] items-center justify-between">
                <div className="flex items-center gap-[7.5px]">
                    <span
                        className="text-[16px] leading-none font-medium tracking-[-0.35px] tabular-nums ml-2"
                        style={{
                            fontFamily: mobile13FontFamily,
                            fontSize: '15px',
                            fontWeight: 600,
                            lineHeight: 1,
                            letterSpacing: '-0.35px',
                            fontVariantNumeric: 'tabular-nums',
                            fontFeatureSettings: "'tnum' 1",
                            color: statusBarForeground,
                        }}
                    >
                        {time}
                    </span>
                    {/* {notificationIds ? (
                        <div className="flex items-center gap-[5px]">
                            <MobileNotificationIcons notificationIds={notificationIds} className="h-[15px] w-[15px] text-current" />
                        </div>
                    ) : null} */}
                </div>
                <div className="flex items-center gap-[8px]" style={{ color: statusBarForeground }}>
                    <Mobile13CellSignalIcon className="h-[18px] w-[19px]" />
                    <Mobile13WifiIcon className="h-[18px] w-[20px]" />
                    <Mobile13BatteryIcon
                        level={batteryLevel}
                        themeMode={themeMode}
                        foregroundColor={statusBarForeground}
                        backgroundColor={EMPTY_COLOR}
                    />
                </div>
            </div>
        </div>
    );
}
