import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { Mobile10PreviewFrame } from '../Mobile10PreviewFrame';
import { IncomingCallContent } from './IncomingCallContent';

export function PreviewMobile10Call({ data, themeMode }: PreviewProps) {
    if (!data) return <EmptyState />;

    return (
        <Mobile10PreviewFrame themeMode={themeMode} notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-10', 'call')}>
            <IncomingCallContent data={data} themeMode={themeMode} />
        </Mobile10PreviewFrame>
    );
}
