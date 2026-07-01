import type { PreviewDeviceMode, PreviewThemeMode } from '../types';

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
