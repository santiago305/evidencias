import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { mobile7FontFamily } from '../mobile7Colors';
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
            statusBarBackground={themeMode === 'light' ? colors.header : undefined}
        >
            <div
                className="flex h-full min-h-0 flex-col overflow-hidden"
                style={{
                    backgroundColor: colors.shell,
                    fontFamily: mobile7FontFamily,
                }}
            >
                <SmsMobileHeader data={data} themeMode={themeMode} showVideoCall={false} />
                <SmsConversation data={data} themeMode={themeMode} composerLayout={{ messageAreaMaxWidth: '175px' }} />
            </div>
        </Mobile7PreviewFrame>
    );
}
