import { useEffect, useState } from 'react';
import type { PreviewThemeMode } from '../../../../types';
import type { MobileNotificationIconId } from '../../mobileNotifications';
import { MobileNotificationIcons } from './Mobile10NotificationIcons';
import { Mobile10BatteryIcon } from './Mobile10BatteryIcon';
import { Mobile10CellSignalIcon } from './components/status-bar/Mobile10CellSignalIcon';
import { Mobile10WifiIcon } from './components/status-bar/Mobile10WifiIcon';
import { mobile10FontFamily, mobile10WhatsappLightBackground } from './mobile10Colors';

// ==================================================
// mobile-10 status bar foreground
// ==================================================

const Mobile10_STATUS_BAR_LIGHT_FOREGROUND = '#696969';
const Mobile10_STATUS_BAR_DARKER_FOREGROUND = '#42474D';

type Mobile10PreviewHeaderProps = {
    themeMode: PreviewThemeMode;
    notificationIds?: MobileNotificationIconId[];
    statusBarBackground?: string;
};

export function Mobile10PreviewHeader({ themeMode, notificationIds, statusBarBackground }: Mobile10PreviewHeaderProps) {
    const [time, setTime] = useState('');
    const [batteryLevel, setBatteryLevel] = useState(90);
    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false }));
            setBatteryLevel([100, 90, 80, 70, 60, 50, 40, 30, 20, 10][Math.floor(now.getHours() / 2) % 10] ?? 90);
        };
        update();
        const interval = window.setInterval(update, 30_000);
        return () => window.clearInterval(interval);
    }, []);
    const isDark = themeMode === 'dark';
    const statusBarForeground = isDark
        ? '#F5F7FA'
        : Mobile10_STATUS_BAR_LIGHT_FOREGROUND;
    return (
        <div
            className="shrink-0 px-[25px] py-[5px]"
            style={{
                backgroundColor: statusBarBackground ?? (isDark ? '#0B1014' : mobile10WhatsappLightBackground),
                color: statusBarForeground,
            }}
        >
            <div className="flex h-[25px] items-center justify-between">
                <div className="flex items-center gap-[7.5px]" style={{ color: isDark ? statusBarForeground : Mobile10_STATUS_BAR_DARKER_FOREGROUND }}>
                    <span
                        className="text-[16px] leading-none font-medium tracking-[-0.35px] tabular-nums"
                        style={{
                            fontFamily: mobile10FontFamily,
                            fontSize: '14px',
                            fontWeight: 500,
                            lineHeight: 1,
                            letterSpacing: '-0.35px',
                            fontVariantNumeric: 'tabular-nums',
                            fontFeatureSettings: "'tnum' 1",
                            color: isDark ? statusBarForeground : Mobile10_STATUS_BAR_DARKER_FOREGROUND,
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
                    <Mobile10CellSignalIcon themeMode={themeMode} className="h-[30.5px] w-[47px] object-contain" />
                    <Mobile10WifiIcon className="h-[18px] w-[28px] me-0" style={{ color: isDark ? statusBarForeground : Mobile10_STATUS_BAR_DARKER_FOREGROUND }} />
                    <Mobile10BatteryIcon level={batteryLevel} themeMode={themeMode} foregroundColor={statusBarForeground} />
                </div>
            </div>
        </div>
    );
}
