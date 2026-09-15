import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { mobile9FontFamily } from '../mobile9Colors';
import { Mobile9PreviewFrame } from '../Mobile9PreviewFrame';
import { SmsMobileHeader } from './sms-header';
import { getMobile9SmsColors } from './smsAppearance';
import { SmsConversation } from './SmsConversation';

export function PreviewMobile9Sms({ data, themeMode }: PreviewProps) {
    if (!data) return <EmptyState />;

    const colors = getMobile9SmsColors(themeMode);

    return (
        <Mobile9PreviewFrame
            themeMode={themeMode}
            notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-9', 'sms')}
            statusBarBackground={themeMode === 'light' ? colors.header : undefined}
            widthClassName="w-[366.75px]"
        >
            <div
                className="flex h-full min-h-0 flex-col overflow-hidden"
                style={{
                    backgroundColor: colors.shell,
                    fontFamily: mobile9FontFamily,
                }}
            >
                <SmsMobileHeader data={data} themeMode={themeMode} showVideoCall={true} />
                <SmsConversation data={data} themeMode={themeMode} composerLayout={{ messageAreaMaxWidth: '175px' }} />
            </div>
        </Mobile9PreviewFrame>
    );
}
