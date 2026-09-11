import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const designDirectory = dirname(fileURLToPath(import.meta.url));

test('mobile 7 has an independent Mobile 4-based structure', () => {
    for (const file of [
        'Mobile7PreviewFrame.tsx',
        'Mobile7PreviewHeader.tsx',
        'Mobile7BatteryIcon.tsx',
        'whatsapp/PreviewMobile7Whatsapp.tsx',
        'whatsapp/mobile7WhatsappRuntime.ts',
        'Mobile7PreviewFooter.tsx',
        'components/navigation/Mobile7RecentsIcon.tsx',
        'components/navigation/Mobile7HomeIcon.tsx',
        'components/navigation/Mobile7BackIcon.tsx',
        'Mobile7NotificationIcons.tsx',
        'whatsapp/WhatsappConversation.tsx',
        'whatsapp/whatsappVisualAdapter.ts',
        'whatsapp/whatsapp-bubbles/WhatsappMobileTextBubble.tsx',
        'sms/PreviewMobile7Sms.tsx',
        'sms/SmsConversation.tsx',
        'sms/sms-header/SmsMobileHeader.tsx',
        'sms/sms-footer/SmsMobileInputBar.tsx',
        'sms/sms-bubbles/SmsMobileTextBubble.tsx',
        'calls/PreviewMobile7Call.tsx',
        'calls/IncomingCallContent.tsx',
        'whatsapp/whatsapp-header/WhatsappMobileHeaderUser.tsx',
        'whatsapp/whatsapp-header/Mobile7MoreVerticalIcon.tsx',
        'components/status-bar/Mobile7WifiIcon.tsx',
        'components/status-bar/Mobile7CellSignalIcon.tsx',
    ]) {
        assert.equal(existsSync(resolve(designDirectory, file)), true, `Missing ${file}`);
    }

    const source = readFileSync(resolve(designDirectory, 'whatsapp', 'PreviewMobile7Whatsapp.tsx'), 'utf8');
    const frameSource = readFileSync(resolve(designDirectory, 'Mobile7PreviewFrame.tsx'), 'utf8');
    const profilesSource = readFileSync(resolve(designDirectory, '..', 'mobilePreviewProfiles.tsx'), 'utf8');

    assert.match(profilesSource, /'mobile-7':\s*\{/);
    assert.match(profilesSource, /renderFrame: renderMobile7Frame/);
    assert.match(profilesSource, /PreviewMobile7Whatsapp/);
    assert.match(frameSource, /Mobile7PreviewHeader/);
    assert.doesNotMatch(source, /mobile-4|Mobile4|mobile4|mobile-6|Mobile6|mobile6/);
});

test('mobile 7 footer renders Android navigation in reference order', () => {
    const footerSource = readFileSync(resolve(designDirectory, 'Mobile7PreviewFooter.tsx'), 'utf8');

    assert.match(footerSource, /Mobile7RecentsIcon/);
    assert.match(footerSource, /Mobile7HomeIcon/);
    assert.match(footerSource, /Mobile7BackIcon/);
    assert.ok(footerSource.indexOf('<Mobile7RecentsIcon') < footerSource.indexOf('<Mobile7HomeIcon'));
    assert.ok(footerSource.indexOf('<Mobile7HomeIcon') < footerSource.indexOf('<Mobile7BackIcon'));

    const recentsSource = readFileSync(resolve(designDirectory, 'components', 'navigation', 'Mobile7RecentsIcon.tsx'), 'utf8');
    const homeSource = readFileSync(resolve(designDirectory, 'components', 'navigation', 'Mobile7HomeIcon.tsx'), 'utf8');
    const backSource = readFileSync(resolve(designDirectory, 'components', 'navigation', 'Mobile7BackIcon.tsx'), 'utf8');
    const mobile5FooterSource = readFileSync(resolve(designDirectory, '..', 'mobile-5', 'Mobile5PreviewFooter.tsx'), 'utf8');

    assert.match(recentsSource, /data-android-navigation-icon="recents"/);
    assert.match(recentsSource, /width="24"/);
    assert.match(recentsSource, /height="24"/);
    assert.match(recentsSource, /x="3"[\s\S]*width="18"[\s\S]*height="18"[\s\S]*fill="currentColor"/);
    assert.match(homeSource, /data-android-navigation-icon="home"/);
    assert.match(homeSource, /r="11\.5"/);
    for (const geometry of ['cx="12"', 'cy="12"', 'r="6.2"', 'strokeWidth="1.8"']) {
        assert.match(mobile5FooterSource, new RegExp(geometry));
        assert.match(homeSource, new RegExp(geometry));
    }
    assert.match(backSource, /data-android-navigation-icon="back"/);
    assert.match(backSource, /points="20,2 4,12 20,22"/);
});

test('mobile 7 WhatsApp uses stable random online status and requested status icons', () => {
    const headerSource = readFileSync(resolve(designDirectory, 'whatsapp', 'whatsapp-header', 'WhatsappMobileHeaderUser.tsx'), 'utf8');
    const statusHeaderSource = readFileSync(resolve(designDirectory, 'Mobile7PreviewHeader.tsx'), 'utf8');
    const signalSource = readFileSync(resolve(designDirectory, 'components', 'status-bar', 'Mobile7CellSignalIcon.tsx'), 'utf8');
    const batterySource = readFileSync(resolve(designDirectory, 'Mobile7BatteryIcon.tsx'), 'utf8');

    assert.match(headerSource, /const \[showOnline\] = useState\(\(\) => Math\.random\(\) < 0\.5\)/);
    assert.match(headerSource, /\{showOnline &&/);
    assert.match(headerSource, /Mobile7MoreVerticalIcon/);
    assert.match(statusHeaderSource, /Mobile7WifiIcon/);
    assert.match(statusHeaderSource, /Mobile7CellSignalIcon/);
    assert.doesNotMatch(signalSource, /clipPath/);
    for (const y of ['13.5', '10.5', '7.5', '4.5', '1.5']) assert.match(signalSource, new RegExp(`y="${y}"`));
    assert.match(batterySource, /fontSize="15"/);
    assert.match(readFileSync(resolve(designDirectory, '..', 'mobile-4', 'Mobile4BatteryIcon.tsx'), 'utf8'), /fontSize="13"/);
});

test('mobile 7 owns its encrypted message notice independently from mobile 3', () => {
    const encryptedMessagePath = resolve(designDirectory, 'whatsapp', 'Mobile7EncryptedMessage.tsx');
    const previewSource = readFileSync(resolve(designDirectory, 'whatsapp', 'PreviewMobile7Whatsapp.tsx'), 'utf8');

    assert.equal(existsSync(encryptedMessagePath), true);
    assert.match(readFileSync(resolve(designDirectory, 'whatsapp', 'whatsappVisualAdapter.ts'), 'utf8'), /Mobile7EncryptedMessage/);
});

test('mobile 7 routes SMS and calls to local previews', () => {
    const profilesSource = readFileSync(resolve(designDirectory, '..', 'mobilePreviewProfiles.tsx'), 'utf8');
    assert.match(profilesSource, /sms: \{ kind: 'custom', Preview: PreviewMobile7Sms \}/);
    assert.match(profilesSource, /call: \{ kind: 'custom', Preview: PreviewMobile7Call \}/);
});
