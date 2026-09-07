import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { SmsMobileHeader } from '../sms/sms-header';
import { getSmsColors } from '../sms/smsAppearance';
import { SmsConversation } from '../sms/SmsConversation';
import type { MobilePreviewDesignProfile } from './mobilePreviewTypes';

export function MobileSmsPreview({ data, themeMode, profile }: PreviewProps & { profile: MobilePreviewDesignProfile }) {
    if (!data) {
        return <EmptyState />;
    }

    const colors = getSmsColors(themeMode, profile.sms.variant);

    return profile.renderFrame({
        children: (
            <div className="flex h-full min-h-0 flex-col overflow-hidden" style={{ backgroundColor: colors.shell, fontFamily: 'Roboto, sans-serif' }}>
                <SmsMobileHeader data={data} themeMode={themeMode} variant={profile.sms.variant} showVideoCall={profile.sms.showVideoCall} />
                <SmsConversation data={data} themeMode={themeMode} variant={profile.sms.variant} composerLayout={profile.sms.composerLayout} />
            </div>
        ),
        data,
        themeMode,
        channel: 'sms',
        notificationIds: buildMobilePreviewNotificationIds(data, profile.key, 'sms'),
        smsShellColor: colors.shell,
        systemChrome: profile.sms.systemChrome?.[themeMode] ?? profile.systemChrome?.[themeMode],
        batteryRenderer: profile.batteryRenderer,
        footerRenderer: profile.footerRenderer,
        frame: profile.frame,
    });
}
