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
