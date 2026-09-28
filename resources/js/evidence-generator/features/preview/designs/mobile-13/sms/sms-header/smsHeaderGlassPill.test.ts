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
    assert.match(glassSource, /w-\[72%\]/);
    assert.match(glassSource, /backdropFilter: 'blur\(8px\)'/);
    assert.match(glassSource, /WebkitBackdropFilter: 'blur\(8px\)'/);
});

test('mobile 13 SMS dark glass keeps its geometry and uses a subtle translucent surface', () => {
    assert.match(glassSource, /backgroundColor: 'rgba\(30,30,32,0\.78\)'/);
    assert.match(glassSource, /borderColor: 'rgba\(255,255,255,0\.08\)'/);
    assert.match(glassSource, /boxShadow: 'inset 0 0 0\.5px rgba\(255,255,255,0\.14\), inset 0 -0\.5px 0\.5px rgba\(255,255,255,0\.10\), inset 0\.5px 0 0\.5px rgba\(255,255,255,0\.07\), inset -0\.5px 0 0\.5px rgba\(255,255,255,0\.07\)'/);
    assert.match(glassSource, /rounded-full border \$\{className\}/);
    assert.match(glassSource, /rgba\(255,255,255,0\.78\) 0%/);
    assert.doesNotMatch(glassSource, /opacity:\s*0\.[0-9]+/);
});

test('back control remains a single interactive button inside the floating surface', () => {
    assert.match(headerSource, /pointer-events-auto/);
    assert.equal((headerSource.match(/<button\b/g) ?? []).length, 1);
    assert.match(headerSource, /M21 4L6 20L21 36/);
});

test('contact keeps dynamic identity and anonymous SMS avatar uses the local iOS-style default', () => {
    assert.match(contactSource, /getSmsHeaderDisplayValue\(data\.nombre, data\.telefono\)/);
    assert.match(avatarSource, /resolveSmsHeaderInitial\(displayName\)/);
    assert.match(avatarSource, /const shouldUseDefaultAnonymousAvatar = normalizedName === ['"]['"]?/);
    assert.match(avatarSource, /<Mobile13SmsDefaultAvatar\s*\/>/);
    assert.match(avatarSource, /linear-gradient\(180deg, #A9B9E0/);
    assert.match(avatarSource, /#A9B9E0/);
    assert.match(avatarSource, /#807CA9/);
    assert.match(avatarSource, /fill="#FFFFFF"/);
    assert.doesNotMatch(avatarSource, /WhatsappAvatarImage/);
    assert.match(avatarSource, /size-\[50px\]/);
    assert.match(contactSource, /-mt-\[5px\]/);
    assert.match(glassSource, /themeMode === 'dark'/);
});
