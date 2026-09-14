import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { mobile8FontFamily } from '../mobile8Colors';
import { Mobile8PreviewFrame } from '../Mobile8PreviewFrame';
import { SmsMobileHeader } from './sms-header';
import { getMobile8SmsColors } from './smsAppearance';
import { SmsConversation } from './SmsConversation';

export function PreviewMobile8Sms({ data, themeMode }: PreviewProps) {
    if (!data) return <EmptyState />;

    const colors = getMobile8SmsColors(themeMode);

    return (
        <Mobile8PreviewFrame
            themeMode={themeMode}
            notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-8', 'sms')}
            statusBarBackground={themeMode === 'light' ? colors.header : undefined}
        >
            <div
                className="flex h-full min-h-0 flex-col overflow-hidden"
                style={{
                    backgroundColor: colors.shell,
                    fontFamily: mobile8FontFamily,
                }}
            >
                <SmsMobileHeader data={data} themeMode={themeMode} showVideoCall={false} />
                <SmsConversation data={data} themeMode={themeMode} composerLayout={{ messageAreaMaxWidth: '175px' }} />
            </div>
        </Mobile8PreviewFrame>
    );
}
