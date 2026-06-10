import { useMemo } from 'react';
import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { Mobile2PreviewFrame } from '../Mobile2PreviewFrame';
import { buildContactIdentityDisplay } from './contactIdentityDisplay';
import { WhatsappHeaderUser } from './whatsapp-header';
import { buildWhatsappAvatarSeed } from './whatsappAppearance';
import { WhatsappConversation } from './WhatsappConversation';
import type { MsgStatus } from './WhatsappPieces';

function hashString(value: string): number {
    let hash = 2166136261;

    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
}

function createSeededRandom(seed: number): () => number {
    let state = seed || 1;

    return () => {
        state += 0x6d2b79f5;
        let temp = state;
        temp = Math.imul(temp ^ (temp >>> 15), temp | 1);
        temp ^= temp + Math.imul(temp ^ (temp >>> 7), temp | 61);
        return ((temp ^ (temp >>> 14)) >>> 0) / 4294967296;
    };
}

export function PreviewMobile2Whatsapp({ data, themeMode }: PreviewProps) {
    const userSeed = useMemo(() => buildWhatsappAvatarSeed(data ?? undefined), [data]);

    const messageStatus = useMemo<MsgStatus>(() => {
        if (data?.previewSnapshot) {
            return data.previewSnapshot.messageStatus;
        }

        const random = createSeededRandom(hashString(`${userSeed}|status`));
        return random() < 0.5 ? 'read' : 'delivered';
    }, [data?.previewSnapshot, userSeed]);

    const temporalBehavior = useMemo(() => {
        if (data?.previewSnapshot) {
            return data.previewSnapshot.temporalBehavior;
        }

        const random = createSeededRandom(hashString(`${userSeed}|temporal`));
        const showsTimerIcon = random() < 0.5;

        if (!showsTimerIcon) {
            const showsTemporalMessagesWhileDisabled = random() < 0.5;

            if (!showsTemporalMessagesWhileDisabled) {
                return {
                    showTemporaryIcon: false,
                    showDefaultTemporalMessage: false,
                    temporalStatusLabel: 'Desactivado' as const,
                    inlineTemporalMode: null,
                };
            }

            return {
                showTemporaryIcon: false,
                showDefaultTemporalMessage: true,
                temporalStatusLabel: 'Desactivado' as const,
                inlineTemporalMode: 'deactive' as const,
            };
        }

        const usesInlineActivationVariant = random() < 0.5;

        if (usesInlineActivationVariant) {
            return {
                showTemporaryIcon: true,
                showDefaultTemporalMessage: false,
                temporalStatusLabel: '90 dias' as const,
                inlineTemporalMode: 'active' as const,
            };
        }

        return {
            showTemporaryIcon: true,
            showDefaultTemporalMessage: true,
            temporalStatusLabel: '90 dias' as const,
            inlineTemporalMode: null,
        };
    }, [data?.previewSnapshot, userSeed]);

    const contactIdentityDisplay = useMemo(
        () =>
            data
                ? buildContactIdentityDisplay(data)
                : {
                      headerTitle: 'Aracely MD',
                      profileTitle: 'Sin nombre',
                      profileSubtitle: '+51 -',
                      showAddContactAction: false,
                  },
        [data],
    );

    if (!data) {
        return <EmptyState />;
    }

    return (
        <Mobile2PreviewFrame
            themeMode={themeMode}
            notificationSeed={[data.seedCode, data.conversationId, data.telefono, data.dniCliente, data.generatedMessages?.length]
                .filter((value) => value !== undefined && value !== null && `${value}`.trim() !== '')
                .join('|')}
            headerVariant="whatsapp"
        >
            <div className={['flex h-full min-h-0 flex-col', themeMode === 'dark' ? 'bg-[#0b141a]' : 'bg-[#efeae2]'].join(' ')}>
                <WhatsappHeaderUser
                    data={data}
                    status={messageStatus}
                    showTemporaryIndicator={temporalBehavior.showTemporaryIcon}
                    displayTitle={contactIdentityDisplay.headerTitle}
                    themeMode={themeMode}
                />

                <WhatsappConversation
                    data={data}
                    messageStatus={messageStatus}
                    messages={data.generatedMessages}
                    showDefaultTemporalMessage={temporalBehavior.showDefaultTemporalMessage}
                    inlineTemporalMode={temporalBehavior.inlineTemporalMode}
                    inlineTemporalInsertIndex={data.previewSnapshot?.inlineTemporalInsertIndex ?? null}
                    displayTitle={contactIdentityDisplay.headerTitle}
                    themeMode={themeMode}
                />
            </div>
        </Mobile2PreviewFrame>
    );
}
