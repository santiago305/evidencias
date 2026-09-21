import type { ReactNode } from 'react';
import type { MobileNotificationIconId } from '../../../mobileNotifications';
import { Mobile1PreviewFrame } from '../../mobile-1/Mobile1PreviewFrame';
import { Mobile2PreviewFrame } from '../../mobile-2/Mobile2PreviewFrame';
import { Mobile1PreviewFrame as Mobile3PreviewFrame } from '../../mobile-3/Mobile1PreviewFrame';
import { Mobile4PreviewFrame } from '../../mobile-4/Mobile4PreviewFrame';
import { Mobile5PreviewFooter } from '../../mobile-5/Mobile5PreviewFooter';
import { Mobile6PreviewFrame } from '../../mobile-6/Mobile6PreviewFrame';
import { Mobile7PreviewFrame } from '../../mobile-7/Mobile7PreviewFrame';
import { Mobile8PreviewFrame } from '../../mobile-8/Mobile8PreviewFrame';
import { Mobile9PreviewFrame } from '../../mobile-9/Mobile9PreviewFrame';
import { Mobile10PreviewFrame } from '../../mobile-10/Mobile10PreviewFrame';
import { Mobile11PreviewFrame } from '../../mobile-11/Mobile11PreviewFrame';
import { Mobile12PreviewFrame } from '../../mobile-12/Mobile12PreviewFrame';
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

export function renderMobile8Frame({ children, themeMode, channel, notificationIds, smsShellColor }: MobileFrameRenderProps) {
    return (
        <Mobile8PreviewFrame
            themeMode={themeMode}
            notificationIds={notificationIds}
            statusBarBackground={channel === 'sms' && themeMode === 'light' ? smsShellColor : undefined}
        >
            {children}
        </Mobile8PreviewFrame>
    );
}

export function renderMobile9Frame({ children, themeMode, channel, notificationIds, smsShellColor }: MobileFrameRenderProps) {
    return (
        <Mobile9PreviewFrame
            themeMode={themeMode}
            notificationIds={notificationIds}
            statusBarBackground={channel === 'sms' && themeMode === 'light' ? smsShellColor : undefined}
        >
            {children}
        </Mobile9PreviewFrame>
    );
}

export function renderMobile10Frame({ children, themeMode, channel, notificationIds, smsShellColor }: MobileFrameRenderProps) {
    return (
        <Mobile10PreviewFrame
            themeMode={themeMode}
            notificationIds={notificationIds}
            statusBarBackground={channel === 'sms' && themeMode === 'light' ? smsShellColor : undefined}
        >
            {children}
        </Mobile10PreviewFrame>
    );
}

export function renderMobile11Frame({ children, themeMode, channel, notificationIds }: MobileFrameRenderProps) {
    return (
        <Mobile11PreviewFrame
            themeMode={themeMode}
            notificationIds={notificationIds}
            headerVariant={resolveHeaderVariant(channel)}
            footerVariant={channel === 'whatsapp' ? 'whatsapp' : channel === 'sms' ? 'sms' : 'default'}
            statusBarBackground={channel === 'whatsapp' ? (themeMode === 'dark' ? '#0B1014' : '#FFFFFF') : undefined}
        >
            {children}
        </Mobile11PreviewFrame>
    );
}

export function renderMobile12Frame({
    children,
    themeMode,
    channel,
    notificationIds,
    smsShellColor,
    systemChrome,
    batteryRenderer,
    footerRenderer,
    frame,
}: MobileFrameRenderProps) {
    return (
        <Mobile12PreviewFrame
            themeMode={themeMode}
            notificationIds={notificationIds}
            headerVariant={resolveHeaderVariant(channel)}
            footerVariant={channel === 'sms' ? 'sms' : 'default'}
            systemHeaderBackground={channel === 'sms' && themeMode === 'light' ? smsShellColor : systemChrome?.headerBackground}
            systemHeaderForeground={systemChrome?.headerForeground}
            systemFooterBackground={systemChrome?.footerBackground}
            systemFooterForeground={systemChrome?.footerForeground}
            batteryRenderer={batteryRenderer}
            footerRenderer={footerRenderer}
            channel={channel}
            frame={frame}
        >
            {children}
        </Mobile12PreviewFrame>
    );
}

export type MobileFrameChildren = ReactNode;

export type MobileFrameNotificationIds = MobileNotificationIconId[];
