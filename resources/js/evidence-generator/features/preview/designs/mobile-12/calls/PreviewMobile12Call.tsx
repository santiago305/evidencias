import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { Mobile12PreviewFrame } from '../Mobile12PreviewFrame';
import { IncomingCallContent } from './IncomingCallContent';

export function PreviewMobile12Call({ data, themeMode }: PreviewProps) {
    if (!data) return <EmptyState />;

    return (
        <Mobile12PreviewFrame themeMode={themeMode} notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-12', 'call')}>
            <IncomingCallContent data={data} themeMode={themeMode} />
        </Mobile12PreviewFrame>
    );
}
