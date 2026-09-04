import type { PreviewProps } from '../../../../../../types';
import { EmptyState } from '../../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../../mobileNotifications';
import { IncomingCallContent } from '../../../shared/calls/IncomingCallContent';
import { Mobile4PreviewFrame } from '../../Mobile4PreviewFrame';

export function PreviewMobile4CallDesign1({ data, themeMode }: PreviewProps) {
    if (!data) {
        return <EmptyState />;
    }

    return (
        <Mobile4PreviewFrame themeMode={themeMode} notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-4', 'call')}>
            <IncomingCallContent data={data} themeMode={themeMode} />
        </Mobile4PreviewFrame>
    );
}
