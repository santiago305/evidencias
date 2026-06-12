import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveValidWhatsappAvatarImageSrc } from './WhatsappAvatarImageSrc.ts';

test('resolveValidWhatsappAvatarImageSrc accepts supported base64 image data URLs', () => {
    const imageDataUrl = `data:image/jpeg;base64,${Buffer.from('avatar').toString('base64')}`;

    assert.equal(resolveValidWhatsappAvatarImageSrc(imageDataUrl), imageDataUrl);
    assert.equal(resolveValidWhatsappAvatarImageSrc(`  ${imageDataUrl}  `), imageDataUrl);
});

test('resolveValidWhatsappAvatarImageSrc rejects non-image or malformed values', () => {
    assert.equal(resolveValidWhatsappAvatarImageSrc('not-base64'), null);
    assert.equal(resolveValidWhatsappAvatarImageSrc('data:text/plain;base64,YXZhdGFy'), null);
    assert.equal(resolveValidWhatsappAvatarImageSrc('data:image/jpeg;base64,not valid base64'), null);
    assert.equal(resolveValidWhatsappAvatarImageSrc('data:image/jpeg;base64,abc'), null);
});
