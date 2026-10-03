import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const designsDirectory = resolve('resources/js/evidence-generator/features/preview/designs');
const profilesSource = readFileSync(resolve(designsDirectory, 'mobilePreviewProfiles.tsx'), 'utf8');
const whatsappHeaderByProfile = [
    'mobile-1', 'mobile-2', 'mobile-3', 'mobile-1', 'mobile-3', 'mobile-6',
    'mobile-7', 'mobile-8', 'mobile-9', 'mobile-10', 'mobile-11', 'mobile-12', 'mobile-13', 'mobile-14', 'mobile-15',
];
const smsHeaderByProfile = [
    ['shared', 'mobile-1'], ['shared', 'mobile-2'], ['shared', 'mobile-3'], ['shared', 'mobile-2'], ['shared', 'mobile-3'], ['shared', 'mobile-6'],
    ['mobile-7', 'mobile-7'], ['mobile-8', 'mobile-8'], ['mobile-9', 'mobile-9'], ['mobile-10', 'mobile-10'],
    ['mobile-11', 'mobile-11'], ['mobile-12', 'mobile-12'], ['mobile-13', 'mobile-13'], ['mobile-14', 'mobile-14'], ['mobile-15', 'mobile-15'],
];

test('all fifteen mobile profiles route WhatsApp and SMS headers through the shared resolver', () => {
    for (let index = 1; index <= 15; index += 1) {
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
        const smsResolverCall = index === 13
            ? 'resolveSmsPhoneDisplay(data, formatMobile13SmsPhone)'
            : 'resolveSmsPhoneDisplay(data';
        assert.ok(smsHeader.includes(smsResolverCall), `${profile} SMS header must resolve the phone-only identity`);

    }
});

test('mobile WhatsApp conversations use the profile identity separately from the header title', () => {
    const previewPaths = [
        'shared/mobile-preview/MobileWhatsappPreview.tsx',
        'mobile-4/whatsapp/PreviewMobile4Whatsapp.tsx',
        'mobile-7/whatsapp/PreviewMobile7Whatsapp.tsx',
        'mobile-8/whatsapp/PreviewMobile8Whatsapp.tsx',
        'mobile-9/whatsapp/PreviewMobile9Whatsapp.tsx',
        'mobile-10/whatsapp/PreviewMobile10Whatsapp.tsx',
        'mobile-11/whatsapp/PreviewMobile11Whatsapp.tsx',
        'mobile-12/whatsapp/PreviewMobile12Whatsapp.tsx',
        'mobile-13/whatsapp/PreviewMobile13Whatsapp.tsx',
        'mobile-14/whatsapp/PreviewMobile14Whatsapp.tsx',
        'mobile-15/whatsapp/PreviewMobile15Whatsapp.tsx',
    ];

    for (const previewPath of previewPaths) {
        const previewSource = readFileSync(resolve(designsDirectory, previewPath), 'utf8');

        assert.match(previewSource, /<[A-Za-z0-9_.]+Header[A-Za-z0-9_.]*[\s\S]*?displayTitle=\{runtime\.contactIdentityDisplay\.headerTitle\}/);
        assert.match(previewSource, /<WhatsappConversation[\s\S]*?displayTitle=\{runtime\.contactIdentityDisplay\.profileTitle\}/);
    }
});
