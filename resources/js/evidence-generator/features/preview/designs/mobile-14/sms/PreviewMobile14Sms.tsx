import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { mobile14FontFamily } from '../mobile14Colors';
import { Mobile14PreviewFrame } from '../Mobile14PreviewFrame';
import { SmsMobileHeader } from './sms-header';
import { getMobile14SmsColors } from './smsAppearance';
import { SmsConversation } from './SmsConversation';

export function PreviewMobile14Sms({ data, themeMode }: PreviewProps) {
    if (!data) return <EmptyState />;

    const colors = getMobile14SmsColors(themeMode);

    return (
        <Mobile14PreviewFrame
            themeMode={themeMode}
            notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-14', 'sms')}
            statusBarBackground={colors.header}
            statusBarTimeColor={colors.headerActionIcon}
            systemFooterBackground={colors.conversation}
            systemFooterForeground="#858385"
            widthClassName="w-[366.75px]"
        >
            <div
                className="flex h-full min-h-0 flex-col overflow-hidden"
                style={{
                    backgroundColor: colors.shell,
                    fontFamily: mobile14FontFamily,
                }}
            >
                <SmsMobileHeader data={data} themeMode={themeMode} showVideoCall={true} />
                <SmsConversation data={data} themeMode={themeMode} composerLayout={{ messageAreaMaxWidth: '175px' }} />
            </div>
        </Mobile14PreviewFrame>
    );
}
