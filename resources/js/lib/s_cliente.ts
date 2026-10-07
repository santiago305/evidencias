import { blockedNouns, exceptionPairs } from './spanishGenderExceptions.ts';
import { inflectByMorphology } from './spanishGenderRules.ts';

export type GeneroGramatical = 'm' | 'f' | 'masculino' | 'femenino';
export type GeneroNormalizado = 'masculino' | 'femenino';

const exceptionForms = new Map<string, Record<GeneroNormalizado, string>>();

for (const pair of exceptionPairs) {
    exceptionForms.set(pair.masculine, { masculino: pair.masculine, femenino: pair.feminine });
    exceptionForms.set(pair.feminine, { masculino: pair.masculine, femenino: pair.feminine });
}

function restoreCase(original: string, transformed: string): string | null {
    if (original === original.toLocaleLowerCase('es')) {
        return transformed;
    }

    if (original === original.toLocaleUpperCase('es')) {
        return transformed.toLocaleUpperCase('es');
    }

    const firstLetter = original[0];
    if (firstLetter === firstLetter?.toLocaleUpperCase('es') && original.slice(1) === original.slice(1).toLocaleLowerCase('es')) {
        return transformed[0]?.toLocaleUpperCase('es') + transformed.slice(1);
    }

    return null;
}

function representGenderPair(masculine: string, feminine: string): string {
    const masculineLetters = [...masculine];
    const feminineLetters = [...feminine];
    const feminineLast = feminineLetters.at(-1);
    const isFeminineA = feminineLast === 'a' || feminineLast === 'A';

    if (isFeminineA && feminineLetters.length === masculineLetters.length + 1 && feminineLetters.slice(0, -1).join('') === masculine) {
        return `${masculine}(${feminineLast})`;
    }

    const masculineLast = masculineLetters.at(-1);
    if (
        isFeminineA &&
        feminineLetters.length === masculineLetters.length &&
        (masculineLast === 'o' || masculineLast === 'O' || masculineLast === 'e' || masculineLast === 'E') &&
        masculineLetters.slice(0, -1).join('') === feminineLetters.slice(0, -1).join('')
    ) {
        return `${masculine}(${feminineLast})`;
    }

    return `${masculine}/${feminine}`;
}

function neutralize(palabra: string): string {
    const parts = palabra.normalize('NFC').match(/^(\s*)([A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)(\s*)$/u);
    if (parts === null) {
        return palabra;
    }

    const [, prefix, word, suffix] = parts;
    const masculine = s_cliente(word, 'm');
    const feminine = s_cliente(word, 'f');
    if (masculine === feminine) {
        return palabra;
    }

    return prefix + representGenderPair(masculine, feminine) + suffix;
}

/** Adapts one Spanish person or animal noun; an omitted gender abbreviates both forms. */
export function s_cliente(palabra: string, genero?: GeneroGramatical): string {
    if (genero === undefined) {
        return neutralize(palabra);
    }

    const normalizedGender = genero === 'm' ? 'masculino' : genero === 'f' ? 'femenino' : genero;
    if (normalizedGender !== 'masculino' && normalizedGender !== 'femenino') {
        return palabra;
    }

    const normalized = palabra.normalize('NFC');
    const parts = normalized.match(/^(\s*)([A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)(\s*)$/u);
    if (parts === null) {
        return palabra;
    }

    const [, prefix, word, suffix] = parts;
    const lowerWord = word.toLocaleLowerCase('es');
    const exception = exceptionForms.get(lowerWord);

    if (blockedNouns.has(lowerWord)) {
        return palabra;
    }

    const inflected = exception?.[normalizedGender] ?? inflectByMorphology(lowerWord, normalizedGender);
    if (inflected === null || inflected === lowerWord || blockedNouns.has(inflected)) {
        return palabra;
    }

    const cased = restoreCase(word, inflected);
    return cased === null ? palabra : prefix + cased + suffix;
}
