/* Minimal tslib shim for build environments where node_modules/.pnpm is unreadable. */

export function __extends(d: Function, b: Function | null): void {
    if (typeof b !== 'function' && b !== null) {
        throw new TypeError(`Class extends value ${String(b)} is not a constructor or null`);
    }

    const setPrototypeOf =
        Object.setPrototypeOf ??
        ((target: object, proto: object | null) => {
            // eslint-disable-next-line no-proto
            (target as { __proto__?: object | null }).__proto__ = proto;
            return target;
        });

    setPrototypeOf(d, b);

    function __(this: { constructor: Function }) {
        this.constructor = d;
    }

    d.prototype = b === null ? Object.create(null) : ((__.prototype = b.prototype), new (__ as unknown as { new (): object })());
}

export const __assign =
    Object.assign ??
    function __assign(target: Record<string, unknown>, ...sources: Record<string, unknown>[]): Record<string, unknown> {
        for (const source of sources) {
            for (const key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };

export function __rest(source: Record<string, unknown>, exclude: string[]): Record<string, unknown> {
    const target: Record<string, unknown> = {};

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key) && !exclude.includes(key)) {
            target[key] = source[key];
        }
    }

    if (source != null && typeof Object.getOwnPropertySymbols === 'function') {
        for (const symbol of Object.getOwnPropertySymbols(source)) {
            if (!exclude.includes(symbol as unknown as string) && Object.prototype.propertyIsEnumerable.call(source, symbol)) {
                target[symbol as unknown as string] = source[symbol as unknown as string];
            }
        }
    }

    return target;
}

export function __values<T>(value: Iterable<T> | ArrayLike<T>) {
    const iterator = (typeof Symbol === 'function' && (value as Iterable<T>)[Symbol.iterator]) as (() => Iterator<T>) | undefined;

    if (iterator) {
        return iterator.call(value);
    }

    if (value && typeof (value as ArrayLike<T>).length === 'number') {
        let index = 0;

        return {
            next() {
                if (!value || index >= (value as ArrayLike<T>).length) {
                    return { done: true, value: undefined as unknown as T };
                }
                return { done: false, value: (value as ArrayLike<T>)[index++] };
            },
        };
    }

    throw new TypeError('Object is not iterable.');
}

export function __read<T>(value: Iterable<T>, count?: number): T[] {
    const iterator = value[Symbol.iterator]();
    const result: T[] = [];
    let step: IteratorResult<T>;

    while ((count === undefined || count-- > 0) && !(step = iterator.next()).done) {
        result.push(step.value);
    }

    return result;
}

export function __spreadArray<T>(to: T[], from: T[], pack?: boolean): T[] {
    if (pack || arguments.length === 2) {
        for (let i = 0, l = from.length; i < l; i++) {
            to.push(from[i]);
        }
        return to;
    }

    return to.concat(from);
}
