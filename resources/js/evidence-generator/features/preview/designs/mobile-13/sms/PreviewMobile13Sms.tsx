import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { mobile13FontFamily } from '../mobile13Colors';
import { Mobile13PreviewFrame } from '../Mobile13PreviewFrame';
import { SMS_HEADER_HEIGHT, SMS_STATUS_BAR_HEIGHT } from './smsHeaderLayout';
import { SmsStatusBar } from './SmsStatusBar';
import { SmsMobileHeader } from './sms-header';
import { getMobile13SmsContentColors } from './smsContentAppearance';
import { SmsConversation } from './SmsConversation';
import { SmsTopGlassOverlay } from './SmsTopGlassOverlay';

export function PreviewMobile13Sms({ data, themeMode }: PreviewProps) {
    if (!data) return <EmptyState />;

    const colors = getMobile13SmsContentColors(themeMode);
    const notificationIds = buildMobilePreviewNotificationIds(data, 'mobile-13', 'sms');

    return (
        <Mobile13PreviewFrame
            themeMode={themeMode}
            notificationIds={notificationIds}
            systemFooterBackground={colors.shell}
            systemFooterForeground={themeMode === 'dark' ? '#FFFFFF' : '#000000'}
            hideSystemHeader
            hideSystemFooter
        >
            <div
                className="relative isolate flex h-full min-h-0 flex-col overflow-hidden"
                style={{
                    backgroundColor: colors.shell,
                    fontFamily: mobile13FontFamily,
                }}
            >
                <SmsConversation data={data} themeMode={themeMode} composerLayout={{ messageAreaMaxWidth: '175px' }} />
                <SmsTopGlassOverlay themeMode={themeMode} />
                <div className="pointer-events-none absolute inset-x-0 z-30" style={{ top: SMS_STATUS_BAR_HEIGHT, height: SMS_HEADER_HEIGHT }}>
                    <SmsMobileHeader data={data} themeMode={themeMode} />
                </div>
                <div className="pointer-events-none absolute inset-x-0 top-0 z-40" style={{ height: SMS_STATUS_BAR_HEIGHT }}>
                    <SmsStatusBar themeMode={themeMode} notificationIds={notificationIds} />
                </div>
            </div>
        </Mobile13PreviewFrame>
    );
}
