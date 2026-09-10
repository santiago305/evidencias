import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer, type ViteDevServer } from 'vite';
import type { PreviewThemeMode, SavedData } from '../../../types';

const designsDirectory = dirname(fileURLToPath(import.meta.url));
const baselinePath = resolve(designsDirectory, 'mobile-preview-visual-baseline.json');
const fixedNow = new Date('2026-09-07T15:00:00.000Z').getTime();

const previewData = {
    telefono: '999 111 222',
    nombre: 'Cliente Visual',
    dniCliente: '12345678',
    monto: '1000',
    tasa: '10',
    cuota: '100',
    plazo: '12',
    TCEA: '12.50',
    fechaHora: '2026-09-07T10:00',
    fechaHoraRegistro: '2026-09-07T09:55',
    duracion: '00:45',
    img_64: '',
    img_64_file: null,
    modoEntrada: 'contactado',
    nombreAsesor: 'Asesora Visual',
    dni: '87654321',
    sexualidadAsesor: 'F',
    tipoCliente: 'sereno',
    conversationId: 'visual-parity-conversation',
    seedCode: 'visual-parity-seed',
    generatedMessages: [
        {
            id_: 'visual-in-1',
            side: 'in',
            time: '10:00',
            dateKey: '2026-09-07',
            lines: ['Mensaje recibido *importante* 12345678'],
        },
        {
            id_: 'visual-out-1',
            side: 'out',
            time: '10:01',
            dateKey: '2026-09-07',
            lines: ['Mensaje enviado con confirmación'],
            status: 'read',
            quote: { side: 'in', text: 'Mensaje recibido importante' },
        },
        {
            id_: 'visual-in-2',
            side: 'in',
            time: '10:02',
            dateKey: '2026-09-08',
            lines: ['Segundo día de conversación'],
        },
    ],
    previewSnapshot: {
        messageStatus: 'read',
        showRightInfoPanel: false,
        temporalBehavior: {
            showTemporaryIcon: true,
            showDefaultTemporalMessage: true,
            temporalStatusLabel: '90 días',
            inlineTemporalMode: 'active',
        },
        inlineTemporalInsertIndex: 1,
        trayTime: '10:02',
        trayDate: '07/09/2026',
        trayProfile: {
            taskbarColor: '#000000',
            icons: [],
            language: { top: 'ESP' },
            languagePosition: 'next-to-hidden',
        },
    },
} as unknown as SavedData;

let server: ViteDevServer;
let mobilePreviewRegistry: Record<string, Record<string, React.ComponentType<{ data: SavedData | null; themeMode: PreviewThemeMode }>>>;

before(async () => {
    server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });

    const previewChannelsModule = await server.ssrLoadModule('/resources/js/evidence-generator/features/preview/components/PreviewChannels.tsx');
    mobilePreviewRegistry = previewChannelsModule.mobilePreviewRegistry;
});

after(async () => {
    await server.close();
});

function withDeterministicRuntime<T>(callback: () => T): T {
    const originalRandom = Math.random;
    const originalDate = globalThis.Date;

    class FixedDate extends originalDate {
        constructor(value?: string | number | Date) {
            super(value === undefined ? fixedNow : value instanceof Date ? value.getTime() : value);
        }

        static now(): number {
            return fixedNow;
        }
    }

    Math.random = () => 0.25;
    globalThis.Date = FixedDate as DateConstructor;

    try {
        return callback();
    } finally {
        Math.random = originalRandom;
        globalThis.Date = originalDate;
    }
}

function renderAllPreviewMarkups(): Record<string, string> {
    return withDeterministicRuntime(() => {
        const markups: Record<string, string> = {};
        const designKeys = ['mobile-1', 'mobile-2', 'mobile-3', 'mobile-4', 'mobile-5', 'mobile-6'];
        const channels = ['whatsapp', 'sms', 'call'];
        const themes: PreviewThemeMode[] = ['light', 'dark'];

        for (const designKey of designKeys) {
            for (const channel of channels) {
                const Preview = mobilePreviewRegistry[designKey]?.[channel];

                assert.ok(Preview, `Missing preview registration for ${designKey}/${channel}`);

                for (const themeMode of themes) {
                    const key = `${designKey}/${channel}/${themeMode}`;
                    let markup: string;

                    try {
                        markup = renderToStaticMarkup(createElement(Preview, { data: previewData, themeMode }));
                    } catch (error) {
                        throw new Error(`Unable to render ${key}: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
                    }

                    markups[key] = createHash('sha256').update(markup).digest('hex');
                }
            }
        }

        return markups;
    });
}

test('mobile previews preserve the frozen rendered markup contract', () => {
    const currentMarkups = renderAllPreviewMarkups();

    if (process.env.UPDATE_MOBILE_VISUAL_BASELINE === '1') {
        writeFileSync(baselinePath, `${JSON.stringify(currentMarkups, null, 2)}\n`, 'utf8');
        return;
    }

    const baseline = JSON.parse(readFileSync(baselinePath, 'utf8')) as Record<string, string>;

    assert.deepEqual(Object.keys(currentMarkups), Object.keys(baseline));
    assert.deepEqual(currentMarkups, baseline);
});
