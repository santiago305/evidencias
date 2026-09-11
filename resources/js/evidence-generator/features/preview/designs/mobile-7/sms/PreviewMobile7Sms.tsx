import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { Mobile7PreviewFrame } from '../Mobile7PreviewFrame';
import { SmsMobileHeader } from './sms-header';
import { getMobile7SmsColors } from './smsAppearance';
import { SmsConversation } from './SmsConversation';

export function PreviewMobile7Sms({ data, themeMode }: PreviewProps) {
    if (!data) return <EmptyState />;

    const colors = getMobile7SmsColors(themeMode);

    return (
        <Mobile7PreviewFrame
            themeMode={themeMode}
            notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-7', 'sms')}
        >
            <div
                className="flex h-full min-h-0 flex-col overflow-hidden"
                style={{
                    backgroundColor: colors.shell,
                    fontFamily: 'Roboto, sans-serif',
                }}
            >
                <SmsMobileHeader data={data} themeMode={themeMode} showVideoCall={false} />
                <SmsConversation data={data} themeMode={themeMode} />
            </div>
        </Mobile7PreviewFrame>
    );
}
