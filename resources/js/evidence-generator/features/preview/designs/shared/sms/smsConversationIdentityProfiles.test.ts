import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { buildSmsConversationHeader as buildSharedHeader } from './smsDateTime.ts';
import { buildSmsConversationHeader as buildMobile10Header } from '../../mobile-10/sms/smsDateTime.ts';
import { buildSmsConversationHeader as buildMobile11Header } from '../../mobile-11/sms/smsDateTime.ts';

const contact = { nombre: 'Nombre que no debe mostrarse', telefono: '999999999' };

test('all SMS conversation-header builders use the phone for RCS and SMS identity', () => {
    const builders = [
        { build: buildSharedHeader, smsTitle: 'Mensajes de texto con 999999999 (SMS/MMS)' },
        { build: buildMobile10Header, smsTitle: 'Mensajes de texto con 999999999 (SMS/MMS)' },
        { build: buildMobile11Header, smsTitle: 'Escribiéndote con 999999999 (SMS/MMS)' },
    ];

    for (const { build, smsTitle } of builders) {
        const rcsHeader = build(contact, 0.2);
        const smsHeader = build(contact, 0.8);

        assert.equal(rcsHeader.title, 'Chat RCS con 999999999');
        assert.equal(rcsHeader.kind, 'rcs');
        assert.equal(rcsHeader.description, 'Ahora el chat está encriptado de extremo a extremo.');
        assert.equal(smsHeader.title, smsTitle);
        assert.equal(smsHeader.kind, 'sms');
    }
});

test('all SMS conversation-header builders use the shared phone-only resolver', () => {
    for (const file of [
        new URL('./smsDateTime.ts', import.meta.url),
        new URL('../../mobile-10/sms/smsDateTime.ts', import.meta.url),
        new URL('../../mobile-11/sms/smsDateTime.ts', import.meta.url),
    ]) {
        assert.match(readFileSync(file, 'utf8'), /resolveSmsPhoneDisplay/);
    }
});

test('custom mobile SMS conversations pass the phone to their opening header builder', () => {
    for (const file of [
        new URL('../../mobile-7/sms/SmsConversation.tsx', import.meta.url),
        new URL('../../mobile-8/sms/SmsConversation.tsx', import.meta.url),
        new URL('../../mobile-15/sms/SmsConversation.tsx', import.meta.url),
    ]) {
        assert.match(
            readFileSync(file, 'utf8'),
            /buildSmsConversationHeader\(\{ \.\.\.data, telefono: displayTelefono \}\)/,
        );
    }
});
