import { useEffect, useState } from 'react';
import type { PreviewThemeMode } from '../../../../types';
import type { MobileNotificationIconId } from '../../mobileNotifications';
import { Mobile15NotificationIcons } from './Mobile15NotificationIcons';
import { Mobile15BatteryIcon } from './Mobile15BatteryIcon';
import { Mobile15AlarmIcon } from './components/status-bar/Mobile15AlarmIcon';
import { Mobile15VolteIcon } from './components/status-bar/Mobile15VolteIcon';
import { Mobile15CellSignalIcon } from './components/status-bar/Mobile15CellSignalIcon';
import { Mobile15WifiIcon } from './components/status-bar/Mobile15WifiIcon';
import { mobile15FontFamily, mobile15WhatsappLightBackground } from './mobile15Colors';

// ==================================================
// Mobile-15 status bar foreground
// ==================================================

const MOBILE15_STATUS_BAR_LIGHT_FOREGROUND = '#3A3A3A';

type Mobile15PreviewHeaderProps = {
    themeMode: PreviewThemeMode;
    notificationIds?: MobileNotificationIconId[];
    statusBarBackground?: string;
    statusBarForeground?: string;
};

export function Mobile15PreviewHeader({ themeMode, notificationIds, statusBarBackground, statusBarForeground: providedStatusBarForeground }: Mobile15PreviewHeaderProps) {
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
    const statusBarForeground = providedStatusBarForeground ?? (isDark
        ? '#F5F7FA'
        : MOBILE15_STATUS_BAR_LIGHT_FOREGROUND);
    return (
        <div
            className="shrink-0 px-[25px] pt-[5px] pb-0"
            style={{
                backgroundColor: statusBarBackground ?? (isDark ? '#0B1014' : mobile15WhatsappLightBackground),
                color: statusBarForeground,
            }}
        >
            <div className="flex h-[25px] items-center justify-between">
                <div className="flex items-center gap-[7.5px]">
                    <span
                        className="text-[16px] leading-none font-medium tracking-[-0.35px] tabular-nums"
                        style={{
                            fontFamily: mobile15FontFamily,
                            fontSize: '12px',
                            fontWeight: 500,
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
                            <Mobile15NotificationIcons notificationIds={notificationIds} className="h-[15px] w-[15px] text-current" />
                        </div>
                    ) : null}
                </div>
                <div className="flex items-center gap-[0px] text-current" style={{ color: statusBarForeground }}>
                    <Mobile15VolteIcon />
                    <Mobile15WifiIcon className="-ml-[2px] h-[17.5px] w-[16.5px]" strokeWidth={2.2} />
                    <Mobile15CellSignalIcon className="h-[13px] w-[17px]" />
                    <Mobile15BatteryIcon level={batteryLevel} />
                </div>
            </div>
        </div>
    );
}
