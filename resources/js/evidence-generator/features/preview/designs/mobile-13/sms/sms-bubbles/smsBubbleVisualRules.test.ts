import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const bubbleSource = readFileSync(new URL('./SmsMobileTextBubble.tsx', import.meta.url), 'utf8');

test('mobile 13 SMS bubbles follow WhatsApp grouping geometry while keeping SMS colors', () => {
    assert.match(bubbleSource, /max-w-\[85%\]/);
    assert.match(bubbleSource, /rounded-\[25px\]/);
    assert.match(bubbleSource, /p-\[1px\]/);
    assert.match(bubbleSource, /groupPosition === 'single' \|\| groupPosition === 'last'/);
    assert.match(bubbleSource, /groupPosition === 'first' \|\| groupPosition === 'middle'/);
    assert.doesNotMatch(bubbleSource, /rounded-tl-\[23px\]|rounded-tr-\[23px\]/);
    assert.match(bubbleSource, /backgroundColor/);
    assert.match(bubbleSource, /colors\.sentBubble|colors\.receivedBubble/);
    assert.match(bubbleSource, /style=\{\{ color \}\}/);
    assert.match(bubbleSource, /<SmsBubbleTail side=\{isOutgoing \? 'right' : 'left'\} color=\{backgroundColor\} \/>/);
});

test('mobile 13 SMS bubbles reserve no space for a hidden timestamp', () => {
    assert.match(bubbleSource, /message\.lines\.map/);
    assert.doesNotMatch(bubbleSource, /invisible inline-flex|formatMobile13SmsTimestamp|SmsMessageMetadata|float-right/);
});

test('clicking a mobile 13 SMS bubble does not reveal a timestamp', () => {
    assert.doesNotMatch(bubbleSource, /onClick|useState|toggleSmsMetadataVisibility|showMetadata|isMetadataVisible/);
});

test('SMS tails appear only for single and final grouped messages', () => {
    assert.match(bubbleSource, /const isLastInGroup = groupPosition === 'single' \|\| groupPosition === 'last'/);
    assert.match(bubbleSource, /groupPosition === 'first' \|\| groupPosition === 'middle'/);
    assert.match(bubbleSource, /isLastInGroup && <SmsBubbleTail/);
    assert.match(bubbleSource, /<SmsBubbleTail side=\{isOutgoing \? 'right' : 'left'\} color=\{backgroundColor\} \/>/);
});

test('received and outgoing tails use smooth, correctly oriented SVG geometry', () => {
    assert.match(bubbleSource, /function SmsBubbleTail\(\{ side, color \}/);
    assert.doesNotMatch(bubbleSource, /function OutgoingBubbleTail|function BubbleTail/);
    assert.match(bubbleSource, /left-\[6px\]/);
    assert.match(bubbleSource, /right-\[6px\]/);
    assert.equal((bubbleSource.match(/bottom-\[-8px\]/g) ?? []).length, 1);
    assert.match(bubbleSource, /width="22"[\s\S]*height="18"[\s\S]*viewBox="0 0 22 18"/);
    assert.match(bubbleSource, /preserveAspectRatio="xMidYMid meet"/);
    assert.match(bubbleSource, /C 21\.6 2\.2\s+19\.6 4\.0\s+17\.6 6\.4/);
    assert.match(bubbleSource, /C 16\.0 13\.6\s+17\.2 15\.7\s+19\.1 17\.0/);
    assert.match(bubbleSource, /C 19\.0 17\.6\s+18\.2 17\.7\s+17\.4 17\.4/);
    assert.match(bubbleSource, /transform=\{\s*side === 'left'\s*\? 'translate\(22 0\) scale\(-1 1\)'\s*: undefined/);
    assert.match(bubbleSource, /data-mobile13-sms-tail=\{side\}/);
    assert.equal((bubbleSource.match(/fill="currentColor"/g) ?? []).length, 1);
    assert.equal((bubbleSource.match(/pointer-events-none/g) ?? []).length, 1);
    assert.equal((bubbleSource.match(/z-0/g) ?? []).length, 1);
    assert.doesNotMatch(bubbleSource, /scale-y-\[-1\]|rounded-bl-none|rounded-br-none/);
    assert.doesNotMatch(bubbleSource, /opacity="0\.13"|fill="#000000"|stroke=|boxShadow/);
});
