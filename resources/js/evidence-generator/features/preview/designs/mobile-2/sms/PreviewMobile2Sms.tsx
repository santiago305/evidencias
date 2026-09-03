import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { SmsMobileHeader } from '../../mobile-3/sms/sms-header';
import { getSmsColors } from '../../mobile-3/sms/smsAppearance';
import { SmsConversation } from '../../mobile-3/sms/SmsConversation';
import { Mobile2PreviewFrame } from '../Mobile2PreviewFrame';

export function PreviewMobile2Sms({ data, themeMode }: PreviewProps) {
    if (!data) {
        return <EmptyState />;
    }

    const colors = getSmsColors(themeMode, 'mobile-2');

    return (
        <Mobile2PreviewFrame
            themeMode={themeMode}
            notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-2', 'sms')}
            headerVariant="sms"
            footerVariant="sms"
        >
            <div
                className="flex h-full min-h-0 flex-col overflow-hidden"
                style={{
                    backgroundColor: colors.shell,
                    fontFamily: 'Roboto, sans-serif',
                }}
            >
                <SmsMobileHeader data={data} themeMode={themeMode} variant="mobile-2" showVideoCall={false} />
                <SmsConversation data={data} themeMode={themeMode} variant="mobile-2" />
            </div>
        </Mobile2PreviewFrame>
    );
}
