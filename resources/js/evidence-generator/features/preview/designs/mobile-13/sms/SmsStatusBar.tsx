import { useEffect, useState } from 'react';
import type { PreviewThemeMode } from '../../../../../types';
import type { MobileNotificationIconId } from '../../../mobileNotifications';
import { Mobile13BatteryIcon, EMPTY_COLOR } from '../Mobile13BatteryIcon';
import { Mobile13CellSignalIcon } from '../components/status-bar/Mobile13CellSignalIcon';
import { Mobile13WifiIcon } from '../components/status-bar/Mobile13WifiIcon';
import { MobileNotificationIcons } from '../Mobile13NotificationIcons';
import { mobile13FontFamily } from '../mobile13Colors';

type SmsStatusBarProps = {
    themeMode: PreviewThemeMode;
    notificationIds: MobileNotificationIconId[];
};

export function SmsStatusBar({ themeMode, notificationIds }: SmsStatusBarProps) {
    const [time, setTime] = useState('');
    const [batteryLevel, setBatteryLevel] = useState(90);
    const isDark = themeMode === 'dark';
    const foregroundColor = isDark ? '#F5F7FA' : '#0E0C0C';

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

    return (
        <div className="shrink-0 px-[20px] pt-[15px] pb-[0px]" style={{ backgroundColor: 'transparent', color: foregroundColor }}>
            <div className="ml-[18px] flex h-[25px] items-center justify-between">
                <div className="ml-2 flex items-center gap-[7.5px]">
                    <span
                        className="text-[16px] leading-none font-medium tracking-[-0.35px] tabular-nums"
                        style={{
                            fontFamily: mobile13FontFamily,
                            fontWeight: 500,
                            lineHeight: 1,
                            letterSpacing: '-0.35px',
                            fontVariantNumeric: 'tabular-nums',
                            fontFeatureSettings: "'tnum' 1",
                            color: foregroundColor,
                        }}
                    >
                        {time}
                    </span>
                    <div className="flex items-center gap-[5px]">
                        <MobileNotificationIcons notificationIds={notificationIds} className="h-[15px] w-[15px] text-current" />
                    </div>
                </div>
                <div className="flex items-center gap-[8px]" style={{ color: foregroundColor }}>
                    <Mobile13CellSignalIcon className="h-[18px] w-[19px]" />
                    <Mobile13WifiIcon className="h-[18px] w-[20px]" />
                    <Mobile13BatteryIcon
                        level={batteryLevel}
                        themeMode={themeMode}
                        foregroundColor={foregroundColor}
                        backgroundColor={EMPTY_COLOR}
                    />
                </div>
            </div>
        </div>
    );
}
