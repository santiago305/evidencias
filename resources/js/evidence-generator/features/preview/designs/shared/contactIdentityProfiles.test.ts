import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const designsDirectory = resolve('resources/js/evidence-generator/features/preview/designs');
const profilesSource = readFileSync(resolve(designsDirectory, 'mobilePreviewProfiles.tsx'), 'utf8');
const whatsappHeaderByProfile = [
    'mobile-1', 'mobile-2', 'mobile-3', 'mobile-1', 'mobile-3', 'mobile-6',
    'mobile-7', 'mobile-8', 'mobile-9', 'mobile-10', 'mobile-11', 'mobile-12', 'mobile-13',
];
const smsHeaderByProfile = [
    ['shared', 'mobile-1'], ['shared', 'mobile-2'], ['shared', 'mobile-3'], ['shared', 'mobile-2'], ['shared', 'mobile-3'], ['shared', 'mobile-6'],
    ['mobile-7', 'mobile-7'], ['mobile-8', 'mobile-8'], ['mobile-9', 'mobile-9'], ['mobile-10', 'mobile-10'],
    ['mobile-11', 'mobile-11'], ['mobile-12', 'mobile-12'], ['mobile-13', 'mobile-13'],
];

test('all thirteen mobile profiles route WhatsApp and SMS headers through the shared resolver', () => {
    for (let index = 1; index <= 13; index += 1) {
        const profile = `mobile-${index}`;
        assert.match(profilesSource, new RegExp(`['"]${profile}['"]\\s*:`));

        const whatsappOwner = whatsappHeaderByProfile[index - 1];
        const whatsappHeader = readFileSync(
            resolve(designsDirectory, whatsappOwner, 'whatsapp/whatsapp-header/WhatsappMobileHeaderUser.tsx'),
            'utf8',
        );
        assert.match(whatsappHeader, /resolveWhatsappHeaderIdentity\(data\)/, `${profile} WhatsApp header must resolve contact identity`);

        const smsOwner = smsHeaderByProfile[index - 1][0];
        const smsHeaderPath = smsOwner === 'shared'
            ? resolve(designsDirectory, 'shared/sms/sms-header/SmsMobileHeader.tsx')
            : resolve(designsDirectory, smsOwner, 'sms/sms-header/SmsMobileHeader.tsx');
        const smsHeader = index === 13
            ? readFileSync(resolve(designsDirectory, smsOwner, 'sms/sms-header/SmsHeaderContactPill.tsx'), 'utf8')
            : readFileSync(smsHeaderPath, 'utf8');
        const smsIdentitySource = index === 13
            ? readFileSync(resolve(designsDirectory, smsOwner, 'sms/sms-header/smsHeaderIdentity.ts'), 'utf8')
            : readFileSync(resolve(designsDirectory, 'shared/sms/contactHeaderIdentity.ts'), 'utf8');
        const smsResolverCall = index === 13 ? 'getSmsHeaderDisplayValue(data.nombre, data.telefono)' : 'resolveSmsHeaderIdentity(data';
        assert.ok(smsHeader.includes(smsResolverCall) && smsIdentitySource.includes('resolveContactHeaderIdentity'), `${profile} SMS header must resolve contact identity`);

    }
});
