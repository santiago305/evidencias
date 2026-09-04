import { Signal, Wifi } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { PreviewThemeMode } from '../../../../types';
import type { MobileNotificationIconId } from '../../mobileNotifications';
import { MobileNotificationIcons } from '../mobile-3/Mobile1PreviewHeader';
import { Mobile4BatteryIcon } from './Mobile4BatteryIcon';
import { mobile4FontFamily, mobile4WhatsappLightBackground } from './mobile4Colors';

type Mobile4PreviewHeaderProps = {
    themeMode: PreviewThemeMode;
    notificationIds?: MobileNotificationIconId[];
    statusBarBackground?: string;
};

export function Mobile4PreviewHeader({ themeMode, notificationIds, statusBarBackground }: Mobile4PreviewHeaderProps) {
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
    const color = themeMode === 'dark' ? '#F5F7FA' : '#3C4043';
    return (
        <div
            className="shrink-0 px-[25px] py-[5px]"
            style={{ backgroundColor: statusBarBackground ?? (themeMode === 'dark' ? '#0B1014' : mobile4WhatsappLightBackground), color }}
        >
            <div className="flex h-[25px] items-center justify-between">
                <div className="flex items-center gap-[7.5px]">
                    <span
                        className="text-[16px] leading-none font-medium tracking-[-0.35px] tabular-nums"
                        style={{
                            fontFamily: mobile4FontFamily,
                            fontSize: '16px',
                            fontWeight: 500,
                            lineHeight: 1,
                            letterSpacing: '-0.35px',
                            fontVariantNumeric: 'tabular-nums',
                            fontFeatureSettings: "'tnum' 1",
                            color,
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
                <div className="flex items-center gap-[5px] text-current">
                    <Signal className="h-[17.5px] w-[17.5px]" strokeWidth={2.2} />
                    <Wifi className="h-[17.5px] w-[17.5px]" strokeWidth={2.2} />
                    <Mobile4BatteryIcon level={batteryLevel} themeMode={themeMode} />
                </div>
            </div>
        </div>
    );
}
