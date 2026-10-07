import assert from 'node:assert/strict';
import test from 'node:test';
import { s_cliente } from './s_cliente.ts';
import { blockedNouns, exceptionPairs } from './spanishGenderExceptions.ts';

test('inflects productive noun endings in both directions and preserves an existing form', () => {
    const pairs = [
        ['ingeniero', 'ingeniera'],
        ['enfermero', 'enfermera'],
        ['panadero', 'panadera'],
        ['profesor', 'profesora'],
        ['doctor', 'doctora'],
        ['director', 'directora'],
        ['trabajador', 'trabajadora'],
        ['asesor', 'asesora'],
        ['señor', 'señora'],
        ['campeón', 'campeona'],
        ['león', 'leona'],
        ['ladrón', 'ladrona'],
        ['patrón', 'patrona'],
        ['francés', 'francesa'],
        ['inglés', 'inglesa'],
        ['japonés', 'japonesa'],
        ['marqués', 'marquesa'],
    ] as const;

    for (const [masculine, feminine] of pairs) {
        assert.equal(s_cliente(masculine, 'femenino'), feminine, masculine);
        assert.equal(s_cliente(feminine, 'masculino'), masculine, feminine);
        assert.equal(s_cliente(masculine, 'masculino'), masculine, masculine);
        assert.equal(s_cliente(feminine, 'femenino'), feminine, feminine);
    }
});

test('resolves irregular and lexically ambiguous nouns before suffix rules', () => {
    const pairs = [
        ['actor', 'actriz'],
        ['rey', 'reina'],
        ['héroe', 'heroína'],
        ['emperador', 'emperatriz'],
        ['príncipe', 'princesa'],
        ['médico', 'médica'],
        ['abogado', 'abogada'],
        ['capitán', 'capitana'],
        ['alemán', 'alemana'],
        ['catalán', 'catalana'],
        ['cliente', 'clienta'],
    ] as const;

    for (const [masculine, feminine] of pairs) {
        assert.equal(s_cliente(masculine, 'femenino'), feminine, masculine);
        assert.equal(s_cliente(feminine, 'masculino'), masculine, feminine);
        assert.equal(s_cliente(masculine, 'masculino'), masculine, masculine);
        assert.equal(s_cliente(feminine, 'femenino'), feminine, feminine);
    }
});

test('keeps common-gender nouns unchanged', () => {
    for (const word of ['estudiante', 'periodista', 'artista', 'cantante', 'agente', 'lingüista']) {
        assert.equal(s_cliente(word, 'femenino'), word);
        assert.equal(s_cliente(word, 'masculino'), word);
    }
});

test('does not inflect unknown, non-person, malformed, or unsupported input', () => {
    for (const word of [
        'palabra_rara',
        'libro',
        'carro',
        'casa',
        'hora',
        'flor',
        'gurú',
        'dinero',
        'agujera',
        'motor',
        'sector',
        'sectora',
        'tractor',
        'tractora',
        'sensor',
        'sensora',
        'neona',
        'neón',
        'padrón',
        'interés',
        'mesa',
        'ventana',
        'semana',
        'pingüino',
        'dos palabras',
        'rol2',
        '',
        '   ',
    ]) {
        assert.equal(s_cliente(word, 'femenino'), word, word);
        assert.equal(s_cliente(word, 'masculino'), word, word);
    }
});

test('preserves Spanish accents and the input case pattern', () => {
    assert.equal(s_cliente('Profesor', 'femenino'), 'Profesora');
    assert.equal(s_cliente('PROFESOR', 'femenino'), 'PROFESORA');
    assert.equal(s_cliente('Profesora', 'masculino'), 'Profesor');
    assert.equal(s_cliente('MÉDICO', 'femenino'), 'MÉDICA');
    assert.equal(s_cliente('Heroína', 'masculino'), 'Héroe');
    assert.equal(s_cliente('SEÑOR', 'femenino'), 'SEÑORA');
    assert.equal(s_cliente('  Médico  ', 'femenino'), '  Médica  ');
    assert.equal(s_cliente('me\u0301dico', 'femenino'), 'médica');
});

test('returns the original for an unsupported gender at runtime', () => {
    assert.equal(s_cliente('profesor', 'neutro' as 'masculino'), 'profesor');
});

test('accepts m and f in the two-argument API while preserving long-form calls', () => {
    assert.equal(s_cliente('profesor', 'm'), 'profesor');
    assert.equal(s_cliente('profesor', 'f'), 'profesora');
    assert.equal(s_cliente('profesora', 'm'), 'profesor');
    assert.equal(s_cliente('Profesora', 'm'), 'Profesor');
    assert.equal(s_cliente('PROFESOR', 'f'), 'PROFESORA');
    assert.equal(s_cliente('profesor', 'femenino'), 'profesora');
});

test('applies the productive gender rules in both directions', () => {
    const pairs = [
        ['autor', 'autora'],
        ['tutor', 'tutora'],
        ['anfitrión', 'anfitriona'],
        ['peatón', 'peatona'],
        ['guardián', 'guardiana'],
        ['musulmán', 'musulmana'],
        ['charlatán', 'charlatana'],
        ['bailarín', 'bailarina'],
        ['danzarín', 'danzarina'],
        ['portugués', 'portuguesa'],
        ['holandés', 'holandesa'],
        ['irlandés', 'irlandesa'],
        ['burgués', 'burguesa'],
        ['feligrés', 'feligresa'],
        ['médico', 'médica'],
        ['abogado', 'abogada'],
        ['gato', 'gata'],
        ['niño', 'niña'],
        ['hermano', 'hermana'],
        ['vecino', 'vecina'],
        ['humano', 'humana'],
        ['chino', 'china'],
        ['latino', 'latina'],
        ['mono', 'mona'],
        ['moro', 'mora'],
    ] as const;

    for (const [masculine, feminine] of pairs) {
        assert.equal(s_cliente(masculine, 'f'), feminine, masculine);
        assert.equal(s_cliente(feminine, 'm'), masculine, feminine);
        assert.equal(s_cliente(masculine, 'm'), masculine, masculine);
        assert.equal(s_cliente(feminine, 'f'), feminine, feminine);
    }
});

test('keeps truly irregular pairs separate from productive morphology', () => {
    const pairs = [
        ['hombre', 'mujer'],
        ['padre', 'madre'],
        ['papá', 'mamá'],
        ['macho', 'hembra'],
        ['yerno', 'nuera'],
        ['caballo', 'yegua'],
        ['toro', 'vaca'],
        ['carnero', 'oveja'],
        ['patriarca', 'matriarca'],
        ['gallo', 'gallina'],
        ['padrino', 'madrina'],
        ['padrastro', 'madrastra'],
        ['monje', 'monja'],
        ['abad', 'abadesa'],
        ['alcalde', 'alcaldesa'],
        ['barón', 'baronesa'],
        ['conde', 'condesa'],
        ['duque', 'duquesa'],
        ['jeque', 'jequesa'],
        ['zar', 'zarina'],
    ] as const;

    for (const [masculine, feminine] of pairs) {
        assert.equal(s_cliente(masculine, 'f'), feminine, masculine);
        assert.equal(s_cliente(feminine, 'm'), masculine, feminine);
    }
});

test('licenses restricted endings and leaves common-gender words unchanged', () => {
    const pairs = [
        ['cliente', 'clienta'],
        ['presidente', 'presidenta'],
        ['dependiente', 'dependienta'],
        ['sirviente', 'sirvienta'],
        ['jefe', 'jefa'],
        ['infante', 'infanta'],
        ['nene', 'nena'],
        ['alcahuete', 'alcahueta'],
        ['español', 'española'],
        ['zagal', 'zagala'],
        ['colegial', 'colegiala'],
        ['andaluz', 'andaluza'],
    ] as const;

    for (const [masculine, feminine] of pairs) {
        assert.equal(s_cliente(masculine, 'f'), feminine, masculine);
        assert.equal(s_cliente(feminine, 'm'), masculine, feminine);
    }

    for (const word of ['estudiante', 'periodista', 'artista', 'representante', 'gerente', 'gerenta', 'portavoz', 'profesional']) {
        assert.equal(s_cliente(word, 'm'), word, word);
        assert.equal(s_cliente(word, 'f'), word, word);
    }
});

test('conservatively protects common suffix collisions and epicene nouns', () => {
    for (const word of [
        'arnés',
        'revés',
        'interés',
        'cortés',
        'descortés',
        'volcán',
        'jardín',
        'botín',
        'cojín',
        'calcetín',
        'acordeón',
        'panteón',
        'balcón',
        'melón',
        'camión',
        'avión',
        'sillón',
        'jabón',
        'corazón',
        'sudor',
        'ardor',
        'color',
        'valor',
        'calor',
        'dolor',
        'tambor',
        'caso',
        'casa',
        'madero',
        'madera',
        'corona',
        'testigo',
        'modelo',
        'soldado',
        'persona',
        'víctima',
        'criatura',
        'lechuza',
        'ruiseñor',
        'factor',
        'florero',
        'llavero',
    ]) {
        assert.equal(s_cliente(word, 'm'), word, word);
        assert.equal(s_cliente(word, 'f'), word, word);
    }
});

test('keeps the irregular register unique and separate from productive rules', () => {
    const registeredForms = new Set<string>();

    for (const pair of exceptionPairs) {
        assert.ok(!registeredForms.has(pair.masculine), pair.masculine);
        assert.ok(!registeredForms.has(pair.feminine), pair.feminine);
        assert.ok(!blockedNouns.has(pair.masculine), pair.masculine);
        assert.ok(!blockedNouns.has(pair.feminine), pair.feminine);
        registeredForms.add(pair.masculine);
        registeredForms.add(pair.feminine);
    }

    for (const regular of ['médico', 'abogado', 'capitán', 'alemán', 'catalán', 'cliente', 'profesor', 'portugués']) {
        assert.ok(!registeredForms.has(regular), regular);
    }
});

test('represents both recognized forms when gender is omitted', () => {
    for (const [word, expected] of [
        ['profesor', 'profesor(a)'],
        ['profesora', 'profesor(a)'],
        ['Profesor', 'Profesor(a)'],
        ['PROFESOR', 'PROFESOR(A)'],
        ['niño', 'niño(a)'],
        ['niña', 'niño(a)'],
        ['doctor', 'doctor(a)'],
        ['doctora', 'doctor(a)'],
        ['director', 'director(a)'],
        ['ingeniero', 'ingeniero(a)'],
        ['ingeniera', 'ingeniero(a)'],
        ['abogado', 'abogado(a)'],
        ['médico', 'médico(a)'],
        ['MÉDICO', 'MÉDICO(A)'],
        ['me\u0301dico', 'médico(a)'],
        ['presidente', 'presidente(a)'],
        ['español', 'español(a)'],
        ['actor', 'actor/actriz'],
        ['actriz', 'actor/actriz'],
        ['rey', 'rey/reina'],
        ['reina', 'rey/reina'],
        ['hombre', 'hombre/mujer'],
        ['emperador', 'emperador/emperatriz'],
        ['campeón', 'campeón/campeona'],
        ['guardián', 'guardián/guardiana'],
        ['portuguesa', 'portugués/portuguesa'],
        ['estudiante', 'estudiante'],
        ['periodista', 'periodista'],
        ['artista', 'artista'],
        ['cantante', 'cantante'],
        ['mesa', 'mesa'],
        ['palabra desconocida', 'palabra desconocida'],
    ] as const) {
        assert.equal(s_cliente(word), expected, word);
    }
    assert.equal(s_cliente('profesor', undefined), 'profesor(a)');
    assert.equal(s_cliente('profesor', 'm'), 'profesor');
    assert.equal(s_cliente('profesor', 'f'), 'profesora');
    assert.equal(s_cliente('profesora', 'm'), 'profesor');
    assert.equal(s_cliente('profesora', 'f'), 'profesora');
});
