import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { Mobile1PreviewFrame } from '../Mobile1PreviewFrame';
import { SmsMobileHeader } from '../../mobile-3/sms/sms-header';
import { getSmsColors } from '../../mobile-3/sms/smsAppearance';
import { SmsConversation } from '../../mobile-3/sms/SmsConversation';

export function PreviewMobile1Sms({ data, themeMode }: PreviewProps) {
    if (!data) {
        return <EmptyState />;
    }

    const colors = getSmsColors(themeMode, 'mobile-1');

    return (
        <Mobile1PreviewFrame themeMode={themeMode} notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-1', 'sms')} headerVariant="sms" footerVariant="sms">
            <div className="flex h-full min-h-0 flex-col overflow-hidden" style={{ backgroundColor: colors.shell, fontFamily: 'Roboto, sans-serif' }}>
                <SmsMobileHeader data={data} themeMode={themeMode} variant="mobile-1" showVideoCall={true} />
                <SmsConversation data={data} themeMode={themeMode} variant="mobile-1" />
            </div>
        </Mobile1PreviewFrame>
    );
}
