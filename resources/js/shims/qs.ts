type ParseOptions = {
    ignoreQueryPrefix?: boolean;
};

type StringifyOptions = {
    arrayFormat?: 'indices' | 'brackets' | 'repeat' | 'comma';
    encodeValuesOnly?: boolean;
};

function encodeKey(key: string, encodeValuesOnly: boolean): string {
    return encodeValuesOnly ? key : encodeURIComponent(key);
}

function encodeValue(value: unknown): string {
    return encodeURIComponent(value == null ? '' : String(value));
}

function appendPair(pairs: string[], key: string, value: unknown, options: StringifyOptions): void {
    const encodeOnlyValue = options.encodeValuesOnly ?? false;
    pairs.push(`${encodeKey(key, encodeOnlyValue)}=${encodeValue(value)}`);
}

function buildPairs(pairs: string[], key: string, value: unknown, options: StringifyOptions): void {
    if (Array.isArray(value)) {
        const format = options.arrayFormat ?? 'indices';

        if (format === 'comma') {
            appendPair(pairs, key, value.join(','), options);
            return;
        }

        value.forEach((item, index) => {
            if (format === 'indices') {
                buildPairs(pairs, `${key}[${index}]`, item, options);
                return;
            }

            if (format === 'brackets') {
                buildPairs(pairs, `${key}[]`, item, options);
                return;
            }

            buildPairs(pairs, key, item, options);
        });

        return;
    }

    if (value !== null && typeof value === 'object') {
        Object.entries(value as Record<string, unknown>).forEach(([nestedKey, nestedValue]) => {
            buildPairs(pairs, `${key}[${nestedKey}]`, nestedValue, options);
        });
        return;
    }

    appendPair(pairs, key, value, options);
}

export function stringify(input: Record<string, unknown>, options: StringifyOptions = {}): string {
    const pairs: string[] = [];

    Object.entries(input ?? {}).forEach(([key, value]) => {
        buildPairs(pairs, key, value, options);
    });

    return pairs.join('&');
}

function assignParsedValue(target: Record<string, unknown>, rawKey: string, value: string): void {
    const arrayMatch = rawKey.match(/^(.*)\[(\d*)\]$/);

    if (!arrayMatch) {
        target[rawKey] = value;
        return;
    }

    const baseKey = arrayMatch[1];
    const index = arrayMatch[2];
    const current = target[baseKey];
    const array = Array.isArray(current) ? current : [];

    if (index === '') {
        array.push(value);
    } else {
        array[Number(index)] = value;
    }

    target[baseKey] = array;
}

export function parse(input: string, options: ParseOptions = {}): Record<string, unknown> {
    const search = options.ignoreQueryPrefix ? input.replace(/^\?/, '') : input;
    const params = new URLSearchParams(search);
    const parsed: Record<string, unknown> = {};

    params.forEach((value, key) => {
        assignParsedValue(parsed, key, value);
    });

    return parsed;
}
