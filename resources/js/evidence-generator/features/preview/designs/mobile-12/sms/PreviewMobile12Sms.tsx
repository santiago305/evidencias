import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { mobile12FontFamily } from '../mobile12Colors';
import { Mobile12PreviewFrame } from '../Mobile12PreviewFrame';
import { SmsMobileHeader } from './sms-header';
import { getMobile12SmsColors } from './smsAppearance';
import { SmsConversation } from './SmsConversation';

export function PreviewMobile12Sms({ data, themeMode }: PreviewProps) {
    if (!data) return <EmptyState />;

    const colors = getMobile12SmsColors(themeMode);

    return (
        <Mobile12PreviewFrame
            themeMode={themeMode}
            notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-12', 'sms')}
            headerVariant="sms"
            footerVariant="sms"
            systemHeaderBackground={colors.header}
            systemHeaderForeground={themeMode === 'dark' ? '#FFFFFF' : '#5F6368'}
        >
            <div
                className="flex h-full min-h-0 flex-col overflow-hidden"
                style={{
                    backgroundColor: colors.shell,
                    fontFamily: mobile12FontFamily,
                }}
            >
                <SmsMobileHeader data={data} themeMode={themeMode} showVideoCall={true} />
                <SmsConversation data={data} themeMode={themeMode} composerLayout={{ messageAreaMaxWidth: '175px' }} />
            </div>
        </Mobile12PreviewFrame>
    );
}
