import assert from 'node:assert/strict';
import test from 'node:test';
import { resolvePreviewThemeMode } from './previewThemeModeSelection.ts';

test('resolvePreviewThemeMode chooses the desktop theme for desktop previews', () => {
    assert.equal(
        resolvePreviewThemeMode({
            previewDeviceMode: 'desktop',
            desktopThemeMode: 'dark',
            mobileThemeMode: 'light',
        }),
        'dark',
    );
});

test('resolvePreviewThemeMode chooses the mobile theme for mobile previews', () => {
    assert.equal(
        resolvePreviewThemeMode({
            previewDeviceMode: 'mobile',
            desktopThemeMode: 'dark',
            mobileThemeMode: 'light',
        }),
        'light',
    );
});
