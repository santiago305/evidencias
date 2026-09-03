import assert from 'node:assert/strict';
import test from 'node:test';
import { getMobile1BatteryColor } from './Mobile1BatteryIcon.ts';

test('uses normal battery color above 20 percent', () => {
    for (const batteryLevel of [100, 54, 21]) {
        assert.equal(getMobile1BatteryColor(batteryLevel, '#EDEDED'), '#EDEDED');
    }
});

test('uses orange battery color from 6 to 20 percent', () => {
    for (const batteryLevel of [20, 15, 6]) {
        assert.equal(getMobile1BatteryColor(batteryLevel, '#EDEDED'), '#F5A623');
    }
});

test('uses red battery color at 5 percent and below', () => {
    for (const batteryLevel of [5, 1, 0]) {
        assert.equal(getMobile1BatteryColor(batteryLevel, '#EDEDED'), '#D93025');
    }
});
