import { useEffect, useState } from 'react';
import type { PreviewThemeMode } from '../../../../types';
import type { MobileNotificationIconId } from '../../mobileNotifications';
import { MobileNotificationIcons } from './Mobile14NotificationIcons';
import { Mobile14BatteryIcon } from './Mobile14BatteryIcon';
import { Signal45GIcon } from './components/status-bar/Mobile14Signal45GIcon';
import { Mobile14VolteIcon } from './components/status-bar/Mobile14VolteIcon';
import { mobile14FontFamily, mobile14WhatsappLightBackground } from './mobile14Colors';

// ==================================================
// mobile-14 status bar foreground
// ==================================================

const Mobile14_STATUS_BAR_LIGHT_FOREGROUND = '#696969';

type Mobile14PreviewHeaderProps = {
    themeMode: PreviewThemeMode;
    notificationIds?: MobileNotificationIconId[];
    statusBarBackground?: string;
    foregroundColor?: string;
    timeColor?: string;
};

export function Mobile14PreviewHeader({ themeMode, notificationIds, statusBarBackground, foregroundColor, timeColor }: Mobile14PreviewHeaderProps) {
    const [time, setTime] = useState('');
    const [batteryLevel, setBatteryLevel] = useState(90);
    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
            setBatteryLevel([100, 90, 80, 70, 60, 50, 40, 30, 20, 10][Math.floor(now.getHours() / 2) % 10] ?? 90);
        };
        update();
        const interval = window.setInterval(update, 30_000);
        return () => window.clearInterval(interval);
    }, []);
    const isDark = themeMode === 'dark';
    const statusBarForeground = foregroundColor ?? (isDark
        ? '#F5F7FA'
        : Mobile14_STATUS_BAR_LIGHT_FOREGROUND);
    const mobile14DarkerStatusBarIconColor = isDark ? statusBarForeground : '#42474D';
    return (
        <div
            className="shrink-0 px-[25px] pt-[5px]"
            style={{
                backgroundColor: statusBarBackground ?? (isDark ? '#0B1014' : mobile14WhatsappLightBackground),
                color: statusBarForeground,
            }}
        >
            <div className="flex h-[25px] items-center justify-between">
                <div className="flex items-center gap-[7.5px]">
                    <span
                        className="text-[16px] leading-none font-medium tracking-[-0.35px] tabular-nums"
                        style={{
                            fontFamily: mobile14FontFamily,
                            fontSize: '12px',
                            fontWeight: isDark ? 400:500,
                            lineHeight: 1,
                            letterSpacing: '-0.35px',
                            fontVariantNumeric: 'tabular-nums',
                            fontFeatureSettings: "'tnum' 1",
                            color: timeColor ?? statusBarForeground,
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
                <div className="flex items-center" style={{ color: statusBarForeground }}>
                    <Mobile14VolteIcon className='mb-[1px]' color={mobile14DarkerStatusBarIconColor} />
                    <Signal45GIcon
                        className="ml-[000px] mb-[3px] h-[15px] w-[33px]"
                        barsColor={mobile14DarkerStatusBarIconColor}
                    />
                    <div className="ml-[2px]">
                        <Mobile14BatteryIcon level={batteryLevel} themeMode={themeMode} foregroundColor={statusBarForeground} />
                    </div>
                </div>
            </div>
        </div>
    );
}
