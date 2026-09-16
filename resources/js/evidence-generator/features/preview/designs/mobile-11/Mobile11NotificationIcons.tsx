import { BCPIcon, ChatGPTIcon, CinemarkIcon, FacebookIcon, GmailIcon, InterbankIcon, LinkedInIcon, NotificationDotIcon, SnaptubeIcon, TemuIcon, ThreadsIcon, TikTokIcon, WarningIcon, WeatherIcon, WhatsAppIcon, YapeIcon, YouTubeIcon, YouTubeMusicIcon } from '@/components/icons';
import type { ComponentType, SVGProps } from 'react';
import type { MobileNotificationIconId } from '../../mobileNotifications';

type NotificationIcon = { id: string; Icon: ComponentType<SVGProps<SVGSVGElement>> };

const notificationIconPool: NotificationIcon[] = [
    { id: 'gmail', Icon: GmailIcon }, { id: 'linkedin', Icon: LinkedInIcon }, { id: 'facebook', Icon: FacebookIcon },
    { id: 'whatsapp', Icon: WhatsAppIcon }, { id: 'weather', Icon: WeatherIcon }, { id: 'chatgpt', Icon: ChatGPTIcon },
    { id: 'threads', Icon: ThreadsIcon }, { id: 'interbank', Icon: InterbankIcon }, { id: 'bcp', Icon: BCPIcon },
    { id: 'youtube-music', Icon: YouTubeMusicIcon }, { id: 'youtube', Icon: YouTubeIcon }, { id: 'temu', Icon: TemuIcon },
    { id: 'snaptube', Icon: SnaptubeIcon }, { id: 'cinemark', Icon: CinemarkIcon }, { id: 'tiktok', Icon: TikTokIcon },
    { id: 'yape', Icon: YapeIcon }, { id: 'warning', Icon: WarningIcon }, { id: 'notification-dot', Icon: NotificationDotIcon },
];

export function MobileNotificationIcons({ notificationIds, className = 'h-[15px] w-[15px] text-current' }: { notificationIds: MobileNotificationIconId[]; className?: string }) {
    const iconById = new Map(notificationIconPool.map((icon) => [icon.id, icon]));
    return <>{notificationIds.map((id, index) => {
        const icon = iconById.get(id);
        if (!icon) return null;
        const Icon = icon.Icon;
        return <Icon key={`${id}-${index}`} className={className} aria-hidden="true" />;
    })}</>;
}
