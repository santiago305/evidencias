import type { MobileDesignKey } from '../types';

interface ResolveActiveMobileDesignOptions {
    availableMobileDesigns: MobileDesignKey[];
    globalMobileDesigns: MobileDesignKey[];
    registeredMobileDesigns: MobileDesignKey[];
    preferPendingDevelopmentDesign?: boolean;
}

export function resolveActiveMobileDesignKey({
    availableMobileDesigns,
    globalMobileDesigns,
    registeredMobileDesigns,
    preferPendingDevelopmentDesign = true,
}: ResolveActiveMobileDesignOptions): MobileDesignKey {
    const pendingDevelopmentDesign = availableMobileDesigns.find((designKey) => !globalMobileDesigns.includes(designKey));

    if (preferPendingDevelopmentDesign && pendingDevelopmentDesign) {
        return pendingDevelopmentDesign;
    }

    return registeredMobileDesigns[0] ?? globalMobileDesigns[0] ?? availableMobileDesigns[0] ?? 'mobile-1';
}
