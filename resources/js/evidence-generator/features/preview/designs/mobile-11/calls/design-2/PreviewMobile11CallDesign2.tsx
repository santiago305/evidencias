import type { PreviewProps } from '../../../../../../types';
import { EmptyState } from '../../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../../mobileNotifications';
import { MissedCallContent } from '../../../shared/calls/MissedCallContent';
import { Mobile11PreviewFrame } from '../../Mobile11PreviewFrame';

export function PreviewMobile11CallDesign2({ data, themeMode }: PreviewProps) {
    if (!data) return <EmptyState />;

    return <Mobile11PreviewFrame themeMode={themeMode} notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-11', 'call')}><MissedCallContent data={data} themeMode={themeMode} spacingVariant="mobile-1" /></Mobile11PreviewFrame>;
}
