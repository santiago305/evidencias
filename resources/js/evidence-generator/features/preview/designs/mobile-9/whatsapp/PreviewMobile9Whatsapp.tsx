import { useMemo } from 'react';
import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { WhatsappMobileHeaderUser } from './whatsapp-header/WhatsappMobileHeaderUser';
import { WhatsappConversation } from './WhatsappConversation';
import { getWhatsappBehaviorProfile } from '../../shared/whatsapp/whatsappProfiles';
import { mobile9WhatsappVisualAdapter } from './whatsappVisualAdapter';
import { Mobile9PreviewFrame } from '../Mobile9PreviewFrame';
import { mobile9FontFamily, mobile9WhatsappLightBackground } from '../mobile9Colors';
import { buildMobile9WhatsappRuntime } from './Mobile9WhatsappRuntime';
import { Mobile9QuickActionButton } from './whatsapp-footer';

export function PreviewMobile9Whatsapp({ data, themeMode }: PreviewProps) {
    const runtime = useMemo(() => (data ? buildMobile9WhatsappRuntime(data) : null), [data]);

    if (!data || !runtime) return <EmptyState />;

    return (
        <Mobile9PreviewFrame
            themeMode={themeMode}
            notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-9', 'whatsapp')}
            statusBarBackground={themeMode === 'light' ? '#FFFFFF' : undefined}
            widthClassName="w-[366.75px]"
        >
            <div
                data-mobile9-whatsapp="true"
                data-mobile9-whatsapp-theme={themeMode}
                className={['flex h-full min-h-0 flex-col', themeMode === 'dark' ? 'bg-[#0b141a]' : ''].filter(Boolean).join(' ')}
                style={{
                    fontFamily: mobile9FontFamily,
                    fontOpticalSizing: 'auto',
                    fontVariationSettings: '"slnt" 0, "wdth" 100, "GRAD" 0, "ROND" 0',
                    ...(themeMode === 'light' ? { backgroundColor: mobile9WhatsappLightBackground } : {}),
                }}
            >
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap');

                    [data-mobile9-whatsapp='true'] {
                        font-family: Roboto, sans-serif !important;
                    }

                    [data-mobile9-whatsapp='true'] [class~='text-[16.25px]'][class~='tracking-tight'] {
                        font-family: Roboto, sans-serif !important;
                        font-weight: 200 !important;
                        font-size: 21.25px;
                        letter-spacing: 0;
                        word-spacing: 0;
                        white-space: nowrap;
                        color: #111B21 !important;
                    }

                    [data-mobile9-whatsapp='true'][data-mobile9-whatsapp-theme='light'] [class~='text-[16.25px]'][class~='tracking-tight'] {
                        color: #525661 !important;
                    }

                    [data-mobile9-whatsapp='true'][data-mobile9-whatsapp-theme='dark'] [class~='text-[16.25px]'][class~='tracking-tight'] {
                        color: #F5F9FC !important;
                    }

                    [data-mobile9-whatsapp='true'] [data-testid='selectable-text'] {
                        font-family: Roboto, sans-serif !important;
                        font-weight: 200;
                        letter-spacing: 0;
                        word-spacing: 0;
                    }

                    [data-mobile9-whatsapp='true'][data-mobile9-whatsapp-theme='light'] [data-testid='selectable-text'] {
                        color: #111B21 !important;
                    }

                    [data-mobile9-whatsapp='true'][data-mobile9-whatsapp-theme='dark'] [data-testid='selectable-text'] {
                        color: #E9EDEF !important;
                    }

                    [data-mobile9-whatsapp='true'] [data-testid='selectable-text'] strong,
                    [data-mobile9-whatsapp='true'] [data-testid='selectable-text'] b {
                        font-family: Roboto, sans-serif !important;
                        font-weight: 400 !important;
                    }

                    [data-mobile9-whatsapp='true'][data-mobile9-whatsapp-theme='light'] [data-testid='selectable-text'] strong,
                    [data-mobile9-whatsapp='true'][data-mobile9-whatsapp-theme='light'] [data-testid='selectable-text'] b {
                        color: #3F454A !important;
                    }

                    [data-mobile9-whatsapp='true'][data-mobile9-whatsapp-theme='dark'] [data-testid='selectable-text'] strong,
                    [data-mobile9-whatsapp='true'][data-mobile9-whatsapp-theme='dark'] [data-testid='selectable-text'] b {
                        color: #D8DDE0 !important;
                    }

                    [data-mobile9-whatsapp='true'] [class~='rounded-[5px]'][class~='text-[12.5px]'] {
                        font-family: Roboto, sans-serif !important;
                        font-weight: 200;
                    }

                    [data-mobile9-whatsapp='true'][data-mobile9-whatsapp-theme='light'] [class~='rounded-[5px]'][class~='text-[12.5px]'] {
                        color: #667781 !important;
                    }

                    [data-mobile9-whatsapp='true'][data-mobile9-whatsapp-theme='dark'] [class~='rounded-[5px]'][class~='text-[12.5px]'] {
                        color: #8D9598 !important;
                    }

                    [data-mobile9-whatsapp='true'][data-mobile9-whatsapp-theme='light'] [class~='bg-[#FFF0D4]'] {
                        color: rgba(0, 0, 0, 0.60) !important;
                        font-family: Roboto, sans-serif !important;
                        font-weight: 200;
                    }

                    [data-mobile9-whatsapp='true'][data-mobile9-whatsapp-theme='light'] [class~='bg-[#FFF0D4]'] svg,
                    [data-mobile9-whatsapp='true'][data-mobile9-whatsapp-theme='light'] [class~='bg-[#FFF0D4]'] strong {
                        color: rgba(0, 0, 0, 0.60) !important;
                    }

                    [data-mobile9-whatsapp='true'][data-mobile9-whatsapp-theme='light'] [class~='bg-[#FFF0D4]'] strong {
                        font-weight: 400;
                    }

                    [data-mobile9-whatsapp='true'][data-mobile9-whatsapp-theme='dark'] [class~='bg-[#12181C]'] {
                        color: #EECC84 !important;
                        font-family: Roboto, sans-serif !important;
                        font-weight: 300;
                    }

                    [data-mobile9-whatsapp='true'][data-mobile9-whatsapp-theme='dark'] [class~='bg-[#12181C]'] svg,
                    [data-mobile9-whatsapp='true'][data-mobile9-whatsapp-theme='dark'] [class~='bg-[#12181C]'] strong {
                        color: #EECC84 !important;
                    }

                    [data-mobile9-whatsapp='true'][data-mobile9-whatsapp-theme='dark'] [class~='bg-[#12181C]']:has([data-icon='lock-small'] title) {
                        color: #767C80 !important;
                    }

                    [data-mobile9-whatsapp='true'][data-mobile9-whatsapp-theme='dark'] [class~='bg-[#12181C]']:has([data-icon='lock-small'] title) strong {
                        color: #767C80 !important;
                    }

                    [data-mobile9-whatsapp='true'] [class~='text-[0.859375rem]'] {
                        font-family: Roboto, sans-serif !important;
                        font-weight: 300;
                    }

                    [data-mobile9-whatsapp='true'][data-mobile9-whatsapp-theme='light'] [class~='text-[0.859375rem]'] {
                        color: rgba(0, 0, 0, 0.60) !important;
                    }

                    [data-mobile9-whatsapp='true'][data-mobile9-whatsapp-theme='dark'] [class~='text-[0.859375rem]'] {
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
                    behaviorProfile={getWhatsappBehaviorProfile('mobile-9')}
                    visualAdapter={mobile9WhatsappVisualAdapter}
                    messageStatus={runtime.messageStatus}
                    messages={data.generatedMessages}
                    showDefaultTemporalMessage={runtime.temporalBehavior.showDefaultTemporalMessage}
                    inlineTemporalMode={runtime.temporalBehavior.inlineTemporalMode}
                    inlineTemporalInsertIndex={data.previewSnapshot?.inlineTemporalInsertIndex ?? null}
                    displayTitle={runtime.contactIdentityDisplay.headerTitle}
                    themeMode={themeMode}
                    composerAccessory={<Mobile9QuickActionButton themeMode={themeMode} />}
                    composerLayout={{ messageAreaMaxWidth: '175px' }}
                />
            </div>
        </Mobile9PreviewFrame>
    );
}
