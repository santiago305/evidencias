import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { Mobile9PreviewFrame } from '../Mobile9PreviewFrame';
import { IncomingCallContent } from './IncomingCallContent';

export function PreviewMobile9Call({ data, themeMode }: PreviewProps) {
    if (!data) return <EmptyState />;

    return (
        <Mobile9PreviewFrame themeMode={themeMode} notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-9', 'call')}>
            <IncomingCallContent data={data} themeMode={themeMode} />
        </Mobile9PreviewFrame>
    );
}
