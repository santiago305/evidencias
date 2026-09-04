import { useMemo } from 'react';
import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { buildWhatsappPreviewRuntime } from '../../shared/whatsapp/whatsappPreviewRuntime';
import type { WhatsappTypographyPlatform } from '../../whatsappTypography';
import { Mobile1PreviewFrame } from '../Mobile1PreviewFrame';
import { WhatsappHeaderUser } from './whatsapp-header';
import { WhatsappConversation } from './WhatsappConversation';

export function PreviewMobile1Whatsapp({ data, themeMode }: PreviewProps) {
    const whatsappTypographyPlatform: WhatsappTypographyPlatform = 'android';
    const runtime = useMemo(() => (data ? buildWhatsappPreviewRuntime(data) : null), [data]);

    if (!data) {
        return <EmptyState />;
    }

    return (
        <Mobile1PreviewFrame
            themeMode={themeMode}
            notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-3', 'whatsapp')}
            headerVariant="whatsapp"
        >
            <div
                data-whatsapp-platform={whatsappTypographyPlatform}
                className={['flex h-full min-h-0 flex-col', themeMode === 'dark' ? 'bg-[#0b141a]' : 'bg-[#efeae2]'].join(' ')}
            >
                <WhatsappHeaderUser
                    data={data}
                    status={runtime?.messageStatus}
                    showTemporaryIndicator={runtime?.temporalBehavior.showTemporaryIcon}
                    displayTitle={runtime?.contactIdentityDisplay.headerTitle}
                    themeMode={themeMode}
                />

                <WhatsappConversation
                    data={data}
                    messageStatus={runtime?.messageStatus}
                    messages={data.generatedMessages}
                    showDefaultTemporalMessage={runtime?.temporalBehavior.showDefaultTemporalMessage}
                    inlineTemporalMode={runtime?.temporalBehavior.inlineTemporalMode}
                    inlineTemporalInsertIndex={data.previewSnapshot?.inlineTemporalInsertIndex ?? null}
                    displayTitle={runtime?.contactIdentityDisplay.headerTitle}
                    themeMode={themeMode}
                />
            </div>
        </Mobile1PreviewFrame>
    );
}
