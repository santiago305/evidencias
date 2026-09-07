import type { WhatsappBehaviorProfile, WhatsappDesignVariant } from './whatsappTypes';

export const whatsappBehaviorProfiles: Record<WhatsappDesignVariant, WhatsappBehaviorProfile> = {
    'mobile-1': 'mobile-1',
    'mobile-2': 'standard',
    'mobile-3': 'standard',
    'mobile-4': 'standard',
    'mobile-5': 'standard',
};

export function getWhatsappBehaviorProfile(variant: WhatsappDesignVariant): WhatsappBehaviorProfile {
    return whatsappBehaviorProfiles[variant];
}
