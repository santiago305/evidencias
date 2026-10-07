import type { GeneroNormalizado } from './s_cliente.ts';

interface MorphologicalRule {
    masculineEnding: string;
    feminineEnding: string;
    minimumStemLength: number;
    licensedMasculines?: ReadonlySet<string>;
    licensedFeminineSources?: ReadonlySet<string>;
}

function license(...masculineForms: string[]): ReadonlySet<string> {
    return new Set(masculineForms);
}

/** These endings are productive only for the listed nouns, not for every -e, -l or -z noun. */
const restrictedRules: readonly MorphologicalRule[] = [
    {
        masculineEnding: 'nte',
        feminineEnding: 'nta',
        minimumStemLength: 2,
        licensedMasculines: license('cliente', 'presidente', 'dependiente', 'sirviente'),
    },
    {
        masculineEnding: 'e',
        feminineEnding: 'a',
        minimumStemLength: 2,
        licensedMasculines: license('jefe', 'infante', 'nene', 'alcahuete'),
    },
    {
        masculineEnding: 'l',
        feminineEnding: 'la',
        minimumStemLength: 2,
        licensedMasculines: license('español', 'zagal', 'colegial'),
    },
    {
        masculineEnding: 'z',
        feminineEnding: 'za',
        minimumStemLength: 2,
        licensedMasculines: license('andaluz'),
    },
];

/** A feminine -ana, -ina or -esa can also come from an -o/-a noun or be unrelated. */
const productiveRules: readonly MorphologicalRule[] = [
    { masculineEnding: 'or', feminineEnding: 'ora', minimumStemLength: 3 },
    { masculineEnding: 'ón', feminineEnding: 'ona', minimumStemLength: 2 },
    {
        masculineEnding: 'án',
        feminineEnding: 'ana',
        minimumStemLength: 2,
        licensedFeminineSources: license('capitán', 'alemán', 'catalán', 'guardián', 'musulmán', 'charlatán'),
    },
    {
        masculineEnding: 'ín',
        feminineEnding: 'ina',
        minimumStemLength: 2,
        licensedFeminineSources: license('bailarín', 'danzarín'),
    },
    {
        masculineEnding: 'és',
        feminineEnding: 'esa',
        minimumStemLength: 2,
        licensedFeminineSources: license(
            'francés',
            'inglés',
            'japonés',
            'marqués',
            'portugués',
            'holandés',
            'irlandés',
            'burgués',
            'feligrés',
            'burgalés',
        ),
    },
    { masculineEnding: 'o', feminineEnding: 'a', minimumStemLength: 2 },
];

function applyRule(word: string, gender: GeneroNormalizado, rule: MorphologicalRule): string | null {
    const sourceEnding = gender === 'femenino' ? rule.masculineEnding : rule.feminineEnding;
    const targetEnding = gender === 'femenino' ? rule.feminineEnding : rule.masculineEnding;

    if (!word.endsWith(sourceEnding)) {
        return null;
    }

    const stem = word.slice(0, -sourceEnding.length);
    if (stem.length < rule.minimumStemLength) {
        return null;
    }

    const masculineCandidate = gender === 'femenino' ? word : stem + rule.masculineEnding;
    if (rule.licensedMasculines && !rule.licensedMasculines.has(masculineCandidate)) {
        return null;
    }

    if (gender === 'masculino' && rule.licensedFeminineSources && !rule.licensedFeminineSources.has(masculineCandidate)) {
        return null;
    }

    return stem + targetEnding;
}

export function inflectByMorphology(word: string, gender: GeneroNormalizado): string | null {
    for (const rule of restrictedRules) {
        const inflected = applyRule(word, gender, rule);
        if (inflected !== null) {
            return inflected;
        }
    }

    if (word.endsWith('ista') || word.endsWith('ante') || word.endsWith('ente')) {
        return null;
    }

    for (const rule of productiveRules) {
        const inflected = applyRule(word, gender, rule);
        if (inflected !== null) {
            return inflected;
        }
    }

    return null;
}
