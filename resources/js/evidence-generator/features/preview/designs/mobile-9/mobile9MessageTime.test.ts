import assert from 'node:assert/strict';
import test from 'node:test';
import { formatMobile9MessageTime } from './mobile9MessageTime.ts';

test('mobile 9 keeps message times in 24-hour format', () => {
    assert.equal(formatMobile9MessageTime('15:30'), '15:30');
    assert.equal(formatMobile9MessageTime('3:30 p.m.'), '15:30');
    assert.equal(formatMobile9MessageTime('12:05 a.m.'), '00:05');
});
