import assert from 'node:assert/strict';
import test from 'node:test';
import { interpolateGenderedAdvisorWords, uppercaseFirstLetter } from './genderedAdvisorWords.ts';

test('interpolateGenderedAdvisorWords renders feminine advisor words', () => {
    assert.equal(interpolateGenderedAdvisorWords('{s_asesor(señor)} esto es asi', 'F'), 'señorita esto es asi');
    assert.equal(interpolateGenderedAdvisorWords('{s_asesor(asesor)} asignada', 'F'), 'asesora asignada');
    assert.equal(interpolateGenderedAdvisorWords('{s_asesor(Estimado)} cliente', 'F'), 'Estimada cliente');
});

test('interpolateGenderedAdvisorWords keeps masculine advisor words', () => {
    assert.equal(interpolateGenderedAdvisorWords('{s_asesor(señor)} {s_asesor(asesor)}', 'M'), 'señor asesor');
});

test('uppercaseFirstLetter uppercases the first letter anywhere in a message', () => {
    assert.equal(uppercaseFirstLetter('hola buenas tardes'), 'Hola buenas tardes');
    assert.equal(uppercaseFirstLetter('¿hola buenas tardes?'), '¿Hola buenas tardes?');
});
