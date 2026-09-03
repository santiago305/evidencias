import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createElement, Fragment, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer, type ViteDevServer } from 'vite';
import type { PreviewThemeMode } from '../../../../../types';
import type { MobileNotificationIconId } from '../../../mobileNotifications';
import type { SmsData, SmsDesignVariant } from '../../mobile-3/sms/smsTypes';

type SmsHeaderProps = {
    data: SmsData;
    themeMode: PreviewThemeMode;
    variant?: SmsDesignVariant;
    showVideoCall?: boolean;
};

type SmsConversationProps = {
    data: SmsData;
    themeMode: PreviewThemeMode;
    variant?: SmsDesignVariant;
    currentDate?: Date;
};

type Mobile2SystemHeaderProps = {
    themeMode: PreviewThemeMode;
    notificationIds?: MobileNotificationIconId[];
    variant?: 'default' | 'whatsapp' | 'sms';
};

type Mobile2SystemFooterProps = {
    themeMode: PreviewThemeMode;
    variant?: 'default' | 'sms';
};

const smsDirectory = dirname(fileURLToPath(import.meta.url));
const mobile2Directory = resolve(smsDirectory, '..');
const currentDate = new Date('2026-09-02T17:00:00.000Z');
const data = {
    telefono: '999 111 222',
    nombre: 'Prueba',
    fechaHora: '2026-09-02T10:00',
    fechaHoraRegistro: '2026-09-02T10:00',
    seedCode: 'sms-validation',
    generatedMessages: [
        { id_: 'incoming', side: 'in', lines: ['Mensaje recibido real'], time: '10:00', dateKey: '2026-09-02' },
        { id_: 'outgoing', side: 'out', lines: ['Mensaje enviado real'], time: '10:01', dateKey: '2026-09-02', status: 'read' },
    ],
} as SmsData;

let server: ViteDevServer;
let SmsMobileHeader: ComponentType<SmsHeaderProps>;
let SmsConversation: ComponentType<SmsConversationProps>;
let Mobile2PreviewHeader: ComponentType<Mobile2SystemHeaderProps>;
let Mobile2PreviewFooter: ComponentType<Mobile2SystemFooterProps>;

before(async () => {
    server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });

    const smsHeaderModule = await server.ssrLoadModule(
        '/resources/js/evidence-generator/features/preview/designs/mobile-3/sms/sms-header/SmsMobileHeader.tsx',
    );
    const smsConversationModule = await server.ssrLoadModule(
        '/resources/js/evidence-generator/features/preview/designs/mobile-3/sms/SmsConversation.tsx',
    );
    const mobile2HeaderModule = await server.ssrLoadModule(
        '/resources/js/evidence-generator/features/preview/designs/mobile-2/Mobile2PreviewHeader.tsx',
    );
    const mobile2FooterModule = await server.ssrLoadModule(
        '/resources/js/evidence-generator/features/preview/designs/mobile-2/Mobile2PreviewFooter.tsx',
    );

    SmsMobileHeader = smsHeaderModule.SmsMobileHeader as ComponentType<SmsHeaderProps>;
    SmsConversation = smsConversationModule.SmsConversation as ComponentType<SmsConversationProps>;
    Mobile2PreviewHeader = mobile2HeaderModule.Mobile2PreviewHeader as ComponentType<Mobile2SystemHeaderProps>;
    Mobile2PreviewFooter = mobile2FooterModule.Mobile2PreviewFooter as ComponentType<Mobile2SystemFooterProps>;
});

after(async () => {
    await server.close();
});

function renderSms(themeMode: PreviewThemeMode, variant: SmsDesignVariant, showVideoCall: boolean): string {
    return renderToStaticMarkup(
        createElement(
            Fragment,
            null,
            createElement(SmsMobileHeader, { data, themeMode, variant, showVideoCall }),
            createElement(SmsConversation, { data, themeMode, variant, currentDate }),
        ),
    );
}

function renderDefaultMobile3Sms(themeMode: PreviewThemeMode): string {
    return renderToStaticMarkup(
        createElement(
            Fragment,
            null,
            createElement(SmsMobileHeader, { data, themeMode }),
            createElement(SmsConversation, { data, themeMode, currentDate }),
        ),
    );
}

function assertMarkupIncludes(markup: string, values: string[]): void {
    for (const value of values) {
        assert.ok(markup.includes(value), `Expected rendered markup to include ${value}`);
    }
}

test('mobile 2 SMS removes the video-call button without removing call or options', () => {
    const markup = renderSms('light', 'mobile-2', false);

    assert.doesNotMatch(markup, /aria-label="Videollamada"/);
    assert.match(markup, /aria-label="Llamar"/);
    assert.match(markup, /aria-label="Opciones"/);
});

test('mobile 3 SMS keeps its video-call button and original palette by default', () => {
    const lightMarkup = renderDefaultMobile3Sms('light');
    const darkMarkup = renderDefaultMobile3Sms('dark');

    assert.match(lightMarkup, /aria-label="Videollamada"/);
    assert.match(darkMarkup, /aria-label="Videollamada"/);
    assertMarkupIncludes(lightMarkup, ['#E9EEF2', '#F6FAFD', '#00688D', '#49B866']);
    assertMarkupIncludes(darkMarkup, ['#1C2023', '#101417', '#014C69', '#5CB973']);
});

test('mobile 2 SMS renders real messages with its exact light and dark surfaces', () => {
    const lightMarkup = renderSms('light', 'mobile-2', false);
    const darkMarkup = renderSms('dark', 'mobile-2', false);

    assertMarkupIncludes(lightMarkup, [
        '#FAEAEB',
        '#FFF6F7',
        '#FEDADA',
        '#24181A',
        '#524444',
        '#FEDDB4',
        '#281800',
        '#5CB973',
        '#FF63B7',
        'Mensaje recibido real',
        'Mensaje enviado real',
    ]);
    assertMarkupIncludes(darkMarkup, [
        '#271D1E',
        '#1C1010',
        '#FFA7A9',
        '#2F0809',
        '#EEDEDE',
        '#D7C1C3',
        '#D4C4C4',
        '#5E421B',
        '#FEDDB4',
        '#5CB973',
        '#202125',
        'Mensaje recibido real',
        'Mensaje enviado real',
    ]);
});

test('mobile 2 SMS keeps quick replies in the DOM and reveals them when the composer receives focus', () => {
    const markup = renderSms('light', 'mobile-2', false);

    assertMarkupIncludes(markup, [
        'aria-label="Mensaje RCS"',
        'data-sms-quick-replies="mobile-2"',
        'group-focus-within:flex',
        'flex-row-reverse',
        'justify-start',
        'w-fit',
        'min-w-[72px]',
        'px-[10px]',
        'Usar sugerencia Que',
        'Usar sugerencia Hola',
        'Usar sugerencia Mande',
        'Usar sugerencia 😁',
    ]);
    assert.match(markup, /id="outgoing"[^>]*mb-\[4px\]/);
});

test('mobile 2 SMS system bars use SMS colors and Android square-circle-triangle order', () => {
    const lightHeader = renderToStaticMarkup(createElement(Mobile2PreviewHeader, { themeMode: 'light', variant: 'sms', notificationIds: [] }));
    const darkHeader = renderToStaticMarkup(createElement(Mobile2PreviewHeader, { themeMode: 'dark', variant: 'sms', notificationIds: [] }));
    const lightFooter = renderToStaticMarkup(createElement(Mobile2PreviewFooter, { themeMode: 'light', variant: 'sms' }));
    const darkFooter = renderToStaticMarkup(createElement(Mobile2PreviewFooter, { themeMode: 'dark', variant: 'sms' }));
    const defaultFooter = renderToStaticMarkup(createElement(Mobile2PreviewFooter, { themeMode: 'light' }));

    assertMarkupIncludes(lightHeader, ['#FAEAEB', '#524444']);
    assertMarkupIncludes(darkHeader, ['#271D1E', '#D7C1C3']);
    assertMarkupIncludes(lightFooter, ['#FFF6F7', '#747274']);
    assertMarkupIncludes(darkFooter, ['#1C1010', '#FFFFFF']);
    assert.match(
        lightFooter,
        /data-android-navigation-icon="recents"[\s\S]*data-android-navigation-icon="home"[\s\S]*data-android-navigation-icon="back"/,
    );
    assert.match(
        defaultFooter,
        /data-android-navigation-icon="back"[\s\S]*data-android-navigation-icon="home"[\s\S]*data-android-navigation-icon="recents"/,
    );
});

test('mobile 2 SMS entry point uses the Mobile 2 frame and shared Mobile 3 SMS implementation', () => {
    const previewSource = readFileSync(resolve(smsDirectory, 'PreviewMobile2Sms.tsx'), 'utf8');
    const frameSource = readFileSync(resolve(mobile2Directory, 'Mobile2PreviewFrame.tsx'), 'utf8');

    assert.match(previewSource, /<Mobile2PreviewFrame/);
    assert.match(previewSource, /headerVariant="sms"/);
    assert.match(previewSource, /footerVariant="sms"/);
    assert.match(previewSource, /<SmsMobileHeader[^>]*variant="mobile-2"[^>]*showVideoCall=\{false\}/);
    assert.match(previewSource, /<SmsConversation[^>]*variant="mobile-2"/);
    assert.doesNotMatch(previewSource, /\bRow\b|Monto:|tenemos informacion sobre tu solicitud/);
    assert.match(frameSource, /h-\[875px\]/);
    assert.match(frameSource, /w-\[418\.75px\]/);
    assert.doesNotMatch(frameSource, /Mobile1PreviewFrame/);
});
