import type { PreviewProps } from '../../../../../../types';
import { EmptyState } from '../../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../../mobileNotifications';
import { MissedCallContent } from '../../../shared/calls/MissedCallContent';
import { Mobile1PreviewFrame } from '../../Mobile1PreviewFrame';

export function PreviewMobile1CallDesign2({ data, themeMode }: PreviewProps) {
    if (!data) return <EmptyState />;

    return <Mobile1PreviewFrame themeMode={themeMode} notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-1', 'call')}><MissedCallContent data={data} themeMode={themeMode} spacingVariant="mobile-1" /></Mobile1PreviewFrame>;
}
