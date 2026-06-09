import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const designsDir = dirname(fileURLToPath(import.meta.url));
const previewDir = resolve(designsDir, '..');

test('preview designs are isolated by target design folder', () => {
    assert.equal(existsSync(resolve(previewDir, 'whatsapp')), false);
    assert.equal(existsSync(resolve(previewDir, 'components', 'MobilePreviewFooter.tsx')), false);
    assert.equal(existsSync(resolve(previewDir, 'components', 'MobilePreviewFrame.tsx')), false);
    assert.equal(existsSync(resolve(previewDir, 'components', 'MobilePreviewHeader.tsx')), false);

    assert.equal(existsSync(resolve(designsDir, 'whatsapp-desktop', 'PreviewWhatsappDesktop.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'whatsapp-desktop', 'whatsapp-header', 'WhatsappDesktopHeaderUser.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'whatsapp-desktop', 'whatsapp-footer', 'WhatsappDesktopInputBar.tsx')), true);

    assert.equal(existsSync(resolve(designsDir, 'mobile-1', 'Mobile1PreviewFrame.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'mobile-1', 'whatsapp', 'PreviewMobile1Whatsapp.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'mobile-1', 'sms', 'PreviewMobile1Sms.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'mobile-1', 'calls', 'design-1', 'PreviewMobile1CallDesign1.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'mobile-1', 'calls', 'design-2', 'PreviewMobile1CallDesign2.tsx')), true);
});

test('preview channel entry points use design folders directly', () => {
    const previewChannelsSource = readFileSync(resolve(previewDir, 'components', 'PreviewChannels.tsx'), 'utf8');
    const desktopSource = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'PreviewWhatsappDesktop.tsx'), 'utf8');
    const mobileSource = readFileSync(resolve(designsDir, 'mobile-1', 'whatsapp', 'PreviewMobile1Whatsapp.tsx'), 'utf8');

    assert.match(previewChannelsSource, /from ["']\.\.\/designs\/whatsapp-desktop["']/);
    assert.match(previewChannelsSource, /from ["']\.\.\/designs\/mobile-1["']/);
    assert.doesNotMatch(previewChannelsSource, /preview\/whatsapp|\.\.\/whatsapp/);
    assert.doesNotMatch(desktopSource, /preview\/whatsapp|\.\.\/\.\.\/whatsapp|deviceMode=/);
    assert.doesNotMatch(mobileSource, /preview\/whatsapp|\.\.\/\.\.\/\.\.\/whatsapp/);
});

test('desktop WhatsApp tray clock uses current Peru time instead of snapshot time', () => {
    const desktopPreviewBlock = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'PreviewBlockWhatsapp.tsx'), 'utf8');

    assert.match(desktopPreviewBlock, /PERU_TIME_ZONE = ['"]America\/Lima['"]/);
    assert.match(desktopPreviewBlock, /function WindowsTrayBar\(\{ profile \}: WindowsTrayBarProps\)/);
    assert.match(desktopPreviewBlock, /useCurrentPeruWindowsDateTime/);
    assert.doesNotMatch(desktopPreviewBlock, /parseLocalDateTime/);
    assert.doesNotMatch(desktopPreviewBlock, /<WindowsTrayBar[^>]*(trayTime|trayDate)=/);
});
