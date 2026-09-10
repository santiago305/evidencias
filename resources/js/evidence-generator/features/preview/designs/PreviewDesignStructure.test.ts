import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const designsDir = dirname(fileURLToPath(import.meta.url));
const previewDir = resolve(designsDir, '..');

function collectSourceFiles(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const entryPath = resolve(directory, entry.name);

        return entry.isDirectory() ? collectSourceFiles(entryPath) : [entryPath];
    });
}

test('preview designs are isolated by target design folder', () => {
    assert.equal(existsSync(resolve(previewDir, 'whatsapp')), false);
    assert.equal(existsSync(resolve(previewDir, 'components', 'MobilePreviewFooter.tsx')), false);
    assert.equal(existsSync(resolve(previewDir, 'components', 'MobilePreviewFrame.tsx')), false);
    assert.equal(existsSync(resolve(previewDir, 'components', 'MobilePreviewHeader.tsx')), false);

    assert.equal(existsSync(resolve(designsDir, 'whatsapp-desktop', 'PreviewWhatsappDesktop.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'whatsapp-desktop', 'whatsapp-header', 'WhatsappDesktopHeaderUser.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'whatsapp-desktop', 'whatsapp-footer', 'WhatsappDesktopInputBar.tsx')), true);

    assert.equal(existsSync(resolve(designsDir, 'mobile-1', 'Mobile1PreviewFrame.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'mobile-2', 'Mobile2PreviewFrame.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'mobile-3', 'Mobile1PreviewFrame.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'mobile-4', 'Mobile4PreviewFrame.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'mobile-4', 'whatsapp', 'PreviewMobile4Whatsapp.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'mobile-5', 'mobile5Colors.ts')), true);
    assert.equal(existsSync(resolve(designsDir, 'mobile-6', 'Mobile6PreviewFrame.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'shared', 'whatsapp', 'whatsappPreviewRuntime.ts')), true);
    assert.equal(existsSync(resolve(designsDir, 'shared', 'sms', 'SmsConversation.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'shared', 'mobile-preview', 'MobileWhatsappPreview.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'shared', 'mobile-preview', 'MobileSmsPreview.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'shared', 'mobile-preview', 'MobileCallPreview.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'shared', 'mobile-preview', 'buildMobilePreviewRegistry.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'mobilePreviewProfiles.tsx')), true);

    for (const designKey of ['mobile-1', 'mobile-2', 'mobile-3']) {
        assert.equal(existsSync(resolve(designsDir, designKey, 'whatsapp', 'PreviewMobile1Whatsapp.tsx')), false);
        assert.equal(existsSync(resolve(designsDir, designKey, 'sms', 'PreviewMobile1Sms.tsx')), false);
    }
});

test('mobile 6 owns its Mobile 3 replica without importing Mobile 3', () => {
    const mobile6Directory = resolve(designsDir, 'mobile-6');
    const profilesSource = readFileSync(resolve(designsDir, 'mobilePreviewProfiles.tsx'), 'utf8');
    const frameRenderersSource = readFileSync(resolve(designsDir, 'shared', 'mobile-preview', 'frameRenderers.tsx'), 'utf8');

    for (const relativePath of [
        'Mobile6PreviewFrame.tsx',
        'Mobile6PreviewHeader.tsx',
        'Mobile6PreviewFooter.tsx',
        'whatsapp/whatsappVisualAdapter.ts',
        'whatsapp/WhatsappPieces.tsx',
        'whatsapp/whatsapp-header/WhatsappMobileHeaderUser.tsx',
        'whatsapp/whatsapp-bubbles/WhatsappMobileTextBubble.tsx',
        'whatsapp/whatsapp-background/WhatsappConversationBackground.tsx',
        'whatsapp/whatsapp-footer/WhatsappMobileInputBar.tsx',
    ]) {
        assert.equal(existsSync(resolve(mobile6Directory, relativePath)), true, `Missing ${relativePath}`);
    }

    const mobile6Source = collectSourceFiles(mobile6Directory)
        .map((filePath) => readFileSync(filePath, 'utf8'))
        .join('\n');

    assert.doesNotMatch(mobile6Source, /mobile-3|Mobile1Preview|mobile3Whatsapp/);
    assert.match(profilesSource, /from ['"]\.\/mobile-6\//);
    assert.match(profilesSource, /'mobile-6':\s*\{/);
    assert.match(profilesSource, /renderFrame: renderMobile6Frame/);
    assert.match(profilesSource, /whatsapp: mobile6WhatsappFamily/);
    assert.match(profilesSource, /sms: \{ variant: 'mobile-6', showVideoCall: true \}/);
    assert.doesNotMatch(profilesSource, /'mobile-6':[\s\S]*?mobile3WhatsappFamily/);
    assert.match(frameRenderersSource, /from ['"]\.\.\/\.\.\/mobile-6\/Mobile6PreviewFrame['"]/);
});

test('preview channel entry points use design folders directly', () => {
    const previewChannelsSource = readFileSync(resolve(previewDir, 'components', 'PreviewChannels.tsx'), 'utf8');
    const desktopSource = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'PreviewWhatsappDesktop.tsx'), 'utf8');
    const profilesSource = readFileSync(resolve(designsDir, 'mobilePreviewProfiles.tsx'), 'utf8');
    const sharedWhatsappSource = readFileSync(resolve(designsDir, 'shared', 'mobile-preview', 'MobileWhatsappPreview.tsx'), 'utf8');

    assert.match(previewChannelsSource, /from ["']\.\.\/designs\/whatsapp-desktop["']/);
    assert.match(previewChannelsSource, /mobilePreviewRegistry/);
    assert.match(previewChannelsSource, /mobilePreviewProfiles/);
    assert.doesNotMatch(previewChannelsSource, /designs\/mobile-[123]["']/);
    assert.doesNotMatch(desktopSource, /preview\/whatsapp|\.\.\/\.\.\/whatsapp|deviceMode=/);
    assert.match(profilesSource, /satisfies Record<MobileDesignKey, MobilePreviewDesignProfile>/);
    assert.match(sharedWhatsappSource, /buildWhatsappPreviewRuntime/);
    assert.match(sharedWhatsappSource, /WhatsappConversation/);
});

test('mobile 4 is selected explicitly for all supported mobile channels', () => {
    const previewChannelsSource = readFileSync(resolve(previewDir, 'components', 'PreviewChannels.tsx'), 'utf8');

    assert.match(previewChannelsSource, /mobilePreviewRegistry/);
    assert.match(readFileSync(resolve(designsDir, 'mobilePreviewProfiles.tsx'), 'utf8'), /PreviewMobile4Whatsapp/);
    assert.match(readFileSync(resolve(designsDir, 'mobilePreviewProfiles.tsx'), 'utf8'), /'mobile-4':\s*\{/);
    assert.match(readFileSync(resolve(designsDir, 'mobilePreviewProfiles.tsx'), 'utf8'), /kind: 'custom'/);
});

test('mobile 5 is configured through the shared profile registry without copied entrypoints', () => {
    const profilesSource = readFileSync(resolve(designsDir, 'mobilePreviewProfiles.tsx'), 'utf8');
    const registrySource = readFileSync(resolve(designsDir, 'shared', 'mobile-preview', 'buildMobilePreviewRegistry.tsx'), 'utf8');

    assert.match(profilesSource, /mobile5WhatsappFamily/);
    assert.match(profilesSource, /'mobile-5':\s*\{/);
    assert.match(profilesSource, /renderFrame: renderMobile3Frame/);
    assert.match(profilesSource, /sms: mobile3SmsFamily/);
    assert.match(profilesSource, /call: \{ missedSpacingVariant: 'standard' \}/);
    assert.match(registrySource, /buildMobilePreviewRegistry/);
    assert.equal(existsSync(resolve(designsDir, 'mobile-5', 'whatsapp', 'PreviewMobile5Whatsapp.tsx')), false);
    assert.equal(existsSync(resolve(designsDir, 'mobile-5', 'sms', 'PreviewMobile5Sms.tsx')), false);
    assert.equal(existsSync(resolve(designsDir, 'mobile-5', 'calls', 'design-1', 'PreviewMobile5CallDesign1.tsx')), false);
});

test('shared WhatsApp and Calls implementations are the channel sources of truth', () => {
    assert.equal(existsSync(resolve(designsDir, 'shared', 'whatsapp', 'WhatsappConversation.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'shared', 'whatsapp', 'buildWhatsappConversation.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'shared', 'calls', 'IncomingCallContent.tsx')), true);
    assert.equal(existsSync(resolve(designsDir, 'shared', 'calls', 'MissedCallContent.tsx')), true);
    assert.doesNotMatch(readFileSync(resolve(previewDir, 'components', 'PreviewChannels.tsx'), 'utf8'), /if \(mobileDesignKey ===/);
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
    assert.match(desktopPreviewBlock, /WHATSAPP_DESKTOP_CAPTURE_MAX_WIDTHS/);
    assert.match(desktopPreviewBlock, /transformOrigin:\s*['"]top left['"]/);
    assert.ok(desktopPreviewBlock.indexOf('transform: `scale(${desktopScaleFactor})`') < desktopPreviewBlock.indexOf('<WindowsTrayBar'));
});

test('desktop WhatsApp capture max width follows the selected page scale', () => {
    const desktopPreviewBlock = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'PreviewBlockWhatsapp.tsx'), 'utf8');

    assert.match(desktopPreviewBlock, /WHATSAPP_DESKTOP_CAPTURE_MAX_WIDTHS/);
    assert.match(desktopPreviewBlock, /const captureMaxWidthPx = WHATSAPP_DESKTOP_CAPTURE_MAX_WIDTHS\[whatsappDesktopScale\];/);
    assert.match(desktopPreviewBlock, /maxWidth: `\$\{captureMaxWidthPx\}px`/);
    assert.doesNotMatch(desktopPreviewBlock, /max-w-320/);
});

test('desktop WhatsApp capture frame contract stays frontend local', () => {
    const captureFrameSource = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'desktopCaptureFrame.ts'), 'utf8');
    const typesSource = readFileSync(resolve(designsDir, '..', '..', '..', 'types.ts'), 'utf8');

    assert.match(captureFrameSource, /export type WhatsappDesktopCaptureMode/);
    assert.match(captureFrameSource, /'near-full'/);
    assert.match(captureFrameSource, /'chat-main'/);
    assert.match(captureFrameSource, /'wide-chat'/);
    assert.match(captureFrameSource, /'aside-mostly-visible'/);
    assert.match(captureFrameSource, /'aside-wide-visible'/);
    assert.match(captureFrameSource, /'chat-with-aside-slice'/);
    assert.match(captureFrameSource, /'chat-with-deep-aside-slice'/);
    assert.match(captureFrameSource, /'chat-with-tray-slice'/);
    assert.match(captureFrameSource, /'tray-heavy'/);
    assert.match(captureFrameSource, /'left-offset'/);
    assert.match(captureFrameSource, /'tight-conversation'/);
    assert.match(captureFrameSource, /'slightly-cropped'/);
    assert.match(captureFrameSource, /export interface WhatsappDesktopCaptureFrame/);
    assert.match(captureFrameSource, /version: 'desktop-capture-v1';/);
    assert.match(captureFrameSource, /cropTopPx: number;/);
    assert.match(captureFrameSource, /cropRightPx: number;/);
    assert.match(captureFrameSource, /cropBottomPx: number;/);
    assert.match(captureFrameSource, /cropLeftPx: number;/);
    assert.match(captureFrameSource, /asideSlicePx: number;/);
    assert.match(captureFrameSource, /traySlicePx: number;/);
    assert.doesNotMatch(typesSource, /desktopCaptureFrame/);
    assert.doesNotMatch(typesSource, /WhatsappDesktopCaptureFrame/);
});

test('desktop WhatsApp capture frame is generated at runtime without persisted state', () => {
    const captureFrameSource = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'desktopCaptureFrame.ts'), 'utf8');

    assert.match(captureFrameSource, /export function buildRandomDesktopCaptureFrame/);
    assert.match(captureFrameSource, /export function buildDesktopCaptureFrameStyle/);
    assert.match(captureFrameSource, /crypto\.getRandomValues/);
    assert.match(captureFrameSource, /Math\.random\(\)/);
    assert.match(captureFrameSource, /MAX_RANDOM_ATTEMPTS/);
    assert.match(captureFrameSource, /const MAX_RANDOM_ATTEMPTS = 500;/);
    assert.match(captureFrameSource, /buildFallbackCaptureFrame/);
    assert.match(captureFrameSource, /MIN_HEADER_VISIBLE_HEIGHT_PX/);
    assert.match(captureFrameSource, /MIN_MESSAGE_VISIBLE_HEIGHT_PX/);
    assert.match(captureFrameSource, /MIN_REQUIRED_RIGHT_ASIDE_IDENTITY_VISIBLE_HEIGHT_PX/);
    assert.match(captureFrameSource, /requiredRightAsideIdentityRect/);
    assert.match(captureFrameSource, /getIntersection/);
    assert.doesNotMatch(captureFrameSource, /createSeededRandom/);
    assert.doesNotMatch(captureFrameSource, /hashString/);
    assert.doesNotMatch(captureFrameSource, /previewSnapshot/);
    assert.doesNotMatch(captureFrameSource, /seedCode/);
    assert.doesNotMatch(captureFrameSource, /visualSeed/);
});

test('desktop WhatsApp exposes safe DOM markers for runtime capture framing', () => {
    const desktopPreviewBlock = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'PreviewBlockWhatsapp.tsx'), 'utf8');
    const desktopConversation = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'WhatsappConversation.tsx'), 'utf8');
    const desktopHeader = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'whatsapp-header', 'WhatsappDesktopHeaderUser.tsx'), 'utf8');
    const desktopRightAside = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'WhatsappRightAside.tsx'), 'utf8');

    assert.match(desktopPreviewBlock, /data-wa-desktop-content/);
    assert.match(desktopPreviewBlock, /data-wa-windows-tray/);
    assert.match(desktopConversation, /data-wa-conversation-root/);
    assert.match(desktopConversation, /data-wa-message-viewport/);
    assert.match(desktopConversation, /data-wa-input-bar/);
    assert.match(desktopHeader, /data-wa-header/);
    assert.match(desktopRightAside, /data-wa-right-aside/);
    assert.match(desktopRightAside, /data-wa-right-aside-identity/);
});

test('desktop WhatsApp capture id is an absolute overlay marker', () => {
    const desktopPreviewBlock = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'PreviewBlockWhatsapp.tsx'), 'utf8');

    assert.match(desktopPreviewBlock, /useRef<HTMLDivElement \| null>/);
    assert.match(desktopPreviewBlock, /data-capture-root="whatsapp-desktop"/);
    assert.match(desktopPreviewBlock, /relative flex h-full w-full flex-col overflow-hidden/);
    assert.match(desktopPreviewBlock, /id="CAPTURA"/);
    assert.match(desktopPreviewBlock, /data-capture-frame="whatsapp-desktop"/);
    assert.match(desktopPreviewBlock, /className="pointer-events-none absolute z-50"/);
    assert.match(desktopPreviewBlock, /style=\{captureFrameStyle\}/);
    assert.match(desktopPreviewBlock, /buildRandomDesktopCaptureFrame/);
    assert.match(desktopPreviewBlock, /buildDesktopCaptureFrameStyle/);
    assert.match(desktopPreviewBlock, /querySelector<HTMLElement>\('\[data-wa-header\]'\)/);
    assert.match(desktopPreviewBlock, /querySelector<HTMLElement>\('\[data-wa-message-viewport\]'\)/);
    assert.match(desktopPreviewBlock, /scheduleCaptureFrameRegeneration/);
    assert.doesNotMatch(desktopPreviewBlock, /<div\s+[^>]*data-capture-root="whatsapp-desktop"[^>]*id="CAPTURA"/);
    assert.doesNotMatch(desktopPreviewBlock, /<div\s+[^>]*id="CAPTURA"[^>]*data-capture-root="whatsapp-desktop"/);
});

test('desktop WhatsApp capture frame reacts to layout changes without persisted state', () => {
    const desktopPreviewBlock = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'PreviewBlockWhatsapp.tsx'), 'utf8');

    assert.match(desktopPreviewBlock, /captureFrameRef/);
    assert.match(desktopPreviewBlock, /pendingCaptureFrameAnimationRef/);
    assert.match(desktopPreviewBlock, /pendingCaptureFrameTimeoutsRef/);
    assert.match(desktopPreviewBlock, /recentCaptureFrameStylesRef/);
    assert.match(desktopPreviewBlock, /CAPTURE_FRAME_RANDOM_CANDIDATES = 128/);
    assert.match(desktopPreviewBlock, /CAPTURE_FRAME_RECENT_HISTORY_LIMIT = 5/);
    assert.match(desktopPreviewBlock, /MIN_CAPTURE_FRAME_STYLE_DISTANCE = 64/);
    assert.match(desktopPreviewBlock, /getCaptureFrameStyleDistance/);
    assert.match(desktopPreviewBlock, /for \(let attempt = 0; attempt < CAPTURE_FRAME_RANDOM_CANDIDATES; attempt \+= 1\)/);
    assert.match(desktopPreviewBlock, /recentCaptureFrameStylesRef\.current\.every/);
    assert.match(desktopPreviewBlock, /getCaptureFrameStyleDistance\(recentFrameStyle, candidateFrameStyle\) >= MIN_CAPTURE_FRAME_STYLE_DISTANCE/);
    assert.match(desktopPreviewBlock, /requestCaptureFrameAnimation/);
    assert.match(desktopPreviewBlock, /window\.cancelAnimationFrame\(pendingCaptureFrameAnimationRef\.current\)/);
    assert.match(desktopPreviewBlock, /window\.requestAnimationFrame\(\(\) => \{/);
    assert.match(desktopPreviewBlock, /scheduleCaptureFrameRegenerationBurst/);
    assert.match(desktopPreviewBlock, /\[0,\s*48,\s*132,\s*260\]/);
    assert.match(desktopPreviewBlock, /window\.setTimeout/);
    assert.match(desktopPreviewBlock, /window\.clearTimeout/);
    assert.match(desktopPreviewBlock, /new ResizeObserver/);
    assert.match(desktopPreviewBlock, /resizeObserver\.observe\(captureRoot\)/);
    assert.match(desktopPreviewBlock, /new MutationObserver/);
    assert.match(desktopPreviewBlock, /mutationObserver\?\.observe\(captureRoot/);
    assert.match(desktopPreviewBlock, /childList:\s*true/);
    assert.match(desktopPreviewBlock, /subtree:\s*true/);
    assert.match(desktopPreviewBlock, /captureFrame\.style\.top/);
    assert.match(desktopPreviewBlock, /captureFrame\.style\.right/);
    assert.match(desktopPreviewBlock, /captureFrame\.style\.bottom/);
    assert.match(desktopPreviewBlock, /captureFrame\.style\.left/);
    assert.match(desktopPreviewBlock, /requiredRightAsideIdentityRect/);
    assert.doesNotMatch(desktopPreviewBlock, /__regenerateWhatsappCaptureFrame/);
    assert.doesNotMatch(desktopPreviewBlock, /previewSnapshot\?\.desktopCaptureFrame/);
    assert.doesNotMatch(desktopPreviewBlock, /seedCode/);
    assert.doesNotMatch(desktopPreviewBlock, /visualSeed/);
});

test('desktop WhatsApp right aside is forced for saved contacts and random for phone headers', () => {
    const desktopPreviewBlock = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'PreviewBlockWhatsapp.tsx'), 'utf8');
    const contactIdentitySource = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'contactIdentityDisplay.shared.ts'), 'utf8');

    assert.match(contactIdentitySource, /headerDisplaysPhone: boolean/);
    assert.match(contactIdentitySource, /headerDisplaysPhone: false/);
    assert.match(contactIdentitySource, /headerDisplaysPhone: true/);
    assert.match(desktopPreviewBlock, /function randomBoolean\(\): boolean/);
    assert.match(desktopPreviewBlock, /function createRuntimeNonce\(\): number/);
    assert.match(desktopPreviewBlock, /const visualGenerationKey = useMemo\(\(\) => createRuntimeNonce\(\), \[data\]\);/);
    assert.match(desktopPreviewBlock, /const showRightAside = useMemo/);
    assert.match(desktopPreviewBlock, /if \(!contactIdentityDisplay\.headerDisplaysPhone\)/);
    assert.match(desktopPreviewBlock, /return randomBoolean\(\);/);
    assert.match(desktopPreviewBlock, /\}, \[contactIdentityDisplay\.headerDisplaysPhone,\s*visualGenerationKey\]\);/);
    assert.match(desktopPreviewBlock, /\{showRightAside \? \(\s*<WhatsappRightAside/);
    assert.match(desktopPreviewBlock, /key=\{`right-aside-\$\{visualGenerationKey\}`\}/);
    assert.match(
        desktopPreviewBlock,
        /!contactIdentityDisplay\.headerDisplaysPhone\s*\?\s*captureRoot\.querySelector<HTMLElement>\('\[data-wa-right-aside-identity\]'\)/,
    );
    assert.doesNotMatch(desktopPreviewBlock, /previewSnapshot\?\.showRightAside/);
});

test('desktop WhatsApp right info panel still uses preview snapshot visibility when aside is shown', () => {
    const desktopPreviewBlock = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'PreviewBlockWhatsapp.tsx'), 'utf8');
    const rightAsideSource = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'WhatsappRightAside.tsx'), 'utf8');

    assert.match(desktopPreviewBlock, /showRightInfoPanel/);
    assert.match(desktopPreviewBlock, /data\.previewSnapshot\?\.showRightInfoPanel/);
    assert.match(desktopPreviewBlock, /<WhatsappRightAside/);
    assert.match(desktopPreviewBlock, /showInfoPanel=\{showRightInfoPanel\}/);
    assert.match(rightAsideSource, /showInfoPanel/);
    assert.match(rightAsideSource, /showInfoPanel \?/);
    assert.match(rightAsideSource, />Info\.<\/div>/);
});

test('desktop WhatsApp conversation starts anchored to the bottom', () => {
    const desktopConversation = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'WhatsappConversation.tsx'), 'utf8');

    assert.match(desktopConversation, /scrollbar-soft h-full w-full overflow-y-auto/);
    assert.match(desktopConversation, /scrollbar-soft-dark/);
    assert.match(desktopConversation, /className="flex min-h-full w-full flex-col justify-end"/);
    assert.match(desktopConversation, /scrollContainer\.scrollTop = scrollHeight - clientHeight;/);
    assert.doesNotMatch(desktopConversation, /scrollRatios|scrollRatio/);
});

test('desktop WhatsApp input bar matches the message bubble text rhythm', () => {
    const desktopInputBar = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'whatsapp-footer', 'WhatsappDesktopInputBar.tsx'), 'utf8');
    const desktopMessageBubble = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'whatsapp-bubbles', 'WhatsappDesktopTextBubble.tsx'), 'utf8');

    assert.match(desktopInputBar, /text-\[12px\]\s+leading-4\.5\s+font-normal/);
    assert.match(desktopMessageBubble, /text-\[12px\] leading-4\.5 font-normal select-text/);
});

test('whatsapp typography platform is configured at the preview entry point', () => {
    const typographySource = readFileSync(resolve(designsDir, 'whatsappTypography.ts'), 'utf8');
    const mobileWhatsappSource = readFileSync(resolve(designsDir, 'shared', 'mobile-preview', 'MobileWhatsappPreview.tsx'), 'utf8');
    const desktopSource = readFileSync(resolve(designsDir, 'whatsapp-desktop', 'PreviewWhatsappDesktop.tsx'), 'utf8');
    const appCssSource = readFileSync(resolve(designsDir, '..', '..', '..', '..', '..', 'css', 'app.css'), 'utf8');

    assert.match(typographySource, /type WhatsappTypographyPlatform = 'android' \| 'ios' \| 'windows';/);
    assert.match(mobileWhatsappSource, /data-whatsapp-platform="android"/);
    assert.match(desktopSource, /const whatsappTypographyPlatform: WhatsappTypographyPlatform = 'windows';/);
    assert.match(desktopSource, /data-whatsapp-platform={whatsappTypographyPlatform}/);
    assert.match(appCssSource, /\[data-whatsapp-platform='android'\]/);
    assert.match(appCssSource, /\[data-whatsapp-platform='ios'\]/);
    assert.match(appCssSource, /\[data-whatsapp-platform='windows'\]/);
    assert.match(appCssSource, /--whatsapp-font-family/);
});

test('mobile 6 SMS owns the save-contact card and renders it only for the SMS conversation branch', () => {
    const cardPath = resolve(designsDir, 'mobile-6', 'sms', 'Mobile6SmsSaveContactCard.tsx');
    const smsConversationPath = resolve(designsDir, 'shared', 'sms', 'SmsConversation.tsx');

    assert.equal(existsSync(cardPath), true);

    const cardSource = readFileSync(cardPath, 'utf8');
    const smsConversationSource = readFileSync(smsConversationPath, 'utf8');

    assert.match(cardSource, /¿Quieres guardar \{telefono\}\?/);
    assert.match(cardSource, /Si guardas este número, se agregará un/);
    assert.match(cardSource, /Denunciar spam/);
    assert.match(cardSource, /Agregar contacto/);
    assert.match(cardSource, /#EDEEF3/);
    assert.match(cardSource, /#4D5C91/);
    assert.doesNotMatch(cardSource, /Math\.random/);
    assert.match(smsConversationSource, /Mobile6SmsSaveContactCard/);
    assert.match(smsConversationSource, /isMobile6 \?/);
    assert.match(smsConversationSource, /useState\(\(\) => buildSmsConversationHeader\(data\)\)/);
});

test('mobile 6 owns a centered compact three-button Android navigation footer', () => {
    const footerPath = resolve(designsDir, 'mobile-6', 'Mobile6PreviewFooter.tsx');
    const source = readFileSync(footerPath, 'utf8');
    assert.match(source, /data-android-navigation-icon="back"/);
    assert.match(source, /data-android-navigation-icon="home"/);
    assert.match(source, /data-android-navigation-icon="recents"/);
    assert.match(source, /h-\[50px\]/);
    assert.match(source, /justify-center/);
    assert.match(source, /gap-\[48px\]/);
    assert.match(source, /data-mobile6-system-navigation="three-button"/);
    const backRenderIndex = source.lastIndexOf('<AndroidBackIcon');
    const homeRenderIndex = source.lastIndexOf('<AndroidHomeIcon');
    const recentsRenderIndex = source.lastIndexOf('<AndroidRecentsIcon');
    assert.ok(backRenderIndex !== -1);
    assert.ok(homeRenderIndex !== -1);
    assert.ok(recentsRenderIndex !== -1);
    assert.ok(backRenderIndex < homeRenderIndex, 'Back must render before Home');
    assert.ok(homeRenderIndex < recentsRenderIndex, 'Home must render before Recents');
    assert.doesNotMatch(source, /Mobile2PreviewFooter/);
    assert.doesNotMatch(source, /mobile-2/);
});
