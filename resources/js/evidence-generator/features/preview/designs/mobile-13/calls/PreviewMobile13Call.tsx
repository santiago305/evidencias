import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { Mobile13PreviewFrame } from '../Mobile13PreviewFrame';
import { IncomingCallContent } from './IncomingCallContent';

export function PreviewMobile13Call({ data, themeMode }: PreviewProps) {
    if (!data) return <EmptyState />;

    return (
        <Mobile13PreviewFrame themeMode={themeMode} notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-13', 'call')}>
            <IncomingCallContent data={data} themeMode={themeMode} />
        </Mobile13PreviewFrame>
    );
}
