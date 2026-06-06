import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('WhatsappConversation inserts a DayChip when the message date key changes', () => {
    const source = readFileSync(new URL('./WhatsappConversation.tsx', import.meta.url), 'utf8');

    assert.match(source, /currentDateKey/);
    assert.match(source, /previousDateKey/);
    assert.match(source, /currentDateKey !== previousDateKey/);
    assert.match(source, /getDayChipTextForDate\(currentDateKey, dayChipReference\)/);
});

test('WhatsappConversation normalizes generated message time and outgoing status', () => {
    const source = readFileSync(new URL('./WhatsappConversation.tsx', import.meta.url), 'utf8');

    assert.match(source, /formatWhatsappTimeValue\(msg\.time\)/);
    assert.match(source, /msg\.side === 'out' \? \(?msg\.status \?\? messageStatus\)? : msg\.status/);
});

test('WhatsappConversation randomizes the initial scroll position when the conversation overflows', () => {
    const source = readFileSync(new URL('./WhatsappConversation.tsx', import.meta.url), 'utf8');

    assert.match(source, /useRef/);
    assert.match(source, /useEffect/);
    assert.match(source, /scrollHeight <= clientHeight/);
    assert.match(source, /scrollTop = Math\.round/);
    assert.match(source, /Math\.random\(\)/);
});

test('WhatsappConversation renders eight and nine digit numbers as WhatsApp-style links', () => {
    const source = readFileSync(new URL('./WhatsappConversation.tsx', import.meta.url), 'utf8');

    assert.match(source, /DOCUMENT_NUMBER_PATTERN = \/\\d\{8,9\}\/g/);
    assert.match(source, /href="#"/);
    assert.match(source, /target="_blank"/);
    assert.match(source, /rel="noopener noreferrer"/);
    assert.match(source, /text-\[#1B8755\]/);
    assert.match(source, /segoe-ui-negrita/);
});

test('WhatsappConversation renders text wrapped in single asterisks as strong text', () => {
    const source = readFileSync(new URL('./WhatsappConversation.tsx', import.meta.url), 'utf8');

    assert.match(source, /STRONG_TEXT_PATTERN = \/\\\*\(\[\^\*\]\+\?\)\\\*\/g/);
    assert.match(source, /function renderFormattedLine/);
    assert.match(source, /<strong key=\{`strong-text-\$\{lineIndex\}-\$\{matchIndex\}`\} className="segoe-ui-negrita">/);
    assert.match(source, /renderFormattedLine\(line, idx\)/);
});
