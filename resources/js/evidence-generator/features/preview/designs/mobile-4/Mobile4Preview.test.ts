import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer, type ViteDevServer } from 'vite';
import type { PreviewTemporalBehavior } from '../../../../types';
import type { WhatsappData } from '../mobile-3/whatsapp/whatsappTypes';

const mobile4Directory = dirname(fileURLToPath(import.meta.url));
const whatsappSource = readFileSync(resolve(mobile4Directory, 'whatsapp', 'PreviewMobile4Whatsapp.tsx'), 'utf8');
const whatsappRuntimeSource = readFileSync(resolve(mobile4Directory, 'whatsapp', 'mobile4WhatsappRuntime.ts'), 'utf8');
const smsSource = readFileSync(resolve(mobile4Directory, 'sms', 'PreviewMobile4Sms.tsx'), 'utf8');
const frameSource = readFileSync(resolve(mobile4Directory, 'Mobile4PreviewFrame.tsx'), 'utf8');
const headerSource = readFileSync(resolve(mobile4Directory, 'Mobile4PreviewHeader.tsx'), 'utf8');
const colorsSource = readFileSync(resolve(mobile4Directory, 'mobile4Colors.ts'), 'utf8');
const callSource = readFileSync(resolve(mobile4Directory, 'calls', 'design-1', 'PreviewMobile4CallDesign1.tsx'), 'utf8');
const sharedRuntimeSource = readFileSync(resolve(mobile4Directory, '..', 'shared', 'whatsapp', 'whatsappPreviewRuntime.ts'), 'utf8');
const mobile3WhatsappSource = readFileSync(resolve(mobile4Directory, '..', 'mobile-3', 'whatsapp', 'PreviewMobile1Whatsapp.tsx'), 'utf8');

let server: ViteDevServer;
let buildMobile4WhatsappRuntime: (data: WhatsappData) => {
    messageStatus: 'read' | 'delivered';
    temporalBehavior: PreviewTemporalBehavior;
    contactIdentityDisplay: { headerTitle: string };
};
let buildWhatsappPreviewRuntime: (data: WhatsappData) => ReturnType<typeof buildMobile4WhatsappRuntime>;
let getMobile4BatteryProgressWidth: (level: number) => number;
let Mobile4BatteryIcon: (props: { level: number; themeMode: 'light' | 'dark' }) => React.ReactElement;
let Mobile4PreviewHeader: (props: { themeMode: 'light' | 'dark'; notificationIds?: string[] }) => React.ReactElement;

before(async () => {
    server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
    const runtimeModule = await server.ssrLoadModule(
        '/resources/js/evidence-generator/features/preview/designs/mobile-4/whatsapp/mobile4WhatsappRuntime.ts',
    );
    buildMobile4WhatsappRuntime = runtimeModule.buildMobile4WhatsappRuntime;
    const sharedRuntimeModule = await server.ssrLoadModule(
        '/resources/js/evidence-generator/features/preview/designs/shared/whatsapp/whatsappPreviewRuntime.ts',
    );
    buildWhatsappPreviewRuntime = sharedRuntimeModule.buildWhatsappPreviewRuntime;

    const batteryModule = await server.ssrLoadModule('/resources/js/evidence-generator/features/preview/designs/mobile-4/Mobile4BatteryIcon.tsx');
    getMobile4BatteryProgressWidth = batteryModule.getMobile4BatteryProgressWidth;
    Mobile4BatteryIcon = batteryModule.Mobile4BatteryIcon;

    const headerModule = await server.ssrLoadModule('/resources/js/evidence-generator/features/preview/designs/mobile-4/Mobile4PreviewHeader.tsx');
    Mobile4PreviewHeader = headerModule.Mobile4PreviewHeader;
});

after(async () => {
    await server.close();
});

test('mobile 4 WhatsApp uses the shared runtime behavior contract', () => {
    assert.match(whatsappSource, /buildMobile4WhatsappRuntime/);
    assert.match(sharedRuntimeSource, /buildWhatsappAvatarSeed/);
    assert.match(sharedRuntimeSource, /createSeededRandom/);
    assert.match(sharedRuntimeSource, /hashString/);
    assert.match(sharedRuntimeSource, /snapshotStatus/);
    assert.match(sharedRuntimeSource, /snapshotBehavior/);
    assert.doesNotMatch(whatsappRuntimeSource, /function (hashString|createSeededRandom|buildWhatsappMessageStatus|buildWhatsappTemporalBehavior)/);
    assert.match(whatsappSource, /runtime\.temporalBehavior/);
    assert.match(whatsappSource, /showTemporaryIndicator=\{runtime\.temporalBehavior\.showTemporaryIcon\}/);
    assert.match(whatsappSource, /showDefaultTemporalMessage=\{runtime\.temporalBehavior\.showDefaultTemporalMessage\}/);
    assert.match(whatsappSource, /inlineTemporalMode=\{runtime\.temporalBehavior\.inlineTemporalMode\}/);
    assert.match(whatsappSource, /inlineTemporalInsertIndex=\{data\.previewSnapshot\?\.inlineTemporalInsertIndex \?\? null\}/);
    assert.match(sharedRuntimeSource, /buildContactIdentityDisplay/);
    assert.doesNotMatch(whatsappSource, /data\.nombre\?\.trim\(\)/);
    assert.doesNotMatch(whatsappSource, /data-whatsapp-platform/);
    assert.match(whatsappSource, /mobile-3\/whatsapp\/WhatsappConversation/);
    assert.doesNotMatch(whatsappSource, /mobile-1\/whatsapp\/WhatsappConversation/);
});

test('mobile 4 SMS uses mobile 2 content and mobile 3 SMS footer', () => {
    assert.match(smsSource, /getSmsColors\(themeMode, ['"]mobile-2['"]\)/);
    assert.match(smsSource, /<SmsMobileHeader[^>]*variant="mobile-2"[^>]*showVideoCall=\{false\}/);
    assert.match(smsSource, /<SmsConversation[^>]*variant="mobile-2"/);
    assert.match(frameSource, /Mobile1PreviewFooter/);
    assert.match(frameSource, /<Mobile1PreviewFooter themeMode=\{themeMode\} \/>/);
    assert.doesNotMatch(frameSource, /Mobile4PreviewFooter/);
    assert.doesNotMatch(frameSource, /footerVariant/);
});

test('mobile 4 WhatsApp runtime is deterministic and honors its snapshot', () => {
    const data = {
        telefono: '999 111 222',
        nombre: 'Nombre ignorado por el selector de identidad',
        dniCliente: '12345678',
        seedCode: 'mobile-4-runtime',
        fechaHora: '2026-09-02T10:00',
        fechaHoraRegistro: '2026-09-02T10:00',
    } as WhatsappData;
    const firstRuntime = buildMobile4WhatsappRuntime(data);
    const secondRuntime = buildMobile4WhatsappRuntime(data);

    assert.equal(firstRuntime.messageStatus, secondRuntime.messageStatus);
    assert.deepEqual(firstRuntime.temporalBehavior, secondRuntime.temporalBehavior);
    assert.equal(firstRuntime.contactIdentityDisplay.headerTitle, '+51 999 111 222');

    const snapshotRuntime = buildMobile4WhatsappRuntime({
        ...data,
        previewSnapshot: {
            messageStatus: 'delivered',
            showRightInfoPanel: false,
            temporalBehavior: {
                showTemporaryIcon: true,
                showDefaultTemporalMessage: false,
                temporalStatusLabel: '90 días',
                inlineTemporalMode: 'active',
            },
            inlineTemporalInsertIndex: 2,
            trayTime: '10:00',
            trayDate: '02/09/2026',
            trayProfile: 'default',
        },
    });

    assert.equal(snapshotRuntime.messageStatus, 'delivered');
    assert.deepEqual(snapshotRuntime.temporalBehavior.inlineTemporalMode, 'active');
});

test('mobile 3 and mobile 4 use the same WhatsApp runtime output', () => {
    const data = {
        telefono: '999 111 222',
        nombre: 'Cliente',
        dniCliente: '12345678',
        seedCode: 'shared-runtime',
        fechaHora: '2026-09-02T10:00',
        fechaHoraRegistro: '2026-09-02T10:00',
    } as WhatsappData;

    const originalRandom = Math.random;
    Math.random = () => 0.2;

    try {
        assert.deepEqual(buildMobile4WhatsappRuntime(data), buildWhatsappPreviewRuntime(data));
    } finally {
        Math.random = originalRandom;
    }

    assert.match(mobile3WhatsappSource, /\.\.\/shared\/whatsapp\/whatsappPreviewRuntime/);
});

test('mobile 4 keeps its own battery with mobile 3 signal and wifi', () => {
    assert.match(frameSource, /Mobile4PreviewHeader/);
    assert.match(readFileSync(resolve(mobile4Directory, 'Mobile4PreviewHeader.tsx'), 'utf8'), /Mobile4BatteryIcon/);
    assert.match(readFileSync(resolve(mobile4Directory, 'Mobile4PreviewHeader.tsx'), 'utf8'), /Signal, Wifi/);
    assert.doesNotMatch(readFileSync(resolve(mobile4Directory, 'Mobile4PreviewHeader.tsx'), 'utf8'), /Mobile4WifiIcon/);
});

test('mobile 4 battery progress uses only the inner body width and clamps the level', () => {
    const expectedWidths = new Map([
        [100, 38],
        [92, 34.96],
        [50, 19],
        [20, 7.6],
        [5, 1.9],
        [0, 0],
        [120, 38],
        [-10, 0],
    ]);

    for (const [level, expectedWidth] of expectedWidths) {
        assert.ok(Math.abs(getMobile4BatteryProgressWidth(level) - expectedWidth) < 1e-9);
    }
});

test('mobile 4 battery progress is clipped below the outline and number', () => {
    const markup = renderToStaticMarkup(createElement(Mobile4BatteryIcon, { level: 92, themeMode: 'dark' }));

    assert.match(markup, /<defs><clipPath id="mobile4-battery-/);
    assert.match(markup, /<rect x="2\.5" y="4" width="34\.96" height="16" rx="3\.5" clip-path="url\(#mobile4-battery-/);
    assert.match(markup, /fill="#AEB7C2"/);
    assert.doesNotMatch(markup, /fill-opacity=/);
    assert.ok(markup.indexOf('clip-path=') < markup.indexOf('stroke='));
    assert.ok(markup.indexOf('stroke=') < markup.indexOf('<text'));
});

test('mobile 4 battery progress remains visibly proportional in both themes', () => {
    for (const level of [100, 92, 75, 40, 20, 5, 0]) {
        const expectedWidth = getMobile4BatteryProgressWidth(level).toString();
        const darkMarkup = renderToStaticMarkup(createElement(Mobile4BatteryIcon, { level, themeMode: 'dark' }));
        const lightMarkup = renderToStaticMarkup(createElement(Mobile4BatteryIcon, { level, themeMode: 'light' }));

        assert.match(darkMarkup, new RegExp(`width="${expectedWidth}"[^>]*fill="#AEB7C2"`));
        assert.match(lightMarkup, new RegExp(`width="${expectedWidth}"[^>]*fill="#8A9198"`));
    }
});

test('mobile 4 light status bar shares the WhatsApp chat background', () => {
    assert.match(colorsSource, /export const mobile4WhatsappLightBackground = ['"]#efeae2['"]/);
    assert.match(headerSource, /mobile4WhatsappLightBackground/);
    assert.match(whatsappSource, /mobile4WhatsappLightBackground/);
    assert.doesNotMatch(headerSource, /backgroundColor: themeMode === 'dark' \? '#0B1014' : '#FFFFFF'/);
});

test('mobile 4 calls use the mobile 4 frame and shared call content', () => {
    assert.match(callSource, /Mobile4PreviewFrame/);
    assert.match(callSource, /IncomingCallContent/);
    assert.match(callSource, /buildMobilePreviewNotificationIds\(data, 'mobile-4', 'call'\)/);
    assert.match(frameSource, /id="CAPTURA"/);
});

test('mobile 4 frame forwards notifications and supports its functional contract', () => {
    assert.match(frameSource, /notificationIds/);
    assert.match(frameSource, /notificationIds=\{notificationIds\}/);
    assert.match(frameSource, /contentClassName\?: string/);
    assert.match(frameSource, /hideSystemHeader\?: boolean/);
    assert.match(frameSource, /hideSystemFooter\?: boolean/);
    assert.match(headerSource, /MobileNotificationIcons/);
    assert.match(headerSource, /notificationIds\?: MobileNotificationIconId\[\]/);
});

test('mobile 4 header renders the notification ids received by its frame', () => {
    const markup = renderToStaticMarkup(createElement(Mobile4PreviewHeader, { themeMode: 'light', notificationIds: ['gmail', 'notification-dot'] }));

    assert.match(markup, /aria-hidden="true"/);
    assert.equal((markup.match(/class="h-\[15px\] w-\[15px\] text-current"/g) ?? []).length, 2);
});

test('mobile 4 SMS light passes its shell color only to the system status bar', () => {
    assert.match(smsSource, /statusBarBackground={themeMode === 'light' \? colors\.shell : undefined}/);
    assert.match(frameSource, /statusBarBackground\?: string/);
    assert.match(frameSource, /statusBarBackground={statusBarBackground}/);
    assert.match(headerSource, /statusBarBackground\?: string/);
    assert.match(headerSource, /backgroundColor: statusBarBackground \?\? /);
    assert.match(whatsappSource, /statusBarBackground=\{themeMode === 'light' \? '#FFFFFF' : undefined\}/);
});

test('mobile 4 WhatsApp has scoped reference typography and text colors', () => {
    assert.match(whatsappSource, /data-mobile4-whatsapp/);
    assert.match(whatsappSource, /font-family: 'Google Sans Flex', sans-serif !important/);
    assert.match(whatsappSource, /data-mobile4-whatsapp-theme/);
    assert.match(whatsappSource, /font-weight: 400/);
    assert.match(whatsappSource, /letter-spacing: 0/);
    assert.match(whatsappSource, /word-spacing: 0/);
    assert.match(whatsappSource, /#F5F9FC/);
    assert.match(whatsappSource, /#E9EDEF/);
    assert.match(whatsappSource, /#111B21/);
    assert.match(whatsappSource, /rgba\(0, 0, 0, 0\.60?\)/);
});

test('mobile 4 WhatsApp hides only the online presence label', () => {
    assert.match(whatsappSource, /#CAPTURA:has\(\[data-mobile4-whatsapp='true'\]\)/);
    assert.match(whatsappSource, /div\.min-w-0\.flex-1\.leading-tight > div:nth-child\(2\)/);
    assert.match(whatsappSource, /display: none/);
});

test('mobile 4 WhatsApp softens bold message text only', () => {
    assert.match(whatsappSource, /\[data-testid='selectable-text'\] strong/);
    assert.match(whatsappSource, /\[data-testid='selectable-text'\] b/);
    assert.match(whatsappSource, /font-family: 'Google Sans Flex', sans-serif !important/);
    assert.match(whatsappSource, /font-weight: 400 !important/);
    assert.match(whatsappSource, /#3F454A/);
    assert.match(whatsappSource, /#D8DDE0/);
});

test('mobile 4 WhatsApp matches mobile 3 dark temporal notice text color', () => {
    assert.match(whatsappSource, /data-icon='lock-small'/);
    assert.match(whatsappSource, /:has\(\[data-icon='lock-small'\] title\)/);
    assert.match(whatsappSource, /color: #767C80 !important/);
});
