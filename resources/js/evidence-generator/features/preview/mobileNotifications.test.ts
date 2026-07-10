import assert from 'node:assert/strict';
import test from 'node:test';
import { buildMobileNotificationIds } from './mobileNotifications.ts';

test('mobile notifications stay the same within a three minute window', () => {
    const first = buildMobileNotificationIds({
        capturedAt: '2026-06-12T16:43',
        userKey: '87654321',
        designKey: 'mobile-1',
        channel: 'whatsapp',
        evidenceKey: 'EVC2-A',
    });
    const second = buildMobileNotificationIds({
        capturedAt: '2026-06-12T16:44',
        userKey: '87654321',
        designKey: 'mobile-1',
        channel: 'whatsapp',
        evidenceKey: 'EVC2-B',
    });

    assert.deepEqual(second, first);
});

test('mobile notifications change gradually across three minute windows', () => {
    const first = buildMobileNotificationIds({
        capturedAt: '2026-06-12T16:43',
        userKey: '87654321',
        designKey: 'mobile-1',
        channel: 'whatsapp',
    });
    const second = buildMobileNotificationIds({
        capturedAt: '2026-06-12T16:46',
        userKey: '87654321',
        designKey: 'mobile-1',
        channel: 'whatsapp',
    });

    const firstSet = new Set(first);
    const sharedCount = second.filter((id) => firstSet.has(id)).length;
    const maxChangedItems = Math.max(first.length, second.length) - sharedCount;

    assert.notDeepEqual(second, first);
    assert.ok(maxChangedItems <= 1, `expected at most one notification change, got ${maxChangedItems}`);
});

test('mobile notifications use the evidence key only when no capture time exists', () => {
    const first = buildMobileNotificationIds({
        capturedAt: '',
        userKey: '87654321',
        designKey: 'mobile-1',
        channel: 'sms',
        evidenceKey: 'EVC2-A',
    });
    const second = buildMobileNotificationIds({
        capturedAt: '',
        userKey: '87654321',
        designKey: 'mobile-1',
        channel: 'sms',
        evidenceKey: 'EVC2-B',
    });

    assert.notDeepEqual(second, first);
});
