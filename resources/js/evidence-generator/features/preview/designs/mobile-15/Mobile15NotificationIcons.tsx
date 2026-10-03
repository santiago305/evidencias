import type { ComponentType, SVGProps } from 'react';
import type { MobileNotificationIconId } from '../../mobileNotifications';
import { Mobile15BCPIcon } from './components/status-bar/notifications/Mobile15BCPIcon';
import { Mobile15ChatGPTIcon } from './components/status-bar/notifications/Mobile15ChatGPTIcon';
import { Mobile15CinemarkIcon } from './components/status-bar/notifications/Mobile15CinemarkIcon';
import { Mobile15FacebookIcon } from './components/status-bar/notifications/Mobile15FacebookIcon';
import { Mobile15GmailIcon } from './components/status-bar/notifications/Mobile15GmailIcon';
import { Mobile15InterbankIcon } from './components/status-bar/notifications/Mobile15InterbankIcon';
import { Mobile15LinkedInIcon } from './components/status-bar/notifications/Mobile15LinkedInIcon';
import { Mobile15NotificationDotIcon } from './components/status-bar/notifications/Mobile15NotificationDotIcon';
import { Mobile15SnaptubeIcon } from './components/status-bar/notifications/Mobile15SnaptubeIcon';
import { Mobile15TemuIcon } from './components/status-bar/notifications/Mobile15TemuIcon';
import { Mobile15ThreadsIcon } from './components/status-bar/notifications/Mobile15ThreadsIcon';
import { Mobile15TikTokIcon } from './components/status-bar/notifications/Mobile15TikTokIcon';
import { Mobile15WarningIcon } from './components/status-bar/notifications/Mobile15WarningIcon';
import { Mobile15WeatherIcon } from './components/status-bar/notifications/Mobile15WeatherIcon';
import { Mobile15WhatsAppIcon } from './components/status-bar/notifications/Mobile15WhatsAppIcon';
import { Mobile15YapeIcon } from './components/status-bar/notifications/Mobile15YapeIcon';
import { Mobile15YouTubeIcon } from './components/status-bar/notifications/Mobile15YouTubeIcon';
import { Mobile15YouTubeMusicIcon } from './components/status-bar/notifications/Mobile15YouTubeMusicIcon';

type NotificationIcon = {
    id: MobileNotificationIconId;
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const notificationIconPool: NotificationIcon[] = [
    { id: 'gmail', Icon: Mobile15GmailIcon },
    { id: 'linkedin', Icon: Mobile15LinkedInIcon },
    { id: 'facebook', Icon: Mobile15FacebookIcon },
    { id: 'whatsapp', Icon: Mobile15WhatsAppIcon },
    { id: 'weather', Icon: Mobile15WeatherIcon },
    { id: 'chatgpt', Icon: Mobile15ChatGPTIcon },
    { id: 'threads', Icon: Mobile15ThreadsIcon },
    { id: 'interbank', Icon: Mobile15InterbankIcon },
    { id: 'bcp', Icon: Mobile15BCPIcon },
    { id: 'youtube-music', Icon: Mobile15YouTubeMusicIcon },
    { id: 'youtube', Icon: Mobile15YouTubeIcon },
    { id: 'temu', Icon: Mobile15TemuIcon },
    { id: 'snaptube', Icon: Mobile15SnaptubeIcon },
    { id: 'cinemark', Icon: Mobile15CinemarkIcon },
    { id: 'tiktok', Icon: Mobile15TikTokIcon },
    { id: 'yape', Icon: Mobile15YapeIcon },
    { id: 'warning', Icon: Mobile15WarningIcon },
    { id: 'notification-dot', Icon: Mobile15NotificationDotIcon },
];

export function Mobile15NotificationIcons({
    notificationIds,
    className = 'h-[15px] w-[15px] text-current',
}: {
    notificationIds: MobileNotificationIconId[];
    className?: string;
}) {
    const iconById = new Map(notificationIconPool.map((icon) => [icon.id, icon.Icon]));

    return (
        <>
            {notificationIds.map((id, index) => {
                const Icon = iconById.get(id);

                return Icon ? <Icon key={`${id}-${index}`} className={className} aria-hidden="true" /> : null;
            })}
        </>
    );
}
