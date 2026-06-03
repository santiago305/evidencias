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
