import assert from 'node:assert/strict';
import test from 'node:test';
import { createInitialFormState } from './formState.ts';
import { clearReplayHydratedForm, hydrateReplayForm } from './replayForm.ts';

test('hydrateReplayForm restores TCEA when it exists in stored input data', () => {
    const form = createInitialFormState();

    assert.equal(hydrateReplayForm(form, { TCEA: '45.20%' }).TCEA, '45.20%');
});

test('clearReplayHydratedForm clears TCEA from a previously hydrated replay', () => {
    const form = {
        ...createInitialFormState(),
        TCEA: '45.20%',
    };

    assert.equal(clearReplayHydratedForm(form).TCEA, '');
});

test('hydrateReplayForm restores client sex and birth date', () => {
    const form = hydrateReplayForm(createInitialFormState(), {
        sexo: 'F',
        fecha_nacimiento: '2001-02-03',
    });

    assert.equal(form.sexo, 'F');
    assert.equal(form.fecha_nacimiento, '2001-02-03');
});

test('clearReplayHydratedForm clears client sex and birth date', () => {
    const form = clearReplayHydratedForm({
        ...createInitialFormState(),
        sexo: 'M',
        fecha_nacimiento: '1995-08-21',
    });

    assert.equal(form.sexo, '');
    assert.equal(form.fecha_nacimiento, '');
});
