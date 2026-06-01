function getCsrfMetaToken(): string | null {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? null;
}

function getCookieValue(name: string): string | null {
    const cookiePrefix = `${name}=`;
    const cookieEntry = document.cookie
        .split(';')
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith(cookiePrefix));

    if (!cookieEntry) {
        return null;
    }

    return decodeURIComponent(cookieEntry.slice(cookiePrefix.length));
}

function csrfHeaders(): Record<string, string> {
    const csrfToken = getCsrfMetaToken();
    const xsrfToken = getCookieValue('XSRF-TOKEN');

    return {
        ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
        ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
    };
}

export async function getJson<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
        },
    });

    const payload = await response.json();
    if (!response.ok) {
        throw payload;
    }

    return payload as T;
}

export async function postJson<T>(url: string, body: unknown): Promise<T> {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...csrfHeaders(),
        },
        body: JSON.stringify(body),
    });

    const payload = await response.json();
    if (!response.ok) {
        throw payload;
    }

    return payload as T;
}

export async function putJson<T>(url: string, body: unknown): Promise<T> {
    const response = await fetch(url, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...csrfHeaders(),
        },
        body: JSON.stringify(body),
    });

    const payload = await response.json();
    if (!response.ok) {
        throw payload;
    }

    return payload as T;
}
