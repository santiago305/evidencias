import assert from 'node:assert/strict';
import test from 'node:test';
import { getConversationMoreIndicatorThreshold, shouldShowConversationMoreIndicator } from './whatsappConversationIndicator.ts';

test('mobile threshold uses 98 percent', () => {
    assert.equal(getConversationMoreIndicatorThreshold('mobile'), 0.98);
});

test('desktop threshold uses 95 percent', () => {
    assert.equal(getConversationMoreIndicatorThreshold('desktop'), 0.95);
});

test('mobile indicator hides when the scroll is at or beyond the 98 percent threshold', () => {
    assert.equal(shouldShowConversationMoreIndicator(97, 100, 0, 'mobile'), true);
    assert.equal(shouldShowConversationMoreIndicator(98, 100, 0, 'mobile'), false);
});

test('desktop indicator hides when the scroll is at or beyond the 95 percent threshold', () => {
    assert.equal(shouldShowConversationMoreIndicator(94, 100, 0, 'desktop'), true);
    assert.equal(shouldShowConversationMoreIndicator(95, 100, 0, 'desktop'), false);
});

test('indicator stays hidden when the conversation does not overflow', () => {
    assert.equal(shouldShowConversationMoreIndicator(0, 100, 100, 'mobile'), false);
});
