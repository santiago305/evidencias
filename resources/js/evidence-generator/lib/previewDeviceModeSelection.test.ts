import assert from 'node:assert/strict';
import test from 'node:test';
import { resolvePreviewDeviceMode } from './previewDeviceModeSelection.ts';

test('resolvePreviewDeviceMode keeps fixed desktop and mobile modes', () => {
    assert.equal(
        resolvePreviewDeviceMode('desktop', () => 0.99),
        'desktop',
    );
    assert.equal(
        resolvePreviewDeviceMode('mobile', () => 0),
        'mobile',
    );
});

test('resolvePreviewDeviceMode chooses desktop seventy percent of the time for mixed mode', () => {
    assert.equal(
        resolvePreviewDeviceMode('mixed', () => 0),
        'desktop',
    );
    assert.equal(
        resolvePreviewDeviceMode('mixed', () => 0.69),
        'desktop',
    );
    assert.equal(
        resolvePreviewDeviceMode('mixed', () => 0.7),
        'mobile',
    );
    assert.equal(
        resolvePreviewDeviceMode('mixed', () => 0.99),
        'mobile',
    );
});
