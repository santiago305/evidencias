import type { ReactNode } from 'react';
import type { MobileNotificationIconId } from '../../../mobileNotifications';
import { Mobile1PreviewFrame } from '../../mobile-1/Mobile1PreviewFrame';
import { Mobile2PreviewFrame } from '../../mobile-2/Mobile2PreviewFrame';
import { Mobile1PreviewFrame as Mobile3PreviewFrame } from '../../mobile-3/Mobile1PreviewFrame';
import { Mobile4PreviewFrame } from '../../mobile-4/Mobile4PreviewFrame';
import { Mobile5PreviewFooter } from '../../mobile-5/Mobile5PreviewFooter';
import { Mobile6PreviewFrame } from '../../mobile-6/Mobile6PreviewFrame';
import { Mobile7PreviewFrame } from '../../mobile-7/Mobile7PreviewFrame';
import type { MobileFrameRenderProps, MobileSystemFooterRenderer } from './mobilePreviewTypes';

function resolveHeaderVariant(channel: MobileFrameRenderProps['channel']): 'default' | 'whatsapp' | 'sms' {
    if (channel === 'whatsapp') return 'whatsapp';
    if (channel === 'sms') return 'sms';

    return 'default';
}

function renderMobile1LikeFrame(Frame: typeof Mobile1PreviewFrame, { children, themeMode, channel, notificationIds }: MobileFrameRenderProps) {
    return (
        <Frame
            themeMode={themeMode}
            notificationIds={notificationIds}
            headerVariant={resolveHeaderVariant(channel)}
            footerVariant={channel === 'sms' ? 'sms' : 'default'}
        >
            {children}
        </Frame>
    );
}

export function renderMobile1Frame(props: MobileFrameRenderProps) {
    return renderMobile1LikeFrame(Mobile1PreviewFrame, props);
}

export function renderMobile2Frame(props: MobileFrameRenderProps) {
    return renderMobile1LikeFrame(Mobile2PreviewFrame, props);
}

export function renderMobile3Frame({ systemChrome, batteryRenderer, footerRenderer, frame, ...props }: MobileFrameRenderProps) {
    return (
        <Mobile3PreviewFrame
            {...props}
            headerVariant={resolveHeaderVariant(props.channel)}
            footerVariant={props.channel === 'sms' ? 'sms' : 'default'}
            systemHeaderBackground={systemChrome?.headerBackground}
            systemHeaderForeground={systemChrome?.headerForeground}
            systemFooterBackground={systemChrome?.footerBackground}
            systemFooterForeground={systemChrome?.footerForeground}
            batteryRenderer={batteryRenderer}
            footerRenderer={footerRenderer}
            frame={frame}
        />
    );
}

export const renderMobile5Footer: MobileSystemFooterRenderer = ({ themeMode, background, foreground }) => (
    <Mobile5PreviewFooter themeMode={themeMode} systemFooterBackground={background} systemFooterForeground={foreground} />
);

export function renderMobile4Frame({ children, themeMode, channel, notificationIds, smsShellColor }: MobileFrameRenderProps) {
    return (
        <Mobile4PreviewFrame
            themeMode={themeMode}
            notificationIds={notificationIds}
            statusBarBackground={channel === 'sms' && themeMode === 'light' ? smsShellColor : undefined}
        >
            {children}
        </Mobile4PreviewFrame>
    );
}

export function renderMobile6Frame({ systemChrome, batteryRenderer, footerRenderer, frame, ...props }: MobileFrameRenderProps) {
    return (
        <Mobile6PreviewFrame
            {...props}
            headerVariant={resolveHeaderVariant(props.channel)}
            footerVariant={props.channel === 'sms' ? 'sms' : 'default'}
            systemHeaderBackground={systemChrome?.headerBackground}
            systemHeaderForeground={systemChrome?.headerForeground}
            systemFooterBackground={systemChrome?.footerBackground}
            systemFooterForeground={systemChrome?.footerForeground}
            batteryRenderer={batteryRenderer}
            footerRenderer={footerRenderer}
            frame={frame}
        />
    );
}

export function renderMobile7Frame({ children, themeMode, channel, notificationIds, smsShellColor }: MobileFrameRenderProps) {
    return (
        <Mobile7PreviewFrame
            themeMode={themeMode}
            notificationIds={notificationIds}
            statusBarBackground={channel === 'sms' && themeMode === 'light' ? smsShellColor : undefined}
        >
            {children}
        </Mobile7PreviewFrame>
    );
}

export type MobileFrameChildren = ReactNode;

export type MobileFrameNotificationIds = MobileNotificationIconId[];
