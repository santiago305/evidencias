import type { PreviewDeviceMode, PreviewDevicePreference } from '../types';

export function resolvePreviewDeviceMode(preference: PreviewDevicePreference, random: () => number = Math.random): PreviewDeviceMode {
    if (preference !== 'mixed') {
        return preference;
    }

    return random() < 0.7 ? 'desktop' : 'mobile';
}
