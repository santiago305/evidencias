import assert from 'node:assert/strict';
import test from 'node:test';
import { formatMobile11StatusBarTime } from './mobile11StatusBarTime.ts';

test('formats mobile 11 status bar time as 12-hour time without meridiem', () => {
    assert.equal(formatMobile11StatusBarTime(new Date(2026, 0, 1, 5, 29)), '5:29');
    assert.equal(formatMobile11StatusBarTime(new Date(2026, 0, 1, 17, 29)), '5:29');
    assert.equal(formatMobile11StatusBarTime(new Date(2026, 0, 1, 0, 5)), '12:05');
});
