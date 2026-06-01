import assert from 'node:assert/strict';
import test from 'node:test';
import { postJson, putJson } from './api.ts';

type HeaderMap = Record<string, string>;

function mockDom(cookie: string, csrfMetaToken: string | null): void {
    Object.defineProperty(globalThis, 'document', {
        configurable: true,
        value: {
            cookie,
            querySelector: (selector: string) => {
                if (selector !== 'meta[name="csrf-token"]' || csrfMetaToken === null) {
                    return null;
                }

                return {
                    getAttribute: (name: string) => (name === 'content' ? csrfMetaToken : null),
                };
            },
        },
    });
}

function mockFetchCaptureHeaders(): { getHeaders: () => HeaderMap } {
    let capturedHeaders: HeaderMap = {};

    Object.defineProperty(globalThis, 'fetch', {
        configurable: true,
        value: async (_input: string, init?: RequestInit) => {
            capturedHeaders = (init?.headers ?? {}) as HeaderMap;

            return new Response(JSON.stringify({ ok: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        },
    });

    return {
        getHeaders: () => capturedHeaders,
    };
}

test('postJson sends X-XSRF-TOKEN from XSRF-TOKEN cookie', async () => {
    mockDom('XSRF-TOKEN=fresh-cookie-token; laravel_session=session-id', 'stale-meta-token');
    const capture = mockFetchCaptureHeaders();

    await postJson('/api/example', { hello: 'world' });

    const headers = capture.getHeaders();
    assert.equal(headers['X-XSRF-TOKEN'], 'fresh-cookie-token');
});

test('putJson sends X-XSRF-TOKEN from XSRF-TOKEN cookie', async () => {
    mockDom('XSRF-TOKEN=new-cookie-token; laravel_session=session-id', 'older-meta-token');
    const capture = mockFetchCaptureHeaders();

    await putJson('/api/example', { hello: 'world' });

    const headers = capture.getHeaders();
    assert.equal(headers['X-XSRF-TOKEN'], 'new-cookie-token');
});
