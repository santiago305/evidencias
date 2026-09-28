import assert from 'node:assert/strict';
import test from 'node:test';
import { getMobile13SmsHeaderColors } from '../smsAppearance.ts';

test('mobile 13 SMS header uses the reference light colors', () => {
    const colors = getMobile13SmsHeaderColors('light');

    assert.deepEqual(colors, {
        headerBackground: '#FFFFFF',
        headerText: '#000000',
        backButtonBackground: 'rgba(255, 255, 255, 0.68)',
        backButtonBorder: 'rgba(100, 100, 100, 0.20)',
        backButtonText: '#000000',
        avatarInitialTop: '#9DB1D5',
        avatarInitialBottom: '#7782BA',
        pillBackground: 'rgba(255, 255, 255, 0.82)',
        pillBorder: 'rgba(100, 100, 100, 0.25)',
        pillText: '#000000',
        pillChevron: '#8A8A8A',
    });
});

test('mobile 13 SMS header uses the reference dark colors', () => {
    const colors = getMobile13SmsHeaderColors('dark');

    assert.deepEqual(colors, {
        headerBackground: '#000000',
        headerText: '#FFFFFF',
        backButtonBackground: 'rgba(50, 50, 50, 0.78)',
        backButtonBorder: 'rgba(255, 255, 255, 0.10)',
        backButtonText: '#FFFFFF',
        avatarInitialTop: '#5B586F',
        avatarInitialBottom: '#372D4F',
        pillBackground: 'rgba(31, 31, 31, 0.90)',
        pillBorder: 'rgba(255, 255, 255, 0.12)',
        pillText: '#FFFFFF',
        pillChevron: '#8A8A8A',
    });
});
