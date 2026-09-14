import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { getSmsColors } from '../shared/sms/smsAppearance.ts';
import { getMobile8SmsColors, shouldShowSmsAccentPoint } from './sms/smsAppearance.ts';

const designDirectory = dirname(fileURLToPath(import.meta.url));

test('mobile 8 has an independent local structure', () => {
    for (const file of [
        'Mobile8PreviewFrame.tsx',
        'Mobile8PreviewHeader.tsx',
        'Mobile8BatteryIcon.tsx',
        'whatsapp/PreviewMobile8Whatsapp.tsx',
        'whatsapp/mobile8WhatsappRuntime.ts',
        'Mobile8PreviewFooter.tsx',
        'components/navigation/Mobile8RecentsIcon.tsx',
        'components/navigation/Mobile8HomeIcon.tsx',
        'components/navigation/Mobile8BackIcon.tsx',
        'Mobile8NotificationIcons.tsx',
        'whatsapp/WhatsappConversation.tsx',
        'whatsapp/whatsappVisualAdapter.ts',
        'whatsapp/whatsapp-bubbles/WhatsappMobileTextBubble.tsx',
        'sms/PreviewMobile8Sms.tsx',
        'sms/SmsConversation.tsx',
        'sms/Mobile8SmsSaveContactCard.tsx',
        'sms/Mobile8SmsSaveContactIcon.tsx',
        'sms/sms-header/SmsMobileHeader.tsx',
        'sms/sms-footer/SmsMobileInputBar.tsx',
        'sms/sms-bubbles/SmsMobileTextBubble.tsx',
        'calls/PreviewMobile8Call.tsx',
        'calls/IncomingCallContent.tsx',
        'whatsapp/whatsapp-header/WhatsappMobileHeaderUser.tsx',
        'whatsapp/whatsapp-header/Mobile8MoreVerticalIcon.tsx',
        'components/status-bar/Mobile8WifiIcon.tsx',
        'components/status-bar/Mobile8CellSignalIcon.tsx',
    ]) {
        assert.equal(existsSync(resolve(designDirectory, file)), true, `Missing ${file}`);
    }

    const source = readFileSync(resolve(designDirectory, 'whatsapp', 'PreviewMobile8Whatsapp.tsx'), 'utf8');
    const frameSource = readFileSync(resolve(designDirectory, 'Mobile8PreviewFrame.tsx'), 'utf8');
    const profilesSource = readFileSync(resolve(designDirectory, '..', 'mobilePreviewProfiles.tsx'), 'utf8');

    assert.match(profilesSource, /'mobile-8':\s*\{/);
    assert.match(profilesSource, /renderFrame: renderMobile8Frame/);
    assert.match(profilesSource, /PreviewMobile8Whatsapp/);
    assert.match(frameSource, /Mobile8PreviewHeader/);
    assert.doesNotMatch(source, /mobile-[1-7]|Mobile[1-7]|mobile[1-7]/);
});

test('mobile 8 footer copies the Mobile 3 gesture footer locally', () => {
    const footerSource = readFileSync(resolve(designDirectory, 'Mobile8PreviewFooter.tsx'), 'utf8');

    assert.match(footerSource, /Mobile8PreviewFooter/);
    assert.match(footerSource, /h-\[6\.25px\] w-\[120px\]/);
    assert.doesNotMatch(footerSource, /Mobile8RecentsIcon|Mobile8HomeIcon|Mobile8BackIcon/);
});

test('mobile 7 WhatsApp uses stable random online status and requested status icons', () => {
    const headerSource = readFileSync(resolve(designDirectory, 'whatsapp', 'whatsapp-header', 'WhatsappMobileHeaderUser.tsx'), 'utf8');
    const statusHeaderSource = readFileSync(resolve(designDirectory, 'Mobile8PreviewHeader.tsx'), 'utf8');
    const signalSource = readFileSync(resolve(designDirectory, 'components', 'status-bar', 'Mobile8CellSignalIcon.tsx'), 'utf8');
    const batterySource = readFileSync(resolve(designDirectory, 'Mobile8BatteryIcon.tsx'), 'utf8');

    assert.match(headerSource, /const \[showOnline\] = useState\(\(\) => Math\.random\(\) < 0\.5\)/);
    assert.match(headerSource, /\{showOnline &&/);
    assert.match(headerSource, /Mobile8MoreVerticalIcon/);
    assert.match(statusHeaderSource, /Mobile8WifiIcon/);
    assert.match(statusHeaderSource, /Mobile8CellSignalIcon/);
    assert.doesNotMatch(signalSource, /clipPath/);
    assert.equal((signalSource.match(/<rect/g) ?? []).length, 4);
    assert.match(signalSource, /viewBox="0 0 20 18"/);
    assert.match(signalSource, /fill="currentColor"/);
    assert.match(readFileSync(resolve(designDirectory, 'components', 'status-bar', 'Mobile8WifiIcon.tsx'), 'utf8'), /wif\.png/);
    assert.match(batterySource, /fontSize="14"/);
    assert.match(readFileSync(resolve(designDirectory, '..', 'mobile-4', 'Mobile4BatteryIcon.tsx'), 'utf8'), /fontSize="13"/);
});

test('mobile 8 status bar keeps four signal bars, Wi-Fi activity, and dynamic battery levels', () => {
    const headerSource = readFileSync(resolve(designDirectory, 'Mobile8PreviewHeader.tsx'), 'utf8');
    const wifiSource = readFileSync(resolve(designDirectory, 'components', 'status-bar', 'Mobile8WifiIcon.tsx'), 'utf8');
    const batterySource = readFileSync(resolve(designDirectory, 'Mobile8BatteryIcon.tsx'), 'utf8');

    assert.match(headerSource, /const \[batteryLevel, setBatteryLevel\] = useState\(90\)/);
    assert.match(headerSource, /setBatteryLevel\(\[100, 90, 80, 70, 60, 50, 40, 30, 20, 10\]\[Math\.floor\(now\.getHours\(\) \/ 2\) % 10\] \?\? 90\)/);
    assert.match(headerSource, /Mobile8CellSignalIcon className="h-\[17px\] w-\[17px\]"/);
    assert.match(headerSource, /Mobile8WifiIcon className="h-\[23px\] w-\[32px\]"/);
    assert.match(headerSource, /gap-\[7\.5px\]/);
    assert.match(wifiSource, /wif\.png/);
    assert.match(batterySource, /{value}/);
    assert.match(batterySource, /fill=\{color\}/);
    assert.match(batterySource, /fontFamily="Roboto, Arial, sans-serif"/);
    assert.match(batterySource, /backgroundColor/);
    assert.match(headerSource, /backgroundColor=\{isDark \? '#0B1014' : '#D9D9D9'\}/);
    assert.match(batterySource, /getMobile8BatteryProgressWidth/);
});

test('mobile 7 owns its encrypted message notice independently from mobile 3', () => {
    const encryptedMessagePath = resolve(designDirectory, 'whatsapp', 'Mobile8EncryptedMessage.tsx');
    const previewSource = readFileSync(resolve(designDirectory, 'whatsapp', 'PreviewMobile8Whatsapp.tsx'), 'utf8');

    assert.equal(existsSync(encryptedMessagePath), true);
    assert.match(readFileSync(resolve(designDirectory, 'whatsapp', 'whatsappVisualAdapter.ts'), 'utf8'), /Mobile8EncryptedMessage/);
});

test('mobile 7 routes SMS and calls to local previews', () => {
    const profilesSource = readFileSync(resolve(designDirectory, '..', 'mobilePreviewProfiles.tsx'), 'utf8');
    assert.match(profilesSource, /sms: \{ kind: 'custom', Preview: PreviewMobile8Sms \}/);
    assert.match(profilesSource, /call: \{ kind: 'custom', Preview: PreviewMobile8Call \}/);
});

test('mobile 7 SMS keeps its frame, notifications, font, and system chrome ownership', () => {
    const previewSource = readFileSync(resolve(designDirectory, 'sms', 'PreviewMobile8Sms.tsx'), 'utf8');
    const frameSource = readFileSync(resolve(designDirectory, 'Mobile8PreviewFrame.tsx'), 'utf8');
    const statusHeaderSource = readFileSync(resolve(designDirectory, 'Mobile8PreviewHeader.tsx'), 'utf8');
    const smsDirectory = resolve(designDirectory, 'sms');

    assert.match(previewSource, /Mobile8PreviewFrame/);
    assert.match(previewSource, /buildMobilePreviewNotificationIds\(data, 'mobile-8', 'sms'\)/);
    assert.match(previewSource, /import \{ mobile8FontFamily \} from '..\/mobile8Colors'/);
    assert.match(previewSource, /fontFamily: mobile8FontFamily/);
    assert.match(previewSource, /showVideoCall=\{false\}/);
    assert.match(previewSource, /messageAreaMaxWidth: '175px'/);
    assert.match(previewSource, /statusBarBackground=\{themeMode === 'light' \? colors\.header : undefined\}/);
    assert.doesNotMatch(previewSource, /Roboto, sans-serif/);
    assert.match(frameSource, /Mobile8PreviewHeader/);
    assert.match(frameSource, /Mobile8PreviewFooter/);
    assert.match(statusHeaderSource, /MobileNotificationIcons/);
    assert.match(statusHeaderSource, /Mobile8WifiIcon/);
    assert.match(statusHeaderSource, /Mobile8CellSignalIcon/);
    assert.match(statusHeaderSource, /Mobile8BatteryIcon/);

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

test('mobile 8 applies the requested typography to its complete frame', () => {
    const cssSource = readFileSync(resolve(designDirectory, 'mobile8.css'), 'utf8');

    assert.match(cssSource, /family=Roboto/);
    assert.match(cssSource, /font-family: Roboto, sans-serif !important/);
});

test('mobile 8 SMS preserves the cloned Mobile 7 conversation locally', () => {
    const conversationSource = readFileSync(resolve(designDirectory, 'sms', 'SmsConversation.tsx'), 'utf8');
    const headerSource = readFileSync(resolve(designDirectory, 'sms', 'sms-header', 'SmsMobileHeader.tsx'), 'utf8');
    const inputSource = readFileSync(resolve(designDirectory, 'sms', 'sms-footer', 'SmsMobileInputBar.tsx'), 'utf8');
    const quickRepliesSource = readFileSync(resolve(designDirectory, 'sms', 'sms-footer', 'SmsQuickReplies.tsx'), 'utf8');
    const bubbleSource = readFileSync(resolve(designDirectory, 'sms', 'sms-bubbles', 'SmsMobileTextBubble.tsx'), 'utf8');
    const appearanceSource = readFileSync(resolve(designDirectory, 'sms', 'smsAppearance.ts'), 'utf8');

    assert.match(conversationSource, /const \[conversationHeader\] = useState\(\(\) => buildSmsConversationHeader\(data\)\)/);
    assert.match(conversationSource, /const supportsQuickReplies = true/);
    assert.match(conversationSource, /grid grid-cols-\[48px_minmax\(0,1fr\)_18px\]/);
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
    const lightColors = getMobile8SmsColors('light');
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
    assert.deepEqual(getMobile8SmsColors('dark'), getSmsColors('dark', 'mobile-2'));

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

test('mobile 8 WhatsApp applies a 17.5px line height to every client and supervisor message line', () => {
    const conversationSource = readFileSync(resolve(designDirectory, 'whatsapp', 'WhatsappConversation.tsx'), 'utf8');
    const bubbleSource = readFileSync(resolve(designDirectory, 'whatsapp', 'whatsapp-bubbles', 'WhatsappMobileTextBubble.tsx'), 'utf8');

    assert.match(conversationSource, /<span key=\{key\} className="leading-\[17\.5px\]">/);
    assert.match(bubbleSource, /data-testid="selectable-text"[\s\S]*leading-\[17\.5px\]/);
    assert.doesNotMatch(bubbleSource, /data-testid="selectable-text"[\s\S]*leading-\[10\.5px\]/);
});

test('mobile 8 SMS owns its save-contact card locally', () => {
    const conversationSource = readFileSync(resolve(designDirectory, 'sms', 'SmsConversation.tsx'), 'utf8');
    const cardSource = readFileSync(resolve(designDirectory, 'sms', 'Mobile8SmsSaveContactCard.tsx'), 'utf8');
    const iconSource = readFileSync(resolve(designDirectory, 'sms', 'Mobile8SmsSaveContactIcon.tsx'), 'utf8');
    const mobile6CardSource = readFileSync(resolve(designDirectory, '..', 'mobile-6', 'sms', 'Mobile6SmsSaveContactCard.tsx'), 'utf8');
    const mobile6IconSource = readFileSync(resolve(designDirectory, '..', 'mobile-6', 'sms', 'Mobile6SmsSaveContactIcon.tsx'), 'utf8');

    assert.match(conversationSource, /import \{ Mobile8SmsSaveContactCard \} from '\.\/Mobile8SmsSaveContactCard'/);
    assert.match(conversationSource, /conversationHeader\.kind === 'sms' \?/);
    assert.match(conversationSource, /<Mobile8SmsSaveContactCard telefono=\{displayTelefono\} themeMode=\{themeMode\} \/>/);
    assert.ok(conversationSource.indexOf('<Mobile8SmsSaveContactCard') < conversationSource.indexOf('<SmsDateSeparator'));
    assert.match(cardSource, /const \[isVisible, setIsVisible\] = useState\(true\)/);
    assert.match(cardSource, /setIsVisible\(false\)/);
    assert.match(cardSource, /Denunciar spam/);
    assert.match(cardSource, /Agregar contacto/);
    assert.match(cardSource, /Mobile8SmsSaveContactIcon/);
    assert.match(iconSource, /viewBox="0 0 44 44"/);
    assert.doesNotMatch(cardSource, /Mobile6|mobile-6/);
    assert.doesNotMatch(iconSource, /Mobile6|mobile-6/);

    for (const value of [
        'h-[130px]',
        'rounded-[31px]',
        'colors.receivedBubble',
        '1C2023',
        '76D1FE',
        'E2E3E5',
        'C2C7CB',
        '003449',
        '4D5C93',
        '191A1F',
        '5F6065',
        'colors.link',
    ]) {
        assert.ok(cardSource.includes(value), `Expected card source to include ${value}`);
    }

    for (const value of ['viewBox="0 0 44 44"', 'cx="22" cy="22" r="22"', 'strokeWidth="2.35"']) {
        assert.ok(iconSource.includes(value), `Expected icon source to include ${value}`);
    }

    assert.match(mobile6CardSource, /Denunciar spam/);
    assert.match(mobile6IconSource, /viewBox="0 0 44 44"/);
});
