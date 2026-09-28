import { useMemo } from 'react';
import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { getWhatsappBehaviorProfile } from '../../shared/whatsapp/whatsappProfiles';
import { mobile13FontFamily, mobile13WhatsappLightBackground } from '../mobile13Colors';
import { Mobile13PreviewFrame } from '../Mobile13PreviewFrame';
import { buildMobile13WhatsappRuntime } from './mobile13WhatsappRuntime';
import { WhatsappMobileHeaderUser } from './whatsapp-header/WhatsappMobileHeaderUser';
import { WhatsappConversation } from './WhatsappConversation';
import { mobile13WhatsappVisualAdapter } from './whatsappVisualAdapter';

export function PreviewMobile13Whatsapp({ data, themeMode }: PreviewProps) {
    const runtime = useMemo(() => (data ? buildMobile13WhatsappRuntime(data) : null), [data]);

    if (!data || !runtime) return <EmptyState />;

    return (
        <Mobile13PreviewFrame
            themeMode={themeMode}
            notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-13', 'whatsapp')}
            statusBarBackground={themeMode === 'light' ? mobile13WhatsappLightBackground : undefined}
            systemFooterBackground={themeMode === 'light' ? mobile13WhatsappLightBackground : undefined}
        >
            <div
                data-mobile13-whatsapp="true"
                data-mobile13-whatsapp-theme={themeMode}
                className={['flex h-full min-h-0 flex-col', themeMode === 'dark' ? 'bg-[#0b141a]' : ''].filter(Boolean).join(' ')}
                style={{
                    fontFamily: mobile13FontFamily,
                    fontOpticalSizing: 'auto',
                    fontVariationSettings: '"slnt" 0, "wdth" 100, "GRAD" 0, "ROND" 0',
                    ...(themeMode === 'light' ? { backgroundColor: mobile13WhatsappLightBackground } : {}),
                }}
            >
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

                    [data-mobile13-whatsapp='true'] {
                        font-family: Inter, sans-serif !important;
                    }

                    [data-mobile13-whatsapp='true'] [class~='text-[16.25px]'][class~='tracking-tight'] {
                        font-family: Inter, sans-serif !important;
                        font-weight: 200 !important;
                        font-size: 21.25px;
                        letter-spacing: 0;
                        word-spacing: 0;
                        white-space: nowrap;
                        color: #111B21 !important;
                    }

                    [data-mobile13-whatsapp='true'][data-mobile13-whatsapp-theme='light'] [class~='text-[16.25px]'][class~='tracking-tight'] {
                        color: #525661 !important;
                    }

                    [data-mobile13-whatsapp='true'][data-mobile13-whatsapp-theme='dark'] [class~='text-[16.25px]'][class~='tracking-tight'] {
                        color: #F5F9FC !important;
                    }

                    [data-mobile13-whatsapp='true'] [data-testid='selectable-text'] {
                        font-family: Inter, sans-serif !important;
                        font-weight: 200;
                        letter-spacing: 0;
                        word-spacing: 0;
                    }

                    [data-mobile13-whatsapp='true'][data-mobile13-whatsapp-theme='light'] [data-testid='selectable-text'] {
                        color: #111B21 !important;
                    }

                    [data-mobile13-whatsapp='true'][data-mobile13-whatsapp-theme='dark'] [data-testid='selectable-text'] {
                        color: #E9EDEF !important;
                    }

                    [data-mobile13-whatsapp='true'] [data-testid='selectable-text'] strong,
                    [data-mobile13-whatsapp='true'] [data-testid='selectable-text'] b {
                        font-family: Inter, sans-serif !important;
                        font-weight: 400 !important;
                    }

                    [data-mobile13-whatsapp='true'][data-mobile13-whatsapp-theme='light'] [data-testid='selectable-text'] strong,
                    [data-mobile13-whatsapp='true'][data-mobile13-whatsapp-theme='light'] [data-testid='selectable-text'] b {
                        color: #3F454A !important;
                    }

                    [data-mobile13-whatsapp='true'][data-mobile13-whatsapp-theme='dark'] [data-testid='selectable-text'] strong,
                    [data-mobile13-whatsapp='true'][data-mobile13-whatsapp-theme='dark'] [data-testid='selectable-text'] b {
                        color: #D8DDE0 !important;
                    }

                    [data-mobile13-whatsapp='true'] [class~='rounded-[5px]'][class~='text-[12.5px]'] {
                        font-family: Inter, sans-serif !important;
                        font-weight: 200;
                    }

                    [data-mobile13-whatsapp='true'][data-mobile13-whatsapp-theme='light'] [class~='rounded-[5px]'][class~='text-[12.5px]'] {
                        color: #667781 !important;
                    }

                    [data-mobile13-whatsapp='true'][data-mobile13-whatsapp-theme='dark'] [class~='rounded-[5px]'][class~='text-[12.5px]'] {
                        color: #8D9598 !important;
                    }

                    [data-mobile13-whatsapp='true'][data-mobile13-whatsapp-theme='light'] [class~='bg-[#FFF0D4]'] {
                        color: rgba(0, 0, 0, 0.60) !important;
                        font-family: Inter, sans-serif !important;
                        font-weight: 200;
                    }

                    [data-mobile13-whatsapp='true'][data-mobile13-whatsapp-theme='light'] [class~='bg-[#FFF0D4]'] svg,
                    [data-mobile13-whatsapp='true'][data-mobile13-whatsapp-theme='light'] [class~='bg-[#FFF0D4]'] strong {
                        color: rgba(0, 0, 0, 0.60) !important;
                    }

                    [data-mobile13-whatsapp='true'][data-mobile13-whatsapp-theme='light'] [class~='bg-[#FFF0D4]'] strong {
                        font-weight: 400;
                    }

                    [data-mobile13-whatsapp='true'][data-mobile13-whatsapp-theme='dark'] [class~='bg-[#12181C]'] {
                        color: #EECC84 !important;
                        font-family: Inter, sans-serif !important;
                        font-weight: 300;
                    }

                    [data-mobile13-whatsapp='true'][data-mobile13-whatsapp-theme='dark'] [class~='bg-[#12181C]'] svg,
                    [data-mobile13-whatsapp='true'][data-mobile13-whatsapp-theme='dark'] [class~='bg-[#12181C]'] strong {
                        color: #EECC84 !important;
                    }

                    [data-mobile13-whatsapp='true'][data-mobile13-whatsapp-theme='dark'] [class~='bg-[#12181C]']:has([data-icon='lock-small'] title) {
                        color: #767C80 !important;
                    }

                    [data-mobile13-whatsapp='true'][data-mobile13-whatsapp-theme='dark'] [class~='bg-[#12181C]']:has([data-icon='lock-small'] title) strong {
                        color: #767C80;
                    }

                    [data-mobile13-whatsapp='true'] [class~='text-[0.859375rem]'] {
                        font-family: Inter, sans-serif !important;
                        font-weight: 300;
                    }

                    [data-mobile13-whatsapp='true'][data-mobile13-whatsapp-theme='light'] [class~='text-[0.859375rem]'] {
                        color: rgba(0, 0, 0, 0.60) !important;
                    }

                    [data-mobile13-whatsapp='true'][data-mobile13-whatsapp-theme='dark'] [class~='text-[0.859375rem]'] {
                        color: #9CAFA6 !important;
                    }
                `}</style>
                <WhatsappMobileHeaderUser
                    data={data}
                    status={runtime.messageStatus}
                    showTemporaryIndicator={runtime.temporalBehavior.showTemporaryIcon}
                    displayTitle={runtime.contactIdentityDisplay.headerTitle}
                    themeMode={themeMode}
                />
                <WhatsappConversation
                    data={data}
                    behaviorProfile={getWhatsappBehaviorProfile('mobile-13')}
                    visualAdapter={mobile13WhatsappVisualAdapter}
                    messageStatus={runtime.messageStatus}
                    messages={data.generatedMessages}
                    showDefaultTemporalMessage={runtime.temporalBehavior.showDefaultTemporalMessage}
                    inlineTemporalMode={runtime.temporalBehavior.inlineTemporalMode}
                    inlineTemporalInsertIndex={data.previewSnapshot?.inlineTemporalInsertIndex ?? null}
                    displayTitle={runtime.contactIdentityDisplay.headerTitle}
                    profileTitle={runtime.contactIdentityDisplay.profileTitle}
                    profileSubtitle={runtime.contactIdentityDisplay.profileSubtitle}
                    showAddContactAction={runtime.contactIdentityDisplay.showAddContactAction}
                    themeMode={themeMode}
                    composerLayout={{ messageAreaMaxWidth: '175px' }}
                />
            </div>
        </Mobile13PreviewFrame>
    );
}
