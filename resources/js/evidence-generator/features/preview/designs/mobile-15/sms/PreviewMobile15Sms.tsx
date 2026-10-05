import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { mobile15FontFamily } from '../mobile15Colors';
import { Mobile15PreviewFrame } from '../Mobile15PreviewFrame';
import { SmsMobileHeader } from './sms-header';
import { getMobile15SmsColors } from './smsAppearance';
import { SmsConversation } from './SmsConversation';

export function PreviewMobile15Sms({ data, themeMode }: PreviewProps) {
    if (!data) return <EmptyState />;

    const colors = getMobile15SmsColors(themeMode);

    return (
        <Mobile15PreviewFrame
            themeMode={themeMode}
            notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-15', 'sms')}
            statusBarBackground={colors.header}
            statusBarForeground={themeMode === 'dark' ? '#C7C5D0' : undefined}
            systemFooterBackground={colors.conversation}
        >
            <div
                className="flex h-full min-h-0 flex-col overflow-hidden"
                style={{
                    backgroundColor: colors.header,
                    fontFamily: mobile15FontFamily,
                }}
            >
                <SmsMobileHeader data={data} themeMode={themeMode} showVideoCall={false} />
                <SmsConversation data={data} themeMode={themeMode} composerLayout={{ messageAreaMaxWidth: '175px' }} />
            </div>
        </Mobile15PreviewFrame>
    );
}
