import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { getSmsColors } from '../shared/sms/smsAppearance.ts';
import { getMobile7SmsColors, shouldShowSmsAccentPoint } from './sms/smsAppearance.ts';

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
        'sms/Mobile7SmsSaveContactCard.tsx',
        'sms/Mobile7SmsSaveContactIcon.tsx',
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
    assert.match(recentsSource, /width="19"/);
    assert.match(recentsSource, /height="19"/);
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
    for (const y of ['14.9', '12.5', '9.5', '6.5', '3.5']) assert.match(signalSource, new RegExp(`y="${y}"`));
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

test('mobile 7 SMS keeps its frame, notifications, font, and system chrome ownership', () => {
    const previewSource = readFileSync(resolve(designDirectory, 'sms', 'PreviewMobile7Sms.tsx'), 'utf8');
    const frameSource = readFileSync(resolve(designDirectory, 'Mobile7PreviewFrame.tsx'), 'utf8');
    const statusHeaderSource = readFileSync(resolve(designDirectory, 'Mobile7PreviewHeader.tsx'), 'utf8');
    const smsDirectory = resolve(designDirectory, 'sms');

    assert.match(previewSource, /Mobile7PreviewFrame/);
    assert.match(previewSource, /buildMobilePreviewNotificationIds\(data, 'mobile-7', 'sms'\)/);
    assert.match(previewSource, /import \{ mobile7FontFamily \} from '..\/mobile7Colors'/);
    assert.match(previewSource, /fontFamily: mobile7FontFamily/);
    assert.match(previewSource, /showVideoCall=\{false\}/);
    assert.match(previewSource, /messageAreaMaxWidth: '175px'/);
    assert.match(previewSource, /statusBarBackground=\{themeMode === 'light' \? colors\.header : undefined\}/);
    assert.doesNotMatch(previewSource, /Roboto, sans-serif/);
    assert.match(frameSource, /Mobile7PreviewHeader/);
    assert.match(frameSource, /Mobile7PreviewFooter/);
    assert.match(statusHeaderSource, /MobileNotificationIcons/);
    assert.match(statusHeaderSource, /Mobile7WifiIcon/);
    assert.match(statusHeaderSource, /Mobile7CellSignalIcon/);
    assert.match(statusHeaderSource, /Mobile7BatteryIcon/);

    for (const file of [
        'SmsConversation.tsx',
        'sms-header/SmsMobileHeader.tsx',
        'sms-footer/SmsMobileInputBar.tsx',
        'sms-footer/SmsQuickReplies.tsx',
        'sms-bubbles/SmsMobileTextBubble.tsx',
    ]) {
        const source = readFileSync(resolve(smsDirectory, file), 'utf8');

        assert.doesNotMatch(source, /mobile-2|Mobile2|mobile-6|Mobile6/);
        assert.doesNotMatch(source, /Mobile2PreviewHeader|Mobile2PreviewFooter|renderMobile2Frame/);
    }
});

test('mobile 7 SMS freezes Mobile 2 conversation behavior locally', () => {
    const conversationSource = readFileSync(resolve(designDirectory, 'sms', 'SmsConversation.tsx'), 'utf8');
    const headerSource = readFileSync(resolve(designDirectory, 'sms', 'sms-header', 'SmsMobileHeader.tsx'), 'utf8');
    const inputSource = readFileSync(resolve(designDirectory, 'sms', 'sms-footer', 'SmsMobileInputBar.tsx'), 'utf8');
    const quickRepliesSource = readFileSync(resolve(designDirectory, 'sms', 'sms-footer', 'SmsQuickReplies.tsx'), 'utf8');
    const bubbleSource = readFileSync(resolve(designDirectory, 'sms', 'sms-bubbles', 'SmsMobileTextBubble.tsx'), 'utf8');
    const appearanceSource = readFileSync(resolve(designDirectory, 'sms', 'smsAppearance.ts'), 'utf8');

    assert.match(conversationSource, /const \[conversationHeader\] = useState\(\(\) => buildSmsConversationHeader\(data\)\)/);
    assert.match(conversationSource, /const supportsQuickReplies = true/);
    assert.match(conversationSource, /mb-\[26px\] flex items-center justify-center gap-1\.5 text-\[10\.5px\] leading-\[15px\]/);
    assert.match(conversationSource, /compactBottomSpacing=\{index === messages\.length - 1\}/);
    assert.doesNotMatch(conversationSource, /false \?|mobile6|Mobile6/);
    assert.match(headerSource, /aria-label="Volver"/);
    assert.match(headerSource, /label="Llamar"/);
    assert.match(headerSource, /aria-label="Opciones"/);
    assert.match(headerSource, /showVideoCall = false/);
    assert.match(inputSource, /colors\.audioBackground/);
    assert.match(inputSource, /colors\.audioIcon/);
    assert.doesNotMatch(inputSource, /#5A3D59|#F0CDED/);
    assert.match(quickRepliesSource, /h-11 w-fit min-w-\[72px\] shrink-0 rounded-full border px-\[10px\]/);
    assert.match(quickRepliesSource, /onClick=\{\(\) => onSuggestionClick\(suggestion\)\}/);
    assert.match(bubbleSource, /max-w-\[85%\]/);
    assert.match(bubbleSource, /px-\[14px\] py-2\.5 text-\[16px\] font-light leading-\[1\.39\] tracking-\[-0\.18px\]/);
    assert.doesNotMatch(bubbleSource, /#314578/);
    assert.match(appearanceSource, /randomValue = Math\.random\(\)/);
    assert.match(appearanceSource, /return randomValue < 0\.5/);
    const lightColors = getMobile7SmsColors('light');
    assert.deepEqual(
        {
            shell: lightColors.shell,
            header: lightColors.header,
            conversation: lightColors.conversation,
            avatarBackground: lightColors.avatarBackground,
            avatarForeground: lightColors.avatarForeground,
        },
        {
            shell: '#F9ECE6',
            header: '#F9ECE6',
            conversation: '#FFF6F1',
            avatarBackground: '#4DCDE6',
            avatarForeground: '#FFFFFF',
        },
    );
    assert.deepEqual(getMobile7SmsColors('dark'), getSmsColors('dark', 'mobile-2'));

    const unchangedLightColorKeys = [
        'receivedBubble',
        'sentBubble',
        'sentText',
        'primaryText',
        'secondaryText',
        'headerIcon',
        'headerActionIcon',
        'composer',
        'tealPoint',
        'link',
        'audioBackground',
        'audioIcon',
        'menuIndicator',
        'metadataIcon',
        'quickReplyBorder',
    ] as const;
    const referenceLightColors = getSmsColors('light', 'mobile-2');

    for (const key of unchangedLightColorKeys) {
        assert.equal(lightColors[key], referenceLightColors[key]);
    }
    assert.equal(shouldShowSmsAccentPoint(0.49), true);
    assert.equal(shouldShowSmsAccentPoint(0.5), false);

    for (const color of [
        '#F9ECE6',
        '#FFF6F1',
        '#FEDADA',
        '#24181A',
        '#524444',
        '#FEDDB4',
        '#281800',
        '#4DCDE6',
        '#FF63B7',
        '#CDBABB',
        '#271D1E',
        '#1C1010',
        '#FFA7A9',
        '#2F0809',
        '#EEDEDE',
        '#D7C1C3',
        '#D4C4C4',
        '#5E421B',
        '#202125',
        '#6E5A5B',
    ]) {
        assert.match(appearanceSource, new RegExp(color.replace('#', '\\#')));
    }
});

test('mobile 7 SMS owns the Mobile 6 save-contact card behavior locally', () => {
    const conversationSource = readFileSync(resolve(designDirectory, 'sms', 'SmsConversation.tsx'), 'utf8');
    const cardSource = readFileSync(resolve(designDirectory, 'sms', 'Mobile7SmsSaveContactCard.tsx'), 'utf8');
    const iconSource = readFileSync(resolve(designDirectory, 'sms', 'Mobile7SmsSaveContactIcon.tsx'), 'utf8');
    const mobile6CardSource = readFileSync(resolve(designDirectory, '..', 'mobile-6', 'sms', 'Mobile6SmsSaveContactCard.tsx'), 'utf8');
    const mobile6IconSource = readFileSync(resolve(designDirectory, '..', 'mobile-6', 'sms', 'Mobile6SmsSaveContactIcon.tsx'), 'utf8');

    assert.match(conversationSource, /import \{ Mobile7SmsSaveContactCard \} from '\.\/Mobile7SmsSaveContactCard'/);
    assert.match(conversationSource, /conversationHeader\.kind === 'sms' \?/);
    assert.match(conversationSource, /<Mobile7SmsSaveContactCard telefono=\{displayTelefono\} themeMode=\{themeMode\} \/>/);
    assert.ok(conversationSource.indexOf('<Mobile7SmsSaveContactCard') < conversationSource.indexOf('<SmsDateSeparator'));
    assert.match(cardSource, /const \[isVisible, setIsVisible\] = useState\(true\)/);
    assert.match(cardSource, /setIsVisible\(false\)/);
    assert.match(cardSource, /Denunciar spam/);
    assert.match(cardSource, /Agregar contacto/);
    assert.match(cardSource, /Mobile7SmsSaveContactIcon/);
    assert.match(iconSource, /viewBox="0 0 44 44"/);
    assert.doesNotMatch(cardSource, /Mobile6|mobile-6/);
    assert.doesNotMatch(iconSource, /Mobile6|mobile-6/);

    for (const value of [
        'h-[140px]',
        'rounded-[31px]',
        'EDEEF3',
        '1C2023',
        '76D1FE',
        'E2E3E5',
        'C2C7CB',
        '003449',
        '4D5C93',
        '191A1F',
        '5F6065',
        '4D5C91',
    ]) {
        assert.ok(cardSource.includes(value), `Expected card source to include ${value}`);
    }

    for (const value of ['viewBox="0 0 44 44"', 'cx="22" cy="22" r="22"', 'strokeWidth="2.35"']) {
        assert.ok(iconSource.includes(value), `Expected icon source to include ${value}`);
    }

    assert.match(mobile6CardSource, /Denunciar spam/);
    assert.match(mobile6IconSource, /viewBox="0 0 44 44"/);
});
