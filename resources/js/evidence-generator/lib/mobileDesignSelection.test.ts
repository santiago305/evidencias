import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveActiveMobileDesignKey } from './mobileDesignSelection.ts';

test('uses the first unregistered catalog design for tests', () => {
    assert.equal(
        resolveActiveMobileDesignKey({
            availableMobileDesigns: ['mobile-1', 'mobile-2'],
            globalMobileDesigns: [],
            registeredMobileDesigns: [],
        }),
        'mobile-1',
    );
});

test('moves to the next test design after the previous one is registered globally', () => {
    assert.equal(
        resolveActiveMobileDesignKey({
            availableMobileDesigns: ['mobile-1', 'mobile-2'],
            globalMobileDesigns: ['mobile-1'],
            registeredMobileDesigns: [],
        }),
        'mobile-2',
    );
});

test('uses the user assigned design when there are no pending test designs', () => {
    assert.equal(
        resolveActiveMobileDesignKey({
            availableMobileDesigns: ['mobile-1', 'mobile-2'],
            globalMobileDesigns: ['mobile-1', 'mobile-2'],
            registeredMobileDesigns: ['mobile-2'],
        }),
        'mobile-2',
    );
});

test('uses the user assigned design for normal evidence even when a pending test design exists', () => {
    assert.equal(
        resolveActiveMobileDesignKey({
            availableMobileDesigns: ['mobile-1', 'mobile-2'],
            globalMobileDesigns: ['mobile-1'],
            registeredMobileDesigns: ['mobile-1'],
            preferPendingDevelopmentDesign: false,
        }),
        'mobile-1',
    );
});

test('uses any registered global design in tests when the user has no assigned design', () => {
    assert.equal(
        resolveActiveMobileDesignKey({
            availableMobileDesigns: ['mobile-1', 'mobile-2'],
            globalMobileDesigns: ['mobile-1', 'mobile-2'],
            registeredMobileDesigns: [],
        }),
        'mobile-1',
    );
});
