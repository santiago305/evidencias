import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { IncomingCallContent } from '../calls/IncomingCallContent';
import type { MobilePreviewDesignProfile } from './mobilePreviewTypes';

export function MobileCallPreview({ data, themeMode, profile }: PreviewProps & { profile: MobilePreviewDesignProfile }) {
    if (!data) {
        return <EmptyState />;
    }

    return profile.renderFrame({
        children: <IncomingCallContent data={data} themeMode={themeMode} />,
        data,
        themeMode,
        channel: 'call',
        notificationIds: buildMobilePreviewNotificationIds(data, profile.key, 'call'),
        batteryRenderer: profile.batteryRenderer,
        footerRenderer: profile.footerRenderer,
        frame: profile.frame,
    });
}
