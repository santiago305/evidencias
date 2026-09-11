import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { Mobile7PreviewFrame } from '../Mobile7PreviewFrame';
import { IncomingCallContent } from './IncomingCallContent';

export function PreviewMobile7Call({ data, themeMode }: PreviewProps) {
    if (!data) return <EmptyState />;

    return (
        <Mobile7PreviewFrame themeMode={themeMode} notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-7', 'call')}>
            <IncomingCallContent data={data} themeMode={themeMode} />
        </Mobile7PreviewFrame>
    );
}
