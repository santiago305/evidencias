import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('WhatsApp preview routes visual surfaces through component folders', () => {
    const conversationSource = readFileSync(new URL('./WhatsappConversation.tsx', import.meta.url), 'utf8');
    const inputBarSource = readFileSync(new URL('./WhatsappInputBar.tsx', import.meta.url), 'utf8');
    const backgroundSource = readFileSync(new URL('./whatsapp-background/WhatsappConversationBackground.tsx', import.meta.url), 'utf8');
    const piecesSource = readFileSync(new URL('./WhatsappPieces.tsx', import.meta.url), 'utf8');
    const mobileTextBubbleSource = readFileSync(new URL('./whatsapp-bubbles/WhatsappMobileTextBubble.tsx', import.meta.url), 'utf8');
    const desktopTextBubbleSource = readFileSync(new URL('./whatsapp-bubbles/WhatsappDesktopTextBubble.tsx', import.meta.url), 'utf8');
    const mobilePreviewHeaderSource = readFileSync(new URL('../components/MobilePreviewHeader.tsx', import.meta.url), 'utf8');

    assert.match(conversationSource, /from '\.\/whatsapp-background\/WhatsappConversationBackground'/);
    assert.match(conversationSource, /from '\.\/whatsapp-footer'/);
    assert.match(conversationSource, /from '\.\/whatsapp-bubbles'/);
    assert.match(conversationSource, /<WhatsappConversationBackground themeMode=\{themeMode\} \/>/);

    assert.match(inputBarSource, /from '\.\/whatsapp-footer\/WhatsappMobileInputBar'/);
    assert.match(inputBarSource, /from '\.\/whatsapp-footer\/WhatsappDesktopInputBar'/);
    assert.match(inputBarSource, /deviceMode === 'mobile'/);

    assert.match(backgroundSource, /from '\.\/WhatsappLightConversationBackground'/);
    assert.match(backgroundSource, /from '\.\/WhatsappDarkConversationBackground'/);
    assert.match(backgroundSource, /themeMode === 'dark'/);

    assert.match(piecesSource, /from "\.\/whatsapp-bubbles\/WhatsappMobileTextBubble"/);
    assert.match(piecesSource, /from "\.\/whatsapp-bubbles\/WhatsappDesktopTextBubble"/);
    assert.match(piecesSource, /deviceMode === "mobile"/);
    assert.doesNotMatch(desktopTextBubbleSource, /WhatsappMobileTextBubble/);
    assert.match(mobileTextBubbleSource, /px-3/);
    assert.match(desktopTextBubbleSource, /px-15\.75/);

    assert.match(mobilePreviewHeaderSource, /from '\.\/mobile-preview-header'/);
});
