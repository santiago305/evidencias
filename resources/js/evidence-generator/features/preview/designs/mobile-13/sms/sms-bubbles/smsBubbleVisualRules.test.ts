import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const bubbleSource = readFileSync(new URL('./SmsMobileTextBubble.tsx', import.meta.url), 'utf8');
const metadataSource = readFileSync(new URL('./SmsMessageMetadata.tsx', import.meta.url), 'utf8');

test('mobile 13 SMS bubbles follow WhatsApp grouping geometry while keeping SMS colors', () => {
    assert.match(bubbleSource, /max-w-\[87%\]/);
    assert.match(bubbleSource, /rounded-\[20px\]/);
    assert.match(bubbleSource, /p-\[1px\]/);
    assert.match(bubbleSource, /groupPosition === 'single' \|\| groupPosition === 'last'/);
    assert.match(bubbleSource, /groupPosition === 'first' \|\| groupPosition === 'middle'/);
    assert.doesNotMatch(bubbleSource, /rounded-tl-\[23px\]|rounded-tr-\[23px\]/);
    assert.match(bubbleSource, /backgroundColor/);
    assert.match(bubbleSource, /colors\.sentBubble|colors\.receivedBubble/);
    assert.match(bubbleSource, /style=\{\{ color \}\}/);
    assert.match(bubbleSource, /<OutgoingBubbleTail color=\{backgroundColor\} \/>/);
    assert.match(bubbleSource, /<BubbleTail side="left" color=\{backgroundColor\} \/>/);
});

test('mobile 13 SMS metadata can be placed inside the WhatsApp-style bubble', () => {
    assert.match(bubbleSource, /placement="inline"/);
    assert.match(metadataSource, /placement\?: 'below' \| 'inline'/);
    assert.match(metadataSource, /isInline/);
    assert.match(metadataSource, /h-\[18\.75px\]/);
});

test('mobile 13 SMS metadata shows the date and time timestamp for either side', () => {
    assert.match(metadataSource, /formatMobile13SmsTimestamp\(message\.dateKey/);
    assert.match(metadataSource, /message\.side === 'out'/);
    assert.doesNotMatch(metadataSource, /DoubleCheckIcon|EncryptionLockIcon|showSmsLabel|showChecks|showLock/);
    assert.doesNotMatch(bubbleSource, /className="w-5 shrink-0 grow-0"/);
    assert.match(bubbleSource, /formatMobile13SmsTimestamp\(message\.dateKey/);
});

test('SMS tails appear only for single and final grouped messages', () => {
    assert.match(bubbleSource, /const isLastInGroup = groupPosition === 'single' \|\| groupPosition === 'last'/);
    assert.match(bubbleSource, /groupPosition === 'first' \|\| groupPosition === 'middle'/);
    assert.match(bubbleSource, /isLastInGroup \? \(/);
    assert.match(bubbleSource, /<OutgoingBubbleTail color=\{backgroundColor\} \/>/);
    assert.match(bubbleSource, /<BubbleTail side="left" color=\{backgroundColor\} \/>/);
});

test('received and outgoing tails use smooth, correctly oriented SVG geometry', () => {
    assert.match(bubbleSource, /function BubbleTail\(\{ side, color \}/);
    assert.match(bubbleSource, /function OutgoingBubbleTail\(\{ color \}/);
    assert.match(bubbleSource, /left-\[1px\]/);
    assert.match(bubbleSource, /right-\[1px\]/);
    assert.equal((bubbleSource.match(/bottom-\[-8px\]/g) ?? []).length, 3);
    assert.match(bubbleSource, /width="19" height="17"/);
    assert.match(bubbleSource, /preserveAspectRatio="xMidYMid meet"/);
    assert.equal((bubbleSource.match(/fill="currentColor"/g) ?? []).length, 3);
    assert.equal((bubbleSource.match(/pointer-events-none/g) ?? []).length, 3);
    assert.equal((bubbleSource.match(/z-0/g) ?? []).length, 3);
    assert.doesNotMatch(bubbleSource, /scale-y-\[-1\]|rounded-bl-none|rounded-br-none/);
    assert.doesNotMatch(bubbleSource, /opacity="0\.13"|fill="#000000"/);
});
