import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('mobile 13 SMS shows conversation messages without the save contact suggestion', () => {
    const source = readFileSync(new URL('./SmsConversation.tsx', import.meta.url), 'utf8');

    assert.doesNotMatch(source, /Mobile13SmsSaveContactCard/);
    assert.match(source, /messages\.map\(\(message, index\)/);
    assert.match(source, /<SmsMobileInputBar/);
});

test('mobile 13 SMS keeps the initial header clearance inside the scrolling content', () => {
    const source = readFileSync(new URL('./SmsConversation.tsx', import.meta.url), 'utf8');

    assert.match(source, /SMS_INITIAL_CONTENT_OFFSET/);
    assert.match(source, /data-mobile13-sms-scroll-area="true"[\s\S]*?overflow-y-auto/);
    assert.match(source, /style=\{\{ paddingTop: `\$\{SMS_INITIAL_CONTENT_OFFSET\}px` \}\}/);
});

test('mobile 13 SMS starts message metadata hidden until a bubble is clicked', () => {
    const source = readFileSync(new URL('./SmsConversation.tsx', import.meta.url), 'utf8');

    assert.match(source, /showMetadata=\{false\}/);
});

test('mobile 13 SMS hides quick replies while the input is focused', () => {
    const conversationSource = readFileSync(new URL('./SmsConversation.tsx', import.meta.url), 'utf8');
    const inputSource = readFileSync(new URL('./sms-footer/SmsMobileInputBar.tsx', import.meta.url), 'utf8');

    assert.match(conversationSource, /isComposerFocused/);
    assert.match(conversationSource, /onInputFocusChange=\{\(isFocused\) => setIsComposerFocused\(isFocused\)\}/);
    assert.match(inputSource, /onFocus=\{\(\) => onInputFocusChange\?\.\(true\)\}/);
    assert.match(inputSource, /onBlur=\{\(\) => onInputFocusChange\?\.\(false\)\}/);
});

test('mobile 13 SMS always shows the SMS conversation title', () => {
    const source = readFileSync(new URL('./SmsConversation.tsx', import.meta.url), 'utf8');

    assert.match(source, /Mensajes de texto • SMS/);
    assert.doesNotMatch(source, /buildSmsConversationHeader|Chat RCS con|EncryptionLockIcon/);
});
