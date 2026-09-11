import { useEffect, useState } from 'react';
import type { PreviewThemeMode } from '../../../../types';
import type { MobileNotificationIconId } from '../../mobileNotifications';
import { MobileNotificationIcons } from './Mobile7NotificationIcons';
import { Mobile7BatteryIcon } from './Mobile7BatteryIcon';
import { Mobile7CellSignalIcon } from './components/status-bar/Mobile7CellSignalIcon';
import { Mobile7WifiIcon } from './components/status-bar/Mobile7WifiIcon';
import { mobile7FontFamily, mobile7WhatsappLightBackground } from './mobile7Colors';

// ==================================================
// Mobile-7 status bar foreground
// ==================================================

const MOBILE7_STATUS_BAR_LIGHT_FOREGROUND = '#696969';

type Mobile7PreviewHeaderProps = {
    themeMode: PreviewThemeMode;
    notificationIds?: MobileNotificationIconId[];
    statusBarBackground?: string;
};

export function Mobile7PreviewHeader({ themeMode, notificationIds, statusBarBackground }: Mobile7PreviewHeaderProps) {
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
        : MOBILE7_STATUS_BAR_LIGHT_FOREGROUND;
    return (
        <div
            className="shrink-0 px-[25px] py-[5px]"
            style={{
                backgroundColor: statusBarBackground ?? (isDark ? '#0B1014' : mobile7WhatsappLightBackground),
                color: statusBarForeground,
            }}
        >
            <div className="flex h-[25px] items-center justify-between">
                <div className="flex items-center gap-[7.5px]">
                    <span
                        className="text-[16px] leading-none font-medium tracking-[-0.35px] tabular-nums"
                        style={{
                            fontFamily: mobile7FontFamily,
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
                <div className="flex items-center gap-[5px]" style={{ color: statusBarForeground }}>
                    <Mobile7CellSignalIcon className="h-[17.5px] w-[17.5px]" />
                    <Mobile7WifiIcon className="h-[17.5px] w-[17.5px]" />
                    <Mobile7BatteryIcon level={batteryLevel} themeMode={themeMode} foregroundColor={statusBarForeground} />
                </div>
            </div>
        </div>
    );
}
