import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveValidWhatsappAvatarImageSrc } from './WhatsappAvatarImageSrc.ts';

test('resolveValidWhatsappAvatarImageSrc accepts png image paths and object URLs', () => {
    assert.equal(resolveValidWhatsappAvatarImageSrc('/storage/contact-images/1/12345678.png'), '/storage/contact-images/1/12345678.png');
    assert.equal(resolveValidWhatsappAvatarImageSrc('https://example.com/12345678.png?cache=1'), 'https://example.com/12345678.png?cache=1');
    assert.equal(resolveValidWhatsappAvatarImageSrc('  blob:http://localhost/avatar-preview  '), 'blob:http://localhost/avatar-preview');
});

test('resolveValidWhatsappAvatarImageSrc rejects non-image or malformed values', () => {
    assert.equal(resolveValidWhatsappAvatarImageSrc('12345678.png'), null);
    assert.equal(resolveValidWhatsappAvatarImageSrc('/storage/contact-images/1/12345678.jpg'), null);
    assert.equal(resolveValidWhatsappAvatarImageSrc('data:image/png;base64,YXZhdGFy'), null);
    assert.equal(resolveValidWhatsappAvatarImageSrc('javascript:alert(1).png'), null);
});
