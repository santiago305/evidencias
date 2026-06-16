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
    assert.equal(existsSync(resolve(designsDir, 'mobile-2', 'Mobile2PreviewFrame.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'mobile-2', 'whatsapp', 'PreviewMobile2Whatsapp.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'mobile-2', 'sms', 'PreviewMobile2Sms.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'mobile-2', 'calls', 'design-1', 'PreviewMobile2CallDesign1.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'mobile-2', 'calls', 'design-2', 'PreviewMobile2CallDesign2.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'mobile-3', 'Mobile1PreviewFrame.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'mobile-3', 'whatsapp', 'PreviewMobile1Whatsapp.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'mobile-3', 'sms', 'PreviewMobile1Sms.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'mobile-3', 'calls', 'design-1', 'PreviewMobile1CallDesign1.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'mobile-3', 'calls', 'design-2', 'PreviewMobile1CallDesign2.tsx')), true);
});

test('preview channel entry points use design folders directly', () => {
    const previewChannelsSource = readFileSync(resolve(previewDir, 'components', 'PreviewChannels.tsx'), 'utf8');
    const desktopSource = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'PreviewWhatsappDesktop.tsx'), 'utf8');
    const mobileSource = readFileSync(resolve(designsDir, 'mobile-2', 'whatsapp', 'PreviewMobile2Whatsapp.tsx'), 'utf8');

    assert.match(previewChannelsSource, /from ["']\.\.\/designs\/whatsapp-desktop["']/);
    assert.match(previewChannelsSource, /from ["']\.\.\/designs\/mobile-2["']/);
    assert.match(previewChannelsSource, /from ["']\.\.\/designs\/mobile-3["']/);
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

test('desktop WhatsApp scale applies to content without scaling the Windows tray bar', () => {
    const desktopPreviewBlock = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'PreviewBlockWhatsapp.tsx'), 'utf8');
    const desktopSource = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'PreviewWhatsappDesktop.tsx'), 'utf8');

    assert.match(desktopSource, /whatsappDesktopScale/);
    assert.match(desktopPreviewBlock, /WHATSAPP_DESKTOP_SCALE_FACTORS/);
    assert.match(desktopPreviewBlock, /WHATSAPP_RIGHT_ASIDE_WIDTHS/);
    assert.match(desktopPreviewBlock, /80:\s*1/);
    assert.match(desktopPreviewBlock, /100:\s*1\.2/);
    assert.match(desktopPreviewBlock, /desktopScaledLayoutSize/);
    assert.match(desktopPreviewBlock, /width:\s*desktopScaledLayoutSize/);
    assert.match(desktopPreviewBlock, /WHATSAPP_RIGHT_ASIDE_WIDTHS\[whatsappDesktopScale\]\s*\/\s*desktopScaleFactor/);
    assert.match(desktopPreviewBlock, /widthPx=\{rightAsideWidthPx\}/);
    assert.match(desktopPreviewBlock, /overflow-hidden/);
    assert.match(desktopPreviewBlock, /transformOrigin:\s*['"]top left['"]/);
    assert.ok(desktopPreviewBlock.indexOf('transform: `scale(${desktopScaleFactor})`') < desktopPreviewBlock.indexOf('<WindowsTrayBar'));
});

test('whatsapp typography platform is configured at the preview entry point', () => {
    const typographySource = readFileSync(resolve(designsDir, 'whatsappTypography.ts'), 'utf8');
    const mobile1Source = readFileSync(resolve(designsDir, 'mobile-1', 'whatsapp', 'PreviewMobile1Whatsapp.tsx'), 'utf8');
    const mobile2Source = readFileSync(resolve(designsDir, 'mobile-2', 'whatsapp', 'PreviewMobile2Whatsapp.tsx'), 'utf8');
    const mobile3Source = readFileSync(resolve(designsDir, 'mobile-3', 'whatsapp', 'PreviewMobile1Whatsapp.tsx'), 'utf8');
    const desktopSource = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'PreviewWhatsappDesktop.tsx'), 'utf8');
    const appCssSource = readFileSync(resolve(designsDir, '..', '..', '..', '..', '..', 'css', 'app.css'), 'utf8');

    assert.match(typographySource, /type WhatsappTypographyPlatform = 'android' \| 'ios' \| 'windows';/);
    assert.match(mobile1Source, /const whatsappTypographyPlatform: WhatsappTypographyPlatform = 'android';/);
    assert.match(mobile1Source, /data-whatsapp-platform={whatsappTypographyPlatform}/);
    assert.match(mobile2Source, /const whatsappTypographyPlatform: WhatsappTypographyPlatform = 'android';/);
    assert.match(mobile2Source, /data-whatsapp-platform={whatsappTypographyPlatform}/);
    assert.match(mobile3Source, /const whatsappTypographyPlatform: WhatsappTypographyPlatform = 'android';/);
    assert.match(mobile3Source, /data-whatsapp-platform={whatsappTypographyPlatform}/);
    assert.match(desktopSource, /const whatsappTypographyPlatform: WhatsappTypographyPlatform = 'windows';/);
    assert.match(desktopSource, /data-whatsapp-platform={whatsappTypographyPlatform}/);
    assert.match(appCssSource, /\[data-whatsapp-platform='android'\]/);
    assert.match(appCssSource, /\[data-whatsapp-platform='ios'\]/);
    assert.match(appCssSource, /\[data-whatsapp-platform='windows'\]/);
    assert.match(appCssSource, /--whatsapp-font-family/);
});
