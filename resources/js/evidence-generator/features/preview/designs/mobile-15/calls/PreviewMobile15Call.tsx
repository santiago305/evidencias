import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { Mobile15PreviewFrame } from '../Mobile15PreviewFrame';
import { IncomingCallContent } from './IncomingCallContent';

export function PreviewMobile15Call({ data, themeMode }: PreviewProps) {
    if (!data) return <EmptyState />;

    return (
        <Mobile15PreviewFrame themeMode={themeMode} notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-15', 'call')}>
            <IncomingCallContent data={data} themeMode={themeMode} />
        </Mobile15PreviewFrame>
    );
}
