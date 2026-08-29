import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { Mobile1PreviewFrame } from '../Mobile1PreviewFrame';
import { SmsMobileHeader } from './sms-header';
import { getSmsColors } from './smsAppearance';
import { SmsConversation } from './SmsConversation';

export function PreviewMobile1Sms({ data, themeMode }: PreviewProps) {
    if (!data) return <EmptyState />;

    const colors = getSmsColors(themeMode);

    return (
        <Mobile1PreviewFrame themeMode={themeMode} notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-3', 'sms')}>
            <div
                className="flex h-full min-h-0 flex-col overflow-hidden"
                style={{
                    backgroundColor: colors.shell,
                    fontFamily: 'Roboto, "Google Sans", "Noto Sans", Arial, Helvetica, sans-serif',
                }}
            >
                <SmsMobileHeader data={data} themeMode={themeMode} />
                <SmsConversation data={data} themeMode={themeMode} />
            </div>
        </Mobile1PreviewFrame>
    );
}
