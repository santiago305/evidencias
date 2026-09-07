import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createElement, type ComponentType, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer, type ViteDevServer } from 'vite';

let server: ViteDevServer;
let mobilePreviewProfiles: typeof import('../mobilePreviewProfiles').mobilePreviewProfiles;
let mobilePreviewRegistry: typeof import('../mobilePreviewProfiles').mobilePreviewRegistry;
let mobile5BatteryRenderer: typeof import('../mobilePreviewProfiles').mobile5BatteryRenderer;
let mobile5WhatsappColors: typeof import('./mobile5Colors').mobile5WhatsappColors;
let mobile5WhatsappSystemChrome: typeof import('./mobile5Colors').mobile5WhatsappSystemChrome;
let mobile5SmsSurfaceColors: typeof import('./mobile5Colors').mobile5SmsSurfaceColors;
let mobile5SmsSystemChrome: typeof import('./mobile5Colors').mobile5SmsSystemChrome;
let mobile3WhatsappVisualAdapter: typeof import('../mobile-3/whatsapp/whatsappVisualAdapter').mobile3WhatsappVisualAdapter;
let Mobile5PreviewFooter: typeof import('./Mobile5PreviewFooter').Mobile5PreviewFooter;
let renderMobile5Footer: typeof import('../shared/mobile-preview/frameRenderers').renderMobile5Footer;
let WhatsappMobileInputBar: ComponentType<{
    themeMode: 'light' | 'dark';
    composerAccessory?: ReactNode;
    composerLayout?: { messageAreaMaxWidth?: string };
}>;
let SmsMobileInputBar: ComponentType<{
    themeMode: 'light' | 'dark';
    variant?: 'mobile-1' | 'mobile-2' | 'mobile-3';
    composerLayout?: { messageAreaMaxWidth?: string };
}>;
let Mobile3PreviewFrame: ComponentType<{
    children: ReactNode;
    themeMode: 'light' | 'dark';
    frame?: { width?: number | string; height?: number | string };
}>;

before(async () => {
    server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });

    const profilesModule = await server.ssrLoadModule('/resources/js/evidence-generator/features/preview/designs/mobilePreviewProfiles.tsx');
    const colorsModule = await server.ssrLoadModule('/resources/js/evidence-generator/features/preview/designs/mobile-5/mobile5Colors.ts');
    const adapterModule = await server.ssrLoadModule(
        '/resources/js/evidence-generator/features/preview/designs/mobile-3/whatsapp/whatsappVisualAdapter.ts',
    );
    const inputModule = await server.ssrLoadModule(
        '/resources/js/evidence-generator/features/preview/designs/mobile-3/whatsapp/whatsapp-footer/WhatsappMobileInputBar.tsx',
    );
    const frameModule = await server.ssrLoadModule('/resources/js/evidence-generator/features/preview/designs/mobile-3/Mobile1PreviewFrame.tsx');
    const smsInputModule = await server.ssrLoadModule('/resources/js/evidence-generator/features/preview/designs/shared/sms/sms-footer/SmsMobileInputBar.tsx');
    const footerModule = await server.ssrLoadModule('/resources/js/evidence-generator/features/preview/designs/mobile-5/Mobile5PreviewFooter.tsx');
    const rendererModule = await server.ssrLoadModule('/resources/js/evidence-generator/features/preview/designs/shared/mobile-preview/frameRenderers.tsx');

    mobilePreviewProfiles = profilesModule.mobilePreviewProfiles;
    mobilePreviewRegistry = profilesModule.mobilePreviewRegistry;
    mobile5BatteryRenderer = profilesModule.mobile5BatteryRenderer;
    mobile5WhatsappColors = colorsModule.mobile5WhatsappColors;
    mobile5WhatsappSystemChrome = colorsModule.mobile5WhatsappSystemChrome;
    mobile5SmsSurfaceColors = colorsModule.mobile5SmsSurfaceColors;
    mobile5SmsSystemChrome = colorsModule.mobile5SmsSystemChrome;
    mobile3WhatsappVisualAdapter = adapterModule.mobile3WhatsappVisualAdapter;
    WhatsappMobileInputBar = inputModule.WhatsappMobileInputBar;
    Mobile3PreviewFrame = frameModule.Mobile1PreviewFrame;
    SmsMobileInputBar = smsInputModule.SmsMobileInputBar;
    Mobile5PreviewFooter = footerModule.Mobile5PreviewFooter;
    renderMobile5Footer = rendererModule.renderMobile5Footer;
});

after(async () => {
    await server.close();
});

test('mobile 5 uses the Mobile 3 composed family and generated registry channels', () => {
    const profile = mobilePreviewProfiles['mobile-5'];
    const whatsapp = profile.whatsapp;

    assert.equal(profile.key, 'mobile-5');
    assert.equal(profile.renderFrame.name, 'renderMobile3Frame');
    assert.equal(whatsapp.kind, 'composed');

    if (whatsapp.kind !== 'composed') {
        return;
    }

    assert.equal(whatsapp.Header.name, 'WhatsappMobileHeaderUser');
    assert.equal(whatsapp.visualAdapter, mobile3WhatsappVisualAdapter);
    assert.equal(whatsapp.behaviorProfile, 'standard');
    assert.equal(whatsapp.colors, mobile5WhatsappColors);
    assert.equal(whatsapp.systemChrome, mobile5WhatsappSystemChrome);
    assert.equal(profile.batteryRenderer, mobile5BatteryRenderer);
    assert.equal(profile.footerRenderer, renderMobile5Footer);
    assert.equal(profile.sms.systemChrome, mobile5SmsSystemChrome);
    assert.equal(profile.frame?.height, '950px');
    assert.equal(typeof profile.frame?.width, 'string');
    assert.deepEqual(whatsapp.composerLayout, { messageAreaMaxWidth: '110px' });
    assert.equal(
        mobilePreviewProfiles['mobile-3'].whatsapp.kind === 'composed' ? mobilePreviewProfiles['mobile-3'].whatsapp.composerLayout : undefined,
        undefined,
    );
    assert.deepEqual(profile.sms, {
        ...mobilePreviewProfiles['mobile-3'].sms,
        composerLayout: { messageAreaMaxWidth: '150px' },
    });
    assert.equal(mobilePreviewProfiles['mobile-3'].sms.composerLayout, undefined);
    assert.deepEqual(profile.call, { missedSpacingVariant: 'standard' });
    assert.ok(mobilePreviewRegistry['mobile-5'].whatsapp);
    assert.ok(mobilePreviewRegistry['mobile-5'].sms);
    assert.ok(mobilePreviewRegistry['mobile-5'].call);
});

test('Mobile 5 SMS system backgrounds continue through the adjacent header and composer surfaces', () => {
    const profile = mobilePreviewProfiles['mobile-5'];

    assert.equal(profile.sms.systemChrome?.light.headerBackground, mobile5SmsSurfaceColors.light.header);
    assert.equal(profile.sms.systemChrome?.light.footerBackground, mobile5SmsSurfaceColors.light.composer);
    assert.equal(profile.sms.systemChrome?.dark.headerBackground, mobile5SmsSurfaceColors.dark.header);
    assert.equal(profile.sms.systemChrome?.dark.footerBackground, mobile5SmsSurfaceColors.dark.composer);

    assert.equal(mobile5SmsSurfaceColors.light.header, '#E9EEF2');
    assert.equal(mobile5SmsSurfaceColors.light.composer, '#E9EEF2');
    assert.equal(mobile5SmsSurfaceColors.dark.header, '#1C2023');
    assert.equal(mobile5SmsSurfaceColors.dark.composer, '#1C2023');
    assert.equal(mobile5WhatsappSystemChrome.light.footerBackground, '#FFFFFF');
    assert.equal(mobile5WhatsappSystemChrome.dark.footerBackground, '#161817');
});

test('Mobile 5 uses one own footer with square-circle-back order in every channel', () => {
    const profile = mobilePreviewProfiles['mobile-5'];
    const expectedOrder =
        /data-android-navigation-icon="recents"[\s\S]*data-android-navigation-icon="home"[\s\S]*data-android-navigation-icon="back"/;
    const channels = ['whatsapp', 'sms', 'call'] as const;

    for (const channel of channels) {
        const markup = renderToStaticMarkup(
            renderMobile5Footer({
                themeMode: 'light',
                channel,
                background: '#F3F3F3',
                foreground: '#6E6E6E',
            }),
        );

        assert.match(markup, expectedOrder);
        assert.match(markup, /background-color:#F3F3F3/);
        assert.match(markup, /stroke="#6E6E6E"/);
    }

    const darkMarkup = renderToStaticMarkup(
        createElement(Mobile5PreviewFooter, {
            themeMode: 'dark',
            systemFooterBackground: '#11181D',
            systemFooterForeground: '#A8ADB3',
        }),
    );

    assert.match(darkMarkup, expectedOrder);
    assert.match(darkMarkup, /background-color:#11181D/);
    assert.match(darkMarkup, /stroke="#A8ADB3"/);
    assert.match(darkMarkup, /width="24" height="24" viewBox="0 0 24 24"/);
    assert.doesNotMatch(darkMarkup, /Mobile2PreviewFooter/);
    assert.equal(profile.footerRenderer, renderMobile5Footer);
});

test('Mobile 5 applies its configured dimensions while Mobile 3 keeps the default frame size', () => {
    const mobile5Markup = renderToStaticMarkup(
        createElement(Mobile3PreviewFrame, { children: null, themeMode: 'light', frame: mobilePreviewProfiles['mobile-5'].frame }),
    );
    const mobile3Markup = renderToStaticMarkup(createElement(Mobile3PreviewFrame, { children: null, themeMode: 'light' }));

    assert.match(mobile5Markup, /class="flex h-\[950px\][^"]*w-\[487\.5px\][^"]*" style="width:427\.5px;height:950px"/);
    assert.match(mobile3Markup, /h-\[950px\][^"']*w-\[487\.5px\]/);
});

test('all Mobile 5 channels forward the profile frame dimensions', () => {
    const currentDirectory = dirname(fileURLToPath(import.meta.url));
    const mobilePreviewDirectory = resolve(currentDirectory, '..', 'shared', 'mobile-preview');

    for (const fileName of ['MobileWhatsappPreview.tsx', 'MobileSmsPreview.tsx', 'MobileCallPreview.tsx']) {
        const source = readFileSync(resolve(mobilePreviewDirectory, fileName), 'utf8');

        assert.match(source, /frame: profile\.frame/);
    }
});

test('Mobile 5 limits only the shared WhatsApp message area width', () => {
    const profile = mobilePreviewProfiles['mobile-5'];
    const composerLayout = profile.whatsapp.kind === 'composed' ? profile.whatsapp.composerLayout : undefined;
    const composerAccessory = profile.whatsapp.kind === 'composed' ? profile.whatsapp.renderComposerAccessory?.('light') : undefined;
    const markup = renderToStaticMarkup(createElement(WhatsappMobileInputBar, { themeMode: 'light', composerAccessory, composerLayout }));

    assert.match(markup, /<input[^>]*class="min-w-0 flex-1[^\"]*"[^>]*style="max-width:145px"/);
    assert.match(markup, /text-\[16\.25px\]/);
    assert.match(markup, /h-\[50px\]/);
    assert.match(markup, /h-\[35px\] w-\[35px\]/);
    assert.match(markup, /aria-label="Acci\u00f3n r\u00e1pida"/);
});

test('Mobile 5 limits only the shared SMS message area width', () => {
    const profile = mobilePreviewProfiles['mobile-5'];
    const markup = renderToStaticMarkup(
        createElement(SmsMobileInputBar, {
            themeMode: 'light',
            variant: profile.sms.variant,
            composerLayout: profile.sms.composerLayout,
        }),
    );

    assert.match(markup, /<input[^>]*class="min-w-0 flex-1[^\"]*"[^>]*style="[^\"]*max-width:150px/);
    assert.match(markup, /text-\[15\.7px\]/);
    assert.match(markup, /min-h-\[54px\]/);
    assert.match(markup, /viewBox="0 0 32 32"/);
});

test('mobile 5 uses the Mobile 4 battery geometry with its configured progress colors', () => {
    const lightMarkup = renderToStaticMarkup(mobile5BatteryRenderer(40, 'light'));
    const darkMarkup = renderToStaticMarkup(mobile5BatteryRenderer(40, 'dark'));

    assert.match(lightMarkup, /viewBox="0 0 48 24"/);
    assert.match(lightMarkup, /width="15\.2[^"]*"[^>]*fill="#AEB4BA"/);
    assert.match(darkMarkup, /width="15\.2[^"]*"[^>]*fill="#C7CDD4"/);
    assert.match(lightMarkup, /font-size="13"/);
    assert.match(darkMarkup, /clip-path="url\(#mobile4-battery-/);
});

test('all generic Mobile 5 channels propagate the configured battery renderer', () => {
    const currentDirectory = dirname(fileURLToPath(import.meta.url));
    const mobilePreviewDirectory = resolve(currentDirectory, '..', 'shared', 'mobile-preview');

    for (const fileName of ['MobileWhatsappPreview.tsx', 'MobileSmsPreview.tsx', 'MobileCallPreview.tsx']) {
        const source = readFileSync(resolve(mobilePreviewDirectory, fileName), 'utf8');

        assert.match(source, /batteryRenderer: profile\.batteryRenderer/);
    }
});

test('Mobile 3 keeps its MDI battery fallback', () => {
    const currentDirectory = dirname(fileURLToPath(import.meta.url));
    const headerSource = readFileSync(resolve(currentDirectory, '..', 'mobile-3', 'Mobile1PreviewHeader.tsx'), 'utf8');

    assert.match(headerSource, /mdiBattery/);
    assert.match(headerSource, /batteryRenderer \? batteryRenderer\(batteryLevel, themeMode\) : <BatteryIcon level=\{batteryLevel\} \/>/);
    assert.doesNotMatch(headerSource, /Mobile4BatteryIcon/);
});

test('Mobile 5 renders the hollow angular lightning accessory between camera and microphone', () => {
    const profile = mobilePreviewProfiles['mobile-5'];
    const accessory = profile.whatsapp.kind === 'composed' ? profile.whatsapp.renderComposerAccessory?.('light') : undefined;
    const markup = renderToStaticMarkup(createElement(WhatsappMobileInputBar, { themeMode: 'light', composerAccessory: accessory }));
    const cameraIndex = markup.indexOf('aria-label="Camara"');
    const lightningIndex = markup.indexOf('aria-label="Acción rápida"');
    const microphoneIndex = markup.indexOf('aria-label="Grabar audio"');

    assert.ok(cameraIndex >= 0);
    assert.ok(lightningIndex > cameraIndex);
    assert.ok(microphoneIndex > lightningIndex);
    const lightningMarkup = markup.slice(lightningIndex, microphoneIndex);

    assert.match(lightningMarkup, /<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true"><path/);
    assert.match(lightningMarkup, /d="M14 2\.5 L6\.25 12\.65 L10\.25 12\.65 L9\.45 21\.5 L17\.75 10\.85 L13\.65 10\.85 Z"/);
    assert.match(lightningMarkup, /fill="#FFFFFF" stroke="#5D6266" stroke-width="2\.4" stroke-linecap="round" stroke-linejoin="round"/);
    assert.doesNotMatch(lightningMarkup, /rx=|ry=/);

    const darkAccessory = profile.whatsapp.kind === 'composed' ? profile.whatsapp.renderComposerAccessory?.('dark') : undefined;
    const darkMarkup = renderToStaticMarkup(createElement(WhatsappMobileInputBar, { themeMode: 'dark', composerAccessory: darkAccessory }));
    const darkLightningIndex = darkMarkup.indexOf('aria-label="Acción rápida"');
    const darkMicrophoneIndex = darkMarkup.indexOf('aria-label="Grabar audio"');
    const darkLightningMarkup = darkMarkup.slice(darkLightningIndex, darkMicrophoneIndex);

    assert.match(darkLightningMarkup, /fill="#1F272A" stroke="#8D9598" stroke-width="2\.4" stroke-linecap="round" stroke-linejoin="round"/);
});

test('mobile 5 color profile matches the requested light and dark palettes', () => {
    assert.deepEqual(mobile5WhatsappColors.light, {
        headerBackground: '#FFFFFF',
        headerText: '#11161B',
        headerIcons: '#151A1F',
        conversationBackground: '#FFFFFF',
        wallpaperPattern: '#EEEEEE',
        avatarBackground: '#F4DED1',
        avatarText: '#82563B',
        outgoingBubble: '#5E47DF',
        outgoingText: '#FFFFFF',
        outgoingMetadata: '#AF9FFF',
        incomingBubble: '#EEEEEE',
        incomingText: '#11161B',
        incomingMetadata: '#5D6266',
        readChecks: '#7FC1FD',
        dateChipBackground: '#F6F5F3',
        dateChipText: '#5D6266',
        composerBackground: '#FFFFFF',
        composerText: '#5D6266',
        composerIcons: '#5D6266',
        microphoneBackground: '#5E47DF',
        microphoneIcon: '#FFFFFF',
    });

    assert.equal(mobile5WhatsappColors.dark.headerBackground, '#161817');
    assert.equal(mobile5WhatsappColors.dark.conversationBackground, '#161817');
    assert.equal(mobile5WhatsappColors.dark.outgoingBubble, '#433597');
    assert.equal(mobile5WhatsappColors.dark.incomingBubble, '#242625');
    assert.equal(mobile5WhatsappColors.dark.readChecks, '#5FA0FA');
    assert.equal(mobile5WhatsappColors.dark.dateChipBackground, '#1F272A');
    assert.equal(mobile5WhatsappColors.dark.composerBackground, '#1F272A');
    assert.equal(mobile5WhatsappColors.dark.microphoneBackground, '#A791FE');
});
