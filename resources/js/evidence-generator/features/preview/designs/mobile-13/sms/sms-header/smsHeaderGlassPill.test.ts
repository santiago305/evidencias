import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const source = (name: string) => {
    const file = new URL(name, import.meta.url);

    return existsSync(file) ? readFileSync(file, 'utf8') : '';
};
const headerSource = source('./SmsMobileHeader.tsx');
const glassSource = source('./SmsHeaderGlassPill.tsx');
const contactSource = source('./SmsHeaderContactPill.tsx');
const avatarSource = source('./SmsHeaderAvatar.tsx');

test('both SMS header pills use one glass surface with non-interactive, separate reflections', () => {
    assert.match(headerSource, /<SmsHeaderGlassPill[\s\S]*?themeMode=\{themeMode\}/);
    assert.match(contactSource, /<SmsHeaderGlassPill[\s\S]*?themeMode=\{themeMode\}/);
    assert.match(glassSource, /aria-hidden="true"/g);
    assert.equal((glassSource.match(/aria-hidden="true"/g) ?? []).length, 2);
    assert.equal((glassSource.match(/pointer-events-none/g) ?? []).length, 2);
    assert.match(glassSource, /top-\[1px\]/);
    assert.match(glassSource, /bottom-\[1px\]/);
    assert.match(glassSource, /w-\[68%\]/);
    assert.match(glassSource, /backdropFilter: 'blur\(12px\) saturate\(1\.05\)'/);
    assert.match(glassSource, /WebkitBackdropFilter: 'blur\(12px\) saturate\(1\.05\)'/);
});

test('mobile 13 SMS header glass stays translucent and preserves the dense-glass compatibility mode', () => {
    assert.match(glassSource, /rgba\(38,38,40,0\.78\).*rgba\(30,30,32,0\.78\).*rgba\(32,32,34,0\.78\)/);
    assert.match(glassSource, /rgba\(255,255,255,0\.46\).*rgba\(254,254,255,0\.40\).*rgba\(249,249,251,0\.34\)/);
    assert.match(glassSource, /rgba\(37,37,39,0\.58\).*rgba\(31,31,33,0\.52\).*rgba\(35,35,37,0\.46\)/);
    assert.match(glassSource, /backdropFilter: 'blur\(10px\) saturate\(1\.02\)'/);
    assert.match(glassSource, /WebkitBackdropFilter: 'blur\(4px\) saturate\(1\.02\)'/);
    assert.match(glassSource, /rgba\(19,19,21,0\.88\).*rgba\(12,12,14,0\.86\).*rgba\(15,15,17,0\.84\)/);
    assert.match(glassSource, /rgba\(255,255,255,0\.88\).*rgba\(255,255,255,0\.84\).*rgba\(250,250,252,0\.82\)/);
    assert.match(glassSource, /blur\(16px\) saturate\(1\.05\)/);
    assert.match(glassSource, /rounded-full border \$\{className\}/);
    assert.doesNotMatch(glassSource, /opacity:\s*0\.[0-9]+/);
});

test('back control remains a single interactive button inside the floating surface', () => {
    assert.match(headerSource, /pointer-events-auto/);
    assert.equal((headerSource.match(/<button\b/g) ?? []).length, 1);
    assert.match(headerSource, /M21 4L6 20L21 36/);
});

test('contact displays the phone and SMS avatar always uses the local iOS-style default', () => {
    assert.match(contactSource, /resolveSmsPhoneDisplay\(data, formatMobile13SmsPhone\)/);
    assert.doesNotMatch(avatarSource, /data\.nombre|resolveSmsHeaderInitial|initial/);
    assert.match(avatarSource, /<Mobile13SmsDefaultAvatar\s*\/>/);
    assert.match(avatarSource, /linear-gradient\(180deg, #A9B9E0/);
    assert.match(avatarSource, /#A9B9E0/);
    assert.match(avatarSource, /#7F8CC6/);
    assert.match(avatarSource, /fill="#FFFFFF"/);
    assert.doesNotMatch(avatarSource, /WhatsappAvatarImage/);
    assert.match(avatarSource, /size-\[50px\]/);
    assert.match(contactSource, /-mt-\[5px\]/);
    assert.match(glassSource, /themeMode === 'dark'/);
});
