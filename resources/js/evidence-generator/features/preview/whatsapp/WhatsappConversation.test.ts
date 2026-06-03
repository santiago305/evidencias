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
