import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const footerPath = resolve(dirname(fileURLToPath(import.meta.url)), 'SmsMobileInputBar.tsx');
const glassPillPath = resolve(dirname(fileURLToPath(import.meta.url)), '../sms-header/SmsHeaderGlassPill.tsx');
const headerPath = resolve(dirname(fileURLToPath(import.meta.url)), '../sms-header/SmsMobileHeader.tsx');
const contactPillPath = resolve(dirname(fileURLToPath(import.meta.url)), '../sms-header/SmsHeaderContactPill.tsx');

test('mobile 13 SMS dark glass is shared by footer and header pills', () => {
    const footerSource = readFileSync(footerPath, 'utf8');
    const glassSource = readFileSync(glassPillPath, 'utf8');

    assert.equal((footerSource.match(/darkComposerMaterial\b/g) ?? []).length, 2);
    assert.match(readFileSync(headerPath, 'utf8'), /<SmsHeaderGlassPill themeMode=\{themeMode\} darkComposerMaterial/);
    assert.match(readFileSync(contactPillPath, 'utf8'), /<SmsHeaderGlassPill[^>]*darkComposerMaterial/);
    assert.match(glassSource, /isDark && darkComposerMaterial/);
    assert.match(glassSource, /background: 'linear-gradient\(180deg, rgba\(37,37,39,0\.58\) 0%, rgba\(31,31,33,0\.52\) 50%, rgba\(35,35,37,0\.46\) 100%\)'/);
    assert.match(glassSource, /backdropFilter: 'blur\(10px\) saturate\(1\.02\)'/);
    assert.match(glassSource, /WebkitBackdropFilter: 'blur\(10px\) saturate\(1\.02\)'/);
    assert.match(glassSource, /inset 0 1px 0 rgba\(255,255,255,0\.035\)/);
    assert.doesNotMatch(glassSource.match(/const darkComposerSurface:[\s\S]*?\n\s*};/)?.[0] ?? '', /\bopacity:|boxShadow: '0 [2-9]px/);
});

test('mobile 13 SMS composer floats above sharp, unobscured messages', () => {
    const source = readFileSync(footerPath, 'utf8');

    assert.match(source, /absolute inset-x-0 bottom-0 z-20/);
    assert.match(source, /pointer-events-none/);
    assert.match(source, /pointer-events-auto/);
    assert.match(readFileSync(glassPillPath, 'utf8'), /contentClassName\?: string/);
    assert.equal((source.match(/contentClassName="w-full"/g) ?? []).length, 2);
    assert.match(source, /import \{ SmsHeaderGlassPill \} from '\.\.\/sms-header\/SmsHeaderGlassPill'/);
    assert.equal((source.match(/<SmsHeaderGlassPill\b/g) ?? []).length, 2);
    assert.match(source, /aria-label="Agregar"[\s\S]*?<\/SmsHeaderGlassPill>/);
    assert.match(source, /<SmsHeaderGlassPill[\s\S]*?aria-label="Mensaje de texto • SMS"/);
    assert.doesNotMatch(source, /backdropFilter|WebkitBackdropFilter/);
    assert.match(source, /Mensaje de texto • SMS/);
    assert.match(source, /isDark \? 'text-\[#777777\]' : 'text-\[#B8B8B8\]'/);
    assert.match(source, /placeholder=""/);
    assert.doesNotMatch(source, /aria-label="Emoji"/);
    assert.doesNotMatch(source, /aria-label="Galería"/);
});
