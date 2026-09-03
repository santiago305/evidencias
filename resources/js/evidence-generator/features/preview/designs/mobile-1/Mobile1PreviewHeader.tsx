import { AlarmClock, Signal, Wifi } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import {
    BCPIcon,
    ChatGPTIcon,
    CinemarkIcon,
    FacebookIcon,
    GmailIcon,
    InterbankIcon,
    LinkedInIcon,
    NotificationDotIcon,
    SnaptubeIcon,
    TemuIcon,
    ThreadsIcon,
    TikTokIcon,
    WarningIcon,
    WeatherIcon,
    WhatsAppIcon,
    YapeIcon,
    YouTubeIcon,
    YouTubeMusicIcon,
} from '@/components/icons';

import type { ComponentType, SVGProps } from 'react';
import { mulberry32 } from '../../../../lib/whatsapp/random';
import type { PreviewThemeMode } from '../../../../types';
import type { MobileNotificationIconId } from '../../mobileNotifications';
import { getSmsColors } from '../mobile-3/sms/smsAppearance';
import { Mobile1BatteryIcon } from './Mobile1BatteryIcon';

type BatteryLevel = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;
type NotificationIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type NotificationIcon = {
    id: string;
    Icon: NotificationIconComponent;
};

const notificationIconPool: NotificationIcon[] = [
    { id: 'gmail', Icon: GmailIcon },
    { id: 'linkedin', Icon: LinkedInIcon },
    { id: 'facebook', Icon: FacebookIcon },
    { id: 'whatsapp', Icon: WhatsAppIcon },
    { id: 'weather', Icon: WeatherIcon },
    { id: 'chatgpt', Icon: ChatGPTIcon },
    { id: 'threads', Icon: ThreadsIcon },
    { id: 'interbank', Icon: InterbankIcon },
    { id: 'bcp', Icon: BCPIcon },
    { id: 'youtube-music', Icon: YouTubeMusicIcon },
    { id: 'youtube', Icon: YouTubeIcon },
    { id: 'temu', Icon: TemuIcon },
    { id: 'snaptube', Icon: SnaptubeIcon },
    { id: 'cinemark', Icon: CinemarkIcon },
    { id: 'tiktok', Icon: TikTokIcon },
    { id: 'yape', Icon: YapeIcon },
    { id: 'warning', Icon: WarningIcon },
    { id: 'notification-dot', Icon: NotificationDotIcon },
];

function hashString(value: string): number {
    let hash = 2166136261;

    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
}

function randomIndex(limit: number, random: () => number): number {
    return Math.floor(random() * limit);
}

function pickNotificationCount(random: () => number): number {
    const roll = random();

    if (roll < 0.2) {
        return 0;
    }

    if (roll < 0.45) {
        return 1;
    }

    if (roll < 0.68) {
        return 2;
    }

    if (roll < 0.84) {
        return 3;
    }

    if (roll < 0.95) {
        return 4;
    }

    return 5;
}

function buildNotificationSet(random: () => number): NotificationIcon[] {
    const targetCount = pickNotificationCount(random);
    const notifications: NotificationIcon[] = [];
    const usage = new Map<string, number>();

    const pickRandomIcon = (allowIndicator: boolean, allowDuplicate: boolean): NotificationIcon => {
        const source = allowIndicator ? notificationIconPool : notificationIconPool.filter(({ id }) => id !== 'notification-dot');
        const available = source.filter(({ id }) => (usage.get(id) ?? 0) === 0);
        const repeated = source.filter(({ id }) => (usage.get(id) ?? 0) > 0 && (usage.get(id) ?? 0) < 3);

        const shouldRepeat = allowDuplicate && repeated.length > 0 && random() < 0.12;
        const nextPool = shouldRepeat && repeated.length > 0 ? repeated : available.length > 0 ? available : repeated;
        const nextIcon = nextPool[randomIndex(nextPool.length, random)];

        usage.set(nextIcon.id, (usage.get(nextIcon.id) ?? 0) + 1);

        return nextIcon;
    };

    for (let index = 0; index < targetCount; index += 1) {
        if (targetCount === 5 && index === targetCount - 1) {
            notifications.push(notificationIconPool.find(({ id }) => id === 'notification-dot') ?? notificationIconPool[0]);
            continue;
        }

        notifications.push(pickRandomIcon(false, index > 0));
    }

    return notifications;
}

function getBatteryLevel(): BatteryLevel {
    const hour = new Date().getHours();

    const levels: BatteryLevel[] = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];

    return levels[Math.floor(hour / 2) % levels.length];
}

type Mobile1PreviewHeaderProps = {
    themeMode: PreviewThemeMode;
    notificationSeed?: string;
    notificationIds?: MobileNotificationIconId[];
    variant?: 'default' | 'whatsapp' | 'sms';
};

export function Mobile1PreviewHeader({ themeMode, notificationSeed, notificationIds, variant = 'default' }: Mobile1PreviewHeaderProps) {
    const isDark = themeMode === 'dark';
    const isWhatsappVariant = variant === 'whatsapp' && isDark;
    const smsColors = variant === 'sms' ? getSmsColors(themeMode, 'mobile-1') : null;
    const [time, setTime] = useState('');
    const [batteryLevel, setBatteryLevel] = useState<BatteryLevel>(getBatteryLevel());

    useEffect(() => {
        const updateStatus = () => {
            const now = new Date();

            setTime(
                now.toLocaleTimeString('es-PE', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: false,
                }),
            );

            setBatteryLevel(getBatteryLevel());
        };

        updateStatus();

        const interval = window.setInterval(updateStatus, 30_000);

        return () => window.clearInterval(interval);
    }, []);

    const notifications = useMemo(() => {
        if (notificationIds) {
            const iconById = new Map(notificationIconPool.map((icon) => [icon.id, icon]));

            return notificationIds.map((id) => iconById.get(id)).filter((icon): icon is NotificationIcon => icon !== undefined);
        }

        const random = notificationSeed?.trim() ? mulberry32(hashString(notificationSeed)) : Math.random;

        return buildNotificationSet(random);
    }, [notificationIds, notificationSeed]);

    return (
        <div
            style={smsColors ? { backgroundColor: smsColors.header, color: smsColors.headerIcon } : undefined}
            className={[
                'shrink-0 px-6.25 py-1',
                smsColors ? '' : isWhatsappVariant ? 'bg-[#0B1014] text-white' : isDark ? 'bg-[#070c0f] text-white' : 'bg-white text-[#5f6368]',
            ].join(' ')}
        >
            <div
                className="flex h-6.25 items-center justify-between"
                style={{
                    fontFamily: 'Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                }}
            >
                <div className="flex items-center gap-[7.5px]">
                    <span
                        className={[
                            'text-[16px] leading-none font-medium tracking-[-0.35px]',
                            smsColors ? '' : isWhatsappVariant ? 'text-white' : isDark ? 'text-white' : 'text-[#5f6368]',
                        ].join(' ')}
                        style={smsColors ? { color: smsColors.headerIcon } : undefined}
                    >
                        {time}
                    </span>

                    <div className="flex items-center gap-1.25">
                        {notifications.map(({ id, Icon: NotificationIcon }, index) => (
                            <NotificationIcon key={`${id}-${index}`} className="h-[15px] w-[15px] text-current" aria-hidden="true" />
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-current">
                    <AlarmClock className="h-[16.25px] w-[16.25px]" strokeWidth={2.1} />
                    <Wifi className="h-[17.5px] w-[17.5px]" strokeWidth={2.2} />

                    <span className="text-[8.75px] leading-[0.9375] font-bold tracking-[-0.04em]">
                        Vo
                        <br />
                        LTE
                    </span>

                    <Signal className="h-[17.5px] w-[17.5px]" strokeWidth={2.2} />

                    <Mobile1BatteryIcon batteryLevel={batteryLevel} />
                </div>
            </div>
        </div>
    );
}
