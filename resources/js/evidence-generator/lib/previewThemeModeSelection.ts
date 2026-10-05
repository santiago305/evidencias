import type { ActiveDesign, MobileDesignKey, PreviewDeviceMode, PreviewThemeMode } from '../types';

const lockedMobileThemeModes: Partial<Record<MobileDesignKey, Partial<Record<'whatsapp' | 'sms', PreviewThemeMode>>>> = {
    'mobile-6': { whatsapp: 'light', sms: 'dark' },
    'mobile-7': { whatsapp: 'light', sms: 'light' },
    'mobile-8': { whatsapp: 'light', sms: 'light' },
    'mobile-9': { whatsapp: 'light', sms: 'light' },
    'mobile-10': { whatsapp: 'light', sms: 'light' },
    'mobile-11': { whatsapp: 'dark', sms: 'dark' },
    'mobile-12': { whatsapp: 'dark', sms: 'dark' },
    'mobile-15': { whatsapp: 'light' },
};

interface LockedMobilePreviewThemeModeSelection {
    mobileDesignKey: MobileDesignKey;
    activeDesign: ActiveDesign;
    previewDeviceMode: PreviewDeviceMode;
}

export function resolveLockedMobilePreviewThemeMode({
    mobileDesignKey,
    activeDesign,
    previewDeviceMode,
}: LockedMobilePreviewThemeModeSelection): PreviewThemeMode | null {
    if (activeDesign === 'llamada' || (activeDesign === 'whatsapp' && previewDeviceMode === 'desktop')) {
        return null;
    }

    return lockedMobileThemeModes[mobileDesignKey]?.[activeDesign] ?? null;
}

interface PreviewThemeModeSelection {
    previewDeviceMode: PreviewDeviceMode;
    desktopThemeMode: PreviewThemeMode;
    mobileThemeMode: PreviewThemeMode;
}

export function resolvePreviewThemeMode({
    previewDeviceMode,
    desktopThemeMode,
    mobileThemeMode,
}: PreviewThemeModeSelection): PreviewThemeMode {
    return previewDeviceMode === 'desktop' ? desktopThemeMode : mobileThemeMode;
}
