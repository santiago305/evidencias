import assert from 'node:assert/strict';
import test from 'node:test';
import { formatMobile14MessageTime } from './mobile14MessageTime.ts';

test('formats mobile 14 conversation message times in 12 hour format', () => {
    assert.equal(formatMobile14MessageTime('15:30'), '3:30 p.m.');
    assert.equal(formatMobile14MessageTime('3:30 p.m.'), '3:30 p.m.');
    assert.equal(formatMobile14MessageTime('12:05 a.m.'), '12:05 a.m.');
    assert.equal(formatMobile14MessageTime('00:15'), '12:15 a.m.');
    assert.equal(formatMobile14MessageTime('12:15'), '12:15 p.m.');
});
