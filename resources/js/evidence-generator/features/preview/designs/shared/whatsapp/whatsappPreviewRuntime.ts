import type { PreviewTemporalBehavior } from '../../../../../types';
import { buildContactIdentityDisplay } from '../../mobile-3/whatsapp/contactIdentityDisplay';
import { buildWhatsappAvatarSeed } from '../../mobile-3/whatsapp/whatsappAppearance';
import type { MsgStatus } from '../../mobile-3/whatsapp/WhatsappPieces';
import type { WhatsappData } from '../../mobile-3/whatsapp/whatsappTypes';

export function hashString(value: string): number {
    let hash = 2166136261;

    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
}

export function createSeededRandom(seed: number): () => number {
    let state = seed || 1;

    return () => {
        state += 0x6d2b79f5;
        let temp = state;
        temp = Math.imul(temp ^ (temp >>> 15), temp | 1);
        temp ^= temp + Math.imul(temp ^ (temp >>> 7), temp | 61);

        return ((temp ^ (temp >>> 14)) >>> 0) / 4294967296;
    };
}

export function buildWhatsappMessageStatus(userSeed: string, snapshotStatus?: MsgStatus): MsgStatus {
    if (snapshotStatus) {
        return snapshotStatus;
    }

    const random = createSeededRandom(hashString(`${userSeed}|status`));

    return random() < 0.5 ? 'read' : 'delivered';
}

export function buildWhatsappTemporalBehavior(userSeed: string, snapshotBehavior?: PreviewTemporalBehavior): PreviewTemporalBehavior {
    if (snapshotBehavior) {
        return snapshotBehavior;
    }

    const random = createSeededRandom(hashString(`${userSeed}|temporal`));
    const showsTimerIcon = random() < 0.5;

    if (!showsTimerIcon) {
        const showsTemporalMessagesWhileDisabled = random() < 0.5;

        if (!showsTemporalMessagesWhileDisabled) {
            return {
                showTemporaryIcon: false,
                showDefaultTemporalMessage: false,
                temporalStatusLabel: 'Desactivado',
                inlineTemporalMode: null,
            };
        }

        return {
            showTemporaryIcon: false,
            showDefaultTemporalMessage: true,
            temporalStatusLabel: 'Desactivado',
            inlineTemporalMode: 'deactive',
        };
    }

    const usesInlineActivationVariant = random() < 0.5;

    if (usesInlineActivationVariant) {
        return {
            showTemporaryIcon: true,
            showDefaultTemporalMessage: false,
            temporalStatusLabel: '90 días',
            inlineTemporalMode: 'active',
        };
    }

    return {
        showTemporaryIcon: true,
        showDefaultTemporalMessage: true,
        temporalStatusLabel: '90 días',
        inlineTemporalMode: null,
    };
}

export function buildWhatsappPreviewRuntime(data: WhatsappData) {
    const userSeed = buildWhatsappAvatarSeed(data);

    return {
        messageStatus: buildWhatsappMessageStatus(userSeed, data.previewSnapshot?.messageStatus),
        temporalBehavior: buildWhatsappTemporalBehavior(userSeed, data.previewSnapshot?.temporalBehavior),
        contactIdentityDisplay: buildContactIdentityDisplay(data),
    };
}
