import assert from 'node:assert/strict';
import test from 'node:test';
import { insertTextAtSelection } from './conversationInsertion.ts';

test('insertTextAtSelection inserts text at the cursor position', () => {
    assert.deepEqual(insertTextAtSelection('Hola mundo', '{nombre_cliente}', 5, 5), {
        text: 'Hola {nombre_cliente}mundo',
        selectionStart: 21,
        selectionEnd: 21,
    });
});

test('insertTextAtSelection replaces the selected text', () => {
    assert.deepEqual(insertTextAtSelection('Hola mundo', '{nombre_cliente}', 5, 10), {
        text: 'Hola {nombre_cliente}',
        selectionStart: 21,
        selectionEnd: 21,
    });
});

test('insertTextAtSelection appends at the end when selection is missing', () => {
    assert.deepEqual(insertTextAtSelection('Hola mundo', '{nombre_cliente}'), {
        text: 'Hola mundo{nombre_cliente}',
        selectionStart: 26,
        selectionEnd: 26,
    });
});
