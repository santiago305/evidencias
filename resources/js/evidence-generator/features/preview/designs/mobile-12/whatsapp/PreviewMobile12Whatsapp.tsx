import { useMemo } from 'react';
import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { Mobile12PreviewFrame } from '../Mobile12PreviewFrame';
import { WhatsappConversation } from './WhatsappConversation';
import { buildMobile12WhatsappRuntime } from './Mobile12WhatsappRuntime';
import { WhatsappMobileHeaderUser } from './whatsapp-header/WhatsappMobileHeaderUser';
import { mobile12WhatsappVisualAdapter } from './whatsappVisualAdapter';
import { getWhatsappBehaviorProfile } from '../../shared/whatsapp/whatsappProfiles';

export function PreviewMobile12Whatsapp({ data, themeMode }: PreviewProps) {
    const runtime = useMemo(() => (data ? buildMobile12WhatsappRuntime(data) : null), [data]);

    if (!data || !runtime) {
        return <EmptyState />;
    }

    return (
        <Mobile12PreviewFrame
            themeMode={themeMode}
            notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-12', 'whatsapp')}
            headerVariant="whatsapp"
        >
            <div className={['flex h-full min-h-0 flex-col', themeMode === 'dark' ? 'bg-[#0b141a]' : 'bg-[#efeae2]'].join(' ')}>
                <WhatsappMobileHeaderUser
                    data={data}
                    status={runtime.messageStatus}
                    showTemporaryIndicator={runtime.temporalBehavior.showTemporaryIcon}
                    displayTitle={runtime.contactIdentityDisplay.headerTitle}
                    themeMode={themeMode}
                />
                <WhatsappConversation
                    data={data}
                    behaviorProfile={getWhatsappBehaviorProfile('mobile-12')}
                    visualAdapter={mobile12WhatsappVisualAdapter}
                    messageStatus={runtime.messageStatus}
                    messages={data.generatedMessages}
                    showDefaultTemporalMessage={runtime.temporalBehavior.showDefaultTemporalMessage}
                    inlineTemporalMode={runtime.temporalBehavior.inlineTemporalMode}
                    inlineTemporalInsertIndex={data.previewSnapshot?.inlineTemporalInsertIndex ?? null}
                    displayTitle={runtime.contactIdentityDisplay.headerTitle}
                    themeMode={themeMode}
                    composerLayout={{ messageAreaMaxWidth: '175px' }}
                />
            </div>
        </Mobile12PreviewFrame>
    );
}
