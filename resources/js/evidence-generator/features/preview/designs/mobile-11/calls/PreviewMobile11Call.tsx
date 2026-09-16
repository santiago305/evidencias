import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { Mobile11PreviewFrame } from '../Mobile11PreviewFrame';
import { IncomingCallContent } from './IncomingCallContent';

export function PreviewMobile11Call({ data, themeMode }: PreviewProps) {
    if (!data) return <EmptyState />;

    return (
        <Mobile11PreviewFrame themeMode={themeMode} notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-11', 'call')}>
            <IncomingCallContent data={data} themeMode={themeMode} />
        </Mobile11PreviewFrame>
    );
}
