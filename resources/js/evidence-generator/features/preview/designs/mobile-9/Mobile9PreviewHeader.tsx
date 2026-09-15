import { useEffect, useState } from 'react';
import type { PreviewThemeMode } from '../../../../types';
import type { MobileNotificationIconId } from '../../mobileNotifications';
import { MobileNotificationIcons } from './Mobile9NotificationIcons';
import { Mobile9BatteryIcon } from './Mobile9BatteryIcon';
import { Mobile9CellSignalIcon } from './components/status-bar/Mobile9CellSignalIcon';
import { Mobile9WifiIcon } from './components/status-bar/Mobile9WifiIcon';
import { mobile9FontFamily, mobile9WhatsappLightBackground } from './mobile9Colors';

// ==================================================
// mobile-9 status bar foreground
// ==================================================

const Mobile9_STATUS_BAR_LIGHT_FOREGROUND = '#696969';

type Mobile9PreviewHeaderProps = {
    themeMode: PreviewThemeMode;
    notificationIds?: MobileNotificationIconId[];
    statusBarBackground?: string;
};

export function Mobile9PreviewHeader({ themeMode, notificationIds, statusBarBackground }: Mobile9PreviewHeaderProps) {
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
        : Mobile9_STATUS_BAR_LIGHT_FOREGROUND;
    return (
        <div
            className="shrink-0 px-[25px] py-[5px]"
            style={{
                backgroundColor: statusBarBackground ?? (isDark ? '#0B1014' : mobile9WhatsappLightBackground),
                color: statusBarForeground,
            }}
        >
            <div className="flex h-[25px] items-center justify-between">
                <div className="flex items-center gap-[7.5px]">
                    <span
                        className="text-[16px] leading-none font-medium tracking-[-0.35px] tabular-nums"
                        style={{
                            fontFamily: mobile9FontFamily,
                            fontSize: '14px',
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
                            <MobileNotificationIcons notificationIds={notificationIds} className="h-[15px] w-[15px] text-current" />
                        </div>
                    ) : null}
                </div>
                <div className="flex items-center gap-[5px]" style={{ color: statusBarForeground }}>
                    <Mobile9CellSignalIcon themeMode={themeMode} className="h-[19.5px] w-[30px] object-contain" />
                    <Mobile9BatteryIcon level={batteryLevel} themeMode={themeMode} foregroundColor={statusBarForeground} />
                </div>
            </div>
        </div>
    );
}
