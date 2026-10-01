import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveLockedMobilePreviewThemeMode, resolvePreviewThemeMode } from './previewThemeModeSelection.ts';

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

test('locks the requested theme for mobile WhatsApp and SMS previews', () => {
    const expectedModes = [
        ['mobile-6', 'light', 'dark'],
        ['mobile-7', 'light', 'light'],
        ['mobile-8', 'light', 'light'],
        ['mobile-9', 'light', 'light'],
        ['mobile-10', 'light', 'light'],
        ['mobile-11', 'dark', 'dark'],
        ['mobile-12', 'dark', 'dark'],
    ] as const;

    for (const [mobileDesignKey, whatsappMode, smsMode] of expectedModes) {
        assert.equal(
            resolveLockedMobilePreviewThemeMode({ mobileDesignKey, activeDesign: 'whatsapp', previewDeviceMode: 'mobile' }),
            whatsappMode,
        );
        assert.equal(resolveLockedMobilePreviewThemeMode({ mobileDesignKey, activeDesign: 'sms', previewDeviceMode: 'mobile' }), smsMode);
    }
});

test('keeps desktop WhatsApp, calls, and unlocked mobiles available for theme selection', () => {
    assert.equal(resolveLockedMobilePreviewThemeMode({ mobileDesignKey: 'mobile-6', activeDesign: 'whatsapp', previewDeviceMode: 'desktop' }), null);
    assert.equal(resolveLockedMobilePreviewThemeMode({ mobileDesignKey: 'mobile-12', activeDesign: 'llamada', previewDeviceMode: 'mobile' }), null);
    assert.equal(resolveLockedMobilePreviewThemeMode({ mobileDesignKey: 'mobile-13', activeDesign: 'sms', previewDeviceMode: 'mobile' }), null);
    assert.equal(resolveLockedMobilePreviewThemeMode({ mobileDesignKey: 'mobile-1', activeDesign: 'whatsapp', previewDeviceMode: 'mobile' }), null);
    assert.equal(resolveLockedMobilePreviewThemeMode({ mobileDesignKey: 'mobile-14', activeDesign: 'whatsapp', previewDeviceMode: 'mobile' }), null);
    assert.equal(resolveLockedMobilePreviewThemeMode({ mobileDesignKey: 'mobile-14', activeDesign: 'sms', previewDeviceMode: 'mobile' }), null);
});
