import assert from 'node:assert/strict';
import test from 'node:test';
import { getMobile13SmsContentColors } from './smsContentAppearance.ts';

test('mobile 13 SMS content uses the reference light palette', () => {
    const colors = getMobile13SmsContentColors('light');

    assert.equal(colors.shell, '#FFFFFF');
    assert.equal(colors.conversation, '#FFFFFF');
    assert.equal(colors.receivedBubble, '#E9E9E9');
    assert.equal(colors.primaryText, '#000000');
    assert.equal(colors.sentBubble, '#46D86B');
    assert.equal(colors.sentText, '#FFFFFF');
    assert.equal(colors.composer, '#F8F8F8');
    assert.equal(colors.secondaryText, '#8A8A8A');
});

test('mobile 13 SMS content uses the reference dark palette', () => {
    const colors = getMobile13SmsContentColors('dark');

    assert.equal(colors.shell, '#000000');
    assert.equal(colors.conversation, '#000000');
    assert.equal(colors.receivedBubble, '#262628');
    assert.equal(colors.primaryText, '#FFFFFF');
    assert.equal(colors.sentBubble, '#32D15A');
    assert.equal(colors.sentText, '#FFFFFF');
    assert.equal(colors.composer, '#1F1F1F');
    assert.equal(colors.secondaryText, '#8A8A8A');
});
