import type { PreviewProps } from '../../../../../../types';
import { EmptyState } from '../../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../../mobileNotifications';
import { MissedCallContent } from '../../../shared/calls/MissedCallContent';
import { Mobile2PreviewFrame } from '../../Mobile2PreviewFrame';

export function PreviewMobile2CallDesign2({ data, themeMode }: PreviewProps) {
    if (!data) return <EmptyState />;

    return <Mobile2PreviewFrame themeMode={themeMode} notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-2', 'call')}><MissedCallContent data={data} themeMode={themeMode} /></Mobile2PreviewFrame>;
}
