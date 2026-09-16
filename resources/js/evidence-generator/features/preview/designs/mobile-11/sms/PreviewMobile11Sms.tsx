import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { mobile11FontFamily } from '../mobile11Colors';
import { Mobile11PreviewFrame } from '../Mobile11PreviewFrame';
import { SmsMobileHeader } from './sms-header';
import { getMobile11SmsColors } from './smsAppearance';
import { SmsConversation } from './SmsConversation';

export function PreviewMobile11Sms({ data, themeMode }: PreviewProps) {
    if (!data) return <EmptyState />;

    const colors = getMobile11SmsColors(themeMode);

    return (
        <Mobile11PreviewFrame
            themeMode={themeMode}
            notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-11', 'sms')}
            statusBarBackground={themeMode === 'light' ? colors.header : undefined}
            widthClassName="w-[366.75px]"
        >
            <div
                className="flex h-full min-h-0 flex-col overflow-hidden"
                style={{
                    backgroundColor: colors.shell,
                    fontFamily: mobile11FontFamily,
                }}
            >
                <SmsMobileHeader data={data} themeMode={themeMode} showVideoCall={true} />
                <SmsConversation data={data} themeMode={themeMode} composerLayout={{ messageAreaMaxWidth: '175px' }} />
            </div>
        </Mobile11PreviewFrame>
    );
}
