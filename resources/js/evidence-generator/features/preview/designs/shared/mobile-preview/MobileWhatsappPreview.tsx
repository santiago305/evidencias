import { useMemo } from 'react';
import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { WhatsappConversation } from '../whatsapp/WhatsappConversation';
import { WhatsappAppearanceProvider } from '../whatsapp/whatsappColorProfile';
import { buildWhatsappPreviewRuntime } from '../whatsapp/whatsappPreviewRuntime';
import type { ComposedMobileWhatsappProfile, MobilePreviewDesignProfile } from './mobilePreviewTypes';

export function MobileWhatsappPreview({ data, themeMode, profile }: PreviewProps & { profile: MobilePreviewDesignProfile }) {
    const whatsappProfile = profile.whatsapp as ComposedMobileWhatsappProfile;
    const runtime = useMemo(() => (data ? buildWhatsappPreviewRuntime(data) : null), [data]);

    if (!data || !runtime) {
        return <EmptyState />;
    }

    const content = (
        <div
            data-whatsapp-platform="android"
            className={['flex h-full min-h-0 flex-col', whatsappProfile.colors ? '' : themeMode === 'dark' ? 'bg-[#0b141a]' : 'bg-[#efeae2]']
                .filter(Boolean)
                .join(' ')}
            style={whatsappProfile.colors ? { backgroundColor: whatsappProfile.colors[themeMode].conversationBackground } : undefined}
        >
            <whatsappProfile.Header
                data={data}
                status={runtime.messageStatus}
                showTemporaryIndicator={runtime.temporalBehavior.showTemporaryIcon}
                displayTitle={runtime.contactIdentityDisplay.headerTitle}
                themeMode={themeMode}
            />
            <WhatsappConversation
                data={data}
                behaviorProfile={whatsappProfile.behaviorProfile}
                visualAdapter={whatsappProfile.visualAdapter}
                messageStatus={runtime.messageStatus}
                messages={data.generatedMessages}
                showDefaultTemporalMessage={runtime.temporalBehavior.showDefaultTemporalMessage}
                inlineTemporalMode={runtime.temporalBehavior.inlineTemporalMode}
                inlineTemporalInsertIndex={data.previewSnapshot?.inlineTemporalInsertIndex ?? null}
                displayTitle={runtime.contactIdentityDisplay.headerTitle}
                themeMode={themeMode}
                composerAccessory={whatsappProfile.renderComposerAccessory?.(themeMode)}
                composerLayout={whatsappProfile.composerLayout}
            />
        </div>
    );

    const themedContent = whatsappProfile.colors ? (
        <WhatsappAppearanceProvider colors={whatsappProfile.colors[themeMode]}>{content}</WhatsappAppearanceProvider>
    ) : (
        content
    );

    return profile.renderFrame({
        children: themedContent,
        data,
        themeMode,
        channel: 'whatsapp',
        notificationIds: buildMobilePreviewNotificationIds(data, profile.key, 'whatsapp'),
        systemChrome: profile.systemChrome?.[themeMode] ?? whatsappProfile.systemChrome?.[themeMode],
        batteryRenderer: profile.batteryRenderer,
        footerRenderer: profile.footerRenderer,
        frame: profile.frame,
    });
}
