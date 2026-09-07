import assert from 'node:assert/strict';
import test from 'node:test';
import { getSmsColors, shouldShowSmsAccentPoint } from './smsAppearance.ts';

test('shows SMS accent points for half of random values', () => {
    assert.equal(shouldShowSmsAccentPoint(0.49), true);
    assert.equal(shouldShowSmsAccentPoint(0.5), false);
});

test('preserves the original light-mode read receipt colors', () => {
    const colors = getSmsColors('light');

    assert.equal(colors.readReceiptBackground, colors.conversation);
    assert.equal(colors.readReceiptForeground, colors.statusCheck);
});

test('uses contrasting read receipt colors only in dark mode', () => {
    const colors = getSmsColors('dark');

    assert.equal(colors.readReceiptBackground, '#101417');
    assert.equal(colors.readReceiptForeground, '#E0E1E5');
});

test('keeps mobile 3 as the default SMS appearance', () => {
    assert.deepEqual(getSmsColors('light'), getSmsColors('light', 'mobile-3'));
    assert.deepEqual(getSmsColors('dark'), getSmsColors('dark', 'mobile-3'));
});

test('uses the exact mobile 2 light SMS palette', () => {
    assert.deepEqual(getSmsColors('light', 'mobile-2'), {
        shell: '#FAEAEB',
        header: '#FAEAEB',
        conversation: '#FFF6F7',
        receivedBubble: '#FAEAEB',
        sentBubble: '#FEDADA',
        sentText: '#24181A',
        primaryText: '#24181A',
        secondaryText: '#524444',
        headerIcon: '#524444',
        headerActionIcon: '#524444',
        composer: '#FAEAEB',
        tealPoint: '#FF63B7',
        link: '#524444',
        audioBackground: '#FEDDB4',
        audioIcon: '#281800',
        redPoint: '#FF63B7',
        menuIndicator: '#FF63B7',
        statusCheck: '#524444',
        readReceiptBackground: '#FFF6F7',
        readReceiptForeground: '#524444',
        metadataIcon: '#524444',
        avatarBackground: '#5CB973',
        avatarForeground: '#FFFFFF',
        systemNavigationForeground: '#747274',
    });
});

test('uses the exact mobile 2 dark SMS palette', () => {
    assert.deepEqual(getSmsColors('dark', 'mobile-2'), {
        shell: '#271D1E',
        header: '#271D1E',
        conversation: '#1C1010',
        receivedBubble: '#271D1E',
        sentBubble: '#FFA7A9',
        sentText: '#2F0809',
        primaryText: '#EEDEDE',
        secondaryText: '#D4C4C4',
        headerIcon: '#D7C1C3',
        headerActionIcon: '#D7C1C3',
        composer: '#271D1E',
        tealPoint: '#FF63B7',
        link: '#D4C4C4',
        audioBackground: '#5E421B',
        audioIcon: '#FEDDB4',
        redPoint: '#FF63B7',
        menuIndicator: '#FF63B7',
        statusCheck: '#D4C4C4',
        readReceiptBackground: '#1C1010',
        readReceiptForeground: '#D4C4C4',
        metadataIcon: '#D4C4C4',
        avatarBackground: '#5CB973',
        avatarForeground: '#202125',
        systemNavigationForeground: '#FFFFFF',
    });
});

test('uses the exact mobile 1 light SMS palette', () => {
    const colors = getSmsColors('light', 'mobile-1');

    assert.equal(colors.shell, '#EAEDF2');
    assert.equal(colors.header, '#EAEDF2');
    assert.equal(colors.conversation, '#F5FAFE');
    assert.equal(colors.receivedBubble, '#EAEDF2');
    assert.equal(colors.sentBubble, '#296389');
    assert.equal(colors.audioBackground, '#EBDBFF');
    assert.equal(colors.avatarBackground, '#5CB973');
    assert.equal(colors.quickReplyBorder, '#C0C7CD');
});

test('uses the exact mobile 1 dark SMS palette', () => {
    const colors = getSmsColors('dark', 'mobile-1');

    assert.equal(colors.shell, '#1C2023');
    assert.equal(colors.header, '#1C2023');
    assert.equal(colors.conversation, '#101817');
    assert.equal(colors.receivedBubble, '#1C2023');
    assert.equal(colors.sentBubble, '#004B72');
    assert.equal(colors.audioBackground, '#4C4161');
    assert.equal(colors.avatarBackground, '#5CB973');
    assert.equal(colors.quickReplyBorder, '#42474D');
});
