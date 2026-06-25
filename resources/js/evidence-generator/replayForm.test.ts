import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const appSource = readFileSync(resolve('resources/js/evidence-generator/App.tsx'), 'utf8');
const dataFormSource = readFileSync(resolve('resources/js/evidence-generator/features/editor/components/DataForm.tsx'), 'utf8');

test('App keeps replay sal visible and fetches stored evidence for hydration', () => {
    assert.match(appSource, /route\('evidences\.show-by-seed'/);
    assert.match(appSource, /inputData/);
    assert.doesNotMatch(appSource, /setSeedCodeInput\(''\);/);
});

test('DataForm uses regeneration copy when a sal is present', () => {
    assert.match(dataFormSource, /Autocompletar por sal/);
    assert.match(dataFormSource, /Regenerar evidencia/);
    assert.match(dataFormSource, /seedCodeInput\.trim\(\) !== '' \? 'Regenerar evidencia' : 'Generar evidencia'/);
});
