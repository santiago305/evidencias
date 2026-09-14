import { useEffect, useState } from 'react';
import type { PreviewThemeMode } from '../../../../types';
import type { MobileNotificationIconId } from '../../mobileNotifications';
import { MobileNotificationIcons } from './Mobile8NotificationIcons';
import { Mobile8BatteryIcon } from './Mobile8BatteryIcon';
import { Mobile8CellSignalIcon } from './components/status-bar/Mobile8CellSignalIcon';
import { Mobile8WifiIcon } from './components/status-bar/Mobile8WifiIcon';
import { mobile8FontFamily, mobile8WhatsappLightBackground } from './mobile8Colors';

// ==================================================
// Mobile-8 status bar foreground
// ==================================================

const MOBILE8_STATUS_BAR_LIGHT_FOREGROUND = '#3A3A3A';

type Mobile8PreviewHeaderProps = {
    themeMode: PreviewThemeMode;
    notificationIds?: MobileNotificationIconId[];
    statusBarBackground?: string;
};

export function Mobile8PreviewHeader({ themeMode, notificationIds, statusBarBackground }: Mobile8PreviewHeaderProps) {
    const [time, setTime] = useState('');
    const [batteryLevel, setBatteryLevel] = useState(90);
    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('es-PE', { hour: 'numeric', minute: '2-digit', hour12: false }));
            setBatteryLevel([100, 90, 80, 70, 60, 50, 40, 30, 20, 10][Math.floor(now.getHours() / 2) % 10] ?? 90);
        };
        update();
        const interval = window.setInterval(update, 30_000);
        return () => window.clearInterval(interval);
    }, []);
    const isDark = themeMode === 'dark';
    const statusBarForeground = isDark
        ? '#F5F7FA'
        : MOBILE8_STATUS_BAR_LIGHT_FOREGROUND;
    return (
        <div
            className="shrink-0 px-[25px] py-[5px]"
            style={{
                backgroundColor: statusBarBackground ?? (isDark ? '#0B1014' : mobile8WhatsappLightBackground),
                color: statusBarForeground,
            }}
        >
            <div className="flex h-[25px] items-center justify-between">
                <div className="flex items-center gap-[7.5px]">
                    <span
                        className="text-[16px] leading-none font-medium tracking-[-0.35px] tabular-nums"
                        style={{
                            fontFamily: mobile8FontFamily,
                            fontSize: '16px',
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
                    {notificationIds ? (
                        <div className="flex items-center gap-[5px]">
                            <MobileNotificationIcons notificationIds={notificationIds} className="h-[15px] w-[15px] text-current" />
                        </div>
                    ) : null}
                </div>
                <div className="flex items-center gap-[0px]" style={{ color: statusBarForeground }}>
                    <Mobile8CellSignalIcon className="h-[17px] w-[17px]" />
                    <Mobile8WifiIcon className="h-[23px] w-[32px]" />
                    <Mobile8BatteryIcon
                        level={100}
                        themeMode={themeMode}
                        foregroundColor={statusBarForeground}
                        backgroundColor={isDark ? '#0B1014' : '#D9D9D9'}
                    />
                </div>
            </div>
        </div>
    );
}
